# Website

Next.js application for the public website and user-facing API. User authentication is handled by Better Auth with PostgreSQL storage through Drizzle. The tRPC router lives in `@ddfdb/user-api` and is served at `/api/trpc`.

## Local setup

1. Start PostgreSQL from the repository root:

   ```sh
   docker compose up -d postgres
   ```

2. Create the website environment file and replace the Better Auth secret with the output of `pnpm dlx auth@latest secret`:

   ```sh
   cp apps/website/.env.example apps/website/.env.local
   ```

3. Apply the checked-in Drizzle migrations:

   ```sh
   DATABASE_URL=postgres://ddfdb:ddfdb@localhost:5435/ddfdb pnpm --filter @ddfdb/db db:migrate
   ```

4. Start the development servers from the repository root with `pnpm dev`, or start only the website with `pnpm --filter @ddfdb/website dev`.

The `/login` page and mobile app use email OTP for sign-in. A user account is created after the first successful OTP verification, so there is no separate sign-up step. In development, verification codes are printed by the website server's console email transport. Production email delivery uses Resend and requires `RESEND_API_KEY` plus a verified `RESEND_FROM_EMAIL` sender. Authenticated website users can view their profile at `/profil`; unauthenticated requests are redirected to `/login`. The mobile app's Expo Web origin is controlled by `TRPC_CORS_ORIGINS` in `.env.local`.
