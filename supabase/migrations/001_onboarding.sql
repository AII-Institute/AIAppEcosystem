-- Onboarding: shared across all ecosystem apps
-- Run this in the Supabase SQL editor

create table if not exists public.onboarding_users (
  id           uuid primary key default gen_random_uuid(),
  email        text not null,
  app_id       text not null,
  role         text not null,
  display_name text,
  avatar_color text,
  created_at   timestamptz not null default now(),
  unique (email, app_id)
);

create table if not exists public.onboarding_state (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.onboarding_users(id) on delete cascade,
  app_id       text not null,
  current_step text not null,
  status       text not null default 'in_progress'
                 check (status in ('not_started', 'in_progress', 'completed')),
  step_data    jsonb not null default '{}',
  completed_at timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique (user_id, app_id)
);

-- Row-level security: each app reads/writes its own rows only
alter table public.onboarding_users enable row level security;
alter table public.onboarding_state  enable row level security;

create policy "anon can insert own user"
  on public.onboarding_users for insert
  with check (true);

create policy "anon can read own user"
  on public.onboarding_users for select
  using (true);

create policy "anon can insert own state"
  on public.onboarding_state for insert
  with check (true);

create policy "anon can read own state"
  on public.onboarding_state for select
  using (true);

create policy "anon can update own state"
  on public.onboarding_state for update
  using (true);
