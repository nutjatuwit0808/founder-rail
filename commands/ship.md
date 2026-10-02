---
description: Build the next planned feature through the full quality harness
argument-hint: [feature name — or empty to pick from the sprint]
---

Build exactly one feature end-to-end:

1. Pick the feature from `features/*/STATUS.md`, re-read now. If $ARGUMENTS names a feature, use it (match against titles and slugs). Otherwise the first match in this order:
   1. A feature with `status: in_progress` — a build that was interrupted. Finish it before starting anything new; the harness resumes it from where it stopped.
   2. A feature with `status: in_review` — built, waiting for the user's verdict. Ask for that first (the harness's Acceptance phase): one plain question naming it, "*X* สร้างเสร็จแล้ว ลองดูหรือยัง ใช้ได้ไหม" style. If they'd rather keep building and look later, respect that and continue down this list — unreviewed work piling up is their call, not a blocker.
   3. The first sprint item with `status: planned` that is not blocked.
   4. Nothing planned → invoke `founder-rail:plan-sprint` first, then continue.
2. Invoke the `founder-rail:implement-tdd` skill for that feature and follow it completely — its Entry check decides whether this is a new run (plan-approval gate), a resume, or an acceptance. Never skip phases.
3. If the feature has a visible UI, the harness runs `founder-rail:verify-visually`; confirm it actually ran before reporting.
4. Finish with the plain-language report the harness requires: what works now, how the user can see it themselves, test results as pass counts, and any ⚠️ items — closing with the one next step the harness names (after a build: try it and say whether it's right).
