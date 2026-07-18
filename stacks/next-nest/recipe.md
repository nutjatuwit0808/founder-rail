# Scaffold: next-nest

## 1. Workspace root

```
mkdir -p apps packages/types
```

`pnpm-workspace.yaml` at the project root:

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

Root `package.json` needs at least `{ "private": true, "workspaces": ["apps/*", "packages/*"] }`-equivalent (pnpm reads `pnpm-workspace.yaml`, but keep a root `package.json` so tooling that expects one still works).

## 2. Frontend — `apps/web`

```
npx create-next-app@latest apps/web --typescript --app --src-dir --import-alias "@/*" --eslint --use-npm --yes
```

Same flags as `next-fullstack` (see that preset's `recipe.md` for flag meanings). `apps/web` calls the API over HTTP — it never imports Prisma or touches a database.

## 3. Backend — `apps/api`

```
pnpm dlx @nestjs/cli new api --directory apps/api --package-manager pnpm --skip-git --strict
```

`--skip-git` (this is a sub-directory of a monorepo, not its own repo), `--package-manager pnpm` (match the workspace), `--strict` (TypeScript strict mode — matches founder-rail's bias toward catching mistakes early). Re-check `pnpm dlx @nestjs/cli new --help` before relying on these — flags can change across `@nestjs/cli` versions.

Add Prisma inside `apps/api` only ⚠️ *touches real infrastructure — flag it and get approval before running, per constitution.md §6:*

```
cd apps/api && pnpm add prisma @prisma/client && pnpm dlx prisma init
```

## 4. Shared types — `packages/types`

A minimal TypeScript package (`package.json` + `src/index.ts` + `tsconfig.json`) that both `apps/web` and `apps/api` depend on via the workspace protocol (`"@founder-rail/types": "workspace:*"` — rename to match the project). Put request/response shapes here so frontend and backend can't drift silently.

## 5. Health routes (always, at scaffold time)

- `apps/api`: a `GET /health` controller returning 200 with `{ status: "ok", time: <ISO timestamp> }`.
- `apps/web`: `src/app/api/health/route.ts` same shape.

Deploy verification and `/founder-rail:checkup` ping these — they must exist before the first launch, so create them now.

## 6. Test runners (always, at scaffold time — TDD does not work without them)

- `apps/api`: `nest new` already ships Jest with a passing seed spec — keep it; `pnpm --filter ./apps/api test` must work.
- `apps/web`: same Vitest + Testing Library + Playwright setup as `../next-fullstack/recipe.md` §5 (run the installs inside `apps/web`), with one difference: the Playwright `webServer.command` must boot **both** apps (the root `dev` script) so E2E exercises web talking to api.
- Seed honest tests: the health-payload unit test in `apps/web`, and an `e2e/smoke.spec.ts` that loads `/` — plus, once the api is reachable, an E2E asserting a page that calls the api renders real data.
- **The E2E layer is for the founder**: `pnpm test:e2e` (root script) any time; spec titles read as user scenarios, never technical descriptions.

## 7. Root scripts

Add root `package.json` scripts that fan out to both apps, e.g. `"dev": "pnpm --parallel --filter ./apps/* dev"`, `"build": "pnpm --filter ./apps/* build"`, `"test": "pnpm --filter ./apps/* test"`, `"test:e2e": "pnpm --filter ./apps/web test:e2e"` — adjust to whatever pnpm version is installed supports.
