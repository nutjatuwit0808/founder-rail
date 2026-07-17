---
name: setup-standards
description: One-time setup of real code-quality standards for a project, without asking the user a single technical question. Use when /founder-rail:start runs, when a project has no constitution.md, or when the user asks to set up the project or code standards. Generates working ESLint + Prettier config from a public style-guide preset and records the result in constitution.md.
---

# Setup Standards

The user cannot (or does not want to) make technical decisions. Every question you ask must be about outcomes and business context. Every technical choice is yours, derived from their answers.

## Step 1 — Detect the project

- Look for `package.json`, `tsconfig.json`, and source folders.
- v1 supports one stack: **web app, React + TypeScript**. If the project is empty, that is what new code will be scaffolded as. If an existing project uses something else, say — in plain language — that automatic setup currently supports web apps, and set up only the parts that apply.

## Step 2 — Ask outcome questions (never technical)

Use AskUserQuestion, in the user's language. At most these two:

1. **Strictness** — "How should quality rules treat small style issues?"
   - "Strict, like a big company team — everything gets fixed before moving on" → `strict`
   - "Flexible, like an early MVP — serious problems still block, small style issues are just noted" → `flexible`
2. **Future hands** — "Who do you expect will work on this code within a year?"
   - "Mostly AI and me" → default naming/documentation rules
   - "Freelancers or a real team eventually" → keep documentation and naming rules at `error`; note in constitution.md that the code must be readable by strangers.

**Forbidden:** asking the user to pick a style guide, linter, formatter, library, framework, or any named technology. If they volunteer one, respect it; never ask.

## Step 3 — Apply the preset

v1 ships one preset: `${CLAUDE_PLUGIN_ROOT}/standards/airbnb-style/` (Airbnb JavaScript/React style guide, adapted for TypeScript, flat-config).

1. Copy into the project root:
   - `eslint.config.mjs`
   - `.prettierrc.json`
2. Apply the strictness answer:
   - `strict`: leave the config exactly as shipped.
   - `flexible`: downgrade the rules listed under "Flexible-mode downgrades" in the preset's `STANDARDS.md` from `error` to `warn`.
3. Install the dev dependencies listed in the preset's `install.md`, using the project's package manager (default npm). Create a minimal `package.json` first if none exists.
4. **Verify before declaring done:** run lint against a real or sample source file (e.g. `npx eslint --no-error-on-unmatched-pattern src/`) and confirm it executes without configuration errors. Setup is not complete until lint actually runs.

## Step 4 — Write constitution.md

If the project has no `constitution.md`, copy the template from `${CLAUDE_PLUGIN_ROOT}/constitution.md`. Fill section 1 with:

- Preset name + link to the public style guide it is based on
- Chosen strictness, quoting the user's answer that led to it
- Paths of the generated config files
- A 3–5 bullet plain-language summary of what the rules catch (e.g. "unused leftover code", "risky comparisons that cause silent bugs", "inconsistent formatting")

## Step 5 — Report

Summarize in plain language, in the user's language, no jargon — don't say "ESLint", "linter", or "config"; say something like "The same code-quality rules big tech teams use are now installed and tested — every time code changes, the system checks it automatically." End by pointing to the next step: `/founder-rail:idea`.
