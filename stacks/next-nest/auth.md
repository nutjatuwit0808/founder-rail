# Auth recipe: next-nest

Sign-in for the monorepo shape: **Auth.js lives in `apps/web`** (same setup as `../next-fullstack/auth.md` — Prisma Adapter pointing at the shared database via `apps/api`'s schema, Resend magic links, same locked choices and forbidden list). The extra question this shape adds is: **how does `apps/api` know who's calling?**

## Locked choice: JWT session strategy + one central Nest guard

- Auth.js session strategy: `jwt` (not database sessions) — the session token is a signed JWT that `apps/api` can verify **statelessly** with the same `AUTH_SECRET`.
- `apps/api` gets exactly **one** auth guard (a NestJS global/route guard) that verifies the JWT and attaches the user identity to the request. Feature code never parses tokens itself — it reads the identity the guard attached, then applies constitution §8 rule 3 (*whose* data).
- `AUTH_SECRET` is shared between both apps via env (NAME in both `.env.example`s; values in the user's hands / host dashboards on both services).
- Known tradeoff, recorded here deliberately: JWT sessions can't be revoked server-side before expiry. Acceptable at MVP scale; keep session `maxAge` short (default 30 days → set 7). If the product later needs instant revocation (bank-grade), that's a feature spec, not a quiet rewrite.

## Wire-up order

1. Web side: follow `../next-fullstack/auth.md` (models live in `apps/api`'s Prisma schema; run the migration there).
2. Api side: guard verifying the Auth.js JWT (use Auth.js's JWT helpers or `jose` with the same secret — follow current Auth.js docs for the token shape; do not hand-roll verification beyond calling the library).
3. `packages/types`: shared `SessionUser` type so web and api agree on the identity shape.
4. E2E must cross the boundary: sign in on web → call an api-backed page → data belongs to the signed-in user.

## Definition of done

Everything in `../next-fullstack/auth.md`, plus: an api request **without** a valid token gets 401 (tested), a token signed with a wrong secret gets 401 (tested), and no endpoint that touches personal data sits outside the guard.

## Role ฝั่งร้าน (optional add-on)

Same locked choices as `../next-fullstack/auth.md` (two roles only, lazy install via `idea-to-spec`, fixed `/staff` prefix, founder grants the first `staff` role outside the app) — mapped to this shape: `role` goes into the JWT claims alongside the user identity, and `apps/api`'s single central guard checks `role === "staff"` for anything under `/staff/*` (both the api routes and the `apps/web` pages that call them), instead of adding a second guard.

## Definition of done — role add-on

Everything in `../next-fullstack/auth.md`'s role add-on section, plus: a valid JWT with `role: "customer"` gets 403 from any `/staff/*` api route (tested), and no `/staff/*` page or endpoint on either side of the boundary skips the role check.
