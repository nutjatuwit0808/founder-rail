---
name: setup-techstack
description: One-time tech-stack setup, run before setup-standards. Picks between a Next.js fullstack app and a Next.js+NestJS split, from outcome questions only — never asks the user to name a framework. Scaffolds the chosen stack, verifies it builds and boots, and records the result in constitution.md.
---

# Setup Tech Stack

The user cannot (or does not want to) make technical decisions. TypeScript is always used, front and back. The default is a single Next.js app; a separate NestJS backend is only added when the user's answers show a real signal for one.

## Step 1 — Detect an existing stack

Look for `next.config.*` and `nest-cli.json` (or an `apps/api` with a NestJS `package.json`). If a stack already exists, do not scaffold over it — record what's there in `constitution.md` (Step 4) and skip to the report.

## Step 2 — Ask outcome questions (never technical)

Use AskUserQuestion, in the user's language. Never say "Next.js", "NestJS", "API", "backend", or "framework" — ask only about what the product needs to do:

1. "Besides this website, will a **mobile app or another system** need to connect and use the same data or features?"
2. "Is there **heavy or ongoing background work** — like processing large files, sending large volumes of email, or scheduled jobs that run on their own?"
3. Ask only if still unclear after 1–2: "Will this get complex enough that it needs its **own dedicated backend team** soon?"

Any "yes" → preset `next-nest`. No "yes" to any → preset `next-fullstack`.

Then two data-sensitivity questions (they set the security level, not the stack):

4. "Will the app keep **customers' personal details** — names, emails, phone numbers, addresses?"
5. "Will **money move through the app** — payments, subscriptions, refunds?"

Any "yes" → security level `sensitive-data` (recorded in Step 5; see constitution §8). Both "no" → `baseline`.

**Forbidden:** asking the user to name a framework, database, or architecture. If they volunteer one, respect it (map to the closest preset); never ask.

## Step 3 — Summarize and get approval

Before scaffolding, tell the user in plain language what will be built and why, based on their answers ("From what you told me, I'll set this up as a single web app that handles both what you see and what happens behind the scenes" or "...as a website plus a separate backend service, because you need [reason]"). Add ⚠️ if a database or login will be wired in. Use AskUserQuestion: approve / adjust. Do not scaffold before approval.

## Step 4 — Scaffold and verify

Presets live in `${CLAUDE_PLUGIN_ROOT}/stacks/<preset>/`.

1. Follow `recipe.md` for the chosen preset exactly, in order.
2. Run every command in `verify.md` for the chosen preset. **Setup is not complete until all of them pass.** A build or boot failure means setup failed — fix it before continuing, don't report success.
3. If the recipe calls for a database (Prisma), that step carries ⚠️ and must have been covered by the Step 3 approval before running.

## Step 5 — Write constitution.md

If the project has no `constitution.md`, copy the template from `${CLAUDE_PLUGIN_ROOT}/constitution.md`. Fill the "Tech stack" section with:

- Preset chosen (`next-fullstack` or `next-nest`) + one-line plain-language reason tied to the user's answers
- Whether a database was wired in, and where (`next-fullstack`: project root; `next-nest`: `apps/api` only)
- Paths: app root(s), and for `next-nest`, the monorepo layout

Also record the security level in section 8 (Secure coding): `baseline` or `sensitive-data`, quoting the answers that set it. If `sensitive-data`: create `features/delete-my-data/` right away (SPEC per `idea-to-spec` conventions — "a customer can ask for their personal data to be removed, and it actually is", status `backlog`) so the legal must-have exists on the board from day one.

## Step 6 — Report

Plain language, user's language, no jargon — don't say "Next.js", "NestJS", "monorepo", or "pnpm workspaces"; say something like "Your app is now running on the same technology used by major production web apps, and it's confirmed to build and start correctly." End by pointing to the next step: `setup-standards` (part of the same `/founder-rail:start` run).
