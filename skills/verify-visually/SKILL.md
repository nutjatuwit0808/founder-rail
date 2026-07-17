---
name: verify-visually
description: Screenshot round-trip verification for UI work - launch the app, capture screenshots with Playwright, visually check them against the spec's acceptance criteria and the design tokens, and report in plain language. Use after implementing any feature with a visible UI, or when the user asks whether it looks right.
---

# Verify Visually

The user will not read code. Screenshots plus plain language are the proof.

1. Ensure Playwright is available: `npm i -D playwright` and `npx playwright install chromium` if missing (chromium only — keep it light).
2. Start the app's dev server in the background; wait until the port responds.
3. From `features/<slug>/SPEC.md` acceptance criteria, list the states to capture: pages, filled forms, error states, empty states.
4. Write a throwaway Playwright script in the scratchpad that visits each state and saves screenshots to `features/<slug>/screenshots/` (viewport 1280×800; add 390×844 if the spec mentions mobile). Name files after the state: `login-error.png`, not `screenshot2.png`.
5. **Look at every screenshot yourself** (the Read tool renders images). For each acceptance criterion, mark:
   - ✅ visible and correct
   - ❌ wrong — say exactly what differs from the spec
   - 🤷 not verifiable visually — name the automated test that covers it instead
6. Check against the design tokens in `constitution.md`: colors, radius, and spacing should plausibly match the chosen direction. Flag anything that looks hard-coded or off-palette.
7. Report per-criterion verdicts in plain language (user's language), and give the screenshot file paths so the user can look at the same evidence. Then stop the dev server.

Any ❌ loops back into the implement-tdd phases (fix → re-review → re-verify). Never report a feature as done with an open ❌.
