# Verify: railway-nest launch

A launch is not done until every check below passes against the **production URLs**.

1. **API health** — fetch `<api-url>/health` (NestJS health route scaffolded by the stack recipe); expect HTTP 200.
2. **Site loads** — fetch the web URL; expect HTTP 200 and real page content.
3. **Site talks to API** — exercise one flow that goes through the backend (e.g. the newest `done` feature's main acceptance criterion) against production. The most common launch failure in this shape is the frontend pointing at the wrong API URL — this check catches it.
4. **Report** — plain language, user's language: both URLs, what was verified, any ⚠️ still open (unset env var, pending DNS).

If any check fails: fix and relaunch, or restore previous deployments (Railway: service → Deployments → previous → Redeploy · Vercel: Deployments → previous → Promote to Production) and report honestly.
