# vercel-fullstack preset

Hosts a `next-fullstack` project on [Vercel](https://vercel.com/) — the platform built by the makers of Next.js. Free tier covers an MVP; scales up without re-platforming.

## What this is for

The default deploy target whenever the project's stack is `next-fullstack`. One app, one host, one URL.

## What the user gets, in plain language

- A real web address customers can open (free `*.vercel.app` domain, or their own domain if they have one)
- Every launch goes through pre-flight first: all tests green, the app builds, no critical known vulnerabilities ⚠️ launching puts changes in front of real customers — always requires the user's approval
- The host keeps previous versions: if a launch goes wrong, the previous deployment can be restored from the Vercel dashboard (Deployments → ⋯ → Promote to Production)

## Secrets ⚠️

Real secret values (database URL, API keys, Stripe secret/webhook keys if the project takes payments) must never pass through the agent as plain text. The skill prepares a `.env.example` documenting every variable NAME the app needs, and the user enters the VALUES themselves in the Vercel dashboard (Project → Settings → Environment Variables) following the plain-language guide the skill prints.

## Uptime watch (optional, recommended after launch)

Vercel shows deployment status but does not alert when the live site goes down. Recommend the user set up a free external ping (e.g. UptimeRobot) pointed at the production URL — the skill prints a step-by-step plain-language guide; founder-rail does not integrate with it.

## Files in this preset

- `recipe.md` — CLI commands for first-time setup and every launch
- `verify.md` — checks that must pass before a launch is declared done
