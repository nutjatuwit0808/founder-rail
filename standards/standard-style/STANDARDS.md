# Standard-style preset

Based on the public [JavaScript Standard Style](https://standardjs.com/) via [neostandard](https://github.com/neostandard/neostandard) — the maintained, ESLint 9 flat-config edition of Standard. It bundles TypeScript and React/JSX support and, unlike the other presets, **formats the code itself** (through `eslint --fix`), so this preset ships no Prettier config. Standard's philosophy is "no configuration decisions" — one consistent style, applied automatically.

## What it catches, in plain language

- One single code style, applied automatically on save — no formatting arguments, ever
- Leftover unused code and variables
- Risky loose comparisons that cause silent bugs (`==` vs `===`)
- Unreachable or obviously broken code paths
- Broken promise handling that swallows errors
- React mistakes that break re-rendering (missing keys, misused hooks)
- Debug leftovers (`console.log`) sneaking into real code

## Flexible-mode downgrades

When the user chose "flexible / MVP" strictness, `setup-standards` downgrades exactly these rules from `error` to `warn` (marked `[flexible: warn]` in `eslint.config.mjs`):

- `no-console`

Standard's own rules are deliberately not tuned per-project — everything else stays as Standard ships it.

## Files in this preset

- `eslint.config.mjs` — copy to project root
- `install.md` — dev dependencies to install

(No `.prettierrc.json`: this preset formats via ESLint, not Prettier.)
