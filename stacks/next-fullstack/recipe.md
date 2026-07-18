# Scaffold: next-fullstack

## 1. Create the app

```
npx create-next-app@latest . --typescript --app --src-dir --import-alias "@/*" --eslint --use-npm --yes
```

Run inside the target project directory (`.`). If the directory already has files (e.g. `constitution.md`, `inbox/`), `create-next-app` will ask to continue in a non-empty directory — confirm.

Flags used: `--typescript` (TS project), `--app` (App Router), `--src-dir`, `--import-alias "@/*"`, `--eslint` (scaffolds a starter config; `setup-standards` overwrites it with the chosen preset), `--use-npm` (default package manager), `--yes` (no interactive prompts). Re-check `npx create-next-app@latest --help` before relying on these — Next.js changes CLI flags across major versions.

## 2. If the user's answers called for login or storing data

Add Postgres + Prisma ⚠️ *this touches real infrastructure — flag it and get approval before running, per constitution.md §5 (plan-then-approve).*

```
npm install prisma @prisma/client
npx prisma init
```

Wire the generated `DATABASE_URL` to whatever Postgres instance the user has (or ask them, in plain language, how they want to host it — that is a business/outcome question, not a technical one: "where should the app's data live — a hosting provider you already use, or should I suggest a free option to start?").

## 3. Backend logic

Lives inside the Next.js app itself — App Router route handlers (`src/app/api/**/route.ts`) or server actions. No separate backend process.
