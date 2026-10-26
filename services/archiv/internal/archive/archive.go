package archive

import (
	"database/sql"
	"fmt"
	"net/url"
	"strconv"
	"strings"
)

const folgenQuery = `
SELECT
  h."hörspielID",
  CASE a."sammlung" WHEN 'spezial' THEN 'specials' ELSE a."sammlung" END,
  a."nummer",
  h."titel",
  h."kurzbeschreibung",
  h."beschreibung",
  h."metabeschreibung",
  CAST(h."veröffentlichungsdatum" AS TEXT),
  CASE
    WHEN EXISTS (
      SELECT 1 FROM "hörspielTeil" AS part
      WHERE part."hörspiel" = h."hörspielID"
    ) THEN (
      SELECT SUM(t."dauer")
      FROM "hörspielTeil" AS part
      JOIN "kapitel" AS k ON k."hörspielID" = part."teil"
      JOIN "track" AS t USING ("trackID")
      WHERE part."hörspiel" = h."hörspielID"
    )
    ELSE (
      SELECT SUM(t."dauer")
      FROM "kapitel" AS k
      JOIN "track" AS t USING ("trackID")
      WHERE k."hörspielID" = h."hörspielID"
    )
  END,
  h."idAppleMusic",
  h."idSpotify",
  h."idBookbeat",
  h."idAmazonMusic",
  h."idYouTubeMusic",
  h."idDeezer",
  COALESCE(
    NULLIF(h."urlCoverDreifragezeichen", ''),
    NULLIF(h."urlCoverApple", ''),
    NULLIF(h."urlCoverKosmos", '')
  ),
  h."urlDreifragezeichen",
  h."artwork"
FROM "alleIDs" AS a
JOIN "hörspiel" AS h USING ("hörspielID")
LEFT JOIN "spezial" AS s ON s."hörspielID" = h."hörspielID"
WHERE a."sammlung" IN ('serie', 'spezial')
ORDER BY
  CASE a."sammlung"
    WHEN 'serie' THEN 1
    WHEN 'spezial' THEN 2
    WHEN 'kurzgeschichten' THEN 3
    WHEN 'die_dr3i' THEN 4
    WHEN 'kids' THEN 5
    ELSE 6
  END,
  COALESCE(a."nummer", s."position", h."hörspielID"),
  h."hörspielID"`

func loadFolgen(db *sql.DB) ([]Folge, error) {
	rows, err := db.Query(folgenQuery)
	if err != nil {
		return nil, fmt.Errorf("query Folgen: %w", err)
	}
	defer rows.Close()

	var folgen []Folge
	for rows.Next() {
		var (
			id               int64
			sammlung         string
			nummer           sql.NullInt64
			titel            string
			kurzbeschreibung sql.NullString
			beschreibung     sql.NullString
			metabeschreibung sql.NullString
			veroeffentlicht  sql.NullString
			gesamtdauer      sql.NullInt64
			appleMusicID     sql.NullString
			spotifyID        sql.NullString
			bookbeatID       sql.NullString
			amazonMusicID    sql.NullString
			youtubeMusicID   sql.NullString
			deezerID         sql.NullString
			cover            sql.NullString
			weblink          sql.NullString
			artwork          int
		)
		if err := rows.Scan(
			&id,
			&sammlung,
			&nummer,
			&titel,
			&kurzbeschreibung,
			&beschreibung,
			&metabeschreibung,
			&veroeffentlicht,
			&gesamtdauer,
			&appleMusicID,
			&spotifyID,
			&bookbeatID,
			&amazonMusicID,
			&youtubeMusicID,
			&deezerID,
			&cover,
			&weblink,
			&artwork,
		); err != nil {
			return nil, fmt.Errorf("scan Folge: %w", err)
		}

		folge := Folge{
			Number:        nullableInt64(nummer),
			Title:         titel,
			ID:            id,
			Collection:    Collection(sammlung),
			Description:   fullDescription(kurzbeschreibung, beschreibung, metabeschreibung),
			ReleaseDate:   nullableNonEmptyString(veroeffentlicht),
			TotalDuration: nullableInt64(gesamtdauer),
			Streaming:     buildStreaming(appleMusicID, spotifyID, bookbeatID, amazonMusicID, youtubeMusicID, deezerID),
			Cover:         nullableNonEmptyString(cover),
			Weblink:       nullableNonEmptyString(weblink),
			Authors:       []string{},
			ScriptAuthors: []string{},
			VoiceRoles:    []VoiceRole{},
		}
		if artwork > 0 {
			if artworkURL := buildArtworkURL(sammlung, nummer, titel); artworkURL != nil {
				folge.Artwork = artworkURL
			}
		}
		folgen = append(folgen, folge)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("iterate Folgen: %w", err)
	}
	if err := rows.Close(); err != nil {
		return nil, fmt.Errorf("close Folgen rows: %w", err)
	}
	if folgen == nil {
		folgen = []Folge{}
	}
	if err := loadCredits(db, folgen); err != nil {
		return nil, err
	}
	return folgen, nil
}

func loadCredits(db *sql.DB, folgen []Folge) error {
	authors, err := loadAuthorNames(db, `
SELECT author."hörspielID", person."name"
FROM "hörspielBuchautor" AS author
JOIN person USING ("personID")
JOIN "alleIDs" AS ids USING ("hörspielID")
WHERE ids."sammlung" IN ('serie', 'spezial')
ORDER BY author."hörspielID", author."personID"`)
	if err != nil {
		return fmt.Errorf("query authors: %w", err)
	}
	scriptAuthors, err := loadAuthorNames(db, `
SELECT author."hörspielID", person."name"
FROM "hörspielSkriptautor" AS author
JOIN person USING ("personID")
JOIN "alleIDs" AS ids USING ("hörspielID")
WHERE ids."sammlung" IN ('serie', 'spezial')
ORDER BY author."hörspielID", author."personID"`)
	if err != nil {
		return fmt.Errorf("query script authors: %w", err)
	}

	folgeByID := make(map[int64]*Folge, len(folgen))
	for index := range folgen {
		folge := &folgen[index]
		folgeByID[folge.ID] = folge
		if names := authors[folge.ID]; names != nil {
			folge.Authors = names
		}
		if names := scriptAuthors[folge.ID]; names != nil {
			folge.ScriptAuthors = names
		}
	}

	rows, err := db.Query(`
SELECT
  role."hörspielID",
  character."name",
  person."name"
FROM "sprechrolle" AS role
JOIN "rolle" AS character USING ("rolleID")
JOIN "alleIDs" AS ids ON ids."hörspielID" = role."hörspielID"
JOIN "spricht" AS speaker USING ("sprechrolleID")
JOIN person USING ("personID")
WHERE ids."sammlung" IN ('serie', 'spezial')
ORDER BY role."hörspielID", role."position", speaker."position"`)
	if err != nil {
		return fmt.Errorf("query voice roles: %w", err)
	}
	defer rows.Close()

	for rows.Next() {
		var (
			folgeID     int64
			roleName    string
			speakerName string
		)
		if err := rows.Scan(&folgeID, &roleName, &speakerName); err != nil {
			return fmt.Errorf("scan voice role: %w", err)
		}

		folge := folgeByID[folgeID]
		if folge == nil {
			continue
		}
		folge.VoiceRoles = append(folge.VoiceRoles, VoiceRole{
			Role:    roleName,
			Speaker: speakerName,
		})
	}
	if err := rows.Err(); err != nil {
		return fmt.Errorf("iterate voice roles: %w", err)
	}
	return nil
}

func loadAuthorNames(db *sql.DB, query string) (map[int64][]string, error) {
	rows, err := db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	namesByFolge := make(map[int64][]string)
	for rows.Next() {
		var folgeID int64
		var name string
		if err := rows.Scan(&folgeID, &name); err != nil {
			return nil, err
		}
		namesByFolge[folgeID] = append(namesByFolge[folgeID], name)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return namesByFolge, nil
}

func fullDescription(short, full, meta sql.NullString) *string {
	parts := make([]string, 0, 2)
	if short.Valid {
		parts = append(parts, short.String)
	}
	if full.Valid {
		parts = append(parts, full.String)
	}
	if len(parts) > 0 {
		description := strings.Join(parts, "\n")
		return &description
	}
	return nullableNonEmptyString(meta)
}

func buildStreaming(ids ...sql.NullString) map[string]Streaming {
	services := []struct {
		key  string
		host string
		path string
	}{
		{key: "appleMusic", host: "music.apple.com", path: "/de/album/"},
		{key: "spotify", host: "open.spotify.com", path: "/intl-de/album/"},
		{key: "bookbeat", host: "www.bookbeat.com", path: "/de/book/"},
		{key: "amazonMusic", host: "music.amazon.de", path: "/albums/"},
		{key: "youtubeMusic", host: "music.youtube.com", path: "/browse/"},
		{key: "deezer", host: "www.deezer.com", path: "/de/album/"},
	}

	streaming := make(map[string]Streaming, len(services))

	for index, service := range services {
		if index >= len(ids) || !ids[index].Valid || ids[index].String == "" {
			continue
		}
		linkURL := url.URL{
			Scheme: "https",
			Host:   service.host,
			Path:   service.path + ids[index].String,
		}
		streaming[service.key] = Streaming{ID: ids[index].String, Link: linkURL.String()}
	}
	return streaming
}

func buildArtworkURL(sammlung string, nummer sql.NullInt64, titel string) *string {
	folder := folderForCollection(sammlung)
	if folder == "" {
		return nil
	}

	var pathName string
	switch sammlung {
	case "serie":
		if !nummer.Valid {
			return nil
		}
		pathName = fmt.Sprintf("%03d", nummer.Int64)
	case "die_dr3i":
		if nummer.Valid {
			pathName = strconv.FormatInt(nummer.Int64, 10)
		} else {
			pathName = filenameSafe(titel)
		}
	case "kids":
		if nummer.Valid {
			pathName = fmt.Sprintf("%03d", nummer.Int64)
		} else {
			pathName = filenameSafe(titel)
		}
	default:
		pathName = filenameSafe(titel)
	}
	if pathName == "" {
		return nil
	}

	assetURL := url.URL{
		Scheme: "https",
		Host:   "dreimetadaten.de",
		Path:   fmt.Sprintf("/data/%s/%s/artwork.webp", folder, pathName),
	}
	artworkURL := assetURL.String()
	return &artworkURL
}

func filenameSafe(title string) string {
	var filename strings.Builder
	for _, character := range title {
		switch character {
		case 'ä':
			filename.WriteString("ae")
		case 'Ä':
			filename.WriteString("Ae")
		case 'ö':
			filename.WriteString("oe")
		case 'Ö':
			filename.WriteString("Oe")
		case 'ü':
			filename.WriteString("ue")
		case 'Ü':
			filename.WriteString("Ue")
		case 'ß':
			filename.WriteString("ss")
		case ' ':
			filename.WriteByte('-')
		default:
			if character >= 'a' && character <= 'z' ||
				character >= 'A' && character <= 'Z' ||
				character >= '0' && character <= '9' ||
				character == '-' || character == '_' {
				filename.WriteRune(character)
			}
		}
	}
	return filename.String()
}

func folderForCollection(sammlung string) string {
	switch sammlung {
	case "serie":
		return "Serie"
	case "specials":
		return "Spezial"
	case "kurzgeschichten":
		return "Kurzgeschichten"
	case "die_dr3i":
		return "DiE_DR3i"
	case "kids":
		return "Kids"
	case "sonstige":
		return "Sonstige"
	default:
		return ""
	}
}

func nullableInt64(value sql.NullInt64) *int64 {
	if !value.Valid {
		return nil
	}
	return &value.Int64
}

func nullableNonEmptyString(value sql.NullString) *string {
	if !value.Valid || value.String == "" {
		return nil
	}
	return &value.String
}
