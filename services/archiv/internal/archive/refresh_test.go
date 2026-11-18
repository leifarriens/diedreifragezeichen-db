package archive

import (
	"context"
	"encoding/json"
	"io"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"strings"
	"sync/atomic"
	"testing"
	"time"

	"github.com/rs/zerolog"
)

func TestRefreshDatabasePersistsValidatedSnapshotAndCheckTime(t *testing.T) {
	var dump atomic.Value
	dump.Store(testDatabaseSQL)
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
		_, _ = io.WriteString(w, dump.Load().(string))
	}))
	defer server.Close()
	path := filepath.Join(t.TempDir(), "metadata.sqlite")
	folgen, checkedAt, err := refreshDatabase(context.Background(), path, server.URL)
	if err != nil {
		t.Fatalf("initial refresh: %v", err)
	}
	cached, cachedAt, err := loadCachedDatabase(context.Background(), path)
	if err != nil || len(cached) != len(folgen) || !cachedAt.Equal(checkedAt) {
		t.Fatalf("load cached snapshot: count=%d time=%v err=%v", len(cached), cachedAt, err)
	}

	for _, invalid := range []string{
		"not a SQL dump",
		`CREATE TABLE "alle" (id INTEGER);`, // Passes the initial table check but cannot load the API data.
		testDatabaseSQL + ` DELETE FROM "serie"; DELETE FROM "spezial";`,
	} {
		dump.Store(invalid)
		if _, _, err := refreshDatabase(context.Background(), path, server.URL); err == nil {
			t.Fatalf("refresh accepted invalid dump: %q", invalid[:min(len(invalid), 80)])
		}
		cached, cachedAt, err = loadCachedDatabase(context.Background(), path)
		if err != nil || len(cached) != len(folgen) || cached[0].Title != folgen[0].Title || !cachedAt.Equal(checkedAt) {
			t.Fatalf("failed refresh changed cached snapshot: count=%d time=%v err=%v", len(cached), cachedAt, err)
		}
	}
}

func TestLegacyDatabaseIsServedAndDueForRefresh(t *testing.T) {
	path := filepath.Join(t.TempDir(), "metadata.sqlite")
	temporary, err := buildSQLiteDatabase(context.Background(), path, []byte(testDatabaseSQL))
	if err != nil {
		t.Fatal(err)
	}
	if err := os.Rename(temporary, path); err != nil {
		t.Fatal(err)
	}
	folgen, checkedAt, err := loadCachedDatabase(context.Background(), path)
	if err != nil || len(folgen) == 0 || !checkedAt.IsZero() {
		t.Fatalf("legacy database: count=%d checkedAt=%v err=%v", len(folgen), checkedAt, err)
	}
}

func TestRefreshLoopServesStaleDataAndRetriesUntilUpdated(t *testing.T) {
	var requests atomic.Int32
	blocked := make(chan struct{})
	release := make(chan struct{})
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		switch requests.Add(1) {
		case 1:
			_, _ = io.WriteString(w, testDatabaseSQL)
		case 2:
			http.Error(w, "upstream unavailable", http.StatusServiceUnavailable)
		default:
			select {
			case blocked <- struct{}{}:
			default:
			}
			select {
			case <-release:
				dump := strings.ReplaceAll(testDatabaseSQL, "und der Papagei", "updated title")
				dump = strings.ReplaceAll(dump, "Robert Arthur", "updated author")
				_, _ = io.WriteString(w, dump)
			case <-r.Context().Done():
			}
		}
	}))
	defer server.Close()
	path := filepath.Join(t.TempDir(), "metadata.sqlite")
	initial, _, err := refreshDatabase(context.Background(), path, server.URL)
	if err != nil {
		t.Fatal(err)
	}
	store := &archiveStore{}
	store.replace(initial)
	handler := newHTTPHandlerWithStore(store, zerolog.New(io.Discard), time.Now)
	ctx, cancel := context.WithCancel(context.Background())
	done := make(chan struct{})
	go func() {
		defer close(done)
		runRefreshLoop(ctx, store, path, server.URL, time.Now().Add(-2*time.Hour), time.Hour, 10*time.Millisecond, 20*time.Millisecond, zerolog.New(io.Discard))
	}()
	defer func() { cancel(); <-done }()

	select {
	case <-blocked:
	case <-time.After(5 * time.Second):
		t.Fatal("refresh did not retry after upstream failure")
	}
	if title := getTestTitle(t, handler); title != "und der Papagei" {
		t.Fatalf("title during refresh = %q", title)
	}
	cached, _, err := loadCachedDatabase(context.Background(), path)
	if err != nil || cached[0].Title != "und der Papagei" {
		t.Fatalf("cached data during refresh: %+v, %v", cached, err)
	}
	close(release)
	deadline := time.Now().Add(5 * time.Second)
	for getTestTitle(t, handler) != "updated title" {
		if time.Now().After(deadline) {
			t.Fatal("refresh did not publish updated snapshot")
		}
		time.Sleep(5 * time.Millisecond)
	}
	for _, test := range []struct{ path, want string }{
		{path: "/folgen", want: "updated title"},
		{path: "/search-options", want: "updated author"},
	} {
		response := httptest.NewRecorder()
		handler.ServeHTTP(response, httptest.NewRequest(http.MethodGet, test.path, nil))
		if response.Code != http.StatusOK || !strings.Contains(response.Body.String(), test.want) {
			t.Fatalf("%s did not use updated snapshot: %s", test.path, response.Body.String())
		}
	}
	cached, checkedAt, err := loadCachedDatabase(context.Background(), path)
	if err != nil || cached[0].Title != "updated title" || checkedAt.IsZero() {
		t.Fatalf("updated cached data: %+v, %v, %v", cached, checkedAt, err)
	}
}

func TestRefreshLoopWaitsUntilPersistedCheckIsDue(t *testing.T) {
	requests := make(chan struct{}, 1)
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
		requests <- struct{}{}
		_, _ = io.WriteString(w, testDatabaseSQL)
	}))
	defer server.Close()
	path := filepath.Join(t.TempDir(), "metadata.sqlite")
	initial, checkedAt, err := refreshDatabase(context.Background(), path, server.URL)
	if err != nil {
		t.Fatal(err)
	}
	<-requests
	initial, checkedAt, err = loadCachedDatabase(context.Background(), path)
	if err != nil {
		t.Fatal(err)
	}
	store := &archiveStore{}
	store.replace(initial)
	ctx, cancel := context.WithCancel(context.Background())
	done := make(chan struct{})
	go func() {
		defer close(done)
		runRefreshLoop(ctx, store, path, server.URL, checkedAt, time.Hour, time.Second, time.Second, zerolog.New(io.Discard))
	}()
	defer func() { cancel(); <-done }()
	select {
	case <-requests:
		t.Fatal("fresh snapshot triggered an early download")
	case <-time.After(50 * time.Millisecond):
	}
}

func getTestTitle(t *testing.T, handler http.Handler) string {
	t.Helper()
	response := httptest.NewRecorder()
	handler.ServeHTTP(response, httptest.NewRequest(http.MethodGet, "/folgen/1", nil))
	if response.Code != http.StatusOK {
		t.Fatalf("detail status = %d", response.Code)
	}
	var folge Folge
	if err := json.Unmarshal(response.Body.Bytes(), &folge); err != nil {
		t.Fatal(err)
	}
	return folge.Title
}
