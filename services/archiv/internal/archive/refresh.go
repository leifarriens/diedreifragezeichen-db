package archive

import (
	"context"
	"time"

	"github.com/rs/zerolog"
)

const (
	initialRetryDelay = time.Minute
	maximumRetryDelay = time.Hour
)

// runRefreshLoop waits until the snapshot is due, then retries failed checks
// without interrupting requests. Only a fully validated replacement is published.
func runRefreshLoop(
	ctx context.Context,
	store *archiveStore,
	databasePath, sourceURL string,
	checkedAt time.Time,
	interval, retryDelay, maxRetryDelay time.Duration,
	logger zerolog.Logger,
) {
	delay := time.Until(checkedAt.Add(interval))
	if checkedAt.IsZero() || delay < 0 {
		delay = 0
	}
	backoff := retryDelay
	for {
		timer := time.NewTimer(delay)
		select {
		case <-ctx.Done():
			timer.Stop()
			return
		case <-timer.C:
		}

		folgen, refreshedAt, err := refreshDatabase(ctx, databasePath, sourceURL)
		if ctx.Err() != nil {
			return
		}
		if err != nil {
			logger.Warn().Err(err).Dur("retry_in", backoff).Msg("could not refresh metadata, serving the cached database")
			delay = backoff
			if backoff < maxRetryDelay/2 {
				backoff *= 2
			} else {
				backoff = maxRetryDelay
			}
			continue
		}
		store.replace(folgen)
		logger.Info().Int("count", len(folgen)).Msg("refreshed metadata database")
		backoff = retryDelay
		delay = max(time.Until(refreshedAt.Add(interval)), 0)
	}
}
