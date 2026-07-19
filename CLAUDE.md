# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

founder-rail is a **Claude Code plugin** (not an application). It ships quality-gated, spec-driven development rails for non-technical founders. There is no build step, no compiled code, and no test runner for the plugin itself — it is entirely Markdown instruction files plus POSIX shell hooks. "Testing" a change means running the shell hooks by hand and reading the skill/command Markdown for correctness. For a full end-to-end exercise of the plugin, follow `docs/plugin-e2e-walkthrough.md` (scripted founder scenario, start → undo, with per-step expected outcomes; note `docs/` is local-only, not tracked).

Distinguish two locations at all times:
- **This repo** = the plugin source (skills, agents, commands, hooks, the `constitution.md` *template*).
- **The user's project** = where the plugin runs. Directories like `inbox/` and `features/<slug>/` and a *filled-in* `constitution.md` live in the user's project, created by the skills. The `inbox/` and `features/` here contain only README placeholders.

## Architecture: the request flow

A user command fans out into skills, which delegate to agents, all policed by hooks:

```
commands/*.md   →  invoke  →  skills/*/SKILL.md  →  delegate to  →  agents/*.md
   (thin entry points)          (the actual logic)                  (implementer, fresh-reviewer)
                                       ↑
                        hooks/*.sh enforce the rules at tool-call time (not prompts)
```

- **commands/** — thin `/founder-rail:*` entry points. Each just invokes a skill and adds routing (e.g. `ship.md` picks the next planned feature, falls back to `plan-sprint`). Keep them thin; logic belongs in skills.
- **skills/** — the real behavior. `setup-techstack`, `setup-standards`, `setup-design`, `setup-structure` (onboarding, run in that order by `commands/start.md`; `setup-design` doubles as the tune-mode engine behind `/founder-rail:design` — a mode gate on whether a tokens file exists picks first-time vs tune, both sharing a blocking WCAG contrast guardrail); `setup-deploy` (first launch); `idea-to-spec` (new features *and* updates to done ones), `plan-sprint` (planning); `implement-tdd` (the build harness); `fix-bug` (reproduce → regression test → fix); `undo-feature` (revert-only walk-back); `verify-visually` (screenshot check); `health-check` (read-only checkup); `render-dashboard` (the kanban).
- **agents/** — `implementer` (writes code strictly by TDD) and `fresh-reviewer` (reviews a diff with **zero** implementation history — launched with only the diff, `SPEC.md`, and `constitution.md`).
- **hooks/** — shell scripts wired by `hooks/hooks.json`; the enforcement layer. See below.

`implement-tdd` is the spine: Phase 0 plan-approval gate → RED → GREEN → REFACTOR → fresh review → verify → record. Implementation code must never be written outside this flow.

## The six non-negotiable principles

Every change must uphold these (from README.md / constitution.md). They are the design constraints, not suggestions:

1. **The user never makes a technical decision.** Every question asked of the user is outcome/business-level. Asking them to pick a linter, framework, database, or style guide is forbidden — skills derive tech choices themselves. (See `setup-techstack`, `setup-standards`, and `setup-structure` "Forbidden" lists, `idea-to-spec` "Forbidden" topics.)
2. **Critical rules are enforced by shell hooks, not prompt text** — so they survive context loss.
3. **Markdown-only persistence.** Project status is *derived at read time* from `features/*/STATUS.md` frontmatter. Never cache it, never answer about status from memory (`render-dashboard` re-reads every time).
4. **Verification never requires reading code** — automated tests + screenshots are the proof shown to the user.
5. **Every user-facing output is plain language, in the user's own language**, with ⚠️ risk indicators for production/payment/login/data-deletion actions.
6. **Plan-then-approve gate before every implementation** (`implement-tdd` Phase 0).

## Hooks (the enforcement layer)

Wired in `hooks/hooks.json`. When editing these, honor two hard constraints from CONTRIBUTING.md:

- **POSIX `sh` only** — they run under Git Bash on Windows. No bashisms.
- **`jq` is optional and must not be required.** Every hook has a `command -v jq` branch and a no-`jq` fallback that greps the raw JSON payload (note: quotes arrive escaped as `\"`, which is why the secret-scan patterns include backslashes in their quote classes). The user's Git Bash has no `jq`, so **the fallback path is the one that actually runs** — test it.
- **Fail closed.** Block (`exit 2`) on the guarded condition; `exit 0` to allow.

| Hook | Trigger | Blocks |
|------|---------|--------|
| `pre-commit-test-gate.sh` | PreToolUse Bash | `git commit` while `npm test` fails |
| `push-safety.sh` | PreToolUse Bash | force-push, deleting main/master |
| `env-commit-guard.sh` | PreToolUse Bash | `git commit` while a real `.env` file is staged (`.env.example`/`.sample`/`.template` allowed) |
| `db-danger-guard.sh` | PreToolUse Bash | certainly-destructive DB commands (`prisma migrate reset`, `--accept-data-loss`/`--force-reset`, `dropdb`, `psql` DROP DATABASE/TRUNCATE) — daily commands like `prisma migrate dev` pass |
| `secret-scan.sh` | PreToolUse Edit/Write | writes containing secret-looking content (skips obvious placeholders) |
| `eslint-on-save.sh` | PostToolUse Edit/Write | JS/TS file that fails `eslint --fix` (walks up to nearest `package.json`) |

`exit 2` feeds stderr back to the agent as the reason to fix. Never bypass a hook — fix the root cause.

### Testing a hook manually

Hooks read a JSON tool-call payload on stdin. Simulate both paths (with and without `jq` on PATH):

```sh
echo '{"tool_input":{"command":"git push --force"}}' | sh hooks/push-safety.sh; echo "exit=$?"
echo '{"tool_input":{"content":"const k = \"sk-ant-abcd1234efgh5678ijkl\""}}' | sh hooks/secret-scan.sh; echo "exit=$?"
echo '{"tool_input":{"command":"npx prisma migrate reset"}}' | sh hooks/db-danger-guard.sh; echo "exit=$?"
```

## Tech-stack and structure presets

`stacks/<preset>/` (`next-fullstack`, `next-nest`) and `structure/<preset>/` (`flat`, `feature-based`, `atomic-design`) follow the same shape as `standards/<preset>/`: a plain-language `STACK.md`/`STRUCTURE.md`, machine-runnable setup material (`recipe.md`+`verify.md`, or `scaffold/`+`eslint.structure.mjs`), and `install.md` for dev deps. Each stack also has an `auth.md` — the locked sign-in recipe (Auth.js v5, passwordless magic link via Resend by default; `next-nest` adds a JWT-verifying central Nest guard). Auth is never re-decided per feature, and hand-rolled session/token/hashing code is a review blocker. `setup-techstack` and `setup-structure` (mirrors of `setup-standards`/`setup-design`) apply them. Structure presets enforce import boundaries by riding the existing `eslint-on-save` hook (`eslint-plugin-boundaries`, `eslint-plugin-check-file`) — never invent a new hook for something ESLint can already check.

`deploy/<preset>/` (`vercel-fullstack`, `railway-nest`) follows the same shape (`DEPLOY.md`, `recipe.md`, `verify.md`); the preset is derived from the stack, never asked. Hard rule for deploy work: real secret values never pass through the agent — variable names only; the user enters values in the host dashboard.

**Brownfield (adopt mode)**: every setup skill has an existing-project path — guardrails fully cover *new* code from day one; legacy files are ignored-but-listed and **graduate when touched** (first feature/fix that substantially edits them brings them to standard). Never mass-migrate, mass-reformat, or move existing files during setup — a giant cleanup diff is unreviewable and looks like breakage to the user.

`security/baseline/` is not user-chosen: `setup-standards` merges it into every project unconditionally. Its hard rule (see its `SECURITY.md`): **only near-zero-false-positive rules may block** — the user can't read code, so a false alarm looks like the system is broken. Heuristic security checks belong in `fresh-reviewer`'s judgment (concrete, demonstrable findings only) and constitution.md §8, never in ESLint config or hooks.

## Feature file convention

Each feature in a user's project is a folder `features/<slug>/` (slug names the **outcome**, e.g. `email-signup`, never the tech). Four files, created by `idea-to-spec`:

- `SPEC.md` — what & why; acceptance criteria phrased so a non-technical person can check them by *using* the app.
- `STATUS.md` — YAML frontmatter is the database: `feature, title, status, sprint, blocked_by, created, updated`. Status values: `backlog → planned → in_progress → in_review → done` (plus `blocked`).
- `DECISIONS.md` — **append-only** decision log; never rewrite past entries.
- `IMPLEMENTATION.md` — approved plan + touchpoints (files/functions changed).

## v1 scope (keep changes inside these bounds)

Two tech-stack presets (`stacks/{next-fullstack,next-nest}/`, both TypeScript, chosen from outcome questions in `setup-techstack`), three standards presets (`standards/{airbnb-style,standard-style,typescript-strict}/`, chosen from business questions in `setup-standards`), three structure presets (`structure/{flat,feature-based,atomic-design}/`, chosen from one outcome question in `setup-structure`), two deploy presets (`deploy/{vercel-fullstack,railway-nest}/`, derived from the stack), two security levels (`baseline` always-on, `sensitive-data` for PII/money apps), dashboard is chat-text only (no HTML dashboard unless explicitly asked), single-user, undo limited to the most recent shipped feature. Out of scope: multi-editor support, real-time server dashboards, compliance presets, team/role modes, mobile stacks, integrated error-tracking SaaS.

## Contributing constraints

Commits require DCO sign-off: `git commit -s -m "..."`. Keep skills concise, and keep user-visible wording rules (plain language, ⚠️ indicators) *inside* each skill so they survive context loss.
