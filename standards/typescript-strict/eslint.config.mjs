// founder-rail preset: the official typescript-eslint "strict" config (ESLint 9 flat config),
// plus React, hooks, and accessibility rules. Formatting is handled by Prettier; these rules
// focus on correctness and type-safety. "strict" is the type-info-free strict tier — it does
// not require wiring tsconfig into the linter, so setup stays fast and reliable.
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
  { ignores: ['dist/**', 'build/**', 'coverage/**', 'node_modules/**'] },
  js.configs.recommended,
  ...tseslint.configs.strict,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: { react, 'react-hooks': reactHooks, 'jsx-a11y': jsxA11y },
    settings: { react: { version: 'detect' } },
    rules: {
      // React
      'react/jsx-key': 'error',
      'react/self-closing-comp': 'error',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      // Accessibility
      'jsx-a11y/alt-text': 'error',
      'jsx-a11y/anchor-is-valid': 'error',
      // founder-rail signature (strict already errors no-explicit-any; kept here so
      // flexible mode can relax it alongside no-console)
      'no-console': 'error', // [flexible: warn]
      '@typescript-eslint/no-explicit-any': 'error', // [flexible: warn]
    },
  },
  prettier,
);
