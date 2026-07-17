# Dev dependencies for the typescript-strict preset

Install with the project's package manager (default npm):

```
npm install -D eslint @eslint/js typescript-eslint eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-jsx-a11y eslint-config-prettier prettier typescript
```

Then verify the setup actually works before declaring it done:

```
npx eslint --no-error-on-unmatched-pattern "src/**/*.{ts,tsx}"
```

A configuration error here means setup is NOT complete — fix it first.
