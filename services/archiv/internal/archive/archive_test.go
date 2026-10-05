package archive

import (
	"bytes"
	"context"
	"database/sql"
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
	_ "modernc.org/sqlite"
)

const testDatabaseSQL = `
CREATE TABLE "hörspiel" (
  "hörspielID" INTEGER PRIMARY KEY,
  "titel" TEXT NOT NULL,
  "kurzbeschreibung" TEXT,
  "beschreibung" TEXT,
  "metabeschreibung" TEXT,
  "veröffentlichungsdatum" DATE,
  "artwork" INTEGER NOT NULL,
  "urlCoverDreifragezeichen" TEXT,
  "idAppleMusic" TEXT,
  "idSpotify" TEXT,
  "idBookbeat" TEXT,
  "idAmazonMusic" TEXT,
  "idAmazon" TEXT,
  "idYouTubeMusic" TEXT,
  "idDeezer" TEXT,
  "urlDreifragezeichen" TEXT
);
CREATE TABLE "serie" ("nummer" INTEGER PRIMARY KEY, "hörspielID" INTEGER UNIQUE);
CREATE TABLE "spezial" ("hörspielID" INTEGER PRIMARY KEY, "position" INTEGER UNIQUE);
CREATE TABLE "kurzgeschichten" ("hörspielID" INTEGER PRIMARY KEY);
CREATE TABLE "dieDr3i" ("nummer" INTEGER, "hörspielID" INTEGER PRIMARY KEY);
CREATE TABLE "kids" ("nummer" INTEGER, "hörspielID" INTEGER PRIMARY KEY);
CREATE TABLE "sonstige" ("hörspielID" INTEGER PRIMARY KEY);
CREATE TABLE "hörspielTeil" ("teil" INTEGER PRIMARY KEY, "hörspiel" INTEGER, "position" INTEGER);
CREATE TABLE "track" ("trackID" INTEGER PRIMARY KEY, "dauer" INTEGER NOT NULL);
CREATE TABLE "kapitel" ("trackID" INTEGER PRIMARY KEY, "hörspielID" INTEGER, "position" INTEGER, "abweichenderTitel" TEXT);
CREATE VIEW "alleIDs" AS
  SELECT 'serie' AS "sammlung", "nummer", "hörspielID" FROM "serie" UNION
  SELECT 'spezial', NULL, "hörspielID" FROM "spezial" UNION
  SELECT 'kurzgeschichten', NULL, "hörspielID" FROM "kurzgeschichten" UNION
  SELECT 'die_dr3i', "nummer", "hörspielID" FROM "dieDr3i" UNION
  SELECT 'kids', "nummer", "hörspielID" FROM "kids" UNION
  SELECT 'sonstige', NULL, "hörspielID" FROM "sonstige";
CREATE VIEW "alle" AS SELECT * FROM "alleIDs" JOIN "hörspiel" USING("hörspielID");
INSERT INTO "hörspiel" VALUES
  (1, 'und der Papagei', 'Kurzbeschreibung', 'Volle Beschreibung', NULL, '2000-01-02', 1, 'https://cdn.example/cover1', '1092529875', 'spotify-id', 'bookbeat-id', 'amazon-music-id', 'amazon-id', 'youtube-id', 'deezer-id', 'https://dreifragezeichen.de/produktwelt/details/und-der-papagei'),
  (2, 'Master of Chess (Live & Unplugged)', NULL, NULL, 'Metabeschreibung', NULL, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
  (3, 'Kurzgeschichte', NULL, NULL, NULL, '2001-01-01', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
  (4, 'Multipart', NULL, 'Gesamter Teil', NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
  (5, 'Multipart Teil 1', NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO "serie" VALUES (1, 1);
INSERT INTO "spezial" VALUES (2, 1), (4, 2);
INSERT INTO "kurzgeschichten" VALUES (3);
INSERT INTO "hörspielTeil" VALUES (5, 4, 1);
INSERT INTO "track" VALUES (1, 1000), (2, 2000), (3, 400), (4, 600);
INSERT INTO "kapitel" VALUES (1, 1, 1, NULL), (2, 1, 2, NULL), (3, 5, 1, NULL), (4, 5, 2, NULL);
`

func TestLoadFolgenMapsSelectedFields(t *testing.T) {
	db := openTestDB(t)
	if _, err := db.Exec(testDatabaseSQL); err != nil {
		t.Fatalf("create test database: %v", err)
	}

	folgen, err := loadFolgen(db)
	if err != nil {
		t.Fatalf("load Folgen: %v", err)
	}
	if len(folgen) != 3 {
		t.Fatalf("got %d Folgen, want 3 Serie/Spezial entries", len(folgen))
	}

	mainFolge := folgen[0]
	if mainFolge.ID != 1 || mainFolge.Collection != "serie" || mainFolge.Number == nil || *mainFolge.Number != 1 {
		t.Fatalf("unexpected ID or number: %+v", mainFolge)
	}
	if mainFolge.Title != "und der Papagei" || mainFolge.Description == nil || *mainFolge.Description != "Kurzbeschreibung\nVolle Beschreibung" {
		t.Fatalf("unexpected title or full description: %+v", mainFolge)
	}
	if mainFolge.ReleaseDate == nil || *mainFolge.ReleaseDate != "2000-01-02" {
		t.Fatalf("unexpected release date: %+v", mainFolge)
	}
	if mainFolge.TotalDuration == nil || *mainFolge.TotalDuration != 3000 {
		t.Fatalf("unexpected total duration: %+v", mainFolge.TotalDuration)
	}
	if len(mainFolge.Links) != 7 || mainFolge.Links["apple_music"] != "https://music.apple.com/de/album/1092529875" || mainFolge.Links["spotify"] != "https://open.spotify.com/intl-de/album/spotify-id" || mainFolge.Links["youtube_music"] != "https://music.youtube.com/browse/youtube-id" {
		t.Fatalf("unexpected streaming links: %+v", mainFolge.Links)
	}
	if mainFolge.Cover == nil || *mainFolge.Cover != "https://cdn.example/cover1" {
		t.Fatalf("unexpected cover URL: %+v", mainFolge.Cover)
	}
	if mainFolge.Weblink == nil || *mainFolge.Weblink != "https://dreifragezeichen.de/produktwelt/details/und-der-papagei" {
		t.Fatalf("unexpected official product link: %+v", mainFolge.Weblink)
	}
	if mainFolge.Artwork == nil || *mainFolge.Artwork != "https://dreimetadaten.de/data/Serie/001/artwork.webp" {
		t.Fatalf("unexpected artwork URL: %+v", mainFolge.Artwork)
	}

	specialFolge := folgen[1]
	if specialFolge.Collection != "spezial" || specialFolge.Number != nil || specialFolge.Description == nil || *specialFolge.Description != "Metabeschreibung" {
		t.Fatalf("unexpected special fields: %+v", specialFolge)
	}
	if specialFolge.TotalDuration != nil || specialFolge.Cover != nil {
		t.Fatalf("expected missing duration and cover to be null: %+v", specialFolge)
	}
	if specialFolge.Artwork == nil || *specialFolge.Artwork != "https://dreimetadaten.de/data/Spezial/Master-of-Chess-Live--Unplugged/artwork.webp" {
		t.Fatalf("unexpected special artwork URL: %+v", specialFolge.Artwork)
	}
	if folgen[2].ID != 4 || folgen[2].Number != nil || folgen[2].TotalDuration == nil || *folgen[2].TotalDuration != 1000 {
		t.Fatalf("expected multipart special duration to sum child chapters: %+v", folgen[2])
	}
}

func TestHTTPHandlerServesNewContractAndDetail(t *testing.T) {
	db := openTestDB(t)
	if _, err := db.Exec(testDatabaseSQL); err != nil {
		t.Fatalf("create test database: %v", err)
	}
	folgen, err := loadFolgen(db)
	if err != nil {
		t.Fatalf("load Folgen: %v", err)
	}
	handler := newHTTPHandler(folgen, zerolog.New(io.Discard))

	listResponse := httptest.NewRecorder()
	handler.ServeHTTP(listResponse, httptest.NewRequest(http.MethodGet, "/folgen?limit=1", nil))
	if listResponse.Code != http.StatusOK {
		t.Fatalf("list status = %d, want %d", listResponse.Code, http.StatusOK)
	}
	var items []Folge
	if err := json.Unmarshal(listResponse.Body.Bytes(), &items); err != nil {
		t.Fatalf("decode list response as a JSON array: %v", err)
	}
	if len(items) != 3 {
		t.Fatalf("got %d items, want 3 Serie/Spezial entries", len(items))
	}
	if !strings.Contains(listResponse.Body.String(), `"id":1`) || !strings.Contains(listResponse.Body.String(), `"collection":"serie"`) || !strings.Contains(listResponse.Body.String(), `"number":1`) || !strings.Contains(listResponse.Body.String(), `"youtube_music":`) || !strings.Contains(listResponse.Body.String(), `"weblink":`) || strings.Contains(listResponse.Body.String(), `"nummer"`) || strings.Contains(listResponse.Body.String(), `"titel"`) || strings.Contains(listResponse.Body.String(), `"_id"`) || strings.Contains(listResponse.Body.String(), `"type"`) || strings.Contains(listResponse.Body.String(), `"service":`) {
		t.Fatalf("response does not use the new standalone field names: %s", listResponse.Body.String())
	}

	detailResponse := httptest.NewRecorder()
	handler.ServeHTTP(detailResponse, httptest.NewRequest(http.MethodGet, "/folgen/2", nil))
	if detailResponse.Code != http.StatusOK {
		t.Fatalf("detail status = %d, want %d", detailResponse.Code, http.StatusOK)
	}
	var detail Folge
	if err := json.Unmarshal(detailResponse.Body.Bytes(), &detail); err != nil {
		t.Fatalf("decode detail response: %v", err)
	}
	if detail.ID != 2 || detail.Number != nil {
		t.Fatalf("unexpected detail response: %+v", detail)
	}
}

func TestHTTPHandlerLogsRequestMetadata(t *testing.T) {
	var output bytes.Buffer
	handler := newHTTPHandler(nil, zerolog.New(&output))
	response := httptest.NewRecorder()
	request := httptest.NewRequest(http.MethodGet, "/healthz?token=secret", nil)
	handler.ServeHTTP(response, request)

	if response.Code != http.StatusOK {
		t.Fatalf("health status = %d, want %d", response.Code, http.StatusOK)
	}
	var logEntry map[string]any
	if err := json.Unmarshal(output.Bytes(), &logEntry); err != nil {
		t.Fatalf("decode request log: %v", err)
	}
	if logEntry["method"] != http.MethodGet || logEntry["path"] != "/healthz" || logEntry["status"] != float64(http.StatusOK) {
		t.Fatalf("unexpected request log fields: %+v", logEntry)
	}
	bytesWritten, ok := logEntry["bytes"].(float64)
	if !ok || bytesWritten <= 0 {
		t.Fatalf("expected response byte count in request log: %+v", logEntry)
	}
	if strings.Contains(output.String(), "secret") {
		t.Fatalf("request log should not include query parameters: %s", output.String())
	}
}

func TestCORSAllowsLocalClientAndPreflight(t *testing.T) {
	handler := newHTTPHandler(nil, zerolog.New(io.Discard))
	preflight := httptest.NewRequest(http.MethodOptions, "/folgen", nil)
	preflight.Header.Set("Origin", localClientOrigin)
	preflight.Header.Set("Access-Control-Request-Method", http.MethodGet)
	preflightResponse := httptest.NewRecorder()
	handler.ServeHTTP(preflightResponse, preflight)

	if preflightResponse.Code != http.StatusNoContent {
		t.Fatalf("preflight status = %d, want %d", preflightResponse.Code, http.StatusNoContent)
	}
	if preflightResponse.Header().Get("Access-Control-Allow-Origin") != localClientOrigin {
		t.Fatalf("unexpected allowed origin: %q", preflightResponse.Header().Get("Access-Control-Allow-Origin"))
	}
	if preflightResponse.Header().Get("Access-Control-Allow-Methods") != "GET, OPTIONS" {
		t.Fatalf("unexpected allowed methods: %q", preflightResponse.Header().Get("Access-Control-Allow-Methods"))
	}

	request := httptest.NewRequest(http.MethodGet, "/healthz", nil)
	request.Header.Set("Origin", localClientOrigin)
	response := httptest.NewRecorder()
	handler.ServeHTTP(response, request)
	if response.Code != http.StatusOK || response.Header().Get("Access-Control-Allow-Origin") != localClientOrigin {
		t.Fatalf("GET response did not allow the local origin: status=%d headers=%v", response.Code, response.Header())
	}
}

func TestCORSRejectsUnexpectedPreflightOrigin(t *testing.T) {
	handler := newHTTPHandler(nil, zerolog.New(io.Discard))
	request := httptest.NewRequest(http.MethodOptions, "/folgen", nil)
	request.Header.Set("Origin", "http://example.com")
	response := httptest.NewRecorder()
	handler.ServeHTTP(response, request)

	if response.Code != http.StatusForbidden {
		t.Fatalf("preflight status = %d, want %d", response.Code, http.StatusForbidden)
	}
	if response.Header().Get("Access-Control-Allow-Origin") != "" {
		t.Fatalf("unexpected allowed origin: %q", response.Header().Get("Access-Control-Allow-Origin"))
	}
}

func TestOpenDatabaseCachesRecentDatabase(t *testing.T) {
	var downloads atomic.Int32
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
		downloads.Add(1)
		_, _ = w.Write([]byte(testDatabaseSQL))
	}))
	defer server.Close()

	directory := t.TempDir()
	databasePath := filepath.Join(directory, "metadata.sqlite")
	sqlCachePath := filepath.Join(directory, "metadata.sql")

	db, status, err := openDatabase(context.Background(), databasePath, sqlCachePath, server.URL, time.Hour)
	if err != nil {
		t.Fatalf("first openDatabase: %v", err)
	}
	if !status.refreshed || downloads.Load() != 1 {
		t.Fatalf("first start: status=%+v downloads=%d, want refreshed and one download", status, downloads.Load())
	}
	if err := db.Close(); err != nil {
		t.Fatalf("close first database: %v", err)
	}

	db, status, err = openDatabase(context.Background(), databasePath, sqlCachePath, server.URL, time.Hour)
	if err != nil {
		t.Fatalf("second openDatabase: %v", err)
	}
	defer db.Close()
	if status.refreshed || downloads.Load() != 1 {
		t.Fatalf("second start: status=%+v downloads=%d, want cached database and no extra download", status, downloads.Load())
	}
}

func TestOpenDatabaseRefreshesExpiredCache(t *testing.T) {
	var downloads atomic.Int32
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
		downloads.Add(1)
		_, _ = w.Write([]byte(testDatabaseSQL))
	}))
	defer server.Close()

	directory := t.TempDir()
	databasePath := filepath.Join(directory, "metadata.sqlite")
	sqlCachePath := filepath.Join(directory, "metadata.sql")
	maxAge := time.Hour

	db, _, err := openDatabase(context.Background(), databasePath, sqlCachePath, server.URL, maxAge)
	if err != nil {
		t.Fatalf("first openDatabase: %v", err)
	}
	if err := db.Close(); err != nil {
		t.Fatalf("close first database: %v", err)
	}

	old := time.Now().Add(-2 * maxAge)
	if err := os.Chtimes(databasePath, old, old); err != nil {
		t.Fatalf("age SQLite database: %v", err)
	}
	if err := os.Chtimes(sqlCachePath, old, old); err != nil {
		t.Fatalf("age SQL cache: %v", err)
	}

	db, status, err := openDatabase(context.Background(), databasePath, sqlCachePath, server.URL, maxAge)
	if err != nil {
		t.Fatalf("refresh expired database: %v", err)
	}
	defer db.Close()
	if !status.refreshed || downloads.Load() != 2 {
		t.Fatalf("expired start: status=%+v downloads=%d, want refresh and two downloads", status, downloads.Load())
	}
}

func openTestDB(t *testing.T) *sql.DB {
	t.Helper()
	db, err := sql.Open("sqlite", ":memory:")
	if err != nil {
		t.Fatalf("open in-memory SQLite database: %v", err)
	}
	db.SetMaxOpenConns(1)
	t.Cleanup(func() {
		_ = db.Close()
	})
	return db
}
