---
name: health-check
description: Read-only project health report in plain language. Use when /founder-rail:checkup runs, or the user asks if the project is healthy, safe, or up to date. Checks vulnerabilities, tests, build, lint, stale dependencies, stalled features - and production if the project is launched. Never fixes anything itself.
---

# Health Check

Read-only. Findings become offers, never silent fixes.

## Checks (run all; a failing check is a finding, not a stop)

| Check | Command / source | Grading |
|-------|------------------|---------|
| Known vulnerabilities | `npm audit` (pnpm equivalent for monorepo) | critical = 🔴 fix now · high = ⚠️ soon · lower = count only |
| Full test suite | `npm test` | any failure = 🔴 |
| Build | `npm run build` (both apps for `next-nest`) | failure = 🔴 |
| Lint (incl. security + structure rules) | `npx eslint` per config | errors = ⚠️ with count |
| Very stale dependencies | `npm outdated` | only majors ≥ 2 behind = ⚠️; ignore minor/patch noise |
| Stalled features | `features/*/STATUS.md` | `in_progress`/`blocked` with `updated` older than 14 days = ⚠️ |

## Production section (only if constitution has a filled Deployment section)

- Fetch the production URL and the health route (`/api/health` or `/health` per stack) — down = 🔴.
- Pull recent error logs via the host CLI (`vercel logs` / `railway logs`; the user's own CLI login from setup-deploy — never handle tokens). The same error repeating ≥ 3 times in a day = ⚠️ finding, and **write it into `inbox/`** using the error-report convention: first lines = plain-language symptom as a user would say it, then a `---`, then the raw log lines for the agent (strip anything that looks like personal data — emails, names, tokens — before writing). `idea-to-spec`/`fix-bug` treat inbox files in this format as bug reports.

## Record the run

Append one line to `checkups.md` at the project root (create the file with a one-line header if missing): `<YYYY-MM-DD> — <headline verdict> (<one-phrase summary>)`. Append-only — this is both the founder's health history and what `/founder-rail:next` reads to know when the last checkup happened.

## Report format

1. **One headline line**: "สุขภาพดี ✅" / "มีเรื่องควรจัดการ ⚠️ N เรื่อง" / "มีเรื่องด่วน 🔴 N เรื่อง" (user's language).
2. Findings ranked by risk, each: plain-language symptom → what it means for the business → an offer ("ให้ผมจัดการเลยไหม? จะเข้า flow ซ่อมตามปกติ").
3. No jargon anywhere: not "CVE", "semver", "major version" — say "ตัวประกอบที่แอปใช้อยู่มีจุดอ่อนที่คนร้ายรู้กันแล้ว" style.
4. Close with when to run the next checkup: read "First launched" from constitution.md §5 — less than 30 days ago, suggest **weekly** (real money/customers moving through a brand-new launch carries more risk per unit time than a settled project); past 30 days, suggest monthly as before; section not filled at all (never launched), no cadence to suggest.

## Hard rules

- Grading matches the security baseline everywhere: critical blocks (well — here it's 🔴 urgent), high reports ⚠️. Never contradict `security/baseline/SECURITY.md`.
- Accepting an offer routes into the normal harness (`fix-bug` / `idea-to-spec`) — no fixing inside the checkup itself.
