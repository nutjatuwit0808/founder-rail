# Deploy recipe: railway-nest

Re-check `railway --help` and `npx vercel --help` before relying on flags — both CLIs change over time.

## First-time setup (`setup-deploy`)

### Backend — `apps/api` on Railway

1. **Login** (user authenticates in browser; agent never handles the token):
   ```
   railway login
   ```
2. **Create/link the project**, from the repo root:
   ```
   railway init
   ```
3. **Postgres** ⚠️ touches real infrastructure — approval required first. Add a Postgres service in the Railway project (`railway add`), then reference its `DATABASE_URL` into the api service via Railway's variable reference (service → Variables) — the value never passes through the agent.
4. **Root directory** — in the Railway service settings, set the api service's root directory to `apps/api` (monorepo). This is a dashboard step; print a plain-language guide.
5. **First deploy** — from `apps/api` (be linked to the api service; `railway link` if needed):
   ```
   railway up
   ```
6. **Run migrations against the production DB** ⚠️ — only after explicit approval, **and only after a verified backup**. Dump through `railway run` so the connection string stays on the host side, never in chat:
   ```
   mkdir -p backups && railway run sh -c 'pg_dump "$DATABASE_URL" -f backups/pre-migrate-'$(date +%Y%m%d-%H%M)'.sql'
   ```
   Verify the file exists and is non-empty (`backups/` must be gitignored — it holds real customer data). Then:
   ```
   railway run npx prisma migrate deploy
   ```
   Never a destructive command — the `db-danger-guard` hook blocks those outright.

### Frontend — `apps/web` on Vercel

Follow `../vercel-fullstack/recipe.md` steps 1–4 with two changes: run `vercel link` inside `apps/web`, and set the env var NAME for the API base URL (e.g. `NEXT_PUBLIC_API_URL`) to the Railway service's public URL.

## Every launch (`/founder-rail:launch`)

Pre-flight must already have passed for **both** apps. Deploy backend first (API must be up before the site that calls it):

```
cd apps/api && railway up
cd apps/web && npx vercel --prod
```

Capture both URLs; run `verify.md`.
