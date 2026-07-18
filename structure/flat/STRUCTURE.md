# flat preset

For small apps and demos where it's not yet clear how big the project will grow. Everything lives directly under `src/` — no feature folders, no layered component hierarchy.

```
src/
├── components/        ← all UI
├── lib/                ← utils, helpers
├── <Name>.test.tsx     ← test sits next to the file it tests
└── main.tsx
```

## Rules, in plain language

- Component files are named like the component itself, capitalized (`Button.tsx`, not `button.tsx`).
- Every component has a test file right next to it, named the same way with `.test.tsx` at the end.
- Files stay small — roughly 200 lines. A file that keeps growing is a sign it should be split.

## Guardrails checked by machine

| Rule | Enforced by |
|------|-------------|
| Component filenames are `PascalCase` | `check-file/filename-naming-convention` |
| Test files end in `.test.tsx` and live beside their source file | `check-file/filename-naming-convention` |
| Files capped around 200 lines | ESLint core `max-lines` |

Ridden on the existing `eslint-on-save` hook — no new hook needed.

## Files in this preset

- `scaffold/` — starter templates for one component (`Component.tsx`, `Component.test.tsx`, `index.ts`) — copy and rename when creating a new component
- `eslint.structure.mjs` — merge into the project's `eslint.config.mjs`
- `install.md` — dev dependencies to install
