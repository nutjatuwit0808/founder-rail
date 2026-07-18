# Deploy recipe: vercel-fullstack

Re-check `npx vercel --help` before relying on flags — Vercel changes its CLI over time.

## First-time setup (`setup-deploy`)

1. **Login** — the user authenticates themselves (browser flow); the agent never handles the token:
   ```
   npx vercel login
   ```
2. **Link the project** (creates/attaches a Vercel project):
   ```
   npx vercel link --yes
   ```
3. **Environment variables** ⚠️ — list every variable the app reads (grep `process.env.` / check `.env.example`). Print a plain-language guide: variable name → what it is → where the user finds the value. The user adds the VALUES in the Vercel dashboard (Project → Settings → Environment Variables → Production). Never `vercel env add` with a real value in the command line.
4. **Preview deploy first** (not production — safe to look at):
   ```
   npx vercel
   ```
   Confirm the preview URL loads before ever touching production.

## Every launch (`/founder-rail:launch`)

Pre-flight must already have passed (see the launch command). Then:

```
npx vercel --prod
```

Capture the production URL from the output; run `verify.md` against it.

## Database backup before production migrations ⚠️

Required by the launch command whenever a schema change ships. Run the dump through the host's env runner so the connection string never appears in chat or files the agent reads:

```
mkdir -p backups && npx vercel env run -- sh -c 'pg_dump "$DATABASE_URL" -f backups/pre-migrate-'$(date +%Y%m%d-%H%M)'.sql'
```

Verify the file exists and is non-empty. `backups/` must be in `.gitignore` (it contains real customer data — treat like a secret; suggest the user delete old dumps after a successful migration settles).

## Custom domain (only if the user has one)

```
npx vercel domains add <domain>
```
Then print the DNS records the user must set at their registrar, in plain language ("log in where you bought the domain name, find DNS settings, add this record"). DNS changes are the user's action, not the agent's.
