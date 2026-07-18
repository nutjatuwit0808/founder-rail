---
name: undo-feature
description: Safely walk back the most recently shipped feature using git revert - never reset, never history rewriting. Use when /founder-rail:undo runs or the user says the latest feature broke things or they want it gone. Explains the cost in plain language and requires approval before touching anything.
---

# Undo Feature

## Step 1 — Identify what "latest" is

From `features/*/STATUS.md` find the most recently `done` feature; confirm against `git log` which commits belong to it. Show the user (plain title, their language): "The most recent finished piece is *X*, completed <date>. That's what can be walked back."

## Step 2 — Explain the cost, then gate ⚠️

Before touching anything, say plainly:

- The feature's **code** goes away; everything else stays.
- **Data does not vanish**: if this feature already stored customer data, that data stays in the database — but the screens that used it will be gone until the feature returns.
- The feature returns to the queue (`planned`), not to the trash — it can be rebuilt better later.

AskUserQuestion: proceed / cancel. No touch before approval.

## Step 3 — Revert (never reset)

- `git revert` the feature's commits (history stays intact — same spirit as the push-safety hook; never `git reset --hard`, never force-push).
- If the revert **conflicts**, stop immediately: do not resolve conflicts creatively. Report that later work is tangled with this feature, list which features touch the same places (plain titles), and recommend `/founder-rail:fix` for the actual symptom instead.
- Run the **full test suite**. If reverting made other tests fail, the same rule: stop, revert the revert, report the entanglement honestly.

## Step 4 — Record & report

- STATUS.md → `status: planned`, `updated: <today>`, body notes it was walked back (the dashboard shows ♻️).
- DECISIONS.md append: date, "walked back", why (user's words), what was learned.
- Report: what's gone, what's untouched, that the work isn't lost (it's back in the queue), and — if the project is launched — that production still runs the old version until the next `/founder-rail:launch` ⚠️.
