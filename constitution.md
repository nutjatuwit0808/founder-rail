# Project Constitution

> The single source of truth for how code gets written in this project.
> Created by founder-rail setup. Agents must follow it. The critical parts are
> enforced by shell hooks — they block, they don't ask.
>
> (Template note: sections marked `<!-- SETUP:... -->` are filled in by the
> `setup-techstack`, `setup-standards`, `setup-design`, and `setup-structure`
> skills when this file is copied into a user's project.)

## 1. Tech stack

<!-- SETUP:TECHSTACK
Fill in:
- Preset: next-fullstack | next-nest — and the plain-language reason tied to
  the user's answers
- Database: whether one was wired in, and where (next-fullstack: project
  root · next-nest: apps/api only, never apps/web)
- Paths: app root(s); for next-nest, the monorepo layout
-->

## 2. Code standards

<!-- SETUP:STANDARDS
Fill in:
- Preset: name + link to the public style guide it is based on
- Strictness: strict | flexible — and the user's answer that led to it (quoted)
- Config files: paths to the generated lint/format config
- Plain-language summary: 3-5 bullets of what the rules catch, no jargon
-->

## 3. Design (frontend only)

<!-- SETUP:DESIGN
Fill in:
- Direction: minimal | bold | playful — and the user's answer that led to it
- Token file: path (e.g. src/styles/tokens.css)
- Rule: all UI code must use tokens — no hard-coded colors, sizes, radii
- Verification: verify-visually checks screenshots against these tokens
-->

## 4. Code structure (frontend only)

<!-- SETUP:STRUCTURE
Fill in:
- Preset: flat | feature-based | atomic-design — and the user's answer that
  led to it
- Layout: the folder tree from the preset's STRUCTURE.md
- Plain-language rules: colocated tests, import direction (who can import
  whom), no jargon
- Verification: fresh-reviewer checks file placement against this section
-->

## 5. Workflow (non-negotiable)

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

## 6. Safety (enforced by hooks — do not bypass)

- Every saved JS/TS file is linted immediately; unfixable problems come back
  to the agent to fix.
- `git commit` is blocked while tests fail.
- Content that looks like a secret (API keys, private keys, passwords) is
  blocked from being written to files.
- Force-push and deleting main branches are blocked.
- Committing a real `.env` secrets file is blocked (`.env.example` with
  placeholders is fine).
- Code that runs strings as code (`eval` and friends) or injects raw HTML
  from variables is blocked at save time.
- Dependencies with *critical* known vulnerabilities block setup and
  verification; *high* ones are reported ⚠️ in plain language, never
  silently ignored.

## 7. Secure coding (always on — judged by the reviewer, not blocked by hooks)

These rules can't be checked by a machine without false alarms, so the
`implementer` follows them while writing and `fresh-reviewer` verifies them
on every diff. A concrete violation is a review **blocker**:

1. **Validate at the boundary.** Anything arriving from outside (form input,
   URL parameters, uploaded files, API request bodies) is validated before
   use — shape, type, and limits.
2. **Database only through the ORM.** No SQL assembled by joining strings
   with user input, ever.
3. **Check *whose* data, not just *whether logged in*.** Every endpoint that
   reads or changes personal data verifies the requester owns (or is allowed
   to see) that specific data.
4. **Responses carry only what the feature needs.** Never return whole
   database objects — pick the fields.
5. **Secrets and passwords never reach logs,** error messages, or API
   responses.

## 8. Language rule

Every user-facing summary is plain language in the user's own language — no
technical jargon. Actions touching production, payments, or user data carry a
⚠️ risk indicator. The user is never asked to read code to verify anything.
