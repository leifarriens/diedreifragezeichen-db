package archive

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/rs/zerolog"
)

const defaultSQLURL = "https://raw.githubusercontent.com/YourMJK/dreimetadaten/refs/heads/master/metadata/db.sql"

func Run() error {
	logger := zerolog.New(os.Stdout).With().Timestamp().Logger()
	databasePath := envOrDefault("DB_PATH", "./data/metadata.sqlite")
	sqlCachePath := envOrDefault("SQL_CACHE_PATH", databasePath+".sql")
	sourceURL := envOrDefault("DDF_METADATA_SQL_URL", defaultSQLURL)
	maxAge, err := time.ParseDuration(envOrDefault("DB_MAX_AGE", "24h"))
	if err != nil || maxAge <= 0 {
		return fmt.Errorf("DB_MAX_AGE must be a positive Go duration, got %q", os.Getenv("DB_MAX_AGE"))
	}

	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	db, status, err := openDatabase(ctx, databasePath, sqlCachePath, sourceURL, maxAge)
	if err != nil {
		return err
	}
	defer db.Close()
	if status.refreshed {
		logger.Info().Msg("refreshed metadata database")
	}
	if status.staleFallback {
		logger.Warn().Err(status.refreshErr).Msg("could not refresh metadata, serving the cached database")
	}

	folgen, err := loadFolgen(db)
	if err != nil {
		return err
	}
	logger.Info().Int("count", len(folgen)).Msg("loaded Folgen")

	addr := os.Getenv("LISTEN_ADDR")
	if addr == "" {
		port := envOrDefault("PORT", "8080")
		addr = ":" + port
	}
	server := &http.Server{
		Addr:              addr,
		Handler:           newHTTPHandler(folgen, logger),
		ReadHeaderTimeout: 5 * time.Second,
		IdleTimeout:       60 * time.Second,
		WriteTimeout:      30 * time.Second,
	}
	serverErr := make(chan error, 1)
	go func() {
		logger.Info().Str("address", addr).Msg("archive service listening")
		serverErr <- server.ListenAndServe()
	}()

	select {
	case err := <-serverErr:
		if errors.Is(err, http.ErrServerClosed) {
			return nil
		}
		return fmt.Errorf("serve HTTP: %w", err)
	case <-ctx.Done():
		shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()
		if err := server.Shutdown(shutdownCtx); err != nil {
			return fmt.Errorf("shut down HTTP server: %w", err)
		}
		return nil
	}
}

func envOrDefault(key, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}
