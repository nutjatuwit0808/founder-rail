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
