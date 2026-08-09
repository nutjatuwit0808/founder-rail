---
name: setup-design
description: Design setup and tuning for projects with a frontend, in two modes sharing one guardrail loop. First-time mode (no tokens file yet, run by /founder-rail:start after setup-standards) asks feeling questions, optionally derives colors from the user's logo/brand image, and generates design tokens. Tune mode (tokens file exists, entered any time via /founder-rail:design) adjusts tokens from plain-language feedback against real screenshots. Never asks a design-vocabulary question in either mode.
---

# Setup Design

## Mode gate

Does the project already have a tokens file (`src/styles/tokens.css` or the path recorded in constitution.md §3)?

- **No** → First-time mode (below).
- **Yes** → jump to **Tune mode**.

`/founder-rail:design` always enters through this gate — the user never has to know which mode they need.

---

# First-time mode

## Step 1 — Confirm a frontend exists

Check for `react` (or `vue`/`svelte`) in package.json dependencies, an `index.html`, or the user saying the project will have a UI. If there is no frontend and none planned, skip with a one-line note that design setup will run automatically when a UI appears.

## Step 2 — Ask the aesthetic direction (feelings, not design terms)

Use AskUserQuestion in the user's language. Describe each option as a feeling:

- **Minimal** — "clean and quiet: lots of space, few colors, feels calm and professional"
- **Bold** — "strong and confident: big headlines, high contrast, feels energetic"
- **Playful** — "friendly and fun: rounded shapes, warm colors, feels approachable"

The direction always gets asked — even in brand mode it decides the layout tokens (radius, shadow, spacing, type scale).

## Step 2b — Brand assets (optional, decides where colors come from)

Ask: "Do you have a **logo or a picture** whose tone the app should match? Send the file — or paste/describe a brand color — or I'll pick colors that fit the feeling you chose."

- **Image given** → read it with the Read tool and identify the 1–2 dominant brand colors by looking (vision-level, not pixel-exact). **Always confirm before use**: render a small swatch (inline HTML/preview) of the exact hex values you read and ask "ใช่สีนี้ไหม" — misreads get corrected here, never downstream in the tokens.
- **Color pasted/described** → use it directly (a description like "เขียวขวดแก้ว" → propose a hex, confirm with a swatch the same way).
- **Nothing** → skip to Step 3 (preset colors).

Never show unconfirmed hex values as decisions and never ask the user to *produce* a hex code themselves.

## Step 3 — Generate tokens (preset colors)

Used when there is no brand color. Create `src/styles/tokens.css` (or the project's equivalent styles location) from the chosen preset:

### Minimal
```css
:root {
  --color-primary: #18181b;   --color-accent: #2563eb;
  --color-surface: #ffffff;   --color-surface-alt: #f4f4f5;
  --color-text: #18181b;      --color-text-muted: #71717a;
  --color-success: #16a34a;   --color-warning: #d97706;  --color-danger: #dc2626;
  --radius: 6px;              --shadow: 0 1px 3px rgb(0 0 0 / 0.08);
  --space-1: 4px; --space-2: 8px; --space-3: 16px; --space-4: 24px; --space-5: 40px; --space-6: 64px;
  --text-sm: 0.833rem; --text-base: 1rem; --text-lg: 1.2rem; --text-xl: 1.44rem; --text-2xl: 1.728rem;
}
```

### Bold
```css
:root {
  --color-primary: #111827;   --color-accent: #f43f5e;
  --color-surface: #ffffff;   --color-surface-alt: #f3f4f6;
  --color-text: #111827;      --color-text-muted: #4b5563;
  --color-success: #15803d;   --color-warning: #b45309;  --color-danger: #b91c1c;
  --radius: 4px;              --shadow: 0 2px 8px rgb(0 0 0 / 0.12);
  --space-1: 4px; --space-2: 8px; --space-3: 12px; --space-4: 20px; --space-5: 32px; --space-6: 56px;
  --text-sm: 0.75rem; --text-base: 1rem; --text-lg: 1.333rem; --text-xl: 1.777rem; --text-2xl: 2.369rem;
}
```

### Playful
```css
:root {
  --color-primary: #7c3aed;   --color-accent: #f59e0b;
  --color-surface: #fffdf9;   --color-surface-alt: #fdf4ff;
  --color-text: #3b0764;      --color-text-muted: #8b5cf6;
  --color-success: #22c55e;   --color-warning: #f59e0b;  --color-danger: #ef4444;
  --radius: 16px;             --shadow: 0 4px 12px rgb(124 58 237 / 0.12);
  --space-1: 4px; --space-2: 8px; --space-3: 16px; --space-4: 24px; --space-5: 40px; --space-6: 64px;
  --text-sm: 0.8rem; --text-base: 1rem; --text-lg: 1.25rem; --text-xl: 1.563rem; --text-2xl: 1.953rem;
}
```

If Tailwind is present, also map these variables into the Tailwind theme (v4 `@theme` block or v3 `tailwind.config` extend) so utility classes use the same tokens.

## Step 3b — Generate tokens (brand-derived)

Used when a brand color was confirmed in Step 2b. **Fixed formula — no ad-hoc taste decisions**, working in HSL from the confirmed brand color:

- `--color-primary` = the confirmed brand color
- `--color-accent` = the second confirmed brand color if there was one; otherwise the brand hue rotated +150°, same saturation band
- `--color-surface` = white · `--color-surface-alt` = brand hue at ~96% lightness, ≤15% saturation
- `--color-text` = brand hue darkened to ≤20% lightness · `--color-text-muted` = brand hue at ~50% lightness, reduced saturation
- `--color-success/warning/danger`, `--radius`, `--shadow`, spacing and type scale: taken from the **feeling preset** chosen in Step 2 (colors come from the brand; the layout character comes from the feeling)

Then run the contrast guardrail (below) before writing the file — brand colors frequently fail it, and the guardrail, not the user, resolves that.

## Step 3.5 — Existing projects: adopt mode

If the project already has styled UI: add the token file without touching existing styles. The tokens rule ("all UI uses tokens") applies to **new and edited** UI; existing hard-coded styles graduate when the screen they belong to is next worked on. Never propose a restyle-everything pass.

## Step 4 — Record

Fill constitution.md section 3 (Design): chosen direction + the user's answers, brand color if any, token file path, and the binding rule: **all UI code must use tokens — no hard-coded colors, sizes, or radii**. Note that `verify-visually` checks screenshots against these tokens, and that later adjustments happen via `/founder-rail:design` (never by hand-editing values into components).

## Step 5 — Preview & report

Render a small sample (button + card + a paragraph of text using the tokens; a throwaway HTML file screenshotted with Playwright works) and show it. When run as part of `/founder-rail:start`'s combined onboarding, this preview was already covered by `start.md`'s single combined approval before Step 4 wrote the tokens — just show the render and report, no separate confirm question here. When run standalone (via `/founder-rail:design` on a project with no tokens file yet, outside `/start`), ask directly: "หน้าตาแนวนี้ — ใช่ feeling ที่อยากได้ไหม?" Adjust on request (through the same guardrail), then report in plain language.

---

# Tune mode

Entered whenever a tokens file already exists (usually via `/founder-rail:design`). This is a conversation loop, not a wizard.

## The loop

1. **Show reality first.** Boot the app and screenshot 2–3 real pages (same mechanism as `verify-visually` — throwaway Playwright script, both viewport 1280×800 and 390×844 always, unless the page is marked internal/desktop-only in its SPEC.md). Never tune against imagined UI.
2. **Listen.** The user points in plain words: "โทนอ่อนกว่านี้", "ปุ่มดูแข็งไป", "ตัวหนังสือเล็ก อ่านยากบนมือถือ". Translate each remark into **token value changes only** — hue/lightness shifts, radius, spacing, type scale. Touching component code in tune mode is forbidden; that discipline is exactly what keeps the whole app consistent from one edit.
3. **Direction-drift check.** If a request (or the accumulated session) effectively amounts to a different direction — e.g. a Minimal app asked round-by-round into big radii, saturated palette, playful shadows — do not silently comply. Say it plainly: "ที่ขอมาแนว ๆ นี้ มันคือการเปลี่ยนโทนทั้งชุดจากเรียบนิ่งเป็นสนุกสดใส — เอาแบบนั้นเลยไหม?" If yes, rerun First-time Steps 2→3/3b as a deliberate re-theme (keeping the brand color unless told otherwise) and record it as a direction change. If no, scope the tweak back to what fits the current direction.

   **Out-of-scope requests.** If the request needs a structural/component change, not a token value — moving a button's position, changing what's on a page, adding/removing an element — say so plainly: this is a feature change, not a design tune ("นี่คือการเปลี่ยนฟีเจอร์ ไม่ใช่การจูนดีไซน์"), and route to `/founder-rail:idea`. Never bend the "token values only" rule to accommodate it.
4. **Contrast guardrail** (below) on every iteration — no exceptions for "just a small tweak".
5. **Re-render** the same pages, show before/after, ask if it's right. Loop to 2, or finish.

## Finishing

- Write the final values to the tokens file (and the Tailwind theme mapping if present).
- Append to **`design/DECISIONS.md`** in the user's project (create the folder/file on first tune): date, what the user asked in their own words, what changed in plain language, and whether it was a tweak or a direction change. Append-only, like every DECISIONS log. Design decisions are project-wide, so they never go into a feature's DECISIONS.md.
- Report: what changed, in the user's language, with the final screenshots. No test/review cycle is required — tune mode may only ever change token *values*, which is why the no-component-edits rule above is absolute (anything needing a component change is a feature change → `/founder-rail:idea`).

---

# Contrast guardrail (both modes — blocking, not advisory)

Before any token write, verify WCAG AA contrast ratios (compute relative luminance per WCAG 2.x; ratio = (L1+0.05)/(L2+0.05)):

| Pair | Minimum |
|------|---------|
| `--color-text` on `--color-surface` | 4.5:1 |
| `--color-text-muted` on `--color-surface` | 4.5:1 |
| White text on `--color-primary` (button face) | 4.5:1 |
| `--color-accent` on `--color-surface` (links/highlights) | 3:1 |

On failure: **do not ask the user to accept it** — adjust the failing color's lightness (keep the hue) until the pair passes, then explain in plain language with a before/after swatch: "สีเดิมของคุณสวยแต่ตัวหนังสือจะอ่านยาก ผมขยับให้เข้มขึ้นนิดเดียว — เทียบกันดูได้เลย". Readability is not a taste preference the user can trade away, because their customers are the ones who pay for it. This is a fixed arithmetic check (zero-false-positive class), which is why it may block.
