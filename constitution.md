# Project Constitution

> The single source of truth for how code gets written in this project.
> Created by founder-rail setup. Agents must follow it. The critical parts are
> enforced by shell hooks — they block, they don't ask.
>
> (Template note: sections marked `<!-- SETUP:... -->` are filled in by the
> `setup-standards` and `setup-design` skills when this file is copied into a
> user's project.)

## 1. Code standards

<!-- SETUP:STANDARDS
Fill in:
- Preset: name + link to the public style guide it is based on
- Strictness: strict | flexible — and the user's answer that led to it (quoted)
- Config files: paths to the generated lint/format config
- Plain-language summary: 3-5 bullets of what the rules catch, no jargon
-->

## 2. Design (frontend only)

<!-- SETUP:DESIGN
Fill in:
- Direction: minimal | bold | playful — and the user's answer that led to it
- Token file: path (e.g. src/styles/tokens.css)
- Rule: all UI code must use tokens — no hard-coded colors, sizes, radii
- Verification: verify-visually checks screenshots against these tokens
-->

## 3. Workflow (non-negotiable)

1. **No code before an approved plan.** Every feature starts with a plan in
   `features/<slug>/IMPLEMENTATION.md`, translated to plain language, approved
   by the user. Risky work (production, payment, login/security, deleting
   data) is flagged ⚠️ in the approval request.
2. **TDD, strictly.** RED (failing test from acceptance criteria) → GREEN
   (minimal implementation) → REFACTOR (per this constitution). Tests are
   never weakened to pass.
3. **Fresh-context review before merge.** The `fresh-reviewer` agent sees only
   the diff, the spec, and this file — never the implementation story. It must
   APPROVE.
4. **Visual verification for UI work.** Screenshot round-trip via Playwright,
   checked against acceptance criteria and design tokens.
5. **Every feature is documented** in `features/<slug>/`:
   `SPEC.md` (what & why), `STATUS.md` (where it is), `DECISIONS.md`
   (append-only decision log), `IMPLEMENTATION.md` (plan + touchpoints).

## 4. Safety (enforced by hooks — do not bypass)

- Every saved JS/TS file is linted immediately; unfixable problems come back
  to the agent to fix.
- `git commit` is blocked while tests fail.
- Content that looks like a secret (API keys, private keys, passwords) is
  blocked from being written to files.
- Force-push and deleting main branches are blocked.

## 5. Language rule

Every user-facing summary is plain language in the user's own language — no
technical jargon. Actions touching production, payments, or user data carry a
⚠️ risk indicator. The user is never asked to read code to verify anything.
