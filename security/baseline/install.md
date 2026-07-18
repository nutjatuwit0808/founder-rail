# Dev dependencies for the security baseline

Installed by `setup-standards` alongside the standards preset's own dependencies:

```
npm install -D eslint-plugin-no-unsanitized
```

Then verify the merged config actually runs before declaring it done:

```
npx eslint --no-error-on-unmatched-pattern "src/**/*.{ts,tsx}"
```

A configuration error here means setup is NOT complete — fix it first.
