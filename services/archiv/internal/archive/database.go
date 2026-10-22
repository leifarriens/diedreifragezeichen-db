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

type databaseStatus struct {
	refreshed     bool
	staleFallback bool
	refreshErr    error
}

// openDatabase uses a cached SQLite database until it is older than maxAge.
// When a refresh is needed, it caches the upstream SQL dump separately and
// builds a replacement database before swapping it into place.
func openDatabase(
	ctx context.Context,
	databasePath string,
	sqlCachePath string,
	sourceURL string,
	maxAge time.Duration,
) (*sql.DB, databaseStatus, error) {
	var status databaseStatus

	cachedDB, cachedErr := openSQLiteDatabase(ctx, databasePath)
	if cachedErr == nil && fileIsFresh(databasePath, maxAge) {
		return cachedDB, status, nil
	}

	dump, err := readOrDownloadSQL(ctx, sqlCachePath, sourceURL, maxAge)
	if err != nil {
		if cachedErr == nil {
			status.staleFallback = true
			status.refreshErr = err
			return cachedDB, status, nil
		}
		return nil, status, fmt.Errorf("load metadata SQL dump: %w", err)
	}

	temporaryDatabasePath, err := buildSQLiteDatabase(ctx, databasePath, dump)
	if err != nil {
		_ = os.Remove(sqlCachePath)
		if cachedErr == nil {
			status.staleFallback = true
			status.refreshErr = err
			return cachedDB, status, nil
		}
		return nil, status, err
	}
	defer os.Remove(temporaryDatabasePath)

	if cachedDB != nil {
		if err := cachedDB.Close(); err != nil {
			return nil, status, fmt.Errorf("close stale metadata database: %w", err)
		}
	}

	if err := os.Rename(temporaryDatabasePath, databasePath); err != nil {
		if cachedErr == nil {
			fallbackDB, openErr := openSQLiteDatabase(ctx, databasePath)
			if openErr == nil {
				status.staleFallback = true
				status.refreshErr = fmt.Errorf("replace metadata database: %w", err)
				return fallbackDB, status, nil
			}
		}
		return nil, status, fmt.Errorf("replace metadata database: %w", err)
	}

	db, err := openSQLiteDatabase(ctx, databasePath)
	if err != nil {
		return nil, status, fmt.Errorf("open refreshed metadata database: %w", err)
	}
	status.refreshed = true
	return db, status, nil
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

func readOrDownloadSQL(
	ctx context.Context,
	cachePath string,
	sourceURL string,
	maxAge time.Duration,
) ([]byte, error) {
	if fileIsFresh(cachePath, maxAge) {
		contents, err := os.ReadFile(cachePath)
		if err == nil && len(contents) > 0 {
			return contents, nil
		}
	}

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
	if err := writeAtomically(cachePath, contents); err != nil {
		return nil, fmt.Errorf("cache SQL dump: %w", err)
	}
	return contents, nil
}

func writeAtomically(path string, contents []byte) error {
	if err := os.MkdirAll(filepath.Dir(path), 0o755); err != nil {
		return err
	}
	file, err := os.CreateTemp(filepath.Dir(path), filepath.Base(path)+".tmp-*")
	if err != nil {
		return err
	}
	temporaryPath := file.Name()
	defer os.Remove(temporaryPath)

	if err := file.Chmod(0o644); err != nil {
		_ = file.Close()
		return err
	}
	if _, err := file.Write(contents); err != nil {
		_ = file.Close()
		return err
	}
	if err := file.Sync(); err != nil {
		_ = file.Close()
		return err
	}
	if err := file.Close(); err != nil {
		return err
	}
	return os.Rename(temporaryPath, path)
}

func fileIsFresh(path string, maxAge time.Duration) bool {
	if maxAge <= 0 {
		return false
	}
	info, err := os.Stat(path)
	return err == nil && time.Since(info.ModTime()) <= maxAge
}
