---
name: setup-design
description: One-time design/theme setup for projects with a frontend. Use after setup-standards when the project has or will have a UI, or when the user asks about look and feel. Asks only aesthetic-outcome questions, generates real design tokens (CSS variables, plus Tailwind wiring if present), and records the result in constitution.md.
---

# Setup Design

## Step 1 — Confirm a frontend exists

Check for `react` (or `vue`/`svelte`) in package.json dependencies, an `index.html`, or the user saying the project will have a UI. If there is no frontend and none planned, skip with a one-line note that design setup will run automatically when a UI appears.

## Step 2 — Ask the aesthetic direction (one question, feelings not design terms)

Use AskUserQuestion in the user's language. Describe each option as a feeling:

- **Minimal** — "clean and quiet: lots of space, few colors, feels calm and professional"
- **Bold** — "strong and confident: big headlines, high contrast, feels energetic"
- **Playful** — "friendly and fun: rounded shapes, warm colors, feels approachable"

Optional single follow-up: "Do you already have a brand color? Paste or describe it — or I'll pick one that fits." Never ask about fonts, frameworks, or CSS.

## Step 3 — Generate tokens

Create `src/styles/tokens.css` (or the project's equivalent styles location). Use the chosen preset below; substitute the brand color into `--color-primary` if given.

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

## Step 3.5 — Existing projects: adopt mode

If the project already has styled UI: add the token file without touching existing styles. The tokens rule ("all UI uses tokens") applies to **new and edited** UI; existing hard-coded styles graduate when the screen they belong to is next worked on. Never propose a restyle-everything pass.

## Step 4 — Record in constitution.md

Fill section 3 (Design): chosen direction + the user's answer, token file path, and the binding rule: **all UI code must use tokens — no hard-coded colors, sizes, or radii**. Note that `verify-visually` checks screenshots against these tokens.

## Step 5 — Report

Plain-language summary in the user's language. Optionally render one small sample (a button + card snippet) so the user can confirm the direction *feels* right — adjust the primary color on request, nothing else needs re-deciding.
