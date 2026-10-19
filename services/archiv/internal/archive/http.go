package archive

import (
	"encoding/json"
	"net/http"
	"sort"
	"strconv"
	"strings"
	"time"

	"github.com/rs/zerolog"
	"github.com/rs/zerolog/hlog"
)

const (
	localClientOrigin      = "http://localhost:8081"
	releaseDateGracePeriod = 24 * time.Hour
)

type searchOptionSort string

const (
	searchOptionSortOccurrences searchOptionSort = "occurrences"
	searchOptionSortName        searchOptionSort = "name"
)

type archiveHandler struct {
	folgen []Folge
	byID   map[int64]Folge
	now    func() time.Time
}

func newHTTPHandler(folgen []Folge, logger zerolog.Logger) http.Handler {
	return newHTTPHandlerWithClock(folgen, logger, time.Now)
}

func newHTTPHandlerWithClock(
	folgen []Folge,
	logger zerolog.Logger,
	now func() time.Time,
) http.Handler {
	byID := make(map[int64]Folge, len(folgen))
	for _, folge := range folgen {
		byID[folge.ID] = folge
	}

	handler := &archiveHandler{folgen: folgen, byID: byID, now: now}
	mux := http.NewServeMux()
	mux.HandleFunc("GET /", handler.root)
	mux.HandleFunc("GET /healthz", handler.health)
	mux.HandleFunc("GET /folgen", handler.listFolgen)
	mux.HandleFunc("GET /folgen/{id}", handler.getFolge)
	mux.HandleFunc("GET /search-options", handler.listSearchOptions)

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
			"health":        "/healthz",
			"folgen":        "/folgen",
			"folge":         "/folgen/{id}",
			"searchOptions": "/search-options",
		},
	})
}

func (h *archiveHandler) health(w http.ResponseWriter, _ *http.Request) {
	writeJSON(w, http.StatusOK, map[string]string{"status": "ok"})
}

func (h *archiveHandler) listFolgen(w http.ResponseWriter, _ *http.Request) {
	now := h.now()
	folgen := make([]Folge, 0, len(h.folgen))
	for _, folge := range h.folgen {
		if isAvailableInArchive(folge, now) {
			folgen = append(folgen, folge)
		}
	}
	sort.SliceStable(folgen, func(i, j int) bool {
		left, right := folgen[i].ReleaseDate, folgen[j].ReleaseDate
		if left == nil || right == nil {
			return left != nil && right == nil
		}
		return *left > *right
	})
	writeJSON(w, http.StatusOK, folgen)
}

func (h *archiveHandler) listSearchOptions(w http.ResponseWriter, r *http.Request) {
	minOccurrences := 1
	if rawMinOccurrences, ok := r.URL.Query()["min_occurrences"]; ok {
		parsedMinOccurrences, err := strconv.Atoi(rawMinOccurrences[0])
		if err != nil || parsedMinOccurrences < 1 {
			writeJSON(w, http.StatusBadRequest, map[string]string{
				"error": "min_occurrences must be a positive integer",
			})
			return
		}
		minOccurrences = parsedMinOccurrences
	}
	sortBy := searchOptionSortOccurrences
	if rawSortBy, ok := r.URL.Query()["sort"]; ok {
		sortBy = searchOptionSort(rawSortBy[0])
		if sortBy != searchOptionSortName && sortBy != searchOptionSortOccurrences {
			writeJSON(w, http.StatusBadRequest, map[string]string{
				"error": "sort must be either name or occurrences",
			})
			return
		}
	}
	writeJSON(w, http.StatusOK, buildSearchOptions(h.folgen, h.now(), minOccurrences, sortBy))
}

func buildSearchOptions(
	folgen []Folge,
	now time.Time,
	minOccurrences int,
	sortBy searchOptionSort,
) SearchOptions {
	options := SearchOptions{
		Speakers:      []string{},
		Roles:         []string{},
		Authors:       []string{},
		ScriptAuthors: []string{},
		Collections:   []Collection{},
	}
	speakerEpisodes := make(map[string]map[int64]struct{})
	roleEpisodes := make(map[string]map[int64]struct{})
	authors := make(map[string]struct{})
	scriptAuthors := make(map[string]struct{})
	collections := make(map[Collection]struct{})

	for _, folge := range folgen {
		if !isAvailableInArchive(folge, now) {
			continue
		}
		collections[folge.Collection] = struct{}{}
		for _, author := range folge.Authors {
			if strings.TrimSpace(author) != "" {
				authors[author] = struct{}{}
			}
		}
		for _, author := range folge.ScriptAuthors {
			if strings.TrimSpace(author) != "" {
				scriptAuthors[author] = struct{}{}
			}
		}
		for _, voiceRole := range folge.VoiceRoles {
			if strings.TrimSpace(voiceRole.Speaker) != "" {
				if speakerEpisodes[voiceRole.Speaker] == nil {
					speakerEpisodes[voiceRole.Speaker] = make(map[int64]struct{})
				}
				speakerEpisodes[voiceRole.Speaker][folge.ID] = struct{}{}
			}
			if strings.TrimSpace(voiceRole.Role) != "" {
				if roleEpisodes[voiceRole.Role] == nil {
					roleEpisodes[voiceRole.Role] = make(map[int64]struct{})
				}
				roleEpisodes[voiceRole.Role][folge.ID] = struct{}{}
			}
		}
	}

	options.Speakers = sortedStringsWithMinimumCount(speakerEpisodes, minOccurrences, sortBy)
	options.Roles = sortedStringsWithMinimumCount(roleEpisodes, minOccurrences, sortBy)
	options.Authors = sortedStrings(authors)
	options.ScriptAuthors = sortedStrings(scriptAuthors)
	for collection := range collections {
		options.Collections = append(options.Collections, collection)
	}
	sort.Slice(options.Collections, func(i, j int) bool {
		return options.Collections[i] < options.Collections[j]
	})
	return options
}

func sortedStrings(values map[string]struct{}) []string {
	result := make([]string, 0, len(values))
	for value := range values {
		result = append(result, value)
	}
	sort.Strings(result)
	return result
}

func sortedStringsWithMinimumCount(
	values map[string]map[int64]struct{},
	minimum int,
	sortBy searchOptionSort,
) []string {
	result := make([]string, 0, len(values))
	for value, episodeIDs := range values {
		if len(episodeIDs) >= minimum {
			result = append(result, value)
		}
	}
	sort.Slice(result, func(i, j int) bool {
		leftCount := len(values[result[i]])
		rightCount := len(values[result[j]])
		if sortBy == searchOptionSortOccurrences && leftCount != rightCount {
			return leftCount > rightCount
		}
		return result[i] < result[j]
	})
	return result
}

func (h *archiveHandler) getFolge(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.ParseInt(r.PathValue("id"), 10, 64)
	if err != nil {
		writeJSON(w, http.StatusNotFound, map[string]string{"error": "Folge not found"})
		return
	}
	folge, ok := h.byID[id]
	if !ok || !isAvailableInArchive(folge, h.now()) {
		writeJSON(w, http.StatusNotFound, map[string]string{"error": "Folge not found"})
		return
	}
	writeJSON(w, http.StatusOK, folge)
}

func isAvailableInArchive(folge Folge, now time.Time) bool {
	if folge.ReleaseDate == nil {
		return true
	}

	releaseDate, err := time.Parse(time.DateOnly, *folge.ReleaseDate)
	if err != nil {
		return true
	}

	return !releaseDate.After(now.UTC().Add(-releaseDateGracePeriod))
}

func writeJSON(w http.ResponseWriter, status int, value any) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(value)
}
