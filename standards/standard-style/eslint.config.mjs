// founder-rail preset: JavaScript Standard Style via neostandard (ESLint 9 flat config).
// neostandard bundles every plugin it needs (TypeScript, React/JSX, @stylistic, promise, n,
// import-x) and fixes formatting through `eslint --fix` — so this preset ships NO Prettier;
// the eslint-on-save hook formats it. Standard is intentionally not configurable, so the only
// founder-rail addition is the debug-leftover guard, which "flexible" mode downgrades.
import neostandard from 'neostandard';

export default [
  { ignores: ['dist/**', 'build/**', 'coverage/**', 'node_modules/**'] },
  ...neostandard({ ts: true }),
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    rules: {
      'no-console': 'error', // [flexible: warn]
    },
  },
];
