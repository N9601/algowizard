# AlgoWizard

[![CI](https://github.com/N9601/algowizard/actions/workflows/ci.yml/badge.svg)](https://github.com/N9601/algowizard/actions/workflows/ci.yml)

AlgoWizard is an interactive algorithm and data-structure learning workspace built with Next.js.

It combines visual step playback, side-by-side comparisons, saved visualizer states, per-page AI help, and Supabase-backed user persistence into one focused study environment.

## What It Does

- Visualizes 27 algorithms and data structures step by step: sorting, searching, graphs, grid pathfinding, data structures, game-tree search, and machine learning
- Plays, pauses, and steps forward or back through every run, with a speed slider that works mid-run
- Narrates each step so the page explains what is happening during playback
- Compares two sorting, searching, or pathfinding algorithms side by side on the same input
- Accepts custom inputs (arrays, targets, walls, start and goal cells, recursion depth, points, learning rates)
- Lets signed-in users save exact visualizer states and reopen them later
- Tracks learning progress per topic on a progress dashboard
- Uses a context-aware chatbot powered by Gemini for page-specific questions
- Persists chat history per user and per page with restore and delete support
- Runs in guest mode when Supabase and Gemini are not configured
- Keeps the UI minimal and reusable across desktop and mobile

## Feature Overview

### Learning workspace

- Sorting: Bubble Sort, Selection Sort, Insertion Sort, Merge Sort, Quick Sort, Heap Sort
- Searching: Linear Search, Binary Search
- Graph: BFS, DFS, Dijkstra, Bellman-Ford, Topological Sort
- Pathfinding (grid): BFS, Dijkstra, A*
- Data Structures: Stack, Queue, Linked List, Binary Tree, Heap, Recursion call stack
- Decision AI: Minimax and Alpha-Beta pruning on tic-tac-toe
- Machine Learning: k-Means clustering, Gradient Descent, a two-layer Neural Network

### Smarter study flow

- Compare mode for sorting, searching, and pathfinding
- Searchable "All algorithms" glossary
- Step narration in every visualizer, plus pseudocode for the core algorithms
- Page-specific YouTube study wheel
- Saved visualizer states with direct reopen links
- Learning progress dashboard
- Previous chatbot threads restored inside the chatbot UI

### Backend foundation

- Supabase auth callback flow
- User profiles
- Saved visualizations
- Learning progress table
- Chat conversations and chat messages
- Row-level security policies

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- Supabase
- Gemini API
- Vitest

## Local Setup

Requires Node.js 20.9 or newer.

### 1. Install dependencies

```bash
npm ci
```

### 2. Create your local env file (optional)

```bash
copy .env.example .env.local   # Windows
cp .env.example .env.local     # macOS / Linux
```

Every variable is optional. Without them the visualizers work in guest mode.

```env
GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.5-flash

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
# Optional legacy fallback:
# NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Optional, not used by any route yet:
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
npm run dev         # start the dev server
npm run build       # production build
npm run start       # serve the production build
npm run lint        # ESLint
npm run typecheck   # TypeScript, no emit
npm test            # Vitest unit tests
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

## Testing

The algorithm engine is pure TypeScript, so it is covered by fast unit tests in `src/lib/**/__tests__`:

- every sorting algorithm on empty, single, duplicate, negative, sorted, reversed, and large inputs
- linear and binary search, including missing targets and duplicates
- BFS, DFS, Dijkstra, Bellman-Ford (with negative edges and cycles), and topological order
- grid BFS, Dijkstra, and A* shortest paths, walls, and unreachable goals
- minimax and alpha-beta agreement, stack, queue, heap, and recursion traces
- the playback controller (stepping, pausing, completion, progress)
- chat request validation and login redirect checks

GitHub Actions runs lint, typecheck, tests, and a production build on every push and pull request.

## Project Structure

```text
app/
  about/                      About page
  api/                        Chat, auth/account, progress, and saved-state routes
  auth/                       Supabase auth callback/error routes
  login/ signup/ saved/       Auth and saved-state pages
  progress/                   Learning progress dashboard
  visualizer/                 Learning workspace and topic pages

components/
  auth/                       Navbar auth UI and auth form
  chatbot/                    Floating AlgoBot and page context provider
  visualizer/                 Shared visualizer UI blocks

src/lib/
  auth/                       Login redirect validation
  chatbot/                    Gemini, context catalog, request validation
  education/                  Pseudocode and step narration helpers
  engine/                     Algorithm step generators and playback controller
  saved-visualizations/       Saved state hooks
  supabase/                   Browser/server/admin Supabase clients

supabase/
  migrations/                 Database schema and RLS
```

## Key Pages

- `/` - landing page
- `/visualizer` - main workspace hub
- `/visualizer/all` - searchable list of every visualizer
- `/visualizer/compare` - side-by-side sorting compare mode
- `/visualizer/compare/searching` - linear vs binary search
- `/visualizer/compare/pathfinding` - two grid pathfinders on the same maze
- `/saved` - saved visualizer states for signed-in users
- `/progress` - learning progress for signed-in users
- `/about` - project overview page

## Current UX Highlights

- Floating profile menu with saved states and sign out
- Minimal dark-branded workspace UI
- Context-aware chatbot bubble
- Route-specific chat history
- Save-state reopening via `?saved=<id>`
- Mid-run speed control support

## Notes For Contributors

- Run `npm run lint`, `npm run typecheck`, and `npm test` before committing code changes
- Keep secrets in `.env.local`
- Do not expose `SUPABASE_SERVICE_ROLE_KEY` in client code
- The chatbot stores conversation history only for signed-in users
- Guest mode is supported, but account-backed persistence is limited by design

## Author

Built by **G Nandakishore Reddy**.

Portfolio / GitHub:

- [https://github.com/N9601](https://github.com/N9601)
