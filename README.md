# AlgoWizard

AlgoWizard is an interactive algorithm and data-structure learning workspace built with Next.js.

It combines visual step playback, side-by-side comparisons, saved visualizer states, per-page AI help, and Supabase-backed user persistence into one focused study environment.

## What It Does

- Visualizes sorting, searching, graph, and data-structure topics step by step
- Includes a dedicated compare mode for running two sorting algorithms on the same input
- Adds automatic step narration so each page explains what is happening during playback
- Lets signed-in users save exact visualizer states and reopen them later
- Uses a context-aware chatbot powered by Gemini for page-specific questions
- Persists chat history per user and per page with restore and delete support
- Supports Supabase auth, profiles, saved states, learning progress, and chat storage
- Keeps the UI minimal and reusable across desktop and mobile

## Feature Overview

### Learning workspace

- Sorting: Bubble Sort, Selection Sort, Insertion Sort, Merge Sort, Quick Sort, Heap Sort
- Searching: Linear Search, Binary Search
- Graph: BFS, DFS, Dijkstra, Bellman-Ford, Topological Sort
- Data Structures: Stack, Queue, Linked List, Binary Tree, Heap

### Smarter study flow

- Compare mode for side-by-side sorting runs
- Step narration inside controls
- Page-specific YouTube study wheel
- Saved visualizer states with direct reopen links
- Previous chatbot threads restored inside the chatbot UI

### Backend foundation

- Supabase auth callback flow
- User profiles
- Saved visualizations
- Learning progress table
- Chat conversations and chat messages
- Row-level security policies

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Supabase
- Gemini API

## Local Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create your local env file

```bash
copy .env.example .env.local
```

Current env variables:

```env
GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.5-flash

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
# Optional legacy fallback:
# NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

### 3. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Gemini Setup

Gemini powers the AlgoBot chat responses.

Required:

- `GEMINI_API_KEY`

Optional:

- `GEMINI_MODEL`

Without a valid Gemini key, the chatbot UI still renders, but replies will fail.

## Supabase Setup

Supabase is used for:

- authentication
- profiles
- saved visualizer states
- learning progress
- chat persistence

If Supabase is not configured, the app still loads, but auth-backed features like saved states and persistent chat history will not work.

### Local Supabase workflow

```bash
npm run supabase:start
npm run supabase:status
npm run supabase:db:reset
```

### Hosted Supabase workflow

```bash
npx supabase link --project-ref <your-project-ref>
npm run supabase:db:push
```

Full setup guide:

- [docs/supabase-setup.md](./docs/supabase-setup.md)

## Available Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

Supabase scripts:

```bash
npm run supabase:init
npm run supabase:start
npm run supabase:stop
npm run supabase:status
npm run supabase:db:reset
npm run supabase:db:push
npm run supabase:db:pull
```

## Project Structure

```text
app/
  about/                      About page
  api/                        Chat, auth/account, and saved-state routes
  auth/                       Supabase auth callback/error routes
  login/ signup/ saved/       Auth and saved-state pages
  visualizer/                 Learning workspace and topic pages

components/
  auth/                       Navbar auth UI and auth form
  chatbot/                    Floating AlgoBot and page context provider
  visualizer/                 Shared visualizer UI blocks

src/lib/
  chatbot/                    Gemini, context catalog, reply types
  education/                  Pseudocode and step narration helpers
  engine/                     Algorithm step generators and controllers
  saved-visualizations/       Saved state hooks
  supabase/                   Browser/server/admin Supabase clients

supabase/
  migrations/                 Database schema and RLS
```

## Key Pages

- `/` - landing page
- `/visualizer` - main workspace hub
- `/visualizer/compare` - side-by-side sorting compare mode
- `/saved` - saved visualizer states for signed-in users
- `/about` - project overview page

## Current UX Highlights

- Floating profile menu with saved states and sign out
- Minimal dark-branded workspace UI
- Context-aware chatbot bubble
- Route-specific chat history
- Save-state reopening via `?saved=<id>`
- Mid-run speed control support

## Notes For Contributors

- Use `npm run lint` before committing code changes
- Keep secrets in `.env.local`
- Do not expose `SUPABASE_SERVICE_ROLE_KEY` in client code
- The chatbot stores conversation history only for signed-in users
- Guest mode is supported, but account-backed persistence is limited by design

## Author

Built by **G Nandakishore Reddy**.

Portfolio / GitHub:

- [https://github.com/N9601](https://github.com/N9601)
