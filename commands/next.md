---
description: Lost? One answer — where the project is and the single next step
---

Tell the user where they are and what to do next. Everything is derived fresh from the project's markdown — never from memory.

**Self-heal first:** if `.claude/founder-rail.md` exists but the project's `CLAUDE.md` is missing the `@.claude/founder-rail.md` reference line (or `CLAUDE.md` is gone), offer to restore it with a one-line explanation ("ไฟล์นำทางหลุดไป ผมเติมคืนให้นะ" style) before answering. And if `.claude/founder-rail.md` differs from `${CLAUDE_PLUGIN_ROOT}/templates/front-desk.md`, re-copy the template over it without comment — it's an agent-facing file the user never edits, and an outdated copy misses newer routes.

Then walk this decision tree top-down; the **first true condition is the answer**:

1. No `constitution.md` at the project root, **or** it exists but still has any `<!-- SETUP:X ... -->` comment block remaining (grep for `<!-- SETUP:`) → "ยังตั้งระบบไม่เสร็จ — ทำต่อที่ `/founder-rail:start`" (say "ยังไม่ได้ตั้งระบบ" only when the file doesn't exist at all; say "ตั้งค้างไว้กลางทาง" when it exists but is incomplete — either way the one next step is the same command, which resumes rather than restarts)
2. Any feature `in_progress` → a build stopped partway. Name it + how stale (`updated:`): "งาน *X* สร้างค้างไว้กลางทาง — `/founder-rail:ship` จะทำต่อจากจุดที่ค้าง ไม่เริ่มใหม่"
3. Any feature `in_review` → built, waiting for the user's verdict — the ball is in their court, not the builder's, so never say `/founder-rail:ship` here: "*X* สร้างเสร็จแล้ว รอคุณลองดู — เปิดดูด้วย `/founder-rail:preview` แล้วบอกผมว่าใช้ได้ไหม"
4. `inbox/` has untriaged files (excluding README) → "มีไอเดียค้าง N เรื่อง — `/founder-rail:idea` เพื่อแปลงเป็นแผน"
5. Any feature `planned` → "คิวถัดไปคือ *X* — `/founder-rail:ship` เมื่อพร้อม"
6. Any `done` but constitution has no filled Deployment section → "ของเสร็จแล้วแต่ลูกค้ายังไม่เห็น — `/founder-rail:launch`?"
7. Launched, nothing pending, and `checkups.md` shows no checkup in 30+ days (or doesn't exist) → "เงียบมาพักใหญ่ — `/founder-rail:checkup` ตรวจสุขภาพหน่อยไหม"
8. Otherwise → "ทุกอย่างเรียบร้อย — มีไอเดียใหม่ก็เล่ามาได้เลย"

Format (user's language): one line of "where you are", then exactly **one** suggested step (constitution §6.6) — never a menu. If the user's message alongside this command already reveals an intent (a bug, an idea), skip the tree and route straight there (§6.7).
