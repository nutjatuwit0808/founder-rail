---
description: Lost? One answer — where the project is and the single next step
---

Tell the user where they are and what to do next. Everything is derived fresh from the project's markdown — never from memory.

**Self-heal first:** if `.claude/founder-rail.md` exists but the project's `CLAUDE.md` is missing the `@.claude/founder-rail.md` reference line (or `CLAUDE.md` is gone), offer to restore it with a one-line explanation ("ไฟล์นำทางหลุดไป ผมเติมคืนให้นะ" style) before answering.

Then walk this decision tree top-down; the **first true condition is the answer**:

1. No `constitution.md` at the project root, **or** it exists but still has any `<!-- SETUP:X ... -->` comment block remaining (grep for `<!-- SETUP:`) → "ยังตั้งระบบไม่เสร็จ — ทำต่อที่ `/founder-rail:start`" (say "ยังไม่ได้ตั้งระบบ" only when the file doesn't exist at all; say "ตั้งค้างไว้กลางทาง" when it exists but is incomplete — either way the one next step is the same command, which resumes rather than restarts)
2. Any feature `in_progress`/`in_review` → name it + how stale (`updated:`): "งาน *X* ค้างอยู่ — ทำต่อด้วย `/founder-rail:ship` หรือถ้าติดอะไรอยู่เล่ามาได้เลย"
3. `inbox/` has untriaged files (excluding README) → "มีไอเดียค้าง N เรื่อง — `/founder-rail:idea` เพื่อแปลงเป็นแผน"
4. Any feature `planned` → "คิวถัดไปคือ *X* — `/founder-rail:ship` เมื่อพร้อม"
5. Any `done` but constitution has no filled Deployment section → "ของเสร็จแล้วแต่ลูกค้ายังไม่เห็น — `/founder-rail:launch`?"
6. Launched, nothing pending, and `checkups.md` shows no checkup in 30+ days (or doesn't exist) → "เงียบมาพักใหญ่ — `/founder-rail:checkup` ตรวจสุขภาพหน่อยไหม"
7. Otherwise → "ทุกอย่างเรียบร้อย — มีไอเดียใหม่ก็เล่ามาได้เลย"

Format (user's language): one line of "where you are", then exactly **one** suggested step (constitution §6.6) — never a menu. If the user's message alongside this command already reveals an intent (a bug, an idea), skip the tree and route straight there (§6.7).
