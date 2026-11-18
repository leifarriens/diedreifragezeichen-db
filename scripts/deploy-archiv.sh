#!/usr/bin/env bash
set -Eeuo pipefail

ROOT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

if [[ -z "${VPS:-}" ]]; then
  printf 'VPS must be set, for example: VPS=user@example.com %s\n' "$0" >&2
  exit 1
fi

PLATFORM="${DOCKER_PLATFORM:-linux/amd64}"
IMAGE_REPOSITORY="${IMAGE_REPOSITORY:-ddfdb-archiv}"
IMAGE_TAG="${IMAGE_TAG:-$(git rev-parse --short HEAD)}"
IMAGE="${IMAGE_REPOSITORY}:${IMAGE_TAG}"
LATEST_IMAGE="${IMAGE_REPOSITORY}:latest"
VPS_APP_DIR="${VPS_APP_DIR:-/srv/ddfdb-archiv}"
VPS_COMPOSE_FILE="${VPS_COMPOSE_FILE:-$VPS_APP_DIR/compose.yaml}"
VPS_SERVICE="${VPS_SERVICE:-archiv}"
VPS_HEALTH_PORT="${VPS_HEALTH_PORT:-3002}"
VPS_HEALTH_TIMEOUT="${VPS_HEALTH_TIMEOUT:-600}"

if [[ ! "$VPS_HEALTH_TIMEOUT" =~ ^[1-9][0-9]*$ ]]; then
  printf 'VPS_HEALTH_TIMEOUT must be a positive number of seconds.\n' >&2
  exit 1
fi

printf 'Building %s for %s...\n' "$IMAGE" "$PLATFORM"
docker build \
  --platform "$PLATFORM" \
  -t "$IMAGE" \
  -t "$LATEST_IMAGE" \
  -f services/archiv/Dockerfile \
  services/archiv

printf 'Copying image to %s...\n' "$VPS"
TRANSFER_ARCHIVE="$(mktemp)"
trap 'rm -f "$TRANSFER_ARCHIVE"' EXIT

docker save "$IMAGE" "$LATEST_IMAGE" \
  | gzip -c \
  > "$TRANSFER_ARCHIVE"
TRANSFER_SIZE="$(wc -c < "$TRANSFER_ARCHIVE")"

if command -v pv >/dev/null 2>&1; then
  pv --size "$TRANSFER_SIZE" --force --wait --name 'image transfer' \
    "$TRANSFER_ARCHIVE" \
    | ssh "$VPS" 'gunzip | docker load'
else
  printf 'pv is not installed; transfer progress is unavailable. Install pv locally for a transfer meter.\n' >&2
  ssh "$VPS" 'gunzip | docker load' < "$TRANSFER_ARCHIVE"
fi

printf 'Restarting %s on %s...\n' "$VPS_SERVICE" "$VPS"
ssh "$VPS" "
  set -e
  test -f '$VPS_COMPOSE_FILE'
  docker compose -f '$VPS_COMPOSE_FILE' up -d --no-deps --force-recreate '$VPS_SERVICE'
  docker compose -f '$VPS_COMPOSE_FILE' ps '$VPS_SERVICE'
  printf 'Waiting up to $VPS_HEALTH_TIMEOUT seconds for the health endpoint...\\n'
  elapsed=0
  while [ \$elapsed -lt $VPS_HEALTH_TIMEOUT ]; do
    if curl --fail --silent http://127.0.0.1:$VPS_HEALTH_PORT/healthz; then
      printf '\\n'
      exit 0
    fi
    sleep 5
    elapsed=\$((elapsed + 5))
  done
  printf 'Health check timed out; recent service logs follow.\\n' >&2
  docker compose -f '$VPS_COMPOSE_FILE' logs --tail=100 '$VPS_SERVICE'
  exit 1
"

printf 'Archiv deployment completed: %s\n' "$IMAGE"
