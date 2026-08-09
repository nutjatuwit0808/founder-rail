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

If Q5 was "yes", ask one more outcome question: "จะมีคนอื่นมาลงขายสินค้าในแพลตฟอร์มคุณด้วยไหม หรือคุณเป็นผู้ขายรายเดียว?" (will other people sell through your platform too, or are you the only seller?). If they answer that other sellers will be involved, say so plainly in the Step 6 report: v1's payment recipe (Stripe Checkout, one seller) doesn't yet support splitting payouts across multiple sellers, and a single-seller shop is what gets built today. This is not a block — just setting the right expectation before they build half of something bigger.

If Q5 ("will money move through the app") is "yes", ask one more outcome question before scaffolding: "ลูกค้าจะจ่ายเงินเป็นสกุลไหน?" (what currency will customers pay in) — the answer drives the payment recipe in Step 4. Never ask which payment provider to use; it's locked to Stripe (see `stacks/<preset>/payments.md`).

**Forbidden:** asking the user to name a framework, database, architecture, or payment provider. If they volunteer one, respect it (map to the closest preset); never ask.

## Step 3 — Summarize and get approval

When run as part of `/founder-rail:start`'s combined onboarding, **skip this gate** — `start.md` collects this summary alongside setup-standards/-design/-structure and asks one combined approval before any of them scaffold. Only run this step's own approval when invoked standalone (a later re-run outside `/start`).

Before scaffolding, tell the user in plain language what will be built and why, based on their answers ("From what you told me, I'll set this up as a single web app that handles both what you see and what happens behind the scenes" or "...as a website plus a separate backend service, because you need [reason]"). Add ⚠️ if a database, login, or payment integration will be wired in. Use AskUserQuestion: approve / adjust. Do not scaffold before approval.

## Step 4 — Scaffold and verify

Presets live in `${CLAUDE_PLUGIN_ROOT}/stacks/<preset>/`.

1. Follow `recipe.md` for the chosen preset exactly, in order.
2. Run every command in `verify.md` for the chosen preset. **Setup is not complete until all of them pass.** A build or boot failure means setup failed — fix it before continuing, don't report success.
3. If the recipe calls for a database (Prisma), that step carries ⚠️ and must have been covered by the Step 3 approval before running.
4. If Q5 ("will money move through the app") was answered "yes", also follow `payments.md` for the chosen preset (Stripe, locked — see the recipe file), using the currency from Step 2. This carries ⚠️ the same as the database step and must already be covered by the Step 3 approval.

## Step 5 — Write constitution.md

If the project has no `constitution.md`, copy the template from `${CLAUDE_PLUGIN_ROOT}/constitution.md`. Fill the "Tech stack" section with:

- Preset chosen (`next-fullstack` or `next-nest`) + one-line plain-language reason tied to the user's answers
- Whether a database was wired in, and where (`next-fullstack`: project root; `next-nest`: `apps/api` only)
- Paths: app root(s), and for `next-nest`, the monorepo layout

Also record the security level in section 8 (Secure coding): `baseline` or `sensitive-data`, quoting the answers that set it. If `sensitive-data`: create `features/delete-my-data/` right away (SPEC per `idea-to-spec` conventions — "a customer can ask for their personal data to be removed, and it actually is", status `backlog`) so the legal must-have exists on the board from day one.

## Step 6 — Report

Plain language, user's language, no jargon — don't say "Next.js", "NestJS", "monorepo", or "pnpm workspaces"; say something like "Your app is now running on the same technology used by major production web apps, and it's confirmed to build and start correctly." End by pointing to the next step: `setup-standards` (part of the same `/founder-rail:start` run).
