---
description: Put the latest work on the real internet — pre-flight checks, user approval, deploy, verify
---

Launch the current project to production:

1. If `constitution.md` has no filled Deployment section, this is the first launch — invoke the `founder-rail:setup-deploy` skill first and complete it fully.
2. **Pre-flight — all must pass before asking the user anything:**
   - Full test suite green (`npm test`)
   - Production build succeeds (per the stack: `npm run build`, or both apps for a monorepo)
   - `npm audit --audit-level=critical` passes (high findings: report ⚠️, don't block)
   - Nothing uncommitted that the user hasn't seen
   If any pre-flight check fails, stop and report in plain language — do not offer to launch anyway.
3. ⚠️ **Approval gate.** Tell the user, in their language: what changed since the last launch (feature titles from `features/*/STATUS.md`, not diffs), that this goes in front of real customers, and any special risk (payments, login, data changes). AskUserQuestion: launch / not yet.
4. Deploy following the launch steps in `${CLAUDE_PLUGIN_ROOT}/deploy/<preset>/recipe.md` (preset from constitution's Deployment section).
5. Run the preset's `verify.md` against the production URL(s). A failed check means the launch is **not done** — fix and redeploy, or restore the previous deployment per the preset's DEPLOY.md, and say plainly what happened.
6. Report: the live URL, what's new in plain language, what was verified, and remaining ⚠️ items if any.
