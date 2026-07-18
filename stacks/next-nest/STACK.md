# next-nest preset

A [Next.js](https://nextjs.org/) frontend and a separate [NestJS](https://nestjs.com/) backend, both TypeScript, in one pnpm-workspaces monorepo. Chosen by `setup-techstack` only when the user's answers show a real signal for a separate backend service — never by default.

## What this is for

- Multiple clients need the same API (web + mobile + an external system)
- Heavy or continuous background work: large file processing, bulk email/notifications, scheduled/cron jobs
- The domain is complex enough that the backend is effectively its own product, or needs its own dedicated team

If none of these apply, this is the wrong preset — use `next-fullstack` instead. Do not reach for a separate backend "just in case."

## What gets scaffolded

```
apps/
├── web/     ← Next.js + TypeScript (create-next-app)
└── api/     ← NestJS + TypeScript (@nestjs/cli)
packages/
└── types/   ← types shared by web and api
```

- Package manager / monorepo tool: **pnpm workspaces**
- Database and ORM (Prisma) live **only** in `apps/api` ⚠️ touches real infrastructure — `apps/web` never talks to the database directly, only through the API

## Files in this preset

- `recipe.md` — the scaffold commands and workspace wiring
- `verify.md` — commands that must pass before setup is declared done
