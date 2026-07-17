# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

founder-rail is a **Claude Code plugin** (not an application). It ships quality-gated, spec-driven development rails for non-technical founders. There is no build step, no compiled code, and no test runner for the plugin itself — it is entirely Markdown instruction files plus POSIX shell hooks. "Testing" a change means running the shell hooks by hand and reading the skill/command Markdown for correctness.

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
- **skills/** — the real behavior. `setup-standards`, `setup-design` (onboarding); `idea-to-spec`, `plan-sprint` (planning); `implement-tdd` (the build harness); `verify-visually` (screenshot check); `render-dashboard` (the kanban).
- **agents/** — `implementer` (writes code strictly by TDD) and `fresh-reviewer` (reviews a diff with **zero** implementation history — launched with only the diff, `SPEC.md`, and `constitution.md`).
- **hooks/** — shell scripts wired by `hooks/hooks.json`; the enforcement layer. See below.

`implement-tdd` is the spine: Phase 0 plan-approval gate → RED → GREEN → REFACTOR → fresh review → verify → record. Implementation code must never be written outside this flow.

## The six non-negotiable principles

Every change must uphold these (from README.md / constitution.md). They are the design constraints, not suggestions:

1. **The user never makes a technical decision.** Every question asked of the user is outcome/business-level. Asking them to pick a linter, framework, database, or style guide is forbidden — skills derive tech choices themselves. (See `setup-standards` "Forbidden" list, `idea-to-spec` "Forbidden" topics.)
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
| `secret-scan.sh` | PreToolUse Edit/Write | writes containing secret-looking content (skips obvious placeholders) |
| `eslint-on-save.sh` | PostToolUse Edit/Write | JS/TS file that fails `eslint --fix` (walks up to nearest `package.json`) |

`exit 2` feeds stderr back to the agent as the reason to fix. Never bypass a hook — fix the root cause.

### Testing a hook manually

Hooks read a JSON tool-call payload on stdin. Simulate both paths (with and without `jq` on PATH):

```sh
echo '{"tool_input":{"command":"git push --force"}}' | sh hooks/push-safety.sh; echo "exit=$?"
echo '{"tool_input":{"content":"const k = \"sk-ant-abcd1234efgh5678ijkl\""}}' | sh hooks/secret-scan.sh; echo "exit=$?"
```

## Feature file convention

Each feature in a user's project is a folder `features/<slug>/` (slug names the **outcome**, e.g. `email-signup`, never the tech). Four files, created by `idea-to-spec`:

- `SPEC.md` — what & why; acceptance criteria phrased so a non-technical person can check them by *using* the app.
- `STATUS.md` — YAML frontmatter is the database: `feature, title, status, sprint, blocked_by, created, updated`. Status values: `backlog → planned → in_progress → in_review → done` (plus `blocked`).
- `DECISIONS.md` — **append-only** decision log; never rewrite past entries.
- `IMPLEMENTATION.md` — approved plan + touchpoints (files/functions changed).

## v1 scope (keep changes inside these bounds)

One stack (React + TypeScript web app), one standards preset (`standards/airbnb-style/`), dashboard is chat-text only (no HTML dashboard unless explicitly asked), single-user. Out of scope: multi-editor support, real-time server dashboards, compliance presets, team/role modes.

## Contributing constraints

Commits require DCO sign-off: `git commit -s -m "..."`. Keep skills concise, and keep user-visible wording rules (plain language, ⚠️ indicators) *inside* each skill so they survive context loss.
