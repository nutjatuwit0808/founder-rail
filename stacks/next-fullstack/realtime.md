# Realtime recipe: next-fullstack

The standard way to make a page "update itself" — a queue count, an order status — without the customer hitting refresh. Locked choice, same spirit as auth/payments: **never hand-roll the mechanism per feature**, so one feature doesn't poll every 3s while another forgets to update live at all.

## Locked choices

- **Default mechanism: polling every 5 seconds** — a client component calls a normal Route Handler on a `setInterval`, no new infra, works identically in dev and prod, easy to debug. A 2-5s delay is invisible for queue/order-status use cases; do not shorten it as a default.
- **Escalation: SSE only, and only on explicit signal** — reach for Server-Sent Events solely when the feature description makes "must be truly instant" explicit (e.g. a live countdown where missing a second matters). This is never the default; record the specific reason in that feature's `DECISIONS.md` when it happens.
- **WebSocket is out of scope for v1** — more infra than a single-store MVP needs.
- **Never ask the founder about the mechanism** — polling vs SSE is an agent decision, identical in spirit to how auth/payment providers are chosen without a technical question.

## Wire-up (polling default)

1. A normal Route Handler (e.g. `src/app/api/queue-status/route.ts`) that reads current state straight from the DB — no caching layer beyond what Prisma/the DB already does, so it never serves state older than ~1s.
2. A client component polls that route with `fetch` on `setInterval(..., 5000)` and **always clears the interval on unmount** — a leaked interval is a review blocker (see `agents/fresh-reviewer.md`).
3. The polled endpoint checks the caller's authorization exactly like every other endpoint — "it's just polling" is not an exemption from auth checks.
4. If a feature genuinely needs SSE: a Route Handler streaming `text/event-stream`, closed cleanly when the client disconnects. Still no WebSocket.

## Definition of done (on top of the normal harness)

- Abuse-case: the polled/streamed endpoint rejects an unauthorized caller the same as any other endpoint for that data
- The polling interval used (default 5s, or the SSE escalation with its recorded reason) is stated in plain language in the Phase 0 plan summary the founder approves — e.g. "the page will refresh its status every ~5 seconds on its own"
- E2E/Playwright specs assert the live update with `page.waitForFunction`/poll-until-visible, never a fixed `sleep`
