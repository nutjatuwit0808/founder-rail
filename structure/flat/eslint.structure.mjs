// founder-rail structure preset: flat
// Merge this into the project's eslint.config.mjs (spread its default export
// into the config array alongside the chosen standards preset).
import checkFile from 'eslint-plugin-check-file';

export default [
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: { 'check-file': checkFile },
    rules: {
      'max-lines': ['warn', { max: 200, skipBlankLines: true, skipComments: true }],
      'check-file/filename-naming-convention': [
        'error',
        {
          'src/components/**/*.{tsx}': 'PASCAL_CASE',
          'src/lib/**/*.{ts}': 'CAMEL_CASE',
        },
        { ignoreMiddleExtensions: true },
      ],
    },
  },
];
