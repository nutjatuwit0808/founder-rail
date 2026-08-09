# Realtime recipe: next-nest

Same locked choices as `../next-fullstack/realtime.md` (5-second polling default, SSE-only escalation on explicit signal, no WebSocket in v1) — mapped to the monorepo shape: **the polled/streamed endpoint lives in `apps/api`**, same as every other REST endpoint. `apps/web` never opens a direct connection to a datastore or a separate realtime service.

## Locked choice: endpoint in `apps/api`, `apps/web` just polls it

- `apps/api` exposes the status endpoint (e.g. `GET /queue-status`) like any other REST endpoint — no separate realtime service, no dedicated gateway process for the polling default.
- `apps/web`'s client component polls that `apps/api` endpoint with `fetch` on `setInterval(..., 5000)`, cleared on unmount — identical client-side pattern to `next-fullstack`.
- If a feature escalates to SSE (rare, signal-driven only — see `../next-fullstack/realtime.md`), the streaming endpoint still lives in `apps/api`; `apps/web` opens the `EventSource` connection to `apps/api`, not to a separate service.

## Wire-up order

1. Api side: a NestJS controller method reading current state straight from the DB, guarded by the same auth check every other endpoint for that data uses.
2. Web side: a client component polling that endpoint every 5s via `fetch`, interval cleared on unmount.
3. E2E must cross the boundary: state changes on the api side (e.g. staff marks an order ready) → web's next poll picks it up within one interval, asserted with `page.waitForFunction`, never a fixed `sleep`.

## Definition of done

Everything in `../next-fullstack/realtime.md`, plus: no direct DB or datastore connection from `apps/web` for realtime data — it always goes through `apps/api`.
