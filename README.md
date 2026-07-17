# founder-rail

Quality-gated, spec-driven development for people who can't code — or can, but don't want to make architecture decisions.

founder-rail is a Claude Code plugin that puts guard rails around AI-driven development from day one of a project:

1. **Real code standards** — picked from public style guides (Airbnb-style for v1) based on 2–3 *business* questions, never technical ones. Generates working ESLint/Prettier config.
2. **Design direction** — for frontend projects: choose a feeling (minimal / bold / playful), get real design tokens.
3. **Spec-driven harness** — no code before an approved plan, strict RED→GREEN→REFACTOR TDD, fresh-context reviewer that never saw the implementation history, screenshot round-trip verification for UI.
4. **Permanent product knowledge** — every feature lives in `features/<slug>/` as plain markdown: `SPEC.md`, `DECISIONS.md`, `STATUS.md`, `IMPLEMENTATION.md`.
5. **Zero-database kanban** — project status derived at read time from `STATUS.md` frontmatter. No server, no DB.

## Non-negotiable principles

| # | Principle |
|---|-----------|
| 1 | The user never makes a technical decision — all questions are outcome/business questions |
| 2 | Critical rules are enforced by **shell hooks**, not prompts (lint on save, tests before commit, secret scan, no force-push) |
| 3 | Markdown-only persistence — status is derived at read time, never cached |
| 4 | Verification never requires the user to read code — automated tests + screenshots are the proof |
| 5 | Every important output passes through a plain-language layer, with ⚠️ risk indicators for production/payment/data actions |
| 6 | Plan-then-approve gate before every implementation |

## Install

```
/plugin marketplace add <this-repo>
/plugin install founder-rail
```

## Quickstart

| Command | What it does |
|---------|--------------|
| `/founder-rail:start` | One-time setup: standards, design, project scaffolding |
| `/founder-rail:idea` | Turn a plain-language idea into a tracked feature spec |
| `/founder-rail:status` | Kanban board derived from markdown — what's where |
| `/founder-rail:ship` | Build the next planned feature through the full quality harness |

## Repo structure

```
founder-rail/
├── .claude-plugin/{plugin.json, marketplace.json}
├── skills/{setup-standards, setup-design, idea-to-spec, plan-sprint,
│            implement-tdd, verify-visually, render-dashboard}/SKILL.md
├── agents/{implementer.md, fresh-reviewer.md}
├── standards/airbnb-style/
├── hooks/{hooks.json, eslint-on-save.sh, pre-commit-test-gate.sh,
│           secret-scan.sh, push-safety.sh}
├── commands/{start.md, idea.md, status.md, ship.md}
├── constitution.md          ← template, copied into the user's project
├── inbox/                   ← raw untriaged ideas (in the user's project)
└── features/<slug>/         ← per-feature knowledge (in the user's project)
```

## v1 scope

- One stack: web app, React + TypeScript
- One standards preset: Airbnb-style
- Dashboard is a text board in chat (HTML dashboard later)
- Single user (no team/role modes)

Out of scope for v1: multi-editor support, real-time server dashboards, compliance presets (GDPR/HIPAA), team permissions.

## License

MIT. Contributions accepted under DCO (see CONTRIBUTING.md).
