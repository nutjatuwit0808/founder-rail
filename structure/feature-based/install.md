# Dev dependencies for the feature-based structure preset

```
npm install -D eslint-plugin-boundaries eslint-plugin-check-file
```

Then verify the setup actually works before declaring it done:

```
npx eslint --no-error-on-unmatched-pattern "src/**/*.{ts,tsx}"
```

A configuration error here means setup is NOT complete — fix it first. `eslint-plugin-boundaries` rule names/options have changed across major versions; if `boundaries/element-types` or `boundaries/entry-point` error out as unknown options, check the installed version's docs and adjust `eslint.structure.mjs` to match, then re-verify.
