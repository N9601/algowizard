create extension if not exists pgcrypto with schema extensions;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text unique,
  full_name text,
  avatar_url text,
  bio text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.saved_visualizations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  algorithm_slug text not null,
  route text not null,
  config jsonb not null default '{}'::jsonb,
  notes text,
  is_public boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.learning_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  topic_slug text not null,
  topic_type text not null check (
    topic_type in ('sorting', 'searching', 'graph', 'data-structure', 'algorithm')
  ),
  status text not null default 'not_started' check (
    status in ('not_started', 'in_progress', 'completed')
  ),
  percent_complete integer not null default 0 check (
    percent_complete >= 0 and percent_complete <= 100
  ),
  last_viewed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (user_id, topic_slug)
);

create table if not exists public.chat_conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete cascade,
  title text not null default 'New conversation',
  page_path text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.chat_conversations (id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists saved_visualizations_user_id_idx
  on public.saved_visualizations (user_id);

create index if not exists saved_visualizations_route_idx
  on public.saved_visualizations (route);

create index if not exists learning_progress_user_id_idx
  on public.learning_progress (user_id);

create index if not exists learning_progress_topic_slug_idx
  on public.learning_progress (topic_slug);

create index if not exists chat_conversations_user_id_idx
  on public.chat_conversations (user_id);

create index if not exists chat_messages_conversation_id_idx
  on public.chat_messages (conversation_id);

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

drop trigger if exists saved_visualizations_set_updated_at on public.saved_visualizations;
create trigger saved_visualizations_set_updated_at
before update on public.saved_visualizations
for each row
execute function public.set_updated_at();

drop trigger if exists learning_progress_set_updated_at on public.learning_progress;
create trigger learning_progress_set_updated_at
before update on public.learning_progress
for each row
execute function public.set_updated_at();

drop trigger if exists chat_conversations_set_updated_at on public.chat_conversations;
create trigger chat_conversations_set_updated_at
before update on public.chat_conversations
for each row
execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.saved_visualizations enable row level security;
alter table public.learning_progress enable row level security;
alter table public.chat_conversations enable row level security;
alter table public.chat_messages enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles
for select
using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles
for insert
with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "saved_visualizations_select_own_or_public" on public.saved_visualizations;
create policy "saved_visualizations_select_own_or_public"
on public.saved_visualizations
for select
using (auth.uid() = user_id or is_public = true);

drop policy if exists "saved_visualizations_insert_own" on public.saved_visualizations;
create policy "saved_visualizations_insert_own"
on public.saved_visualizations
for insert
with check (auth.uid() = user_id);

drop policy if exists "saved_visualizations_update_own" on public.saved_visualizations;
create policy "saved_visualizations_update_own"
on public.saved_visualizations
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "saved_visualizations_delete_own" on public.saved_visualizations;
create policy "saved_visualizations_delete_own"
on public.saved_visualizations
for delete
using (auth.uid() = user_id);

drop policy if exists "learning_progress_select_own" on public.learning_progress;
create policy "learning_progress_select_own"
on public.learning_progress
for select
using (auth.uid() = user_id);

drop policy if exists "learning_progress_insert_own" on public.learning_progress;
create policy "learning_progress_insert_own"
on public.learning_progress
for insert
with check (auth.uid() = user_id);

drop policy if exists "learning_progress_update_own" on public.learning_progress;
create policy "learning_progress_update_own"
on public.learning_progress
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "learning_progress_delete_own" on public.learning_progress;
create policy "learning_progress_delete_own"
on public.learning_progress
for delete
using (auth.uid() = user_id);

drop policy if exists "chat_conversations_select_own" on public.chat_conversations;
create policy "chat_conversations_select_own"
on public.chat_conversations
for select
using (auth.uid() = user_id);

drop policy if exists "chat_conversations_insert_own" on public.chat_conversations;
create policy "chat_conversations_insert_own"
on public.chat_conversations
for insert
with check (auth.uid() = user_id);

drop policy if exists "chat_conversations_update_own" on public.chat_conversations;
create policy "chat_conversations_update_own"
on public.chat_conversations
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "chat_conversations_delete_own" on public.chat_conversations;
create policy "chat_conversations_delete_own"
on public.chat_conversations
for delete
using (auth.uid() = user_id);

drop policy if exists "chat_messages_select_own" on public.chat_messages;
create policy "chat_messages_select_own"
on public.chat_messages
for select
using (
  exists (
    select 1
    from public.chat_conversations conversations
    where conversations.id = conversation_id
      and conversations.user_id = auth.uid()
  )
);

drop policy if exists "chat_messages_insert_own" on public.chat_messages;
create policy "chat_messages_insert_own"
on public.chat_messages
for insert
with check (
  exists (
    select 1
    from public.chat_conversations conversations
    where conversations.id = conversation_id
      and conversations.user_id = auth.uid()
  )
);

drop policy if exists "chat_messages_delete_own" on public.chat_messages;
create policy "chat_messages_delete_own"
on public.chat_messages
for delete
using (
  exists (
    select 1
    from public.chat_conversations conversations
    where conversations.id = conversation_id
      and conversations.user_id = auth.uid()
  )
);
