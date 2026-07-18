// founder-rail structure preset: feature-based
// Merge this into the project's eslint.config.mjs (spread its default export
// into the config array alongside the chosen standards preset).
import boundaries from 'eslint-plugin-boundaries';
import checkFile from 'eslint-plugin-check-file';

export default [
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: { boundaries, 'check-file': checkFile },
    settings: {
      'boundaries/elements': [
        { type: 'feature', pattern: 'src/features/*', mode: 'folder' },
        { type: 'shared', pattern: 'src/shared/*' },
        { type: 'app', pattern: 'src/app/*' },
      ],
    },
    rules: {
      'boundaries/element-types': [
        'error',
        {
          default: 'disallow',
          rules: [
            { from: 'feature', allow: ['shared'] },
            { from: 'app', allow: ['feature', 'shared'] },
            { from: 'shared', allow: ['shared'] },
          ],
        },
      ],
      'boundaries/entry-point': [
        'error',
        { default: 'disallow', rules: [{ target: 'feature', allow: 'index.ts' }] },
      ],
      'check-file/filename-naming-convention': [
        'error',
        {
          'src/features/*/components/**/*.tsx': 'PASCAL_CASE',
          'src/features/**/*.{ts}': 'CAMEL_CASE',
        },
        { ignoreMiddleExtensions: true },
      ],
    },
  },
];
