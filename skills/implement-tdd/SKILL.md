---
name: implement-tdd
description: The build harness - implements one feature spec end-to-end with a plan-approval gate, strict RED-GREEN-REFACTOR TDD, fresh-context review, and documentation updates. Use when /founder-rail:ship runs or the user asks to build a planned feature. Implementation code must never be written outside this flow.
---

# Implement (TDD harness)

Work on exactly one feature per run. Input: the feature slug.

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

If the project is a git repo, work in an isolated worktree (EnterWorktree) so the user's working copy stays intact; merge back only after review passes. Set `STATUS.md` → `status: in_progress`, `updated: <today>`.

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
- `STATUS.md` → `in_review` while awaiting the user's acceptance; `done` after they accept.
- Report in plain language (user's language): what works now, exact steps for the user to see it themselves (what to run/click), test results as pass counts, and any ⚠️ items. If the project has been launched before (constitution has a Deployment section), close by pointing to `/founder-rail:launch` to put this in front of real users.

## Hard rules

- No implementation before an approved plan. No skipping RED. Never weaken tests.
- Hooks will block commits with failing tests, secret-looking content, and force-pushes. Fix causes; never bypass a hook.
- The user verifies through behavior and screenshots — never ask them to read a diff.
