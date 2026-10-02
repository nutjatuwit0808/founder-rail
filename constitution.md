# Project Constitution

> The single source of truth for how code gets written in this project.
> Created by founder-rail setup. Agents must follow it. The critical parts are
> enforced by shell hooks — they block, they don't ask.
>
> (Template note: sections marked `<!-- SETUP:... -->` are filled in by the
> `setup-techstack`, `setup-standards`, `setup-design`, `setup-structure`,
> and `setup-deploy` skills when this file is copied into a user's project.
> A section whose owning skill hasn't run yet **keeps its `<!-- SETUP:X -->`
> comment block verbatim** — that comment is the resume marker. `start.md`
> and `next.md` check for any comment still present, not just whether this
> file exists, before treating setup as done: a session that dies partway
> through onboarding (e.g. right after tech stack, before standards/design/
> structure) must resume the remaining skills, not be mistaken for finished.
> Filling a section means deleting its entire `<!-- SETUP:X ... -->` block
> and replacing it with the real content — never leaving the comment behind
> alongside the filled content.)

## 1. Tech stack

<!-- SETUP:TECHSTACK
Fill in:
- Preset: next-fullstack | next-nest — and the plain-language reason tied to
  the user's answers
- Database: whether one was wired in, and where (next-fullstack: project
  root · next-nest: apps/api only, never apps/web)
- Paths: app root(s); for next-nest, the monorepo layout
- Staff role: none until a feature needs it. Filled in by `idea-to-spec`/
  `implement-tdd` the first time a feature installs the "Role ฝั่งร้าน" add-on
  from `stacks/<preset>/auth.md` — record here: fixed `/staff` prefix, that
  the founder granted the first `staff` role outside the app (seed/migration,
  date), and the date installed.
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

## 5. Deployment

<!-- SETUP:DEPLOY
Fill in (by setup-deploy, which may run later than the other setup skills):
- Host: which preset (vercel-fullstack | railway-nest) and the plain-language
  reason tied to the user's answers (budget, domain)
- First launched: `<YYYY-MM-DD>` of the first production deploy — set once,
  never overwritten by later redeploys (`health-check` uses it to know how
  recent the launch is)
- Production URL + custom domain if any
- Env vars: the list of variable NAMES the app needs in production (never
  values), and where the user manages them (host dashboard)
- Rule: deploying to production always requires the launch pre-flight (tests
  green, build passes, no critical vulnerabilities) and the user's ⚠️ approval
-->

## 6. Workflow (non-negotiable)

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
   A feature is `done` only after the user has tried it and said it's right —
   until then it waits as `in_review`. An interrupted build is resumed from
   the `phase` recorded in `STATUS.md`, never restarted.
6. **No dead ends.** Every user-facing report ends with exactly **one**
   suggested next step (never a menu of options). The user must never be left
   wondering what to do — and `/founder-rail:next` answers "where am I, what
   now?" whenever they are.
7. **Route, never reject.** A command invoked in the "wrong" situation takes
   the user to the right flow with a one-line explanation — it never answers
   "you can't do that here."

## 7. Safety (enforced by hooks — do not bypass)

- Every saved JS/TS file is linted immediately; unfixable problems come back
  to the agent to fix.
- `git commit` is blocked while tests fail.
- Content that looks like a secret (API keys, private keys, passwords) is
  blocked from being written to files.
- Force-push and deleting main branches are blocked.
- Committing a real `.env` secrets file is blocked (`.env.example` with
  placeholders is fine).
- Commands that certainly destroy database data (full resets, dropping or
  truncating a database) are blocked — if truly needed, the user runs them
  personally after a plain-language explanation of what would be lost.
- Code that runs strings as code (`eval` and friends) or injects raw HTML
  from variables is blocked at save time.
- Dependencies with *critical* known vulnerabilities block setup and
  verification; *high* ones are reported ⚠️ in plain language, never
  silently ignored.

## 8. Secure coding (always on — judged by the reviewer, not blocked by hooks)

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
6. **Stock/quantity decrements are atomic.** Reducing how much of something is
   left (inventory, limited-quantity items) happens as one conditional
   operation that checks the remaining count in the same step — never a
   separate read-then-write — so two customers buying the last item at the
   same time can't both succeed.
7. **Order/status transitions are explicit, not a free-set field.** A feature
   that changes an order's status (pending → paid → shipped →
   delivered/cancelled, or equivalent) defines which transitions are allowed
   and checks the current status before changing it — never just assigns a
   new string.

### Security level

<!-- SETUP:SECURITY-LEVEL
Filled by setup-techstack: `baseline` or `sensitive-data`, with the user's
answers that set it (does the app hold personal details? does money move?).
-->

When the level is **`sensitive-data`**, these additional rules apply:

- Dependency vulnerabilities rated *high* also block ship/launch (baseline
  blocks only *critical*). An unfixable transitive case may be excepted only
  via a DECISIONS.md entry and stays a permanent ⚠️ in every checkup.
- Personal details (emails, phone numbers, addresses, names) never reach
  logs — same footing as secrets.
- Every API response has an explicit field allowlist; the reviewer checks no
  personal field leaves that isn't needed.
- Every feature that *reads* personal data (not just writes) counts as ⚠️
  and needs abuse-case tests.
- Money amounts are integers in the smallest unit (satang/cents) — never
  floating point.
- A "delete my data" feature exists in the backlog from day one.

## 9. Language rule

Every user-facing summary is plain language in the user's own language — no
technical jargon. Actions touching production, payments, or user data carry a
⚠️ risk indicator. The user is never asked to read code to verify anything.
