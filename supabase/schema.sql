-- Run this once in your Supabase project's SQL editor (Project -> SQL Editor -> New query)

create extension if not exists pgcrypto;

do $$ begin
  create type collab_type as enum ('barter', 'paid');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type collab_mode as enum ('online', 'offline');
exception when duplicate_object then null;
end $$;

create table if not exists collabs (
  id uuid primary key default gen_random_uuid(),
  brand_name text not null,
  collab_type collab_type not null default 'barter',
  expected_reels int not null default 0,
  expected_stories int not null default 0,
  expected_posts int not null default 0,
  reels_done boolean not null default false,
  stories_done boolean not null default false,
  posts_done boolean not null default false,
  due_date date,
  payment_amount numeric,
  payment_received boolean not null default false,
  completed boolean not null default false,
  completed_at timestamptz,
  poc_name text default '',
  poc_phone text default '',
  description text default '',
  review text default '',
  mode collab_mode not null default 'offline',
  visiting_date date,
  platform text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Safe to re-run: adds columns if you created the table before they existed.
alter table collabs add column if not exists review text default '';
alter table collabs add column if not exists reels_done boolean not null default false;
alter table collabs add column if not exists stories_done boolean not null default false;
alter table collabs add column if not exists posts_done boolean not null default false;

create index if not exists collabs_completed_idx on collabs (completed);
create index if not exists collabs_due_date_idx on collabs (due_date);

-- Row Level Security is enabled with no policies, so only requests using the
-- service role key (used by this app's server-side API routes) can read/write.
-- The anon/public key is never used by this app, so this table stays private.
alter table collabs enable row level security;
