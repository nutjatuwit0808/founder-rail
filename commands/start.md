---
description: One-time project setup — tech stack, code standards, structure, design direction, and quality rails
---

Run founder-rail onboarding for the current project:

1. If `constitution.md` exists at the project root, check whether any `<!-- SETUP:X ... -->` comment block still remains in it (grep for `<!-- SETUP:`).
   - **No comments remain** → setup was already done — show the user (plain language) what protections are in place, and only re-run if they explicitly ask.
   - **Some comments remain** → setup was interrupted partway through. Do not restart from scratch and do not re-ask questions for a section already filled: tell the user plainly that a previous setup didn't finish, then in Steps 3–5 below run only the skills owning still-unfilled sections (fixed order techstack → standards → design/structure → deploy), skipping any skill whose section is already filled. If `constitution.md` doesn't exist yet at all, this is a fresh start — every skill runs, from Step 3 below.
2. Tell the user, in one plain-language line, that this is going to be several questions in a row before anything gets built, and they'll see everything laid out before it's created (sets expectations — this is a long stretch of turns, not a single quick exchange).
3. **Ask phase** — run each skill's outcome questions only, holding what it would build without letting it scaffold or write files yet:
   - `founder-rail:setup-techstack` Steps 1–2 (detect, ask outcome questions incl. currency if payments apply)
   - `founder-rail:setup-standards` Steps 1–2 (detect, ask its two questions)
   - If the project has a frontend or will have one: `founder-rail:setup-design` First-time mode Steps 1–3b (direction, optional brand color, tokens computed but not yet written) and `founder-rail:setup-structure` Steps 1–2 (ask its one question)
4. **One combined approval.** Summarize everything from step 3 in plain language as a single list — stack, standards, design direction/colors, structure — with ⚠️ on any database/login/payment step. AskUserQuestion once: approve / adjust. "Adjust" loops back to whichever skill's question needs revisiting; nothing has been written yet, so adjusting costs nothing. This replaces each skill's own individual approval gate (`setup-techstack` Step 3, `setup-design` Step 5's confirm) — those skills skip that gate when run as part of this combined flow and only use it when re-run standalone later.
5. **Build phase**, in order, now that everything is approved: `setup-techstack` Steps 4–6 (scaffold, verify, write constitution.md, report) → `setup-standards` Steps 3–5 → `setup-design` Steps 4–5 (write tokens, render preview, report — no separate confirm, already covered by step 4 above) → `setup-structure` Steps 3–5.
6. Create `inbox/` and `features/` directories at the project root if missing, each with a one-paragraph README explaining its purpose.
7. **Install the front desk** so the user never needs to remember commands: copy `${CLAUDE_PLUGIN_ROOT}/templates/front-desk.md` to `.claude/founder-rail.md` in the project, and make sure the project's `CLAUDE.md` contains the line `@.claude/founder-rail.md` (create `CLAUDE.md` with just that line if missing; if one exists — brownfield — append the single reference line and touch nothing else).
8. Create `GUIDE.md` at the project root, in the user's language: a one-page "how to talk to this system" table (situation → what to say, e.g. "เจอของพัง → เล่าอาการมาได้เลย", "อยากได้อะไรเพิ่ม → เล่าไอเดียมา"), ending with: "จำอะไรไม่ได้เลย → `/founder-rail:next`".
9. If the project is not a git repository, offer to initialize one. Explain it in plain language ("a save-history system so nothing is ever lost"), don't say "version control".
10. Finish with a plain-language summary (user's language) of what is now protected and enforced, closing with exactly one next step: `/founder-rail:idea` to add their first idea — and offer 2-3 example first ideas guessed from what the user already said during onboarding (not a new dropdown of business types), just enough to give them something to say back.
