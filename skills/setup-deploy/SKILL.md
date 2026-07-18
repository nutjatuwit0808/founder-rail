---
name: setup-deploy
description: One-time deployment setup, run when the user first wants the app on the real internet (usually via /founder-rail:launch detecting no Deployment section in constitution.md). Picks the host from the project's stack preset, walks the user through login and secrets without ever handling secret values, does a safe preview deploy, and records everything in constitution.md.
---

# Setup Deploy

Gets the app onto the real internet for the first time. The host is derived from the stack — the user never picks a hosting company by name.

## Step 1 — Derive the preset (no user question needed)

Read `constitution.md` section 1 (Tech stack):

- `next-fullstack` → preset `vercel-fullstack`
- `next-nest` → preset `railway-nest`

Presets live in `${CLAUDE_PLUGIN_ROOT}/deploy/<preset>/`. Only two outcome questions, in the user's language:

1. "Do you already own a **web address** (domain name) you want to use? Or start with a free one and add yours later?"
2. ⚠️ "Launching means **real people can find and use this app**. Ready for that, or do you want a private preview first?" (preview = deploy without production promotion)

**Forbidden:** asking the user to pick a hosting provider, region, or plan by name.

## Step 2 — Secrets, without touching them ⚠️

List every environment variable the app needs (from `.env.example` and `process.env.` usage). For each: print the NAME, what it is in plain language, and where the user finds the value. The user enters values in the host dashboard **themselves** — real secret values must never pass through the agent as plain text, not in commands, not in files. If `.env.example` is missing or stale, fix it first.

## Step 3 — Follow the preset recipe

Run `recipe.md` first-time steps in order. Login steps are the user's own browser flow. Steps marked ⚠️ (database, migrations, DNS) require explicit approval before running — and destructive DB commands stay blocked by the `db-danger-guard` hook regardless.

Always end with a **preview deploy** and confirm the preview URL loads before offering production.

## Step 4 — Write constitution.md and COSTS.md

Fill section 5 (Deployment): preset + plain-language reason, production URL (or "preview only so far"), the env var NAME list and where values are managed, and the standing rule: production launches only via `/founder-rail:launch` pre-flight + ⚠️ approval.

Also create `COSTS.md` at the project root, **in the user's language**, plain words throughout:

- What the current setup costs today (usually ฿0 — say which free allowances it sits on, in outcome terms: "roughly how many visitors/data before it stops being free")
- What would trigger the **first bill** and its rough size (host tier, database, domain renewal)
- One line per paid-able thing, nothing technical

`/founder-rail:launch` updates this file whenever a launch adds or removes a paid-able service — the user should never learn about a cost from an invoice first.

## Step 5 — Report

Plain language, user's language, no jargon — don't say "deploy", "environment variable", or "DNS"; say something like "Your app now has a real address on the internet. Here's the link — open it on your phone." Point to `/founder-rail:launch` for every future release.
