# Payment recipe: next-nest

Payments for the monorepo shape: **Checkout Session creation and the Stripe webhook both live in `apps/api`** (same locked choices as `../next-fullstack/payments.md` — Stripe, Checkout-hosted flow, one-time payments, integer money, founder-only refunds). `apps/web` never talks to Stripe directly; it only calls `apps/api`.

## Locked choice: webhook and Checkout Session creation both in `apps/api`

- `apps/api` gets exactly **one** Stripe webhook controller (mirrors the one central auth guard — no per-feature webhook handlers). All Stripe calls (creating Checkout Sessions, reading event webhooks) go through `apps/api`; `apps/web` only ever redirects the browser to the Checkout URL `apps/api` hands back.
- `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` live only in `apps/api`'s env — `apps/web` never holds them. `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (safe to expose) lives in `apps/web`'s env, used only if the project ever adds an embedded element later.
- Reason for centralizing: same as auth — one place to get webhook signature verification and idempotency right, instead of re-deriving it per feature.

## Wire-up order

1. Api side: follow `../next-fullstack/payments.md` steps 1–3, built as NestJS providers/controllers instead of Next.js route handlers (a `StripeService` wrapping the client, a `POST /checkout` endpoint, a `POST /webhooks/stripe` endpoint reading the raw body before Nest's body parser touches it).
2. Web side: a thin server action/route handler that calls `apps/api`'s `/checkout` endpoint and redirects the browser to the returned URL. No Stripe SDK needed in `apps/web` unless an embedded element is added later.
3. Order/payment records live in `apps/api`'s Prisma schema (same shape as `next-fullstack`).
4. E2E must cross the boundary: a customer starts checkout on web → api creates the session → (test mode) completes payment → api's webhook fulfills the order → web reflects the new status.

## Definition of done

Everything in `../next-fullstack/payments.md`, plus: no Stripe secret key or webhook secret ever appears in `apps/web`'s code or env files, and `apps/web` has no path that calls Stripe directly.
