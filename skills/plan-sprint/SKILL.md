---
name: plan-sprint
description: Group backlog feature specs into a simple sprint. Use when the user asks what to build next or to plan a sprint, or when /founder-rail:ship finds nothing planned. Lightweight by design - no story points, no velocity.
---

# Plan Sprint

1. Scan `features/*/STATUS.md` frontmatter. Collect items with `status: backlog`; note `blocked_by` chains and anything already `planned` or `in_progress`.
2. Next sprint number = highest existing `sprint` value + 1 (or 1).
3. Ask the user **one** outcome question (their language): which results matter most right now. Present backlog items by plain title with a one-line value summary each (multiSelect, pick up to 4). Recommend an order yourself — dependencies first — the user confirms priorities, they do not design the plan.
4. Update each chosen feature's `STATUS.md`: `status: planned`, `sprint: <N>`, `updated: <today>`. Leave the body line describing the plain-language state.
5. Report as text: what's in the sprint and in what order, why that order (in plain language, e.g. "login must exist before profiles"), and what stays in the backlog.

Rules:
- An item whose `blocked_by` isn't `done` cannot enter the sprint before its blocker.
- Never plan more than 5 items into one sprint.
- Never invent features — only what exists under `features/`. Point to `/founder-rail:idea` for new ones.
