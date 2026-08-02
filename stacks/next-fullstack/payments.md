# Payment recipe: next-fullstack

The standard way to add "customers can pay" to a `next-fullstack` project. Locked choice, same spirit as Prisma/Auth.js — **never hand-roll payment handling**: no custom card parsing, no storing raw card numbers, no hand-written webhook verification. Re-check `https://stripe.com/docs` before relying on exact APIs — Stripe's SDKs and API versions move.

## Locked choices

- **Provider: Stripe** — server-side via the official `stripe` Node SDK
- **Default flow: Stripe Checkout (hosted page)** — Stripe hosts the card form; this project's server never sees a raw card number, keeping PCI scope to the minimum. Switching to an embedded Payment Element is a deliberate later choice, not a default.
- **Scope: one-time payments only** — subscriptions/recurring billing (Stripe Billing) is a separate recipe added later, only when a feature genuinely needs it; don't wire it in speculatively.
- **Money is always an integer in the smallest currency unit** (e.g. satang, cents) — never a float. Already required by constitution §8 whenever the security level is `sensitive-data`, which "money moves through the app" always triggers.
- **Currency**: asked of the founder in outcome terms when this recipe is first installed ("ลูกค้าจะจ่ายเงินสกุลไหน?") — never assumed, never hard-coded.
- **Refunds are the founder's action, not the agent's** — refunds happen from the Stripe Dashboard, by the founder, after they decide to issue one. No feature calls the refund API on the founder's behalf; a "request a refund" feature (if ever built) only creates a request for the founder to action manually.
- **Env var NAMES only, never values** — same rule as every other secret: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` go in `.env.example`; the founder creates the Stripe account and enters real values themselves in `.env` / the host dashboard.

## Install

```
npm install stripe @stripe/stripe-js
```

## Wire-up (follow current Stripe docs for exact shapes)

1. `src/lib/stripe.ts` — a single server-side Stripe client instantiated once from `STRIPE_SECRET_KEY`; nothing else in the codebase constructs its own client.
2. A route handler (e.g. `src/app/api/checkout/route.ts`) that creates a Checkout Session server-side (amount as an integer, currency from the founder's answer) and returns its URL — the client redirects to it. Never build a card form in this project's own UI.
3. A webhook route handler (e.g. `src/app/api/stripe/webhook/route.ts`) that:
   - reads the raw request body (do not let a framework body-parser touch it first — Stripe signature verification needs the exact bytes)
   - calls `stripe.webhooks.constructEvent(...)` with `STRIPE_WEBHOOK_SECRET` before trusting anything in the payload
   - handles `checkout.session.completed` (and any other event the feature needs) **idempotently** — record the Stripe event ID already processed so a retried webhook delivery never double-fulfills an order
4. Env var NAMES into `.env.example`: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`. Values: founder's hands only (their own Stripe account, test mode first).
5. Order/payment records go through Prisma like any other data — an integer `amount`, a `currency`, and a `status` derived from webhook events, never from the client's say-so.
6. Any page showing payment status uses the design tokens like any other UI — no special-cased styling.

## Definition of done (on top of the normal harness)

- Abuse-case tests from RED phase: a webhook with an invalid/missing signature is rejected, an amount of zero or negative is rejected before a Checkout Session is even created, a webhook delivered twice for the same event does not fulfill the order twice
- Test mode only during development — Stripe's test API keys and test card numbers (never a real card) drive every automated test and the E2E spec
- E2E spec titled as a scenario ("a customer pays for their order and sees a confirmation"), exercising the real Checkout redirect in Stripe's test mode, never a mocked-out fake that skips Stripe entirely
- `npm audit` clean at critical level after the new deps (and at high level too, since payment features always carry security level `sensitive-data`)
