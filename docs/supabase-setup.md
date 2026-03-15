# Supabase Setup From Scratch

This project now includes the Supabase foundation for:

- Auth sessions
- User profiles
- Saved visualizer configurations
- Learning progress
- Chat conversations and messages

## 1. Install the basics on a fresh Windows PC

1. Install Node.js LTS.
2. Install Git.
3. Install Docker Desktop and make sure it can start successfully.
4. Reboot if Docker or WSL asks you to.

You need Docker Desktop for local Supabase.

## 2. Install the project

```bash
git clone <your-repo-url>
cd algowizard
npm install
```

## 3. Environment variables

Copy the example file and fill in the values you want to use:

```bash
copy .env.example .env.local
```

Required variables:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

This repo also already uses Gemini, so keep your Gemini variables in the same `.env.local`.

## 4. Start Supabase locally

The repo already includes the CLI and project config.

```bash
npm run supabase:start
```

Useful commands:

```bash
npm run supabase:status
npm run supabase:stop
npm run supabase:db:reset
```

After `supabase:start`, use `npm run supabase:status` and copy these local values into `.env.local`:

- `API URL` -> `NEXT_PUBLIC_SUPABASE_URL`
- `anon key` or `publishable key` -> `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `service_role key` -> `SUPABASE_SERVICE_ROLE_KEY`

Local defaults are usually:

- API: `http://127.0.0.1:54321`
- Studio: `http://127.0.0.1:54323`
- Database: `postgresql://postgres:postgres@127.0.0.1:54322/postgres`

## 5. Apply the local schema

This repo already contains a migration:

- `supabase/migrations/20260315000100_init_backend.sql`

Apply it with:

```bash
npm run supabase:db:reset
```

That creates:

- `profiles`
- `saved_visualizations`
- `learning_progress`
- `chat_conversations`
- `chat_messages`

It also enables row-level security and creates a profile row automatically when a user signs up.

## 6. Run the app

```bash
npm run dev
```

What is ready in the codebase:

- Browser Supabase client: `src/lib/supabase/client.ts`
- Server Supabase client: `src/lib/supabase/server.ts`
- Admin client: `src/lib/supabase/admin.ts`
- Session refresh proxy: `proxy.ts`
- Auth callback route: `app/auth/callback/route.ts`
- Example authenticated API route: `app/api/me/route.ts`

## 7. Create a hosted Supabase project

When you are ready for cloud hosting:

1. Create a Supabase project in the dashboard.
2. Open Project Settings.
3. Copy:
   - Project URL
   - Publishable key or anon key
   - Service role key
4. Put those values into `.env.local`.

## 8. Configure auth redirects

In Supabase Auth settings, add these URLs:

- `http://localhost:3000`
- `http://localhost:3000/auth/callback`

If you deploy later, add your production domain equivalents too.

## 9. Push this schema to your hosted project

Link the local CLI to your hosted project:

```bash
npx supabase link --project-ref <your-project-ref>
```

Push your migration:

```bash
npm run supabase:db:push
```

## 10. Recommended next backend tasks

Once local Supabase is running, the next useful app features are:

1. Add sign up / sign in UI.
2. Save algorithm state to `saved_visualizations`.
3. Track viewed topics in `learning_progress`.
4. Persist chatbot history to `chat_conversations` and `chat_messages`.
5. Add storage buckets for avatars or exported visualizations.
