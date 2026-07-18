// founder-rail structure preset: atomic-design
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
        { type: 'atom', pattern: 'src/components/atoms/*', mode: 'file' },
        { type: 'molecule', pattern: 'src/components/molecules/*', mode: 'file' },
        { type: 'organism', pattern: 'src/components/organisms/*', mode: 'file' },
        { type: 'template', pattern: 'src/components/templates/*', mode: 'file' },
        { type: 'page', pattern: 'src/pages/*', mode: 'file' },
      ],
    },
    rules: {
      'boundaries/element-types': [
        'error',
        {
          default: 'disallow',
          rules: [
            { from: 'atom', allow: ['atom'] },
            { from: 'molecule', allow: ['atom', 'molecule'] },
            { from: 'organism', allow: ['atom', 'molecule', 'organism'] },
            { from: 'template', allow: ['atom', 'molecule', 'organism', 'template'] },
            { from: 'page', allow: ['atom', 'molecule', 'organism', 'template', 'page'] },
          ],
        },
      ],
      'check-file/filename-naming-convention': [
        'error',
        { 'src/components/**/*.tsx': 'PASCAL_CASE', 'src/pages/**/*.tsx': 'PASCAL_CASE' },
        { ignoreMiddleExtensions: true },
      ],
    },
  },
];
