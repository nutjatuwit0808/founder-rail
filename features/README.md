# Features

One folder per feature, named by outcome (`email-signup`, not `supabase-auth`). Each folder is the permanent product knowledge for that feature:

| File | Purpose |
|------|---------|
| `SPEC.md` | What & why — requirements and acceptance criteria in plain language |
| `STATUS.md` | Where it is — YAML frontmatter (`status`, `sprint`, `blocked_by`) read live by the dashboard |
| `DECISIONS.md` | Append-only decision log (ADR-style): date, decision, why, plain-language impact |
| `IMPLEMENTATION.md` | The approved plan + touchpoints: every file/function the feature touches |

Status values: `backlog` → `planned` → `in_progress` → `in_review` → `done` (plus `blocked`).

There is no database. These files, read at runtime, are the entire tracking system.
