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
	sourceURL := envOrDefault("DDF_METADATA_SQL_URL", defaultSQLURL)
	maxAge, err := time.ParseDuration(envOrDefault("DB_MAX_AGE", "24h"))
	if err != nil || maxAge <= 0 {
		return fmt.Errorf("DB_MAX_AGE must be a positive Go duration, got %q", os.Getenv("DB_MAX_AGE"))
	}

	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	folgen, checkedAt, err := loadCachedDatabase(ctx, databasePath)
	if err != nil {
		logger.Warn().Err(err).Msg("no valid cached metadata, downloading initial database")
		folgen, checkedAt, err = refreshDatabase(ctx, databasePath, sourceURL)
		if err != nil {
			return fmt.Errorf("load initial metadata: %w", err)
		}
	}
	logger.Info().Int("count", len(folgen)).Msg("loaded Folgen")

	store := &archiveStore{}
	store.replace(folgen)
	refreshCtx, cancelRefresh := context.WithCancel(ctx)
	refreshDone := make(chan struct{})
	go func() {
		defer close(refreshDone)
		// Check after 23 hours by default, leaving a buffer before the 24-hour target.
		interval := maxAge - maxAge/24
		runRefreshLoop(refreshCtx, store, databasePath, sourceURL, checkedAt, interval, initialRetryDelay, maximumRetryDelay, logger)
	}()
	defer func() {
		cancelRefresh()
		<-refreshDone
	}()

	addr := os.Getenv("LISTEN_ADDR")
	if addr == "" {
		port := envOrDefault("PORT", "8080")
		addr = ":" + port
	}
	server := &http.Server{
		Addr:              addr,
		Handler:           newHTTPHandlerWithStore(store, logger, time.Now),
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
