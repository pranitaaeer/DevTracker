-- Supabase schema for Kanban

create table if not exists kanban_columns (
  id text primary key,
  user_id text not null,
  title text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists kanban_cards (
  id text primary key,
  user_id text not null,
  column_id text not null references kanban_columns(id) on delete cascade,
  project_id text references projects(id),
  title text not null,
  description text,
  priority text,
  due_date date,
  position integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_kanban_columns_user on kanban_columns(user_id);
create index if not exists idx_kanban_cards_user on kanban_cards(user_id);
create index if not exists idx_kanban_cards_column on kanban_cards(column_id);
create index if not exists idx_kanban_cards_project on kanban_cards(project_id);
