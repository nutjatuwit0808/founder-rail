---
name: fix-bug
description: Turn a plain-language bug report into a reproduced, regression-tested fix. Use when /founder-rail:fix runs or the user says something is broken, crashes, or behaves wrong. Lighter ceremony than a full feature spec, but never leaves the harness - reproduce first, failing regression test, fresh review.
---

# Fix Bug

For things that are **broken against what their SPEC promised**. If the app does what the spec says but the user wants it different, that's an update to the feature — hand off to `idea-to-spec` (it has an update mode) and say so plainly.

## Step 1 — Hear the symptom

Take the user's words. At most 2 follow-up questions, symptom-level only ("does it happen every time?", "what did you do right before?"). **Forbidden:** technical questions ("what's in the console?", "which browser version?") — reproducing is your job, not theirs.

The report may also be an `inbox/` file written by `/founder-rail:checkup` (production errors): plain-language symptom first, then `---`, then raw log lines for you. Use the log part for reproduction; talk to the user only in terms of the symptom part. Delete the inbox file once the fix lands.

## Step 2 — Find the owner

Map the symptom to a `features/<slug>/` (read SPECs as needed). No match → project-level bug: use `features/_project/` (create once, with a README noting it holds cross-cutting bugs; the leading `_` keeps it apart from real feature slugs).

## Step 3 — Reproduce before touching anything

Run the app or the relevant tests and confirm the bug actually happens. If it can't be reproduced, say so honestly, describe what was tried in plain language, and ask what the user saw — **never guess-fix an unreproduced bug.**

## Step 4 — Mini plan gate

One short paragraph to the user (their language): what's broken, why (plain-language cause), what will be touched. ⚠️ if the fix touches payments, login/security, or stored data — then explicit approval is required before code. For non-⚠️ fixes, state the plan and proceed unless the user objects — the full feature-plan ceremony is not needed for a bug.

## Step 5 — Regression test (RED)

Write a test that fails **because of this bug** — reproducing the exact symptom, not a generic test. Run it, confirm it fails for that reason. This test is permanent: it stops this bug from ever returning silently.

## Step 6 — Fix (GREEN) → full suite → fresh review

Same rules as `implement-tdd` Phases 3–5: minimal fix, never weaken a test, run the **full** suite, then `fresh-reviewer` with only the diff + the owning feature's SPEC.md + constitution.md. Review is not skipped for small fixes — one-line fixes are where regressions hide.

## Step 7 — Record & report

- Append to the owner's `DECISIONS.md`: date, symptom (user's words), plain-language cause, what changed.
- If the feature was `done`, it stays `done` (a fix restores the promise; it doesn't reopen the feature). Update `updated:` in STATUS.md.
- Report: "จุดที่แจ้งถูกซ่อมแล้ว — ลองทำแบบเดิมอีกครั้งได้เลย" style (user's language): what was wrong in plain words, confirmation the old symptom is now covered by a permanent test, and exact steps to re-check it themselves. If the project is launched, point to `/founder-rail:launch` to ship the fix to real users.

## Hard rules

- No fix without reproduction. No fix without a failing regression test first. No skipping fresh review.
- A bug found while shipping another feature: if it doesn't block that feature, finish the feature first and run this flow separately — don't mix diffs.
