# Media recipe: next-nest

Same locked choices as `../next-fullstack/media.md` (S3-compatible storage, presigned browser→storage upload, DB stores only the object key, validate type/size before issuing a URL, `next/image` for resize) — mapped to the monorepo shape: **the presigned-URL endpoint lives in `apps/api`**, same as every other REST endpoint. `apps/web` never holds storage credentials or talks to the storage provider directly.

## Locked choice: presigned-URL issuance in `apps/api`

- `apps/api` exposes exactly **one** upload-URL endpoint (mirrors the one central auth guard / one Stripe webhook controller pattern) — checks the caller's authorization, validates type/size against the allowlist, then returns a presigned PUT URL and object key.
- `STORAGE_ACCESS_KEY_ID`/`STORAGE_SECRET_ACCESS_KEY` live only in `apps/api`'s env — `apps/web` never holds them. `STORAGE_PUBLIC_URL` (safe to expose, used for rendering) can live in both.
- `apps/web`'s client uploads directly to the storage provider using the URL `apps/api` handed back — never proxied through either app server.

## Wire-up order

1. Api side: a NestJS controller/service issuing presigned URLs, following `../next-fullstack/media.md` steps 2–4 as NestJS equivalents.
2. Web side: a client component that calls `apps/api` for a presigned URL, then uploads directly to storage, then confirms completion back to `apps/api` so the object key gets saved via Prisma (in `apps/api`'s schema).
3. E2E must cross the boundary: request an upload URL from api → upload to storage → api records the key → web renders the image via `next/image`.

## Definition of done

Everything in `../next-fullstack/media.md`, plus: no storage secret key ever appears in `apps/web`'s code or env files, and `apps/web` has no path that talks to the storage provider's management API directly (only the presigned upload URL itself).
