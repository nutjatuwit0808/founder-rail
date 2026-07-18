---
name: setup-structure
description: One-time setup of folder/component structure for a project, run after setup-design. Picks a structure preset (flat, feature-based, or atomic-design) from one outcome question, wires ESLint import-boundary rules into the project's existing lint config, and records the result in constitution.md.
---

# Setup Structure

The user cannot (or does not want to) make architecture decisions. What's machine-checkable (naming, colocated tests, import boundaries) is enforced by ESLint riding the existing `eslint-on-save` hook. What's judgment (how to split a component, what counts as a feature) goes into `constitution.md` for the `implementer` and `fresh-reviewer` to follow.

## Step 1 — Confirm a frontend exists

Same check as `setup-design`: `react` in package.json dependencies, an `index.html`, or the user saying the project will have a UI. All v1 tech-stack presets (`next-fullstack`, `next-nest`) include a frontend, so this normally passes. If there is truly no frontend, skip with a one-line note.

## Step 2 — Ask the outcome question (one question, never architecture terms)

Use AskUserQuestion, in the user's language. Never say "feature-based", "atomic design", "component hierarchy", or "architecture":

- "Is this a **small app or demo** where you're not sure yet how big it'll grow?" → preset `flat`
- "Will this **grow into several distinct features or pages** over time?" → preset `feature-based` (default if unsure)
- "Is the product mostly **lots of reusable visual pieces** — a design-heavy UI, more than distinct features?" → preset `atomic-design`

**Forbidden:** asking the user to name a folder structure, pattern, or methodology. If they volunteer one, respect it (map to the closest preset); never ask.

## Step 3 — Apply the chosen preset

Presets live in `${CLAUDE_PLUGIN_ROOT}/structure/<preset>/`.

1. Read the preset's `STRUCTURE.md` and create the top-level folders it describes (empty is fine — they fill in as features are built).
2. Merge `eslint.structure.mjs`'s exported config array into the project's existing `eslint.config.mjs` (added by `setup-standards`) — spread it in alongside the standards preset's config, don't replace anything.
3. Install the dev dependencies from the preset's `install.md`.
4. Copy `scaffold/` into a scratch location the `implement-tdd` harness can reference later (or leave it in the plugin — `implement-tdd` Phase 1 reads it directly from `${CLAUDE_PLUGIN_ROOT}/structure/<preset>/scaffold/`).
5. **Verify before declaring done:** run the lint command from `install.md`. Setup is not complete until it runs with no configuration errors. If a plugin's rule names/options don't match what `eslint.structure.mjs` expects (plugin API drift), fix the config file, not the check.

## Step 3.5 — Existing projects: adopt mode (never move files during setup)

If the project already has substantial source code:

1. Create the preset's top-level folders **alongside** the existing layout; do not move or rename a single existing file during setup.
2. The boundary/naming rules only cover the preset's new folders (their globs already do), so legacy files don't light up.
3. Record in constitution.md: new features are built in the preset layout; existing code migrates into it feature-by-feature via `/founder-rail:ship`, never in one big move.

## Step 4 — Write constitution.md

Fill the "Code structure" section with:

- Preset name + the user's answer that led to it
- The folder layout (copy from `STRUCTURE.md`)
- Plain-language rules (colocated tests, import direction) — no jargon
- Note that `fresh-reviewer` checks file placement against this section

## Step 5 — Report

Plain language, user's language, no jargon — don't say "boundaries", "ESLint plugin", or "atomic design"; say something like "New code now has a consistent home, and the system blocks code from reaching into parts of the project it shouldn't touch." This is the last step of `/founder-rail:start`; point to `/founder-rail:idea`.
