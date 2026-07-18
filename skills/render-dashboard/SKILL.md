---
name: render-dashboard
description: Zero-database kanban - derive project status entirely from features/*/STATUS.md at read time and render a text board in chat. Use when /founder-rail:status runs or the user asks about progress, what is happening, or project status.
---

# Render Dashboard

The markdown files ARE the database. Always re-read them; never answer from memory or any cache.

1. Glob `features/*/STATUS.md` and parse the YAML frontmatter: `feature`, `title`, `status`, `sprint`, `blocked_by`, `updated`. Skip malformed files but list them at the end as "needs attention". `features/_project/` (cross-cutting bugs) counts too: show any active fix there as a 🔧 item in the column matching its status.
2. Count `inbox/*.md` files (excluding README) as untriaged ideas.
3. Board columns, in order: 📥 Backlog · 📋 Planned · 🔨 In progress · 👀 In review · ✅ Done. An item whose `blocked_by` is not done gets a 🚫 marker with the blocker's plain title.
4. Render as a markdown table — one column per status, plain titles (never slugs), sprint number in parentheses for planned items. A `done` feature that returned to `planned` for an update round (its STATUS body says so) gets a ♻️ marker so the user sees it's an improvement, not new work.
5. Below the board add:
   - Current sprint contents in build order
   - Counts per column + untriaged inbox count
   - Exactly ONE suggested next action, e.g. "`/founder-rail:ship` to build *Email signup*" or "`/founder-rail:idea` — the board is empty, add your first idea"
6. Everything in plain language, in the user's language.

v1 is chat-only: do not generate an HTML dashboard unless the user explicitly asks.
