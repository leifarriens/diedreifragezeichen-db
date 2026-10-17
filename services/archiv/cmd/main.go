package main

import (
	"os"

	"github.com/ddfdb/archiv/internal/archive"
	"github.com/rs/zerolog"
)

func main() {
	if err := archive.Run(); err != nil {
		logger := zerolog.New(os.Stderr).With().Timestamp().Logger()
		logger.Error().Err(err).Msg("archive service stopped")
		os.Exit(1)
	}
}
