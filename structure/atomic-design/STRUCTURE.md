# atomic-design preset

For projects with heavy, component-heavy UI work — lots of reusable pieces that combine into bigger ones. Organizes components by how small/composed they are, from [Atomic Design](https://atomicdesign.bradfrost.com/).

```
src/
├── components/
│   ├── atoms/         ← smallest building blocks (Button, Input, Icon)
│   ├── molecules/      ← small groups of atoms (SearchBar, FormField)
│   ├── organisms/      ← larger sections built from molecules (Header, ProductCard)
│   └── templates/       ← page layouts made of organisms, no real content
├── pages/                ← templates filled with real content/data
├── shared/                ← utils, hooks, non-visual helpers
└── app/                    ← routing, app shell
```

## Rules, in plain language

- A component can only be built from pieces at its level or smaller: molecules can use atoms, organisms can use molecules and atoms, and so on. A small piece never depends on a bigger one.
- Every component has a test right next to it.
- Component filenames are capitalized to match the component.

## Guardrails checked by machine (import boundaries)

| Rule | Enforced by |
|------|-------------|
| `atoms` cannot import `molecules`/`organisms`/`templates`/`pages` | `boundaries/element-types` |
| `molecules` cannot import `organisms`/`templates`/`pages` | `boundaries/element-types` |
| `organisms` cannot import `templates`/`pages` | `boundaries/element-types` |
| `templates` cannot import `pages` | `boundaries/element-types` |
| Component filenames are `PascalCase` | `check-file/filename-naming-convention` |

Ridden on the existing `eslint-on-save` hook — no new hook needed.

## When to choose this over feature-based

Pick this when the product is mostly a design system / heavy UI surface (many reusable visual components, few distinct data-driven features). Pick `feature-based` when the product is mostly distinct features with moderate UI. The two are not combined in v1.

## Files in this preset

- `scaffold/` — starter templates for one component (`Component.tsx`, `Component.test.tsx`, `index.ts`)
- `eslint.structure.mjs` — merge into the project's `eslint.config.mjs`
- `install.md` — dev dependencies to install
