-- =====================================================================
-- Run this ONCE in Supabase: Dashboard → SQL Editor → New query → Run.
-- It creates one table. Each user gets ONE row with all their progress.
-- =====================================================================

create table public.progress (
  user_id uuid primary key default auth.uid() references auth.users (id) on delete cascade,
  data jsonb not null,                      -- your whole progress object
  updated_at timestamptz not null default now()
);

-- Row Level Security (RLS): without this, anyone could read every row.
-- With it, each person can only see and change THEIR OWN row.
alter table public.progress enable row level security;

create policy "Read my own progress" on public.progress
  for select using (auth.uid() = user_id);

create policy "Create my own progress" on public.progress
  for insert with check (auth.uid() = user_id);

create policy "Update my own progress" on public.progress
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
