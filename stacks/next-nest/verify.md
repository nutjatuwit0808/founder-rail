# Verify: next-nest

Setup is not complete until every command below passes. Run from the project root unless noted.

```
pnpm install
```
Must resolve the workspace with no errors — confirms `pnpm-workspace.yaml` and the three packages are wired correctly.

```
pnpm --filter ./apps/web build
pnpm --filter ./apps/api build
```
Both apps must compile with no errors.

```
pnpm --filter ./apps/web test
pnpm --filter ./apps/api test
```
Both seeded tests must pass — confirms the test runners are genuinely wired in each app.

```
pnpm test:e2e
```
The smoke E2E must pass — confirms the founder can run end-to-end tests themselves with one command.

```
pnpm --filter ./apps/web dev
```
Boots and serves the home page (fetch `http://localhost:3000` or open it in a browser); stop it after confirming.

```
pnpm --filter ./apps/api start:dev
```
Boots and responds on its port (the NestJS default landing route or a health check); stop it after confirming.

```
npx eslint --no-error-on-unmatched-pattern "apps/web/src/**/*.{ts,tsx}" "apps/api/src/**/*.ts"
```
Must run without configuration errors (re-run after `setup-standards` applies its preset to both apps).

```
pnpm audit --audit-level critical
```
Must pass — critical advisories block setup. If it reports *high* (but not critical) findings, do not block: report them to the user in plain language with ⚠️ ("some building blocks this app uses have known weaknesses — not urgent, but worth updating soon") and note them in `constitution.md`'s Secure coding section.

If Prisma was added in `apps/api`:

```
cd apps/api && npx prisma validate
```
Confirms `schema.prisma` is syntactically valid before anyone runs a migration against real data.
