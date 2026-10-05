package archive

import (
	"encoding/json"
	"net/http"
	"strconv"
	"time"

	"github.com/rs/zerolog"
	"github.com/rs/zerolog/hlog"
)

const localClientOrigin = "http://localhost:8081"

type archiveHandler struct {
	folgen []Folge
	byID   map[int64]Folge
}

func newHTTPHandler(folgen []Folge, logger zerolog.Logger) http.Handler {
	byID := make(map[int64]Folge, len(folgen))
	for _, folge := range folgen {
		byID[folge.ID] = folge
	}

	handler := &archiveHandler{folgen: folgen, byID: byID}
	mux := http.NewServeMux()
	mux.HandleFunc("GET /", handler.root)
	mux.HandleFunc("GET /healthz", handler.health)
	mux.HandleFunc("GET /folgen", handler.listFolgen)
	mux.HandleFunc("GET /folgen/{id}", handler.getFolge)

	logRequests := hlog.AccessHandler(func(r *http.Request, status, size int, duration time.Duration) {
		requestLogger := hlog.FromRequest(r)
		event := requestLogger.Info()
		if status >= http.StatusInternalServerError {
			event = requestLogger.Error()
		} else if status >= http.StatusBadRequest {
			event = requestLogger.Warn()
		}
		event.
			Str("method", r.Method).
			Str("path", r.URL.Path).
			Int("status", status).
			Int("bytes", size).
			Dur("duration", duration).
			Msg("http request")
	})
	return hlog.NewHandler(logger)(logRequests(withCORS(mux)))
}

func withCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Add("Vary", "Origin")
		origin := r.Header.Get("Origin")
		if origin != localClientOrigin {
			if r.Method == http.MethodOptions {
				writeJSON(w, http.StatusForbidden, map[string]string{"error": "origin not allowed"})
				return
			}
			next.ServeHTTP(w, r)
			return
		}

		w.Header().Set("Access-Control-Allow-Origin", origin)
		w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		w.Header().Set("Access-Control-Max-Age", "600")
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		next.ServeHTTP(w, r)
	})
}

func (h *archiveHandler) root(w http.ResponseWriter, _ *http.Request) {
	writeJSON(w, http.StatusOK, map[string]any{
		"service": "archiv",
		"endpoints": map[string]string{
			"health": "/healthz",
			"folgen": "/folgen",
			"folge":  "/folgen/{id}",
		},
	})
}

func (h *archiveHandler) health(w http.ResponseWriter, _ *http.Request) {
	writeJSON(w, http.StatusOK, map[string]string{"status": "ok"})
}

func (h *archiveHandler) listFolgen(w http.ResponseWriter, _ *http.Request) {
	writeJSON(w, http.StatusOK, h.folgen)
}

func (h *archiveHandler) getFolge(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.ParseInt(r.PathValue("id"), 10, 64)
	if err != nil {
		writeJSON(w, http.StatusNotFound, map[string]string{"error": "Folge not found"})
		return
	}
	folge, ok := h.byID[id]
	if !ok {
		writeJSON(w, http.StatusNotFound, map[string]string{"error": "Folge not found"})
		return
	}
	writeJSON(w, http.StatusOK, folge)
}

func writeJSON(w http.ResponseWriter, status int, value any) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(value)
}
