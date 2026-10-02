---
name: idea-to-spec
description: Turn a plain-language idea into a tracked feature spec under features/<slug>/. Use when /founder-rail:idea runs, when the user describes something they want built, or when triaging files in inbox/. Never asks about stack or architecture.
---

# Idea → Spec

## Input

The user's words (command arguments or conversation), or a file from `inbox/`. If no idea was given and `inbox/` has files, list them by plain-language summary and ask which to triage. An inbox file with a `---` separator followed by raw log lines is a production error report from `/founder-rail:checkup` — route it to the `fix-bug` skill instead of writing a spec.

## Clarify — at most 3 questions, all outcome-level

Allowed topics: who will use it, what success looks like, what is explicitly *not* needed, how it relates to existing features. **Forbidden:** databases, APIs, frameworks, architecture, hosting — the tech stack was already decided once, project-wide, by `setup-techstack`; a feature only *uses* it. Never re-litigate stack choices at spec time, and never ask the user.

## Existing feature? Update it instead

Before creating anything, check whether the idea is really a change to an existing `features/<slug>/` (read titles/SPECs). If so, switch to **update mode** — tell the user plainly ("นี่คือการปรับปรุง *X* ที่มีอยู่ ไม่ใช่ฟีเจอร์ใหม่" style, their language):

- **Append** the new requirements/acceptance criteria to the existing SPEC.md; never delete promises that still hold — mark superseded ones as replaced, with the new one next to them.
- STATUS.md: `done → planned` (back in the queue; the dashboard marks it ♻️), `updated: <today>`.
- DECISIONS.md append: date, what's changing, why (user's words).
- `/founder-rail:ship` then builds it like any planned feature — the plan gate protects the existing behavior.

The dividing line (shared with `fix-bug`): broken against what SPEC promised = `/founder-rail:fix` · works as promised but wanted different = update mode here. Decide yourself; never make the user classify it.

## Broad idea? Offer to split it by shippable value, in order

If the idea describes an end-to-end journey that's really several separately-shippable outcomes ("customers browse products, add to cart, and pay" is really: browse → cart → checkout), propose splitting it into that many `features/<slug>/` in the order each one delivers value on its own — before creating any folder. Confirm only the split/grouping itself in plain language ("อยากให้แบ่งเป็น 3 ก้อนแบบนี้ ทำทีละก้อน โอเคไหม" style) — this is not a technical decision, just sequencing. The founder can always say "just build it as one thing" and get a single feature instead; never insist on splitting. This keeps each `implement-tdd` run small enough to review, the same reason adopt-mode never proposes a mass-reformat.

## Data import? Third mode, not a feature

Signal (don't ask the user to classify it themselves): the idea comes with an attached file (CSV/Excel/JSON) or its description implies "นำเข้าข้อมูล/ย้ายข้อมูลเก่า/เพิ่มทีเดียวหลายรายการจากไฟล์" — a one-time bulk load, not a reusable screen. If the import logic is being built as a permanent, reusable part of the app (e.g. an admin import page used repeatedly), that's a real feature — use the normal flow above instead, not this mode.

This mode skips SPEC.md/user-facing acceptance criteria (there's no screen to check) and skips the full `implement-tdd` RED-GREEN-REFACTOR-review harness (there's no permanent diff to keep or review) — same entry point (`/founder-rail:idea`), lighter path:

1. **Validate file structure first, always, before anything else.** Check required columns are present and data types are right (prices are numbers, no empty required fields). Any problem stops here — tell the user in plain language which column, how many rows affected. Do not proceed to a dry-run with a structurally invalid file.
2. **Dry-run.** Show the user the first N rows and the total count in plain language before touching the database: "จะเพิ่ม 342 รายการ ตัวอย่าง 5 รายการแรกคือ...". Get explicit confirmation before step 3.
3. **Import idempotently.** Upsert by a stated key (e.g. name+set, not an auto-increment insert) so running it again never creates duplicates.
4. **Sanity check after import.** Report actual row counts against what was previewed, and confirm no required field came back empty — numbers, not just "done".
5. **Log it.** Append an entry to `features/_project/DECISIONS.md` (same file `fix-bug` uses for cross-cutting entries — create it with its README if missing): date, file source, rows succeeded/skipped, what the sanity check found.

No dedicated rollback mechanism — structure validation (step 1) and the dry-run (step 2) catch most mistakes before anything is written; if something still goes wrong after import, it's `/founder-rail:fix` like any other bug. `render-dashboard` does not list data imports as features (no `backlog→done` lifecycle) — they only show up as history in `features/_project/DECISIONS.md`.

## Create the feature folder (new features)

Slug: short kebab-case named after the *outcome*, not technology (`email-signup`, not `supabase-auth`).

`features/<slug>/SPEC.md`:

```markdown
# <Plain feature name>

## Summary
<2–3 sentences, plain language>

## Who it's for
<the user/persona and the situation>

## What success looks like
<observable outcome in business terms>

## Requirements
1. <numbered, plain language, each independently checkable>

## Acceptance criteria
- [ ] <each phrased so a non-technical person can check it by USING the app —
      "When I enter a wrong password, I see a clear message telling me what to do",
      never "auth returns 401">
- [ ] <if the feature touches login, payments, or personal data (⚠️), include
      misuse criteria too — what must NOT be possible: "When someone who isn't
      the account owner tries to open this page, they see an access-denied
      message, not the data">

If the feature needs to know **who the user is** (accounts, "my orders", saved
preferences) and the project has no sign-in yet, note in IMPLEMENTATION.md that
the build must follow `${CLAUDE_PLUGIN_ROOT}/stacks/<preset>/auth.md` — the
stack's standard sign-in recipe (Auth.js, passwordless by default). Never
re-decide auth per feature, and never ask the user which login technology they
want; the only outcome question allowed is e.g. "อยากให้ลูกค้ากดเข้าด้วยบัญชี
Google ได้ด้วยไหม หรืออีเมลอย่างเดียวพอ?"

If the feature involves **the customer paying money** (checkout, a paid order,
a subscription) and the project has no payment recipe installed yet, note in
IMPLEMENTATION.md that the build must follow
`${CLAUDE_PLUGIN_ROOT}/stacks/<preset>/payments.md` — the stack's standard
payment recipe (Stripe, Checkout-hosted, one-time payments by default). This
also raises the project to security level `sensitive-data` if it wasn't
already (constitution §8) — flag that ⚠️ in the plan like any other risky
item. Never re-decide which payment provider to use per feature, and never ask
the user which one; the only outcome question allowed is the currency, owned
by `implement-tdd` Phase 0 (which asks it once, when this note says the
recipe is being installed for the first time) — this step only leaves the
note, it does not ask the question itself.

If the feature's description implies **uploading or attaching an image**
("อัปโหลดรูป", "แนบรูป", "รูปสินค้า", "โลโก้") and the project has no media
recipe installed yet, note in IMPLEMENTATION.md that the build must follow
`${CLAUDE_PLUGIN_ROOT}/stacks/<preset>/media.md` — the stack's standard
recipe (S3-compatible storage, presigned browser-to-storage upload). Never
ask the user which storage provider to use; there is no outcome question for
this recipe at all.

If the feature's description implies **two different groups seeing different
things** (e.g. "the shop sees incoming orders" vs. "the customer sees their
own status"), ask one outcome question — never say role/permission/RBAC:
"หน้านี้ลูกค้าเป็นคนเห็น หรือคนในร้านเป็นคนเห็น หรือทั้งคู่แต่เห็นคนละแบบ?"
(counts toward the ≤3-question cap, doesn't raise it). If the answer implies a
staff-only view and the project has no staff role installed yet, note in
IMPLEMENTATION.md that the build must follow the "Role ฝั่งร้าน" section of
`${CLAUDE_PLUGIN_ROOT}/stacks/<preset>/auth.md` — fixed `/staff` prefix, one
central guard, founder grants the first staff role outside the app.

If the feature's description implies the customer should **see status update
on its own** — "เห็นสด", "อัปเดตเอง", "แจ้งเตือนเมื่อพร้อม", "นับคนข้างหน้า"
or equivalent — note in IMPLEMENTATION.md that the build must follow
`${CLAUDE_PLUGIN_ROOT}/stacks/<preset>/realtime.md` — the stack's standard
recipe (polling every 5 seconds by default; SSE only on an explicit "must be
instant" signal). Never ask the user whether they want polling or
websockets/SSE; that mechanism choice is the agent's alone.

## Non-goals
- <what this feature deliberately does not do>

## Open questions
- <anything unresolved — must be empty or answered before implementation>
```

`features/<slug>/STATUS.md`:

```markdown
---
feature: <slug>
title: <Plain feature name>
status: backlog
phase: null
sprint: null
blocked_by: []
created: <YYYY-MM-DD>
updated: <YYYY-MM-DD>
---

<one-line current state in plain language>
```

`features/<slug>/DECISIONS.md` — header only; append-only log. Each entry: date, decision, why, plain-language impact.

`features/<slug>/IMPLEMENTATION.md` — header only; will hold the approved plan and the touchpoints (files/functions touched) once built.

## Confirm

Read the spec back to the user in plain language (their language) and adjust until they confirm. If the idea came from `inbox/`, delete the inbox file after the spec exists. Close with exactly **one** next step (constitution §6.6): normally "`/founder-rail:ship` เมื่อพร้อมให้เริ่มสร้าง" — never a menu of commands.

Status values used across founder-rail: `backlog`, `planned`, `in_progress`, `in_review`, `done`, `blocked`. `phase` is written only by `implement-tdd` while a feature is `in_progress` (how far the build got, so an interrupted run resumes); leave it `null` here.
