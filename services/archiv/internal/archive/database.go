package archive

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	_ "modernc.org/sqlite"
)

const maxSQLDumpSize = 32 << 20

// loadCachedDatabase loads the last valid snapshot even if its refresh is overdue.
// Databases created before refresh timestamps were introduced are refreshed immediately.
func loadCachedDatabase(ctx context.Context, databasePath string) ([]Folge, time.Time, error) {
	db, err := openSQLiteDatabase(ctx, databasePath)
	if err != nil {
		return nil, time.Time{}, err
	}
	defer db.Close()

	folgen, err := loadFolgen(db)
	if err != nil {
		return nil, time.Time{}, err
	}
	if len(folgen) == 0 {
		return nil, time.Time{}, errors.New("cached metadata contains no Folgen")
	}

	var rawCheckedAt string
	var checkedAt time.Time
	if err := db.QueryRowContext(ctx, `SELECT checked_at FROM "__ddfdb_refresh" LIMIT 1`).Scan(&rawCheckedAt); err == nil {
		checkedAt, _ = time.Parse(time.RFC3339Nano, rawCheckedAt)
		if checkedAt.After(time.Now()) {
			checkedAt = time.Time{}
		}
	}
	return folgen, checkedAt, nil
}

// refreshDatabase downloads and fully validates a replacement before publishing it
// on disk. The check time lives in the same file as the data so a crash cannot
// make an older snapshot look fresh.
func refreshDatabase(ctx context.Context, databasePath, sourceURL string) ([]Folge, time.Time, error) {
	checkedAt := time.Now().UTC()
	dump, err := downloadSQL(ctx, sourceURL)
	if err != nil {
		return nil, time.Time{}, err
	}
	temporaryPath, err := buildSQLiteDatabase(ctx, databasePath, dump)
	if err != nil {
		return nil, time.Time{}, err
	}
	defer os.Remove(temporaryPath)

	db, err := openSQLiteDatabase(ctx, temporaryPath)
	if err != nil {
		return nil, time.Time{}, fmt.Errorf("open imported metadata: %w", err)
	}
	folgen, loadErr := loadFolgen(db)
	if loadErr == nil && len(folgen) == 0 {
		loadErr = errors.New("imported metadata contains no Folgen")
	}
	if loadErr == nil {
		_, loadErr = db.ExecContext(ctx, `CREATE TABLE "__ddfdb_refresh" (checked_at TEXT NOT NULL)`)
	}
	if loadErr == nil {
		_, loadErr = db.ExecContext(ctx, `INSERT INTO "__ddfdb_refresh" (checked_at) VALUES (?)`, checkedAt.Format(time.RFC3339Nano))
	}
	closeErr := db.Close()
	if loadErr != nil {
		return nil, time.Time{}, fmt.Errorf("validate imported metadata: %w", loadErr)
	}
	if closeErr != nil {
		return nil, time.Time{}, fmt.Errorf("close imported metadata: %w", closeErr)
	}
	if err := ctx.Err(); err != nil {
		return nil, time.Time{}, err
	}
	if err := os.Rename(temporaryPath, databasePath); err != nil {
		return nil, time.Time{}, fmt.Errorf("replace metadata database: %w", err)
	}
	return folgen, checkedAt, nil
}

func openSQLiteDatabase(ctx context.Context, path string) (*sql.DB, error) {
	db, err := sql.Open("sqlite", path)
	if err != nil {
		return nil, err
	}
	db.SetMaxOpenConns(4)
	if err := db.PingContext(ctx); err != nil {
		_ = db.Close()
		return nil, err
	}
	var count int
	if err := db.QueryRowContext(ctx, `SELECT COUNT(*) FROM "alle"`).Scan(&count); err != nil {
		_ = db.Close()
		return nil, fmt.Errorf("validate metadata database: %w", err)
	}
	return db, nil
}

func buildSQLiteDatabase(ctx context.Context, databasePath string, dump []byte) (string, error) {
	if len(dump) == 0 {
		return "", errors.New("upstream SQL dump is empty")
	}
	if err := os.MkdirAll(filepath.Dir(databasePath), 0o755); err != nil {
		return "", fmt.Errorf("create database directory: %w", err)
	}
	file, err := os.CreateTemp(filepath.Dir(databasePath), filepath.Base(databasePath)+".tmp-*.sqlite")
	if err != nil {
		return "", fmt.Errorf("create temporary database file: %w", err)
	}
	temporaryPath := file.Name()
	if err := file.Close(); err != nil {
		_ = os.Remove(temporaryPath)
		return "", fmt.Errorf("close temporary database file: %w", err)
	}
	db, err := sql.Open("sqlite", temporaryPath)
	if err != nil {
		_ = os.Remove(temporaryPath)
		return "", fmt.Errorf("open temporary database: %w", err)
	}
	db.SetMaxOpenConns(1)
	if _, err := db.ExecContext(ctx, string(dump)); err != nil {
		_ = db.Close()
		_ = os.Remove(temporaryPath)
		return "", fmt.Errorf("import upstream SQL dump: %w", err)
	}
	var count int
	if err := db.QueryRowContext(ctx, `SELECT COUNT(*) FROM "alle"`).Scan(&count); err != nil {
		_ = db.Close()
		_ = os.Remove(temporaryPath)
		return "", fmt.Errorf("validate imported metadata: %w", err)
	}
	if err := db.Close(); err != nil {
		_ = os.Remove(temporaryPath)
		return "", fmt.Errorf("close imported metadata database: %w", err)
	}
	return temporaryPath, nil
}

func downloadSQL(ctx context.Context, sourceURL string) ([]byte, error) {
	request, err := http.NewRequestWithContext(ctx, http.MethodGet, sourceURL, nil)
	if err != nil {
		return nil, fmt.Errorf("create SQL download request: %w", err)
	}
	client := &http.Client{Timeout: 90 * time.Second}
	response, err := client.Do(request)
	if err != nil {
		return nil, fmt.Errorf("download SQL dump: %w", err)
	}
	defer response.Body.Close()
	if response.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("download SQL dump: unexpected HTTP status %s", response.Status)
	}
	contents, err := io.ReadAll(io.LimitReader(response.Body, maxSQLDumpSize+1))
	if err != nil {
		return nil, fmt.Errorf("read SQL dump: %w", err)
	}
	if len(contents) > maxSQLDumpSize {
		return nil, fmt.Errorf("SQL dump exceeds %d bytes", maxSQLDumpSize)
	}
	if len(contents) == 0 || !strings.Contains(string(contents[:min(len(contents), 256)]), "CREATE TABLE") {
		return nil, errors.New("downloaded content is not a valid SQL dump")
	}
	return contents, nil
}
