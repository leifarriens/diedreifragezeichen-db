# Available metadata fields

This is a field inventory for the upstream SQLite schema downloaded from [`metadata/db.sql`](https://raw.githubusercontent.com/YourMJK/dreimetadaten/refs/heads/master/metadata/db.sql). It lists the fields the service could expose, including related metadata that is not currently returned by the HTTP API.

`NOT NULL` means the SQL schema requires a value. A `PRIMARY KEY` or `UNIQUE` constraint may also make a column effectively non-null even if its declaration does not say `NOT NULL`.

## Selected standalone HTTP response

`GET /folgen` returns a bare JSON array, not the legacy API envelope. It includes entries from upstream `serie` and `spezial` data, exposed as the `serie` and `specials` collections. `/folgen/{id}` returns one included object by the upstream `ids.dreimetadaten` ID.

| API field       | Source or behavior                                                                                                                                                                                                                                                       |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `id`            | `hörspiel.hörspielID`, which is the upstream JSON `ids.dreimetadaten` value                                                                                                                                                                                              |
| `collection`    | `Collection` string union exposed by the API: `serie` or `specials` (upstream `spezial` is normalized to `specials`)                                                                                                                                                     |
| `number`        | `alleIDs.nummer`; `null` for specials entries that do not have an episode number                                                                                                                                                                                         |
| `title`         | `hörspiel.titel`                                                                                                                                                                                                                                                         |
| `description`   | Upstream `gesamtbeschreibung`: `kurzbeschreibung` and `beschreibung` joined by a newline; if both are absent, use `metabeschreibung`                                                                                                                                     |
| `releaseDate`   | `hörspiel.veröffentlichungsdatum`; `null` when missing                                                                                                                                                                                                                   |
| `totalDuration` | Sum of the chapter track durations. For multipart entries, sum the child-part chapter durations. `null` when no chapter duration is available.                                                                                                                           |
| `streaming`     | Object keyed by available streaming services (`appleMusic`, `spotify`, `bookbeat`, `amazonMusic`, `youtubeMusic`, `deezer`); each value contains the upstream service `id` and its generated `link` URL. The purchase-only `idAmazon` is intentionally excluded.         |
| `cover`         | First non-empty URL among `hörspiel.urlCoverDreifragezeichen`, `hörspiel.urlCoverApple` (iTunes), and `hörspiel.urlCoverKosmos`, in that order; `null` when all are missing                                                                                              |
| `weblink`       | `hörspiel.urlDreifragezeichen`, the official product page URL corresponding to upstream `links.dreifragezeichen`; `null` when missing                                                                                                                                    |
| `artwork`       | Link to the upstream artwork asset when `hörspiel.artwork` is nonzero. Numbered collections use their formatted number; other collections use the upstream title-derived directory name. `null` when missing.                                                            |
| `authors`       | Array of names joined from `hörspielBuchautor` and `person`, ordered by person ID. Empty when no author is recorded.                                                                                                                                                     |
| `scriptAuthors` | Array of names joined from `hörspielSkriptautor` and `person`, ordered by person ID. Empty when no script author is recorded.                                                                                                                                            |
| `voiceRoles`    | Array of role-speaker pairs ordered by role position, then speaker position. Each object has string fields `role` and `speaker`; a role repeats when it has multiple speakers. Roles without linked speakers are omitted. Empty when no role-speaker pairs are recorded. |

Optional scalar fields are represented as JSON `null`. `streaming` is always an object and contains only streaming services with an available identifier. The upstream `idAmazon` is a purchase link, not a streaming service, and is not included. Credit fields are always arrays, including when no credits are recorded.

## Main episode table

### `hörspiel`

One row per audio play. This is the main source for list and detail fields.

| Column                     | SQLite type | Nullable | Description                                                                          |
| -------------------------- | ----------- | -------- | ------------------------------------------------------------------------------------ |
| `hörspielID`               | INTEGER     | No       | Primary key used to identify the audio play                                          |
| `titel`                    | TEXT        | No       | Title                                                                                |
| `kurzbeschreibung`         | TEXT        | Yes      | Short description                                                                    |
| `beschreibung`             | TEXT        | Yes      | Full description                                                                     |
| `metabeschreibung`         | TEXT        | Yes      | Metadata description                                                                 |
| `veröffentlichungsdatum`   | DATE        | Yes      | Release date                                                                         |
| `unvollständig`            | BOOLEAN     | No       | Whether the metadata entry is marked incomplete                                      |
| `artwork`                  | INTEGER     | No       | Artwork asset/version indicator; constrained to be nonnegative                       |
| `cover`                    | INTEGER     | No       | Cover asset/version indicator; constrained to be nonnegative                         |
| `urlCoverApple`            | TEXT        | Yes      | Apple cover image URL                                                                |
| `urlCoverKosmos`           | TEXT        | Yes      | Kosmos cover image URL                                                               |
| `urlCoverDreifragezeichen` | TEXT        | Yes      | Official Die drei ??? cover image URL                                                |
| `urlDreifragezeichen`      | TEXT        | Yes      | Official product/detail page URL                                                     |
| `idAppleMusic`             | TEXT        | Yes      | Apple Music identifier                                                               |
| `idSpotify`                | TEXT        | Yes      | Spotify identifier                                                                   |
| `idBookbeat`               | TEXT        | Yes      | BookBeat identifier                                                                  |
| `idAmazonMusic`            | TEXT        | Yes      | Amazon Music identifier                                                              |
| `idAmazon`                 | TEXT        | Yes      | Amazon purchase identifier; intentionally excluded from the API's `streaming` object |
| `idYouTubeMusic`           | TEXT        | Yes      | YouTube Music identifier                                                             |
| `idDeezer`                 | TEXT        | Yes      | Deezer identifier                                                                    |

The image URL fields are directly usable as external image links. The selected API exposes the first available URL from `urlCoverDreifragezeichen`, `urlCoverApple`, then `urlCoverKosmos` as `cover`; the artwork asset URL is derived from the collection path and title or number.

## Collections and numbering

The upstream `alleIDs` view combines these tables into collection membership and numbering. Its `sammlung` values include `spezial`; Archiv exposes that collection as `specials` in its API.

### `serie`

| Column       | SQLite type | Nullable | Description                                |
| ------------ | ----------- | -------- | ------------------------------------------ |
| `nummer`     | INTEGER     | No       | Main series episode number and primary key |
| `hörspielID` | INTEGER     | No       | Unique reference to `hörspiel.hörspielID`  |

### `spezial`

| Column       | SQLite type | Nullable | Description                                 |
| ------------ | ----------- | -------- | ------------------------------------------- |
| `hörspielID` | INTEGER     | No       | Primary key and reference to the audio play |
| `position`   | INTEGER     | No       | Unique position in the special collection   |

### `kurzgeschichten`

| Column       | SQLite type | Nullable | Description                                 |
| ------------ | ----------- | -------- | ------------------------------------------- |
| `hörspielID` | INTEGER     | No       | Primary key and reference to the audio play |

### `dieDr3i`

| Column       | SQLite type | Nullable | Description                                     |
| ------------ | ----------- | -------- | ----------------------------------------------- |
| `nummer`     | INTEGER     | Yes      | Optional collection number; unique when present |
| `hörspielID` | INTEGER     | No       | Primary key and reference to the audio play     |

### `kids`

| Column       | SQLite type | Nullable | Description                                     |
| ------------ | ----------- | -------- | ----------------------------------------------- |
| `nummer`     | INTEGER     | Yes      | Optional collection number; unique when present |
| `hörspielID` | INTEGER     | No       | Primary key and reference to the audio play     |

### `sonstige`

| Column       | SQLite type | Nullable | Description                                 |
| ------------ | ----------- | -------- | ------------------------------------------- |
| `hörspielID` | INTEGER     | No       | Primary key and reference to the audio play |

### Views: `alleIDs` and `alle`

- Upstream `alleIDs` exposes `sammlung`, `nummer`, and `hörspielID` for all six collections. Its `nummer` is `NULL` for `spezial`, `kurzgeschichten`, and `sonstige`. Special ordering is available from the upstream `spezial.position`; the other two tables do not define a collection number.
- `alle` joins `alleIDs` to `hörspiel`, so it includes collection membership and every column in the main episode table.

## Parts and multipart episodes

### `hörspielTeil`

| Column      | SQLite type | Nullable | Description                                                |
| ----------- | ----------- | -------- | ---------------------------------------------------------- |
| `teil`      | INTEGER     | No       | Primary key and reference to the part's own `hörspiel` row |
| `hörspiel`  | INTEGER     | No       | Reference to the parent audio play                         |
| `position`  | INTEGER     | No       | Part order within the parent                               |
| `buchstabe` | TEXT        | Yes      | Optional one-character part label                          |

The schema prevents a part from referring to itself and makes the parent/position and parent/letter pairs unique.

## Media, tracks, and chapters

### `medium`

| Column          | SQLite type | Nullable | Description                                     |
| --------------- | ----------- | -------- | ----------------------------------------------- |
| `mediumID`      | INTEGER     | No       | Auto-incrementing primary key                   |
| `hörspielID`    | INTEGER     | No       | Reference to the audio play                     |
| `position`      | INTEGER     | No       | Medium order within the audio play              |
| `ripLog`        | BOOLEAN     | No       | Whether a rip log is associated with the medium |
| `musicBrainzID` | TEXT        | Yes      | MusicBrainz identifier                          |

### `track`

| Column     | SQLite type | Nullable | Description                                                                       |
| ---------- | ----------- | -------- | --------------------------------------------------------------------------------- |
| `trackID`  | INTEGER     | No       | Auto-incrementing primary key                                                     |
| `mediumID` | INTEGER     | No       | Reference to the medium                                                           |
| `position` | INTEGER     | No       | Track order within the medium                                                     |
| `titel`    | TEXT        | No       | Track title                                                                       |
| `dauer`    | INTEGER     | No       | Track duration value; confirm the desired unit before exposing it in a public API |

### `kapitel`

| Column              | SQLite type | Nullable | Description                                       |
| ------------------- | ----------- | -------- | ------------------------------------------------- |
| `trackID`           | INTEGER     | No       | Primary key and reference to a track              |
| `hörspielID`        | INTEGER     | No       | Reference to the audio play                       |
| `position`          | INTEGER     | No       | Chapter order within the audio play               |
| `abweichenderTitel` | TEXT        | Yes      | Optional chapter title overriding the track title |

These tables can provide a nested `medien` list with ordered tracks and duration values, plus chapter-to-track associations, chapter order, and optional chapter titles. Chapter boundaries could be derived from track durations if that matches the intended semantics.

## Cast, roles, and authors

### `person`, `pseudonym`, and `rolle`

| Table       | Column        | SQLite type | Nullable | Description                     |
| ----------- | ------------- | ----------- | -------- | ------------------------------- |
| `person`    | `personID`    | INTEGER     | No       | Auto-incrementing person key    |
| `person`    | `name`        | TEXT        | No       | Person name                     |
| `pseudonym` | `pseudonymID` | INTEGER     | No       | Auto-incrementing pseudonym key |
| `pseudonym` | `name`        | TEXT        | No       | Pseudonym name                  |
| `rolle`     | `rolleID`     | INTEGER     | No       | Auto-incrementing role key      |
| `rolle`     | `name`        | TEXT        | No       | Character or speaking-role name |

### `sprechrolle`

| Column          | SQLite type | Nullable | Description                              |
| --------------- | ----------- | -------- | ---------------------------------------- |
| `sprechrolleID` | INTEGER     | No       | Auto-incrementing speaking-role key      |
| `hörspielID`    | INTEGER     | No       | Audio play the role belongs to           |
| `rolleID`       | INTEGER     | No       | Reference to `rolle.rolleID`             |
| `position`      | INTEGER     | No       | Role display order within the audio play |

### `spricht`

| Column          | SQLite type | Nullable | Description                             |
| --------------- | ----------- | -------- | --------------------------------------- |
| `sprechrolleID` | INTEGER     | No       | Reference to a speaking role            |
| `personID`      | INTEGER     | No       | Reference to the speaker                |
| `pseudonymID`   | INTEGER     | Yes      | Optional pseudonym used for this credit |
| `position`      | INTEGER     | No       | Speaker order for the role              |

The API exposes these records as flat `voiceRoles` entries pairing the role name with the speaker's person name. A role repeats when multiple people perform it. `sprechrolle` stores the role order for each Folge.

### `sprechrolleTeil`

| Column          | SQLite type | Nullable | Description                               |
| --------------- | ----------- | -------- | ----------------------------------------- |
| `sprechrolleID` | INTEGER     | No       | Reference to a speaking role              |
| `hörspielID`    | INTEGER     | No       | Reference to a part (`hörspielTeil.teil`) |
| `position`      | INTEGER     | No       | Role order for that part                  |

This relation can restrict a role to a particular part of a multipart audio play.

### `hörspielBuchautor` and `hörspielSkriptautor`

Both are join tables from an audio play to `person`.

| Table                 | Column       | SQLite type | Nullable | Description                         |
| --------------------- | ------------ | ----------- | -------- | ----------------------------------- |
| `hörspielBuchautor`   | `hörspielID` | INTEGER     | No       | Reference to the audio play         |
| `hörspielBuchautor`   | `personID`   | INTEGER     | No       | Book author reference to `person`   |
| `hörspielSkriptautor` | `hörspielID` | INTEGER     | No       | Reference to the audio play         |
| `hörspielSkriptautor` | `personID`   | INTEGER     | No       | Script author reference to `person` |

Both tables use the two columns as a composite primary key. Join to `person.name` to return author names.

## Database version

### `version`

| Column  | SQLite type | Nullable | Description                                               |
| ------- | ----------- | -------- | --------------------------------------------------------- |
| `major` | INTEGER     | No       | Major metadata database version component                 |
| `minor` | INTEGER     | No       | Minor metadata database version component                 |
| `patch` | INTEGER     | No       | Patch metadata database version component                 |
| `date`  | DATETIME    | No       | Version record timestamp, defaults to `CURRENT_TIMESTAMP` |

The three version numbers form a composite primary key. This is database-level version information, not a per-Folge `created_at` or `updated_at` timestamp.

## Other fields that could be added later

The schema also supports adding short and meta descriptions, the `unvollständig` flag, collection membership and special position, authors, cast and pseudonyms, multipart relationships, media and MusicBrainz IDs, tracks, chapter titles, and database version information.

There are no source fields for ratings, popularity, or per-Folge creation/update timestamps.
