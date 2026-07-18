# Verify: next-fullstack

Setup is not complete until every command below passes. Run from the project root.

```
npm run build
```
Must complete with no errors — confirms the TypeScript project actually compiles.

```
npm test
```
The seeded health test must pass — confirms the unit test runner is genuinely wired (TDD is impossible without this, and the commit hook checks it from day one).

```
npm run test:e2e
```
The smoke E2E must pass — confirms the founder can run end-to-end tests themselves with one command.

```
npm run dev
```
Start it, confirm it boots and serves the home page (fetch `http://localhost:3000` or open it in a browser), then stop the dev server.

```
npx eslint --no-error-on-unmatched-pattern "src/**/*.{ts,tsx}"
```
Must run without configuration errors (run this again after `setup-standards` applies its preset — the two setups are independent but both must pass).

```
npm audit --audit-level=critical
```
Must pass — critical advisories block setup. If it reports *high* (but not critical) findings, do not block: report them to the user in plain language with ⚠️ ("some building blocks this app uses have known weaknesses — not urgent, but worth updating soon") and note them in `constitution.md`'s Secure coding section.

If Prisma was added in step 2 of `recipe.md`:

```
npx prisma validate
```
Confirms `schema.prisma` is syntactically valid before anyone runs a migration against real data.
