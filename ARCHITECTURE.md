# Architecture

DDFDB has two separate data domains: public episode metadata and user-owned data. Episodes are called **Folgen** (singular: **Folge**) throughout the project.

The website and mobile app consume both domains, but each domain has its own API and database. Archiv is the source of public Folge metadata; PostgreSQL is the source of user accounts and application-owned user data.

## Data flow

```text
Upstream dreimetadaten SQL dump
  |
  v
Archiv service (Go) -> local SQLite database
  ^
  | HTTP GET /folgen and /folgen/{id} via fetch clients
  |
Website (Next.js) / Mobile app (Expo)
  |
  | User API: tRPC /api/trpc
  | Authentication: Better Auth /api/auth/*
  v
Website server -> Drizzle -> PostgreSQL
```

The user API is a separate logical API from Archiv, but it is currently hosted inside the website's Next.js server, not in a standalone service. Website server-side code can also call the user router directly without an HTTP round trip.

## Public metadata: Archiv

[`services/archiv`](services/archiv/README.md) is a standalone Go service. It automatically downloads the upstream dreimetadaten SQL dump and imports it into a local SQLite database. The SQLite database is a rebuildable copy of upstream metadata, not a store for user data.

At startup, Archiv checks its local database and rebuilds it when missing or stale (24 hours by default). It caches the SQL dump separately and can continue serving a valid stale database if a refresh fails. This is a startup freshness check, not a background polling loop.

Archiv exposes read-only JSON endpoints:

- `GET /folgen`: the catalog of supported Folgen, currently the `serie` and `spezial` collections.
- `GET /folgen/{id}`: one Folge by its upstream `ids.dreimetadaten` ID.
- `GET /healthz`: service health.

Metadata includes titles, descriptions, release dates, durations, cover artwork, and streaming links. Although SQLite contains the upstream metadata, the HTTP API does not expose every upstream field or collection. See the [field inventory](services/archiv/AVAILABLE_FIELDS.md) for details.

Both apps use small `fetch` clients rather than accessing SQLite or routing metadata through the user API:

- Website: [`apps/website/src/lib/archiv-api.ts`](apps/website/src/lib/archiv-api.ts), configured with `DDFDB_ARCHIV_API_URL`.
- Mobile: [`apps/mobile/src/api/archiv.ts`](apps/mobile/src/api/archiv.ts), configured with `EXPO_PUBLIC_DDFDB_ARCHIV_API_URL`.

The shared TypeScript `Folge` contract is generated from the Go model in `services/archiv/internal/archive/folge.go` and imported as `@ddfdb/archiv/contracts`. Change the source model and regenerate the contract; do not hand-edit generated files.

## User data: user API and PostgreSQL

The user API owns application-level reads and writes for user-specific data. Its intended scope includes user profiles, ratings, bookmarks, and other personal state. These belong in PostgreSQL, not in Archiv's SQLite database.

The relevant components are:

| Component                                                                 | Responsibility                                                                                         |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| [`packages/user-api`](packages/user-api/src/index.ts) (`@ddfdb/user-api`) | Shared tRPC router, input validation, authenticated procedure boundary, and exported `AppRouter` type. |
| [`apps/website`](apps/website/README.md)                                  | Hosts `/api/trpc` and `/api/auth/*`, resolves sessions, and provides the website UI.                   |
| [`packages/db`](packages/db/README.md) (`@ddfdb/db`)                      | Server-side PostgreSQL connection, Drizzle schema, and versioned SQL migrations.                       |
| Better Auth                                                               | Account creation, sign-in, and session management, persisted through its Drizzle adapter.              |

The website resolves the Better Auth session and passes the authenticated user into the tRPC context. Protected procedures reject unauthenticated requests. User-owned operations must also enforce ownership on the server; authentication alone does not authorize access to another user's records.

Both apps share the user API's TypeScript contract. The mobile tRPC client lives in [`apps/mobile/src/api/user-api.ts`](apps/mobile/src/api/user-api.ts) and uses `EXPO_PUBLIC_DDFDB_API_URL`. Website tRPC clients and server callers live in `apps/website/src/trpc`.

### Current implementation versus intended scope

Today, the Drizzle schema defines Better Auth's `user`, `session`, `account`, and `verification` tables. The `user` table includes basic profile fields such as name and image. The user router currently exposes an authenticated `user.me` query.

Ratings, bookmarks, and additional profile features are part of the intended user-data domain, but their tables and API operations are not implemented yet. Add their schema and migrations in `packages/db` and their user-facing operations in `packages/user-api`, with server-side database wiring in the website host as needed.

## Boundaries for contributors and coding agents

- **Keep metadata and user state separate.** Do not store accounts, ratings, or bookmarks in Archiv, and do not make PostgreSQL a second authoritative catalog of Folge metadata.
- **Use APIs from clients.** Mobile and browser code must not import database connections or receive PostgreSQL credentials. Database access belongs on the server.
- **Use the archive ID to associate user state with a Folge.** The upstream Folge `id` is the API identifier; episode `number` is display metadata, not the identity. SQLite and PostgreSQL are separate databases, so there is no cross-database foreign key. Any existence validation must happen at the application boundary.
- **Keep schemas and contracts in their owning packages.** Archiv owns the metadata contract; `packages/user-api` owns the tRPC contract; `packages/db` owns the PostgreSQL schema and migrations.
- **Keep shared utilities independent of persistence.** [`packages/core`](packages/core/src/index.ts) contains cross-app utilities, currently date helpers, rather than API hosting or database code.
- **Preserve independent metadata access.** Browsing the public archive does not require a user account or a call to the user API.

## Further reading

- [Archiv setup, configuration, and deployment](services/archiv/README.md)
- [PostgreSQL setup and migration workflow](packages/db/README.md)
- [Website and user API setup](apps/website/README.md)
- [Mobile app](apps/mobile/README.md)
- [Agent guidelines and verification commands](AGENTS.md)
