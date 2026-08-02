# railway-nest preset

Hosts a `next-nest` monorepo: the NestJS backend (`apps/api`) on [Railway](https://railway.com/) (which runs real Node servers and Postgres), and the Next.js frontend (`apps/web`) on [Vercel](https://vercel.com/). Chosen automatically whenever the project's stack is `next-nest`.

## What this is for

A `next-nest` project has a long-running backend process — Vercel alone doesn't host that shape well; Railway does, and also provides the Postgres database next to the API.

## What the user gets, in plain language

- Two pieces working together behind one experience: the website customers open, and the engine behind it — each on the host that suits it
- Same launch discipline as everything else: pre-flight (tests green, both apps build, no critical vulnerabilities) → ⚠️ user approval → deploy → verify the real URLs respond
- Both hosts keep previous versions for rollback from their dashboards

## Secrets ⚠️

Same rule as all founder-rail deploys: real values never pass through the agent — including Stripe secret/webhook keys if the project takes payments. Variable NAMES are documented in `.env.example` per app; the user enters VALUES in each host's dashboard (Railway: service → Variables · Vercel: Project → Settings → Environment Variables). Railway can inject its own Postgres `DATABASE_URL` into the api service directly — prefer that over copying values by hand.

## Uptime watch (optional, recommended after launch)

Recommend a free external ping (e.g. UptimeRobot) on **both** the site URL and the API health URL; the skill prints a plain-language setup guide. No integration.

## Files in this preset

- `recipe.md` — CLI commands for first-time setup and every launch
- `verify.md` — checks that must pass before a launch is declared done
