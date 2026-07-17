# Airbnb-style preset

Based on the public [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript) (and its React guide), adapted for TypeScript with ESLint flat config. Formatting is handled by Prettier; the lint rules focus on correctness and consistency.

## What it catches, in plain language

- Leftover unused code and variables that confuse future readers
- Risky loose comparisons that cause silent bugs (`==` vs `===`)
- Old-style variable declarations and reassignment patterns that lead to surprises
- React mistakes that cause broken re-rendering (missing keys, misused hooks)
- Missing image descriptions and broken links that hurt accessibility
- Debug leftovers (`console.log`) sneaking into real code
- Escape-hatch typing (`any`) that silently turns type safety off

## Flexible-mode downgrades

When the user chose "flexible / MVP" strictness, `setup-standards` downgrades exactly these rules from `error` to `warn` (they are marked `[flexible: warn]` in `eslint.config.mjs`):

- `no-console`
- `@typescript-eslint/no-explicit-any`
- `react/no-array-index-key`

Everything else stays at `error` in both modes — correctness rules are never downgraded.

## Files in this preset

- `eslint.config.mjs` — copy to project root
- `.prettierrc.json` — copy to project root
- `install.md` — dev dependencies to install
