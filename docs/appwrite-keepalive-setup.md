# Appwrite Keepalive Setup

This project includes a production-safe keepalive endpoint at `/api/cron/appwrite-keepalive` and a GitHub Actions scheduler at `.github/workflows/appwrite-keepalive.yml`.

## 1) Deployment Environment Variables (hosting platform)

Set these in your deployed environment (for example Vercel, Railway, Render):

- `APPWRITE_ENDPOINT` (or `NEXT_PUBLIC_APPWRITE_ENDPOINT` fallback)
- `APPWRITE_PROJECT_ID` (or `NEXT_PUBLIC_APPWRITE_PROJECT_ID` fallback)
- `APPWRITE_DATABASE_ID` (or `NEXT_PUBLIC_DATABASE_ID` fallback)
- `APPWRITE_API_KEY` (server-only; never expose in client code)
- `REQUIRE_CRON_SECRET=false` (default open mode)
- `CRON_SECRET` (required only when `REQUIRE_CRON_SECRET=true`)

## 2) GitHub Actions Secrets and Variables (scheduler)

GitHub Actions does not read local `.env` files. Configure repository-level Secrets/Variables.

URL resolution order in the workflow:

1. `workflow_dispatch` input `keepalive_url`
2. Secret `KEEPALIVE_URL`
3. Variable `KEEPALIVE_URL`
4. Secret `NEXTAUTH_URL`
5. Variable `NEXTAUTH_URL`

Recommended:

- Set `KEEPALIVE_URL` to your production base URL or full keepalive endpoint URL.
- If endpoint protection is enabled, set secret `CRON_SECRET` in GitHub.

Behavior notes:

- If URL already ends with `/api/cron/appwrite-keepalive`, it is used as-is.
- Otherwise, the workflow appends `/api/cron/appwrite-keepalive`.
- If URL resolves from `NEXTAUTH_URL` and appears to be localhost, the workflow emits a warning.
- The workflow only sends Authorization when secret `CRON_SECRET` exists.

## 3) Endpoint Authorization Modes

Open mode (default):

- `REQUIRE_CRON_SECRET=false`
- Endpoint allows requests without Authorization header.

Protected mode:

- `REQUIRE_CRON_SECRET=true`
- Requires `Authorization: Bearer <CRON_SECRET>`
- If `CRON_SECRET` is missing while protection is enabled, endpoint returns 401.
