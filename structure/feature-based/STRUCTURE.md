# feature-based preset (default)

For projects meant to grow into several features or pages. Mirrors `features/<slug>/` — the markdown knowledge and the code use the same feature name.

```
src/
├── features/<slug>/
│   ├── components/
│   ├── <slug>.logic.ts
│   ├── <slug>.test.tsx    ← test sits next to the file it tests
│   └── index.ts           ← the feature's only entry point
├── shared/                 ← ui/utils used by more than one feature
└── app/                    ← wires features together (routing, layout)
```

## Rules, in plain language

- Each feature's code lives in one folder, named exactly like its `features/<slug>/` markdown counterpart.
- A feature never reaches directly into another feature's files — if two features need to share something, that something moves to `shared/`.
- Other code can only use a feature through its `index.ts` — never by importing a file from inside the feature folder directly.
- Every source file has a test right next to it.

## Guardrails checked by machine (import boundaries)

| Rule | Enforced by |
|------|-------------|
| `features/*` cannot import from another `features/*` | `boundaries/element-types` |
| `shared/` cannot import from `features/` or `app/` | `boundaries/element-types` |
| Cross-feature imports must go through `index.ts`, not a deep file path | `boundaries/element-types` |
| Component filenames are `PascalCase`, feature/logic files are `camelCase` | `check-file/filename-naming-convention` |

Ridden on the existing `eslint-on-save` hook — no new hook needed.

## Public references

Based on [Feature-Sliced Design](https://feature-sliced.design/) and [bulletproof-react](https://github.com/alan2207/bulletproof-react), simplified to what a single-developer MVP needs.

## Files in this preset

- `scaffold/` — starter templates for one component (`Component.tsx`, `Component.test.tsx`, `index.ts`)
- `eslint.structure.mjs` — merge into the project's `eslint.config.mjs`
- `install.md` — dev dependencies to install
