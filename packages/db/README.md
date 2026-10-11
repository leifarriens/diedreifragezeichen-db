# Database package

`@ddfdb/db` owns the PostgreSQL connection, Drizzle schema, and database migrations. Better Auth's core tables are defined in `src/schema/auth.ts`; add application-owned tables in this package as features are implemented.

## Local PostgreSQL

From the repository root, start the database defined in `docker-compose.yaml`:

```sh
docker compose up -d postgres
```

Set `DATABASE_URL` to the local connection string from `apps/website/.env.example` when generating or applying migrations:

```sh
DATABASE_URL=postgres://ddfdb:ddfdb@localhost:5435/ddfdb pnpm --filter @ddfdb/db db:generate
DATABASE_URL=postgres://ddfdb:ddfdb@localhost:5435/ddfdb pnpm --filter @ddfdb/db db:migrate
```

`db:generate` writes versioned SQL migrations to `packages/db/migrations`. `db:migrate` applies those migrations. Do not use schema push for deployed environments.
