# Auth recipe: next-fullstack

The standard way to add "users can sign in" to a `next-fullstack` project. Locked choices, same spirit as Prisma/pnpm — **never hand-roll auth**: no custom session logic, no custom token signing, no custom password hashing. Re-check `https://authjs.dev` before relying on exact APIs — v5 moved things and may again.

## Locked choices

- **Library: Auth.js (NextAuth v5)** — root `auth.ts` config, `auth()` everywhere (Server Components, route handlers, middleware, server actions)
- **Default sign-in: passwordless magic link via email** — no passwords stored means no passwords to leak; ideal for an MVP ⚠️ still a login feature: plan approval + abuse-case tests are mandatory as always
- **Email sender: Resend** (official Auth.js guide path, free tier) — the user creates the Resend account themselves and puts the API key VALUE in `.env` / host dashboard; the agent only ever writes the NAME `AUTH_RESEND_KEY`
- **Optional add-on when asked in outcome terms** ("อยากให้ลูกค้ากดเข้าด้วยบัญชี Google ไหม?"): Google OAuth provider
- **If real passwords are ever truly required** (rare for MVPs — challenge the need first): hashing through a maintained library (`argon2`), never hand-written, and constitution §8 log rules apply

## Install

```
npm install next-auth@beta @auth/prisma-adapter resend
```

## Wire-up (follow current Auth.js docs for exact shapes)

1. `auth.ts` at the project root: PrismaAdapter + Resend provider; export `{ handlers, auth, signIn, signOut }`.
2. `src/app/api/auth/[...nextauth]/route.ts` re-exporting `handlers`.
3. Prisma schema: add the Auth.js models (`User`, `Account`, `Session`, `VerificationToken`) from the adapter docs, then a normal `prisma migrate dev` (the db-danger-guard hook allows it).
4. Env var NAMES into `.env.example`: `AUTH_SECRET` (generate via `npx auth secret`), `AUTH_RESEND_KEY`, `AUTH_URL` for production. Values: user's hands only.
5. Sign-in page uses the design tokens like any other UI — no special-cased styling.
6. Protect pages/routes with `auth()` checks — and remember constitution §8: *whose* data, not just *whether logged in*.

## Definition of done (on top of the normal harness)

- Abuse-case tests from RED phase: expired/reused magic link rejected, malformed email rejected at the boundary, a protected page without a session redirects (never renders data), one user cannot read another user's rows
- E2E spec titled as a scenario ("a customer signs in from an email link") — full round-trip in dev can use the provider's dev/test mode or a captured link; never a mocked-out fake that skips Auth.js
- `npm audit` clean at critical level after the new deps

## Role ฝั่งร้าน (optional add-on)

Only when the project has a "staff sees things customers don't" side — installed lazily by `idea-to-spec` the first feature that needs it, never asked up front at onboarding.

- **Exactly two roles**: `customer` (default, never chosen explicitly) and `staff` — no permission matrix, no multi-tenant orgs, out of v1 scope.
- **One field**, not a separate authorization system: `role: "customer" | "staff"` (default `"customer"`) added to the Auth.js `User` model.
- **Fixed prefix `/staff`** for every staff-facing page/route, in every structure preset — it's a routing concern, not a component-architecture concern the structure preset should own.
- **One central guard**, same pattern as the sign-in check itself: a single middleware/guard checking `role === "staff"` gates everything under `/staff/*` — never a per-page check.
- **The founder grants the first `staff` role themselves, outside the app** — a one-time seed/migration run when the recipe is first installed, never an in-app "promote to staff" endpoint (that's a privilege-escalation hole). Any later staff additions are the founder's own action (e.g. editing the row directly, or a future feature scoped and reviewed on its own).

## Definition of done — role add-on

Everything above, plus: a customer session hitting any `/staff/*` route is redirected/blocked (never rendered), tested as an abuse case; the first `staff` grant happened outside app code (seed/migration), not through a self-serve endpoint.
