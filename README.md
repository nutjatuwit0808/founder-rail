# founder-rail

Quality-gated, spec-driven development for people who can't code — or can, but don't want to make architecture decisions.

founder-rail is a Claude Code plugin that puts guard rails around AI-driven development from day one of a project:

1. **Tech stack, decided once** — Next.js fullstack by default, a separate NestJS backend only when the user's answers signal a real need for one — picked from outcome questions, never technical ones.
2. **Real code standards** — picked from public style guides (Airbnb-style, Standard-style, or TypeScript-strict) based on 2 *business* questions, never technical ones. Generates working ESLint/Prettier config, plus an always-on security baseline (no `eval`/raw-HTML injection, no `.env` in commits, dependency audit) built from near-zero-false-positive rules only.
3. **Design direction** — for frontend projects: choose a feeling (minimal / bold / playful), get real design tokens.
4. **Folder/component structure** — flat, feature-based, or atomic-design, picked from one outcome question, enforced with import-boundary lint rules riding the same save hook.
5. **Spec-driven harness** — no code before an approved plan, strict RED→GREEN→REFACTOR TDD, fresh-context reviewer that never saw the implementation history, screenshot round-trip verification for UI.
6. **Permanent product knowledge** — every feature lives in `features/<slug>/` as plain markdown: `SPEC.md`, `DECISIONS.md`, `STATUS.md`, `IMPLEMENTATION.md`.
7. **Zero-database kanban** — project status derived at read time from `STATUS.md` frontmatter. No server, no DB.

## Non-negotiable principles

| # | Principle |
|---|-----------|
| 1 | The user never makes a technical decision — all questions are outcome/business questions |
| 2 | Critical rules are enforced by **shell hooks**, not prompts (lint on save, tests before commit, secret scan, no force-push) |
| 3 | Markdown-only persistence — status is derived at read time, never cached |
| 4 | Verification never requires the user to read code — automated tests + screenshots are the proof |
| 5 | Every important output passes through a plain-language layer, with ⚠️ risk indicators for production/payment/data actions |
| 6 | Plan-then-approve gate before every implementation |
| + | **Never lost**: every report ends with exactly one next step, wrong-door commands route instead of rejecting, plain words with no command still reach the right flow, and `/founder-rail:next` answers "where am I, what now?" |

## Install

```
/plugin marketplace add <this-repo>
/plugin install founder-rail
```

## Quickstart

| Command | What it does |
|---------|--------------|
| `/founder-rail:start` | One-time setup: stack, standards, design, structure, quality rails |
| `/founder-rail:idea` | Turn a plain-language idea into a tracked feature spec (or update an existing feature) |
| `/founder-rail:status` | Kanban board derived from markdown — what's where |
| `/founder-rail:ship` | Build the next planned feature through the full quality harness |
| `/founder-rail:preview` | Open the app locally — link + what to try |
| `/founder-rail:design` | Set or adjust look & feel from a logo or plain words ("softer", "bigger text") — token-safe, contrast-guarded |
| `/founder-rail:fix` | Report something broken in plain words → reproduced, regression-tested fix |
| `/founder-rail:launch` | Put the latest work on the real internet — pre-flight, ⚠️ approval, deploy, verify |
| `/founder-rail:undo` | Walk back the most recent shipped feature safely (git revert, plain-language cost) |
| `/founder-rail:checkup` | Monthly health report: vulnerabilities, tests, stale parts, production errors |
| `/founder-rail:next` | Lost? One answer: where the project is and the single next step |

## How the skills work

Commands are thin entry points; each one invokes a **skill** that holds the real logic. Skills create markdown under `features/<slug>/`, and the build harness delegates to **agents**. Shell **hooks** enforce the safety rules at tool-call time, underneath everything.

```mermaid
flowchart TD
    subgraph cmds[Commands]
        start["/founder-rail:start"]
        idea["/founder-rail:idea"]
        status["/founder-rail:status"]
        ship["/founder-rail:ship"]
        fix["/founder-rail:fix"]
        launch["/founder-rail:launch"]
    end

    fix --> fixBug[fix-bug: reproduce → regression test → fix]
    launch --> deploySkill[setup-deploy / launch pre-flight]

    start --> setupTech[setup-techstack]
    setupTech --> setupStd[setup-standards]
    setupStd -->|frontend project?| setupDsn[setup-design]
    setupDsn --> setupStruct[setup-structure]

    idea --> ideaSpec[idea-to-spec]
    ideaSpec --> feat[("features/&lt;slug&gt;/<br/>SPEC · STATUS · DECISIONS · IMPLEMENTATION")]

    status --> dash[render-dashboard]
    dash -. reads live .-> feat

    ship -->|nothing planned yet| plan[plan-sprint]
    plan --> impl
    ship --> impl[implement-tdd harness]
    impl --> implementer([implementer agent])
    impl --> reviewer([fresh-reviewer agent])
    impl --> vis[verify-visually]
    impl -. updates .-> feat

    subgraph hooks[Hooks — enforced on every tool call]
        h1[secret-scan]
        h2[eslint-on-save]
        h3[pre-commit-test-gate]
        h4[push-safety]
        h5[env-commit-guard]
        h6[db-danger-guard]
    end
```

### The build harness (`implement-tdd`) in detail

`/founder-rail:ship` runs one feature through seven phases that cannot be skipped:

```mermaid
flowchart LR
    p0[0 · Plan gate<br/>plain-language approval] --> p1[1 · Isolate<br/>git worktree]
    p1 --> p2[2 · RED<br/>failing tests first]
    p2 --> p3[3 · GREEN<br/>minimum code to pass]
    p3 --> p4[4 · REFACTOR<br/>clean, stay green]
    p4 --> p5[5 · Fresh review<br/>diff + spec only]
    p5 -->|changes requested| p3
    p5 -->|APPROVE| p6[6 · Verify<br/>full suite + screenshots]
    p6 --> p7[7 · Record & report<br/>plain-language result]
```

### What each skill does

- **`setup-techstack`** — one-time, runs first. Asks outcome questions (does another client need the same API, is there heavy background work) and derives the stack itself: `next-fullstack` (Next.js doing both frontend and backend) by default, `next-nest` (Next.js + a separate NestJS backend, pnpm monorepo) only when the answers signal a real need. Scaffolds it, verifies it builds and boots, and writes section 1 of `constitution.md`.
- **`setup-standards`** — one-time. Asks the user only *business* questions (how strict, who will maintain the code) and derives every technical choice itself. Copies the `airbnb-style` ESLint + Prettier preset into the project, installs dev dependencies, and verifies lint actually runs before declaring done. Writes section 2 of `constitution.md`.
- **`setup-design`** — frontend only, two modes behind one gate. First-time: turns a chosen *feeling* (minimal / bold / playful) — and optionally the user's logo/brand color, confirmed via a color swatch — into real design tokens. Tune (`/founder-rail:design`, any time): screenshots the real app and adjusts tokens from plain-language remarks ("softer", "bigger text"), detecting when accumulated tweaks amount to a full re-theme and confirming first. Both modes pass a blocking WCAG contrast guardrail — readability is not tradeable. Records the rule that all UI code must use tokens (no hard-coded colors, sizes, radii); tune history is appended to `design/DECISIONS.md`.
- **`setup-structure`** — one-time, frontend only. Asks one outcome question (small/demo, growing into several features, or design-heavy UI) and picks `flat`, `feature-based`, or `atomic-design`. Wires import-boundary and naming-convention ESLint rules into the project's existing lint config — riding the `eslint-on-save` hook — and writes section 4 of `constitution.md`.
- **`idea-to-spec`** — turns a plain-language idea (or an `inbox/` file) into a tracked feature. Asks at most 3 outcome-level questions (never about databases, frameworks, or architecture) and scaffolds `features/<slug>/` with `SPEC.md`, `STATUS.md`, `DECISIONS.md`, and `IMPLEMENTATION.md`. The slug names the *outcome* (`email-signup`), not the tech.
- **`plan-sprint`** — groups `backlog` features into a simple sprint. Asks one outcome question about what matters most now, respects `blocked_by` order, caps a sprint at 5 items, and marks the chosen features `planned`. No story points or velocity.
- **`implement-tdd`** — the build harness (diagram above). The only place implementation code is ever written: plan-approval gate → strict RED→GREEN→REFACTOR TDD → fresh-context review → verification → documentation update. Delegates larger builds to the `implementer` agent.
- **`verify-visually`** — for features with a visible UI. Drives the app and captures screenshots via Playwright, checking them against the acceptance criteria and design tokens — proof the user can see without reading code. Part of the harness, not optional.
- **`render-dashboard`** — the zero-database kanban. Re-reads `features/*/STATUS.md` frontmatter every time (never cached) and renders a text board — Backlog · Planned · In progress · In review · Done — plus one suggested next action.
- **`fix-bug`** — plain-language bug report → reproduce first → failing regression test → fix → fresh review. Never guess-fixes an unreproduced bug; the regression test is permanent.
- **`setup-deploy`** — first-launch setup. Host derived from the stack (`vercel-fullstack` / `railway-nest`); secret values never pass through the agent — the user enters them in the host dashboard following a plain-language guide.
- **`undo-feature`** — walks back the most recent shipped feature with `git revert` only (history intact), after explaining the cost in plain language. Conflicts = stop and report, never resolve creatively.
- **`health-check`** — read-only monthly report: vulnerabilities, tests, build, stale dependencies, stalled features, and (if launched) production health + recurring errors, which flow into `inbox/` as plain-language bug reports.

## Repo structure

```
founder-rail/
├── .claude-plugin/{plugin.json, marketplace.json}
├── skills/{setup-techstack, setup-standards, setup-design, setup-structure,
│            setup-deploy, idea-to-spec, plan-sprint, implement-tdd, fix-bug,
│            undo-feature, health-check, verify-visually,
│            render-dashboard}/SKILL.md
├── agents/{implementer.md, fresh-reviewer.md}
├── stacks/{next-fullstack, next-nest}/
├── standards/{airbnb-style, standard-style, typescript-strict}/
├── structure/{flat, feature-based, atomic-design}/
├── security/baseline/       ← always-on, merged by setup-standards
├── deploy/{vercel-fullstack, railway-nest}/
├── hooks/{hooks.json, eslint-on-save.sh, pre-commit-test-gate.sh,
│           secret-scan.sh, push-safety.sh, env-commit-guard.sh,
│           db-danger-guard.sh}
├── commands/{start.md, idea.md, status.md, ship.md, preview.md, design.md,
│              fix.md, launch.md, undo.md, checkup.md, next.md}
├── templates/front-desk.md  ← installed into the user's project as .claude/founder-rail.md
├── constitution.md          ← template, copied into the user's project
├── inbox/                   ← raw untriaged ideas + production error reports
└── features/<slug>/         ← per-feature knowledge (in the user's project)
```

## v1 scope

- Two tech-stack presets: `next-fullstack` (default) and `next-nest`, both TypeScript — each with a locked sign-in recipe (Auth.js, passwordless by default; hand-rolled auth is a review blocker)
- Three standards presets: Airbnb-style, Standard-style (StandardJS via neostandard), TypeScript-strict
- Three structure presets: `flat`, `feature-based` (default), `atomic-design`
- Two deploy presets: `vercel-fullstack`, `railway-nest` — secrets never pass through the agent
- Two security levels: `baseline` (always on) and `sensitive-data` (PII/money apps)
- Dashboard is a text board in chat (HTML dashboard later)
- Single user (no team/role modes)

Out of scope for v1: multi-editor support, real-time server dashboards, compliance presets (GDPR/HIPAA beyond the delete-my-data backlog item), team permissions, mobile stacks, integrated error-tracking SaaS.

## License

MIT. Contributions accepted under DCO (see CONTRIBUTING.md).
