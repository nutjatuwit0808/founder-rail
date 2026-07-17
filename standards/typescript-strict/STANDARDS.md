# TypeScript-strict preset

Based on the official [typescript-eslint **strict** configuration](https://typescript-eslint.io/users/configs/#strict) — the TypeScript project's own recommended-plus-strict rule set — with React, hooks, and accessibility rules added. Formatting is handled by Prettier; the lint rules focus on correctness and type-safety. This is the highest-rigor preset: it catches more mistakes than Airbnb-style, at the cost of being stricter about types.

## What it catches, in plain language

- Everything the standard correctness rules catch (unused code, risky comparisons, debug leftovers)
- Escape-hatch typing (`any`, unsafe casts) that silently turns type safety off
- Likely-mistaken code: needless conditions, unsafe optional-chaining, confusing overloads
- React mistakes that break re-rendering (missing keys, misused hooks)
- Missing image descriptions and broken links that hurt accessibility

## Flexible-mode downgrades

When the user chose "flexible / MVP" strictness, `setup-standards` downgrades exactly these rules from `error` to `warn` (marked `[flexible: warn]` in `eslint.config.mjs`):

- `no-console`
- `@typescript-eslint/no-explicit-any`

The rest of the strict rule set stays at `error` in both modes — correctness is never downgraded.

## Note on type-checked rules

This preset uses the type-info-free `strict` tier, not `strict-type-checked`. That keeps setup fast and avoids wiring `tsconfig` into the linter. If a project later wants type-aware rules, swap `tseslint.configs.strict` for `tseslint.configs.strictTypeChecked` and add `languageOptions.parserOptions.projectService: true`.

## Files in this preset

- `eslint.config.mjs` — copy to project root
- `.prettierrc.json` — copy to project root
- `install.md` — dev dependencies to install
