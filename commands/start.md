---
description: One-time project setup — code standards, design direction, and quality rails
---

Run founder-rail onboarding for the current project:

1. If `constitution.md` already exists at the project root, setup was already done — show the user (plain language) what protections are in place, and only re-run if they explicitly ask.
2. Invoke the `founder-rail:setup-standards` skill and complete it fully (including verifying that lint actually runs).
3. If the project has a frontend — or the user says it will have one — invoke the `founder-rail:setup-design` skill.
4. Create `inbox/` and `features/` directories at the project root if missing, each with a one-paragraph README explaining its purpose.
5. If the project is not a git repository, offer to initialize one. Explain it in plain language ("a save-history system so nothing is ever lost"), don't say "version control".
6. Finish with a plain-language summary (user's language) of what is now protected and enforced, and point them to `/founder-rail:idea` to add their first idea.
