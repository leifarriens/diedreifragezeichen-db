# Archiv service

A standalone Go HTTP service that downloads the dreimetadaten SQL dump, imports it into a local SQLite database, and serves Folgen as JSON. It does not require the mobile app or any other monorepo service. Go 1.26 or newer is required for the Air and Tygo Go tool directives.

See [AVAILABLE_FIELDS.md](./AVAILABLE_FIELDS.md) for the full upstream schema field inventory and fields that could be added to the API.

## Run

```sh
cd services/archiv
go run ./cmd
```

For a local rebuild-on-change loop, run `air` from `services/archiv`; it uses the checked-in `.air.toml`. Generate the TypeScript contract from `internal/archive/folge.go` with `pnpm --filter @ddfdb/archiv build`; Tygo writes `generated/folge.ts`, importable as `@ddfdb/archiv/contracts`. The generated contract is checked in so JavaScript builds do not need Go. Build a standalone binary with `go build -o ./tmp/archiv ./cmd`.

The entry point is `cmd/main.go`; application code lives under `internal/archive`. On the first start, the service downloads `metadata/db.sql` from dreimetadaten, builds `./data/metadata.sqlite`, and starts listening on port `8080`. It refreshes the source data when the SQLite database is older than 24 hours. The SQL dump is cached alongside the database, so a recent cached dump can be reused if a database rebuild is needed. If a refresh fails but a valid cached database exists, the service logs a warning and continues to serve the stale data.

Try it with curl:

```sh
curl http://localhost:8080/healthz
curl http://localhost:8080/folgen
curl http://localhost:8080/folgen/1
```

`GET /folgen` returns entries from the Serie and Spezial collections as a JSON array. Other upstream collections, including Kids, DiE DR3i, Kurzgeschichten, and Sonstige, are excluded. Folgen with a release date are returned only after that date is at least one day old; entries without a release date remain included. The same release threshold applies to `/folgen/{id}`. Each object has `number`, `title`, `id`, `collection`, `description`, `release_date`, `total_duration`, `streaming`, `cover`, `weblink`, `artwork`, `authors`, `script_authors`, and `voice_roles`. `collection` is `serie` or `spezial`. Optional metadata is JSON `null`; `streaming` is an object keyed by available streaming service names such as `youtube_music`, with each value containing the service `id` and `link` URL. Amazon Music is included as a streaming service; Amazon's purchase-only identifier is excluded. Credit fields are always arrays. `/folgen/{id}` returns one item by its upstream `ids.dreimetadaten` ID. This is a new standalone contract, not the legacy API response format. Requests are logged as JSON with method, path, status, response bytes, and duration. Query parameters are not included in the access log. Browser CORS requests are allowed from `http://localhost:8081`.

## Performance tests

Start Archiv locally, then run a k6 test from the repository root. The runner uses Docker, so a local k6 installation is not required:

```sh
ENDPOINT_URL=http://localhost:8080/folgen services/archiv/performance/run.sh smoke
```

The available configurations are `smoke` (the default), `average`, `stress`, `spike`, and `breakpoint`. You can also select one with `TEST_CONFIG=stress` instead of passing it as an argument. The higher-load configurations can generate substantial traffic, so use them only against an environment where you are authorized to run load tests.

## Configuration

| Environment variable   | Default                        | Description                                                                        |
| ---------------------- | ------------------------------ | ---------------------------------------------------------------------------------- |
| `PORT`                 | `8080`                         | Port to listen on                                                                  |
| `LISTEN_ADDR`          | unset                          | Full listen address, overrides `PORT` (for example `0.0.0.0:8080`)                 |
| `DB_PATH`              | `./data/metadata.sqlite`       | Local SQLite database path                                                         |
| `SQL_CACHE_PATH`       | `<DB_PATH>.sql`                | Cached upstream SQL dump path                                                      |
| `DDF_METADATA_SQL_URL` | Upstream `metadata/db.sql` URL | Source SQL dump URL                                                                |
| `DB_MAX_AGE`           | `24h`                          | How long the local SQLite database is considered fresh; accepts Go duration syntax |

Remove the SQLite file to force a fresh import. Remove both the SQLite file and cached SQL dump to force a new download immediately.

## VPS deployment

Build the Docker image locally, stream it to the VPS over SSH, recreate only the Compose service, then check `/healthz` from the VPS. No image registry or automated deployment is required. The image needs outbound HTTPS access on first start to download the upstream SQL dump; the deploy script waits up to 10 minutes for the service to become healthy.

### One-time VPS setup

Set the SSH target and verify that Docker Compose is available:

```sh
export VPS=user@example.com
ssh "$VPS" 'docker version --format "{{.Server.Version}}" && docker compose version'
```

Create the deployment directory and copy the checked-in Compose file to the VPS:

```sh
ssh "$VPS" 'sudo install -d -o "$USER" -g "$USER" -m 700 /srv/ddfdb-archiv'
ssh "$VPS" 'install -m 644 /dev/stdin /srv/ddfdb-archiv/compose.yaml' < services/archiv/compose.yaml
```

The Compose file publishes the service only on `127.0.0.1:3002` and stores SQLite data in the persistent `archiv-data` Docker volume. Configure the VPS reverse proxy (for example, Caddy) to forward the desired public hostname to `127.0.0.1:3002`.

### Deploy

From the repository root, build, transfer, restart, and health-check Archiv with:

```sh
VPS=user@example.com pnpm deploy:archiv
```

The script defaults to:

```text
DOCKER_PLATFORM=linux/amd64
IMAGE_REPOSITORY=ddfdb-archiv
IMAGE_TAG=<current-short-git-commit>
VPS_APP_DIR=/srv/ddfdb-archiv
VPS_COMPOSE_FILE=/srv/ddfdb-archiv/compose.yaml
VPS_SERVICE=archiv
VPS_HEALTH_PORT=3002
VPS_HEALTH_TIMEOUT=600
```

It builds from `services/archiv/`, tags the image with the current Git commit and `latest`, transfers both tags with `docker save | gzip | ssh ... docker load`, recreates only the Archiv service, and polls `http://127.0.0.1:3002/healthz` on the VPS. The persistent volume is not removed when the service is recreated. The script does not copy application data or configuration to the VPS.

All deployment settings can be overridden through environment variables, for example:

```sh
VPS=user@example.com \
VPS_APP_DIR=/srv/ddfdb-archiv \
VPS_COMPOSE_FILE=/srv/ddfdb-archiv/compose.yaml \
VPS_HEALTH_PORT=3002 \
VPS_HEALTH_TIMEOUT=900 \
pnpm deploy:archiv
```

### Roll back and inspect

Each deploy leaves the commit-tagged image on the VPS. List available versions and retag a known-good one before recreating Archiv:

```sh
ssh "$VPS" 'docker image ls ddfdb-archiv --format "table {{.Tag}}\t{{.CreatedSince}}\t{{.ID}}"'
ssh "$VPS" 'docker image tag ddfdb-archiv:<known-good-commit> ddfdb-archiv:latest && docker compose -f /srv/ddfdb-archiv/compose.yaml up -d --no-deps --force-recreate archiv && docker compose -f /srv/ddfdb-archiv/compose.yaml ps archiv && curl --fail --silent --show-error http://127.0.0.1:3002/healthz'
```

Check service state and logs with:

```sh
ssh "$VPS" 'docker compose -f /srv/ddfdb-archiv/compose.yaml ps archiv'
ssh "$VPS" 'docker compose -f /srv/ddfdb-archiv/compose.yaml logs --since=15m archiv'
```
