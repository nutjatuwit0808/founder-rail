# Security baseline

Applied to **every** project automatically by `setup-standards` — security is not a preset the user chooses, because "no security" is not an acceptable option. The user is never asked a question about it.

## Design rule: block only what is certain

The end user cannot read code, so a false alarm from a blocking rule is indistinguishable from a real one — it just looks like the system is broken. Therefore:

- **Blocking (hooks / ESLint `error`)**: only rules that are wrong essentially 100% of the time they fire. No heuristic pattern-matching rules (e.g. `eslint-plugin-security`'s object-injection detection is deliberately NOT used — it flags ordinary safe code constantly).
- **Judgment calls**: handled by `fresh-reviewer` (concrete, demonstrable issues only) and by the constitution's plain-language rules that the `implementer` follows while writing.

## What the machine blocks (high-precision only)

| Rule | Why it's safe to block on |
|------|---------------------------|
| `no-eval`, `no-implied-eval`, `no-new-func` | Running strings as code is never needed in app code; any hit is real |
| `no-unsanitized/method`, `no-unsanitized/property` | Writing raw HTML from variables (`innerHTML` etc.) without sanitizing — the rule understands safe patterns and stays quiet on them |
| `react/no-danger` (added only when the standards preset ships the `react` ESLint plugin — airbnb-style, typescript-strict) | `dangerouslySetInnerHTML` is named dangerous for a reason; legitimate uses are rare and deliberate |
| Writing `.env`-style files with real values (extended `secret-scan.sh` hook) | Secret files must never be created by the agent as tracked content; `.env.example` with placeholders stays allowed |
| Secrets in code (`secret-scan.sh`, pre-existing) | Pattern-matches real key formats, skips placeholders |
| `npm audit` at critical level (stack `verify.md` + `implement-tdd` Phase 6) | Critical advisories are vetted upstream; near-zero false positives. High-level advisories are *reported* in plain language with ⚠️, not blocked — they are sometimes unfixable transitive noise |

## What the reviewer judges instead (never auto-blocked)

Written into `constitution.md` "Secure coding" section; checked by `fresh-reviewer`:

- Input from users validated at the boundary before use
- Database access only through Prisma — no SQL built by string concatenation
- Every endpoint touching personal data checks *whose* data is being asked for, not just "is someone logged in"
- API responses contain only the fields the feature needs — never whole DB objects
- Passwords/tokens never appear in logs

## Files in this preset

- `eslint.security.mjs` — merged into the project's `eslint.config.mjs` by `setup-standards`
- `install.md` — dev dependencies to install
