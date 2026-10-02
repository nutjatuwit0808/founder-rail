---
name: implement-tdd
description: The build harness - implements one feature spec end-to-end with a plan-approval gate, strict RED-GREEN-REFACTOR TDD, fresh-context review, and documentation updates. Use when /founder-rail:ship runs or the user asks to build a planned feature. Implementation code must never be written outside this flow.
---

# Implement (TDD harness)

Work on exactly one feature per run. Input: the feature slug.

## Entry check — new run, resume, or acceptance?

Read `features/<slug>/STATUS.md` first; the `status` and `phase` fields decide where this run starts. A session can die at any point, and the founder cannot tell "half-built" from "finished" — so the files say where the work stands, never memory.

- `planned` (or `backlog`) → a new run: start at Phase 0.
- `in_progress` → **resume**, don't restart. The plan in `IMPLEMENTATION.md` `## Plan` was already approved (`phase` is `plan-approved` or later) — do not ask for approval again and do not rewrite it. Treat `phase` as a hint and verify it against reality: re-enter the feature's worktree if it still exists, run the suite, and check which planned tests exist and whether they pass. Continue from the earliest phase whose work isn't actually finished (e.g. `phase: green` but planned tests still fail → continue GREEN). Tell the user in one plain-language line what was already done and where you're picking up ("งาน *X* ค้างไว้ตอนกำลังสร้าง — เขียนชุดทดสอบไว้แล้ว ผมทำต่อจากตรงนั้นเลย" style). Only if `phase` is empty or `## Plan` is missing was the plan never approved — then start at Phase 0.
- `in_review` → the build is finished and waiting for the user: go straight to Phase 8 (Acceptance). Never rebuild it.

## Phase 0 — Plan gate (MANDATORY — no code before approval)

1. Read `features/<slug>/SPEC.md`, `constitution.md`, and `features/<slug>/DECISIONS.md`. If SPEC.md has unresolved Open questions, resolve them with the user first (outcome-level questions only).
2. Write the technical plan into `IMPLEMENTATION.md` under `## Plan`: approach, files to create/change, and a test list mapped 1:1 to the acceptance criteria.
3. Translate the plan to plain language for the user (their language): what will be built, what will change, and how they'll know it works. Add risk indicators:
   - ⚠️ if the work touches payments, live/production data, login/security, or deletes anything — say so explicitly and plainly.
   - ⚠️ also if the plan changes the data structure in a way that affects rows that already exist (a schema migration plus backfill) — even though it's not a destructive command the `db-danger-guard` hook would block, a botched backfill has real business impact (e.g. a new required field left empty on existing records).
   If IMPLEMENTATION.md notes this feature follows `stacks/<preset>/realtime.md`, state the polling interval in plain language too (default "หน้าจะรีเฟรชสถานะให้เองทุก ~5 วินาที"; only a different number if that recipe's SSE escalation with a recorded reason applies).
   If IMPLEMENTATION.md notes this feature needs the payments recipe installed for the first time, ask the currency question here (outcome-level, e.g. "ลูกค้าจะจ่ายเงินสกุลไหน?") — this step owns that question; don't leave it as a loose note.
   If IMPLEMENTATION.md notes this feature needs the staff role add-on installed for the first time (`stacks/<preset>/auth.md` "Role ฝั่งร้าน"), ask for the founder's own sign-in email here (outcome-level: "ให้อีเมลที่เจ้าของร้านจะใช้ล็อกอินฝั่งร้าน") — Phase 3 runs a one-time seed/migration granting that email `role: "staff"`; no in-app self-promote endpoint is ever built.
4. AskUserQuestion: approve / adjust. **Do not write any implementation or test code before approval.** "Adjust" loops back to step 2.
5. On approval, tell the user in one plain-language line that several steps run back-to-back now (write tests, build it, review it, verify it) and they'll hear back once each finishes — sets the expectation that a quiet stretch means work, not that anything is stuck.

## Phase 1 — Isolate

If the project is a git repo, work in an isolated worktree (EnterWorktree) so the user's working copy stays intact; merge back only after review passes. Set `STATUS.md` → `status: in_progress`, `phase: plan-approved`, `updated: <today>`.

From here on, update `phase` in `STATUS.md` each time a phase **completes** — `red` → `green` → `refactor` → `review` → `verify` — so an interrupted run can be resumed by the Entry check instead of restarted.

Before writing any file, check `constitution.md` §4 (Code structure) for the project's structure preset, then copy the matching `scaffold/` template from `${CLAUDE_PLUGIN_ROOT}/structure/<preset>/scaffold/` for each new component the plan calls for, renaming it into place. This keeps new files where the preset's import-boundary rules expect them, instead of the boundaries hook catching a misplaced file after the fact.

## Phase 2 — RED

Write tests from the acceptance criteria **before** any implementation. Run them and confirm they fail *for the right reason* (missing feature, not a typo). A new test that passes immediately is invalid — investigate before continuing. Record test file paths in `IMPLEMENTATION.md`.

For ⚠️ features (login, payments, personal data, deletion), **abuse-case tests are mandatory**, not optional: wrong password, expired session, one user reaching for another user's data, invalid/oversized input at every boundary the plan touches. A ⚠️ feature whose tests only cover the happy path has not completed RED.

If IMPLEMENTATION.md notes this feature follows `stacks/<preset>/media.md`, abuse-case tests additionally cover: a disallowed file type is rejected before a presigned URL is issued, an oversized file is rejected the same way, and a caller without the right to upload for a given record cannot get a presigned URL for it.

## Phase 3 — GREEN

Implement the minimum needed to pass. Delegate to the `implementer` agent for larger features, giving it the approved plan, SPEC.md, and constitution.md. Never edit a test to make it pass — unless the test itself contradicts the spec, in which case fix the test and append the reason to `DECISIONS.md`. Run the **full** suite, not just the new tests.

If this feature installs the staff role add-on for the first time, this phase also runs the one-time seed/migration granting the founder's email (collected in Phase 0) `role: "staff"` — a script run once, never an in-app endpoint.

## Phase 4 — REFACTOR

Clean up per `constitution.md` while keeping the suite green. Lint must be clean (the save hook enforces this continuously anyway).

## Phase 5 — Fresh review

Launch the `fresh-reviewer` agent with ONLY: the diff (or the command to produce it), the path to SPEC.md, and the path to constitution.md. Do not describe the implementation journey, prior attempts, or reasoning. Fix findings and re-review until it returns APPROVE.

## Phase 6 — Verify

Run the full test suite one final time. If the feature has a visible UI, run the `verify-visually` skill now — it is part of this harness, not optional.

Also for UI features: add (or extend) a Playwright E2E spec in `e2e/` derived from the acceptance criteria, titled as a user scenario ("a customer takes a queue number and sees their position"), and confirm `npm run test:e2e` is green. This is the founder's own end-to-end proof — they rerun the whole journey anytime with one command, so every shipped UI feature must leave one behind.

If the feature added or updated dependencies, run `npm audit --audit-level=critical` (or the pnpm equivalent): critical findings block completion; high findings are reported to the user in plain language with ⚠️, never silently ignored.

## Phase 7 — Record & report

- `IMPLEMENTATION.md` → `## Touchpoints`: every file/function created or changed, one line each.
- `DECISIONS.md`: append significant choices (date, decision, why, plain-language impact). Append-only — never rewrite old entries.
- `STATUS.md` → `status: in_review`, `phase: null`, `updated: <today>` — built and checked, waiting for the user's own look.
- Report in plain language (user's language): what works now, exact steps for the user to see it themselves (what to run/click), test results as pass counts, and any ⚠️ items. Close with exactly one next step — the acceptance ask: "ลองใช้ดูแล้วบอกผมได้เลยว่าใช้ได้ หรือมีตรงไหนยังไม่ใช่" style. Don't point to `/founder-rail:launch` yet; that comes after they accept.

## Phase 8 — Acceptance (the user's own verdict)

A feature is `done` only when the user says so — passing tests prove the spec was met, not that the spec was what they meant. This phase runs whenever the user reacts to an `in_review` feature, in any words and in any later session (the front desk routes "looks good" / "that's not it" here; `/founder-rail:ship` and `/founder-rail:next` bring it up while something is waiting). If more than one feature is `in_review` and their words don't make clear which, ask which one by plain title.

- **They accept** ("ใช้ได้", "โอเค", "ผ่าน"): `STATUS.md` → `status: done`, `updated: <today>`; append to `DECISIONS.md`: date, "accepted by the user". Confirm in one line, then exactly one next step: `/founder-rail:launch` if the project has been launched before (constitution has a filled Deployment section), otherwise the next planned feature via `/founder-rail:ship` — or `/founder-rail:idea` if nothing is queued.
- **They haven't tried it yet**: nothing changes. Offer `/founder-rail:preview` so they can.
- **Something isn't right**: decide which case it is yourself — never make the user classify it.
  - *An acceptance criterion in SPEC.md isn't actually met* (the build missed it): the promise is broken, so the feature goes back into this harness — `status: in_progress`, `phase: plan-approved` — and Phase 2 starts with a failing test that reproduces what they saw. The approved plan still stands; return to the plan gate only if the fix changes what was approved.
  - *It does what the spec says, but they want it different*: accept it as built (`done`, noting in `DECISIONS.md` that a change was requested), then hand their words to `idea-to-spec` update mode — the change gets its own plan gate rather than being slipped in unreviewed.

## Hard rules

- No implementation before an approved plan. No skipping RED. Never weaken tests.
- Hooks will block commits with failing tests, secret-looking content, and force-pushes. Fix causes; never bypass a hook.
- The user verifies through behavior and screenshots — never ask them to read a diff.
