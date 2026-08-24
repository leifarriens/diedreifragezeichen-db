# Contribution Guide

## Setup

- Node.js v24.14.0 (`.nvmrc`), pnpm 10.30.1, MongoDB 8.0.20 (or Docker)

Before larger features: start a [Discussion](https://github.com/leifarriens/diedreiffragezeichen-db/discussions).

Fork, clone, then:

```sh
pnpm install
cp .env.example .env.local   # fill in required values
docker compose up -d         # optional, for MongoDB
pnpm dev
```

## Populate database

`POST /api/sync/folgen` with `CRON_SECRET` as Bearer token (e.g. `curl -X POST -H "Authorization: Bearer $CRON_SECRET" http://localhost:3000/api/sync/folgen`).

## Pull requests

Branches for work (`feat/...`, `fix/...`, ...); PR against `main` in the original repo.
