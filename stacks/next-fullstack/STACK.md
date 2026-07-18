# next-fullstack preset

**Default tech stack.** One app, one deploy: [Next.js](https://nextjs.org/) (App Router) with TypeScript, handling both the pages users see and the server-side logic behind them (route handlers / server actions).

## What this is for

Covers most MVPs and SaaS products: a web app with login, a database, API-style endpoints, and moderate backend logic — all inside a single Next.js project. Chosen by `setup-techstack` whenever the user's answers show no signal of needing a separate backend service.

## What gets scaffolded

- A Next.js project: TypeScript, App Router, `src/` directory, `@/*` import alias
- No database or auth wired in by default — added only when the user's answers call for storing data or logging users in (Postgres + Prisma) ⚠️ touches real infrastructure

## Files in this preset

- `recipe.md` — the scaffold command and post-install steps
- `verify.md` — commands that must pass before setup is declared done

## Escalation

If, after scaffolding, the project turns out to need a second client (mobile app, external system), heavy background jobs, or a dedicated backend team, that is a `next-nest` situation — see `../next-nest/STACK.md`. Re-running `setup-techstack` is a deliberate migration, not automatic.
