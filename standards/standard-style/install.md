# Dev dependencies for the standard-style preset

`neostandard` bundles the plugins it needs; TypeScript must be present for `ts: true` parsing.
Install with the project's package manager (default npm):

```
npm install -D eslint neostandard typescript
```

This preset formats via ESLint — do **not** install Prettier for it.

Then verify the setup actually works before declaring it done:

```
npx eslint --no-error-on-unmatched-pattern "src/**/*.{ts,tsx}"
```

A configuration error here means setup is NOT complete — fix it first.
