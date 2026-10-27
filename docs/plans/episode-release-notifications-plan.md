# Episode release notifications

## Goal

Notify opted-in users when a new Folge becomes available in Archiv. Archiv remains the source of public episode metadata; PostgreSQL owns notification preferences, release detection state, and delivery state.

## Proposed architecture

```text
Scheduler (Vercel Cron or host timer)
    |
    v
Website: /api/cron/episode-releases
    |
    +-- Fetch /folgen from Archiv without caching
    +-- Detect previously unseen episode IDs
    +-- Persist release events and pending deliveries in PostgreSQL
    +-- Deliver pending notifications in bounded batches
```

Track processed Archiv episode IDs rather than a single latest episode. A latest-episode marker can miss multiple releases between checks, specials, or episodes sharing a release date. Episode numbers are display metadata, not identifiers.

## 1. Keep Archiv fresh

### Current behavior

Archiv checks metadata freshness at startup, with `DB_MAX_AGE` defaulting to `24h`. It loads the catalog into memory once and does not refresh it while running. A long-running instance can therefore miss upstream additions indefinitely.

The persistent SQLite database and cached SQL dump both participate in refresh decisions. A restart does not necessarily download new metadata if the existing data is still considered fresh.

### Recommended solution: periodic refresh in Go

Implement background refresh inside `services/archiv`:

- Periodically check whether upstream metadata needs refreshing.
- Build and validate a replacement catalog without interrupting reads.
- Atomically replace the catalog used by HTTP handlers only after a successful refresh.
- Keep serving the last valid catalog if downloading, importing, or validation fails.
- Prevent overlapping refresh operations.
- Support cancellation and graceful shutdown.
- Log refresh successes and failures, and expose the last successful refresh time for freshness monitoring.

Metadata freshness belongs to Archiv. Keeping refresh inside the service makes its behavior independent of host scheduling and avoids restarting a healthy service to update data.

### Interim alternative: scheduled container restart

A host cron job or systemd timer can restart Archiv to reuse its existing startup refresh behavior:

```sh
docker compose -f /srv/ddfdb-archiv/compose.yaml restart archiv
```

Docker Compose has no built-in time-based restart scheduler. Its `restart:` policy handles lifecycle events such as process failures, not scheduled restarts.

If using this alternative:

- Prefer a host systemd timer over a scheduler container with Docker socket access.
- Configure the restart interval and `DB_MAX_AGE` together. Restarting every six hours with a `24h` freshness threshold does not force six-hourly updates.
- Verify cached SQL dump behavior when choosing the freshness settings.
- Expect brief downtime while the process restarts and loads metadata.
- Monitor restart failures and service health.
- Schedule notification polling after the expected refresh period, but do not depend on exact timing for correctness.
- Leave notification detection state unchanged when Archiv is unavailable so a later poll can recover.

Scheduled restarts are an acceptable interim deployment measure. Periodic in-process refresh is the preferred long-term design.

## 2. Define release availability

Archiv currently hides dated episodes until the day after their release date. Entries with missing or invalid release dates remain visible.

Before implementation, choose whether notifications announce:

- **Archive availability:** retain the existing visibility rule and notify when an episode first becomes visible.
- **Release-day availability:** explicitly change Archiv's visibility policy, including the timezone used for date-only release values.

Do not promise release-day notifications while retaining the current delay.

## 3. Persist detection and delivery state

Add application-owned tables and generated migrations in `packages/db`:

| State                    | Purpose                                                                       |
| ------------------------ | ----------------------------------------------------------------------------- |
| Release polling state    | Initialization marker and last successful check                               |
| Observed episodes        | Unique Archiv episode ID and first-seen timestamp                             |
| Release events           | One release notification event per episode                                    |
| Notification preferences | Explicit user opt-in and channel preferences                                  |
| Notification deliveries  | Recipient, channel, status, attempts, next retry time, and provider reference |

Keep only metadata snapshots required to render or audit notifications. Do not create a second authoritative episode catalog or cross-database foreign keys to Archiv's SQLite database.

### Polling algorithm

1. Authenticate the scheduler request.
2. Fetch the complete `/folgen` catalog with a timeout, bypassing the website's existing one-hour fetch cache.
3. Validate the response before changing state.
4. On the first successful run, atomically establish a baseline without notifying users about the existing catalog. Reject an empty or invalid response as a baseline.
5. On subsequent runs, identify unseen episode IDs.
6. In a transaction, record newly observed IDs and create eligible release events and durable recipient deliveries.
7. Update the last successful poll timestamp only after successful detection-state persistence.
8. Process a bounded batch of pending deliveries independently of detection.

Use database uniqueness constraints and transactional initialization to make concurrent polls safe. An episode disappearing temporarily and later returning must not create a second release event.

### Historical imports and catch-up

Newly observed does not always mean newly released. Define a configurable release-age window so historical catalog additions are recorded without generating release alerts.

Before enabling delivery, explicitly decide:

- The release-age window.
- How missing or invalid release dates affect notification eligibility.
- How to recover after an outage longer than the window without silently losing intended alerts or announcing historical imports.

## 4. Deliver reliably

Detection must not depend on every provider request succeeding during one HTTP invocation.

- Persist deliveries before contacting a provider.
- Enforce uniqueness for each event, recipient, and channel.
- Claim deliveries atomically, with recovery for expired claims after a worker crashes.
- Recheck opt-in status before sending.
- Retry transient failures with backoff and provider-aware rate limiting.
- Mark permanent failures for inspection rather than retrying indefinitely.
- Use stable provider idempotency keys where supported.
- Record provider references and delivery outcomes without logging secrets or sensitive payloads unnecessarily.

Database uniqueness prevents duplicate jobs, but does not by itself prevent duplicate external sends after a crash between provider acceptance and recording success. Provider idempotency support and its retention limits must be considered; do not claim exactly-once delivery without those guarantees.

Initially, one cron invocation can perform detection and process a bounded delivery batch. A separate worker can drain the same durable backlog later. Delivery throughput and retry latency must be matched to scheduler frequency and function runtime limits.

## 5. Endpoint and scheduling

Proposed route:

`apps/website/src/app/api/cron/episode-releases/route.ts`

Requirements:

- Accept scheduler calls via GET, as required by Vercel Cron.
- Require an exact `Authorization: Bearer <CRON_SECRET>` match.
- Fail closed if `CRON_SECRET` is missing.
- Prevent response caching.
- Restrict real delivery to production; use dry-run behavior elsewhere.
- Return summary counts for observed episodes, release events, queued deliveries, sent deliveries, and failures.
- Bound work to fit the function runtime and preserve unfinished work in PostgreSQL.

Add the schedule to `apps/website/vercel.json`, separately from the existing legacy episode-sync cron.

### Frequency

Start with daily polling if daily notification latency is acceptable. Use six-hourly polling if faster detection is required and supported by the scheduler.

The repository's privacy documentation identifies the deployment as Vercel Hobby. Vercel's current documentation limits Hobby cron jobs to once daily and does not guarantee exact invocation timing. Six-hourly polling requires a supporting plan or an external scheduler, such as a systemd timer on the existing VPS calling the protected website endpoint. Confirm the actual deployment plan before configuring the schedule.

Reference: https://vercel.com/docs/cron-jobs/usage-and-pricing

## 6. Preferences and notification channel

There is currently no release-notification subscription system. Add authenticated preference operations in `packages/user-api` and settings UI in the relevant clients.

Do not automatically subscribe users merely because they created an account.

Keep detection channel-independent. Select the initial delivery channel before implementation:

- **Email:** reuse the website's existing Resend transport, adding release templates, unsubscribe handling, and provider idempotency support.
- **Mobile push:** add notification permission handling, device-token registration, token lifecycle management, and push delivery.

Define whether preferences cover both `serie` and `specials`, and whether multiple releases should generate separate notifications or a digest. Update privacy documentation for the chosen channel and its data processing.

## 7. Monitoring

Track and alert on:

- Archiv's last successful metadata refresh.
- The website's last successful release poll.
- Pending delivery count and oldest pending delivery age.
- Delivery failures and exhausted retries.
- Unexpected catalog size changes or unusually large release batches.

Avoid sending a large unexpected batch automatically during rollout. Use dry-run inspection and a deliberate backfill policy.

## Implementation sequence

1. Decide release visibility, notification channel, historical-import policy, preferences, and polling frequency.
2. Implement periodic Archiv refresh, or deliberately deploy the interim host restart timer.
3. Add PostgreSQL schema and generated migrations for detection, preferences, events, and deliveries.
4. Implement and test transactional release detection and first-run baselining.
5. Implement subscriptions and the initial delivery channel.
6. Add the protected endpoint, bounded delivery processing, and scheduler configuration.
7. Add freshness and delivery monitoring.
8. Run targeted checks during implementation, followed by `pnpm turbo typecheck lint test` before finishing code or configuration changes.
9. Deploy in dry-run mode, establish and inspect the baseline, then enable delivery.

## Test coverage

- Initial baseline creates no notifications.
- Empty, malformed, timed-out, or failed archive responses do not advance detection state.
- Multiple releases and equal release dates are all detected.
- Specials use stable Archiv IDs rather than episode numbers.
- Historical imports follow the configured alert policy.
- Missing or invalid release dates follow an explicit eligibility rule.
- Concurrent polls and baseline initialization do not duplicate events.
- Temporary disappearance and reappearance do not retrigger notifications.
- Failed delivery does not prevent release detection from committing.
- Expired delivery claims can be recovered.
- Transient failures retry; permanent failures remain inspectable.
- Opt-outs are respected when processing queued deliveries.
- Provider idempotency is used consistently on retries.
- Archiv continues serving its last valid catalog after refresh failure.
- Catalog replacement is safe during concurrent requests and shutdown.
- Release visibility follows the selected date and timezone policy.

## Status

Planning only. No implementation or deployment changes have been made.
