#!/usr/bin/env bash
set -Eeuo pipefail

ROOT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

if [[ "${VERCEL_ENV:-}" == "production" ]]; then
  printf 'Applying production database migrations...\n'
  pnpm --filter @ddfdb/db db:migrate
fi

pnpm --recursive --sort \
  --filter '@ddfdb/website...' \
  --filter '!@ddfdb/archiv' \
  run build
