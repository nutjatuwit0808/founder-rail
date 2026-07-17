---
name: idea-to-spec
description: Turn a plain-language idea into a tracked feature spec under features/<slug>/. Use when /founder-rail:idea runs, when the user describes something they want built, or when triaging files in inbox/. Never asks about stack or architecture.
---

# Idea → Spec

## Input

The user's words (command arguments or conversation), or a file from `inbox/`. If no idea was given and `inbox/` has files, list them by plain-language summary and ask which to triage.

## Clarify — at most 3 questions, all outcome-level

Allowed topics: who will use it, what success looks like, what is explicitly *not* needed, how it relates to existing features. **Forbidden:** databases, APIs, frameworks, architecture, hosting — those are decided at implementation time by the harness, never at spec time, and never by the user.

## Create the feature folder

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
