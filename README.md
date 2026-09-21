# Collab Tracker

A personal dashboard for tracking brand collaborations — active deals, past collabs, payments, and deadlines — built for a food influencer's own use.

## Features

- Collabs list with brand name, collab type (Barter/Paid), expected deliverables (reels/stories/posts), due date, payment received, POC, description (expandable), online/offline mode + visiting date, and platform.
- Tick "Done" to complete a collab — it moves out of the Active list into Past Collabs.
- Search by brand, filter by type/mode, sort by due date, visiting date, or brand name.
- Dashboard with total earned, active/completed counts, a collabs+earnings trend chart, and a barter-vs-paid split.
- Single shared-password login (no multi-user accounts).

## Tech stack

- **Next.js 15** (App Router) + TypeScript + Tailwind CSS v4
- **Supabase** (Postgres) as the production database — accessed only from server-side API routes with the service role key, so the database is never exposed to the browser
- **Recharts** for charts, **lucide-react** for icons
- Deploy target: **Vercel**

## Running locally

```bash
npm install
npm run dev
```

Without any Supabase env vars set, the app automatically falls back to a local JSON file store at `.data/collabs.json` (gitignored) — this is only for local development/testing, never used in production.

You'll always need these two env vars locally too (put them in a `.env.local` file — see `env.sample.txt` for the full list):

```
APP_PASSWORD=pick-a-password
SESSION_SECRET=some-long-random-string
```

## Setting up the real database (Supabase)

1. Create a free account/project at [supabase.com](https://supabase.com).
2. Open the SQL editor and run everything in [`supabase/schema.sql`](supabase/schema.sql).
3. Go to Project Settings → API and copy the **Project URL** and the **service_role** key (not the anon key).
4. Add them as `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.

The service role key bypasses Row Level Security, which is intentional here — only your server-side code (never the browser) uses it, so keep it out of version control.

## Deploying to Vercel

1. Push this project to a GitHub repo.
2. Import the repo in [vercel.com](https://vercel.com) (free tier is enough).
3. In the project's Environment Variables settings, add:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `APP_PASSWORD`
   - `SESSION_SECRET`
   - `NEXT_PUBLIC_CURRENCY_SYMBOL` (optional, defaults to ₹)
4. Deploy. Your tracker will be live at the Vercel URL, protected by your password.

## Notes

- This is designed for one person (you) — there's a single shared password, not per-user accounts.
- All money fields are treated as ₹ by default; change `NEXT_PUBLIC_CURRENCY_SYMBOL` if needed.
