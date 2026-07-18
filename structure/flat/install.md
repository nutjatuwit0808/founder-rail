# Dev dependencies for the flat structure preset

```
npm install -D eslint-plugin-check-file
```

Then verify the setup actually works before declaring it done:

```
npx eslint --no-error-on-unmatched-pattern "src/**/*.{ts,tsx}"
```

A configuration error here means setup is NOT complete — fix it first. If `eslint-plugin-check-file`'s API has changed since this preset was written, adjust `eslint.structure.mjs` to match the installed version, then re-verify.
