// founder-rail preset: Airbnb-style rules adapted for TypeScript + React (ESLint flat config).
// Strictness mapping lives in STANDARDS.md — "flexible" mode downgrades the rules
// marked [flexible: warn] below from "error" to "warn".
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
  { ignores: ['dist/**', 'build/**', 'coverage/**', 'node_modules/**'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: { react, 'react-hooks': reactHooks, 'jsx-a11y': jsxA11y },
    settings: { react: { version: 'detect' } },
    rules: {
      // Airbnb signature rules
      'prefer-const': 'error',
      'no-var': 'error',
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      'no-param-reassign': ['error', { props: true }],
      'prefer-template': 'error',
      'object-shorthand': ['error', 'always'],
      'no-else-return': ['error', { allowElseIf: false }],
      'no-nested-ternary': 'error',
      'no-console': 'error', // [flexible: warn]
      'no-unused-expressions': 'error',
      // TypeScript
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'error', // [flexible: warn]
      '@typescript-eslint/consistent-type-imports': 'error',
      // React
      'react/jsx-key': 'error',
      'react/self-closing-comp': 'error',
      'react/jsx-boolean-value': ['error', 'never'],
      'react/no-array-index-key': 'error', // [flexible: warn]
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      // Accessibility
      'jsx-a11y/alt-text': 'error',
      'jsx-a11y/anchor-is-valid': 'error',
    },
  },
  prettier,
);
