---
description: One-time project setup — tech stack, code standards, structure, design direction, and quality rails
---

Run founder-rail onboarding for the current project:

1. If `constitution.md` already exists at the project root, setup was already done — show the user (plain language) what protections are in place, and only re-run if they explicitly ask.
2. Invoke the `founder-rail:setup-techstack` skill and complete it fully (including verifying the scaffolded stack builds and boots).
3. Invoke the `founder-rail:setup-standards` skill and complete it fully (including verifying that lint actually runs).
4. If the project has a frontend — or the user says it will have one — invoke the `founder-rail:setup-design` skill, then the `founder-rail:setup-structure` skill.
5. Create `inbox/` and `features/` directories at the project root if missing, each with a one-paragraph README explaining its purpose.
6. **Install the front desk** so the user never needs to remember commands: copy `${CLAUDE_PLUGIN_ROOT}/templates/front-desk.md` to `.claude/founder-rail.md` in the project, and make sure the project's `CLAUDE.md` contains the line `@.claude/founder-rail.md` (create `CLAUDE.md` with just that line if missing; if one exists — brownfield — append the single reference line and touch nothing else).
7. Create `GUIDE.md` at the project root, in the user's language: a one-page "how to talk to this system" table (situation → what to say, e.g. "เจอของพัง → เล่าอาการมาได้เลย", "อยากได้อะไรเพิ่ม → เล่าไอเดียมา"), ending with: "จำอะไรไม่ได้เลย → `/founder-rail:next`".
8. If the project is not a git repository, offer to initialize one. Explain it in plain language ("a save-history system so nothing is ever lost"), don't say "version control".
9. Finish with a plain-language summary (user's language) of what is now protected and enforced, closing with exactly one next step: `/founder-rail:idea` to add their first idea.
