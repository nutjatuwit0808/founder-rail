# Media recipe: next-fullstack

The standard way to add "customers/the founder can upload a picture" to a `next-fullstack` project. Locked choice, same spirit as auth/payments: **never hand-roll upload handling** — no storing files as base64/blob in the database, no uploads streamed through the app server, no picking a storage vendor per feature.

## Locked choices

- **Storage: S3-compatible object storage** (AWS S3 or Cloudflare R2, same API shape) — never a host-specific vendor lock-in, so this recipe works identically whether the project deploys to `vercel-fullstack` or `railway-nest`.
- **Upload path: browser → storage directly, via a presigned URL** — the server issues a short-lived upload URL; it never receives the file's bytes itself. Keeps the app server's bandwidth/memory out of the picture and avoids a much larger PCI-style trust surface than a multipart upload through the backend would need.
- **The database stores only the object key/URL** — never the file itself, never base64.
- **Validate type and size before issuing the URL, always** — allowlist `jpg/png/webp`, default max size 8MB. This runs before any presigned URL is handed out, not after upload.
- **Resizing/thumbnails: `next/image` handles it** — no separate resize pipeline in v1; escalate only when a real signal shows up (e.g. needing multiple permanent thumbnail sizes stored).
- **Never ask the founder about the storage provider** — S3-compatible is the agent's decision, same spirit as choosing Stripe for payments or Auth.js for sign-in.

## Install

No SDK dependency required beyond the storage provider's presigning helper (e.g. `@aws-sdk/client-s3` + `@aws-sdk/s3-request-presigner`, which also targets R2's S3-compatible API).

## Wire-up

1. A single server-side storage client (e.g. `src/lib/storage.ts`), instantiated once from env vars — nothing else in the codebase constructs its own client.
2. A Route Handler (e.g. `src/app/api/upload-url/route.ts`) that: checks the caller's authorization, validates the requested file's type and size against the allowlist, then returns a presigned PUT URL and the final object key. Reject before issuing a URL, not after the fact.
3. The client uploads directly to the presigned URL, then tells the server the upload finished (or the server verifies the object exists) before the object key is saved to the database via Prisma like any other data.
4. Env var NAMES into `.env.example`: `STORAGE_BUCKET`, `STORAGE_ACCESS_KEY_ID`, `STORAGE_SECRET_ACCESS_KEY`, `STORAGE_ENDPOINT`, `STORAGE_PUBLIC_URL`. Values: founder's hands only, entered in the host dashboard — same rule as every other secret.
5. Images render via `next/image`, pointed at `STORAGE_PUBLIC_URL` — no custom resize code.

## Definition of done (on top of the normal harness)

- Abuse-case tests from RED phase: a disallowed file type (e.g. `.exe`) is rejected before a presigned URL is issued, an oversized file is rejected the same way, a caller without the right to upload for a given record cannot get a presigned URL for it
- No storage credential ever appears in client-side code or a committed file
- `npm audit` clean at critical level after any new deps
