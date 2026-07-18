---
description: Open the app locally so the user can see and click it right now
---

Show the user their app:

1. Read `constitution.md` section 1 (Tech stack) to know how the project runs: `next-fullstack` → `npm run dev` at the root; `next-nest` → both apps via the root scripts (web + api).
2. Start the dev server(s) and **confirm they actually serve** (fetch the home page) before telling the user anything.
3. Tell the user, plain language, their language: the link to open, and "what there is to try" — a short list from `features/*/STATUS.md` of what's `done` and `in_review` (plain titles, one line each on what to click).
4. If boot fails: do not paste error logs at the user. Say plainly that the app won't start, what you'll do about it, then fix it (through `/founder-rail:fix` flow if it's a real bug).
