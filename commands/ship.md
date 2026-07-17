---
description: Build the next planned feature through the full quality harness
argument-hint: [feature name — or empty to pick from the sprint]
---

Build exactly one feature end-to-end:

1. If $ARGUMENTS names a feature, use it (match against `features/*/STATUS.md` titles and slugs). Otherwise pick the first sprint item with `status: planned` that is not blocked. If nothing is planned, invoke `founder-rail:plan-sprint` first, then continue.
2. Invoke the `founder-rail:implement-tdd` skill for that feature and follow it completely — including the plan-approval gate. Never skip phases.
3. If the feature has a visible UI, the harness runs `founder-rail:verify-visually`; confirm it actually ran before reporting.
4. Finish with the plain-language report the harness requires: what works now, how the user can see it themselves, test results as pass counts, and any ⚠️ items.
