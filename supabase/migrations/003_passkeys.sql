-- Passkey (WebAuthn) credential storage
create table if not exists public.passkey_credentials (
  id              uuid primary key default gen_random_uuid(),
  email           text not null,
  credential_id   text not null unique,
  public_key      text not null,
  counter         bigint not null default 0,
  device_type     text,
  backed_up       boolean default false,
  transports      text[],
  created_at      timestamptz default now()
);

create index if not exists passkey_credentials_email_idx on public.passkey_credentials (email);

alter table public.passkey_credentials enable row level security;
create policy "service can manage passkey_credentials"
  on public.passkey_credentials using (true) with check (true);

-- Temporary challenge storage (cleaned up after each use, max 5 min TTL)
create table if not exists public.passkey_challenges (
  id          uuid primary key default gen_random_uuid(),
  email       text not null,
  challenge   text not null,
  expires_at  timestamptz not null,
  created_at  timestamptz default now()
);

alter table public.passkey_challenges enable row level security;
create policy "service can manage passkey_challenges"
  on public.passkey_challenges using (true) with check (true);
