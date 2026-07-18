---
name: setup-standards
description: One-time setup of real code-quality standards for a project, without asking the user a single technical question. Use when /founder-rail:start runs, when a project has no constitution.md, or when the user asks to set up the project or code standards. Picks a public style-guide preset from business questions, generates working lint/format config, and records the result in constitution.md.
---

# Setup Standards

The user cannot (or does not want to) make technical decisions. Every question you ask must be about outcomes and business context. Every technical choice is yours, derived from their answers.

## Step 1 — Detect the project

- Look for `package.json`, `tsconfig.json`, and source folders.
- v1 supports one stack: **web app, React + TypeScript**. If the project is empty, that is what new code will be scaffolded as. If an existing project uses something else, say — in plain language — that automatic setup currently supports web apps, and set up only the parts that apply.

## Step 2 — Ask outcome questions (never technical)

Use AskUserQuestion, in the user's language. Two questions, both about outcomes — the user never names a style guide:

1. **Priority** — "What should the code style prioritize?" This chooses the preset:
   - "Keep it simple and move fast — I don't want to fuss over formatting or lots of rules" → preset `standard-style` (one style, applied automatically, fewest decisions)
   - "Follow the conventions most professional teams and future hires already know" → preset `airbnb-style` (industry-standard). Also note in `constitution.md` that the code must stay readable by strangers.
   - "Catch as many mistakes as possible — I'd rather the rules be strict" → preset `typescript-strict` (highest rigor, type-safety focused)
2. **Strictness** — "How should quality rules treat small style issues?"
   - "Strict, like a big company team — everything gets fixed before moving on" → `strict`
   - "Flexible, like an early MVP — serious problems still block, small style issues are just noted" → `flexible`

**Forbidden:** asking the user to pick a style guide, linter, formatter, library, framework, or any named technology by name. If they volunteer one, respect it (map it to the closest preset); never ask.

## Step 3 — Apply the chosen preset

Presets live in `${CLAUDE_PLUGIN_ROOT}/standards/<preset>/`. All are TypeScript + React, ESLint 9 flat-config:

| Preset | Based on (public) | Formats with |
|--------|-------------------|--------------|
| `airbnb-style` | Airbnb JavaScript/React style guide | Prettier |
| `standard-style` | JavaScript Standard Style (via neostandard) | ESLint itself — no Prettier |
| `typescript-strict` | typescript-eslint `strict` config | Prettier |

1. Copy **every config file the preset lists under "Files in this preset"** in its `STANDARDS.md` into the project root. That is `eslint.config.mjs` for every preset, plus `.prettierrc.json` for all presets **except** `standard-style` (which formats via ESLint and ships no Prettier config).
2. Apply the strictness answer:
   - `strict`: leave the config exactly as shipped.
   - `flexible`: downgrade the rules listed under "Flexible-mode downgrades" in the preset's `STANDARDS.md` from `error` to `warn` (marked `[flexible: warn]` in `eslint.config.mjs`).
3. Install the dev dependencies from the preset's `install.md`, using the project's package manager (default npm). Create a minimal `package.json` first if none exists. Do **not** install Prettier for `standard-style`.
4. **Merge the security baseline — always, no question asked.** Spread `${CLAUDE_PLUGIN_ROOT}/security/baseline/eslint.security.mjs` into the project's `eslint.config.mjs` and install its dev dependencies (`install.md` in the same folder). If the chosen standards preset ships `eslint-plugin-react` (`airbnb-style`, `typescript-strict`), also add `'react/no-danger': 'error'` to that preset's rules block. The baseline contains only near-zero-false-positive rules by design (see its `SECURITY.md`) — never add heuristic security rules to it. Strictness (`flexible`) does **not** downgrade security rules.
5. **Verify before declaring done:** run lint against a real or sample source file (e.g. `npx eslint --no-error-on-unmatched-pattern src/`) and confirm it executes without configuration errors. Setup is not complete until lint actually runs.

## Step 4 — Write constitution.md

If the project has no `constitution.md`, copy the template from `${CLAUDE_PLUGIN_ROOT}/constitution.md`. Fill section 1 with:

- Preset name + link to the public style guide it is based on
- Chosen strictness, quoting the user's answer that led to it
- Paths of the generated config files
- A 3–5 bullet plain-language summary of what the rules catch (e.g. "unused leftover code", "risky comparisons that cause silent bugs", "inconsistent formatting")

## Step 5 — Report

Summarize in plain language, in the user's language, no jargon — don't say "ESLint", "linter", or "config"; say something like "The same code-quality rules big tech teams use are now installed and tested — every time code changes, the system checks it automatically." End by pointing to the next step: `/founder-rail:idea`.
