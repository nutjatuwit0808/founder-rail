// founder-rail security baseline — merged into every project's eslint.config.mjs
// by setup-standards, regardless of which standards preset was chosen.
//
// POLICY: only rules that are essentially never wrong may live here. The end
// user cannot read code, so a false positive from a blocking rule looks like
// the system is broken. Heuristic rules (e.g. eslint-plugin-security's
// detect-object-injection) are deliberately excluded — judgment calls belong
// to fresh-reviewer, not to a blocking hook.
//
// react/no-danger is NOT declared here (this file must also work for the
// standard-style preset, which does not expose the `react` plugin key);
// setup-standards appends it to the standards preset's own rules block when
// that preset ships eslint-plugin-react (airbnb-style, typescript-strict).
import noUnsanitized from 'eslint-plugin-no-unsanitized';

export default [
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: { 'no-unsanitized': noUnsanitized },
    rules: {
      // Running strings as code — never legitimate in app code
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      // Raw HTML injection sinks (innerHTML, outerHTML, insertAdjacentHTML,
      // document.write) fed from variables without sanitizing
      'no-unsanitized/method': 'error',
      'no-unsanitized/property': 'error',
    },
  },
];
