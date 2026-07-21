-- Supabase schema for DevTrack projects
-- Run in Supabase SQL editor or via migration

create table if not exists projects (
  id text primary key,
  user_id text not null,
  name text not null,
  description text,
  tech_stack jsonb default '[]'::jsonb,
  status text default 'active',
  github_url text,
  live_url text,
  color text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_projects_user on projects(user_id);
