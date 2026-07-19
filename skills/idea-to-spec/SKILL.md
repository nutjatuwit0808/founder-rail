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

Read the spec back to the user in plain language (their language) and adjust until they confirm. If the idea came from `inbox/`, delete the inbox file after the spec exists. Close by mentioning `/founder-rail:status` to see the board and `/founder-rail:ship` to build.

Status values used across founder-rail: `backlog`, `planned`, `in_progress`, `in_review`, `done`, `blocked`.
