-- Strategies table for storing generated marketing strategies
-- Stores all AI-generated content for each user

create table public.strategies (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  niche text not null,
  platform text not null,
  goal text not null,
  strategy_text text not null,
  schedule jsonb not null default '[]'::jsonb,
  hashtags text,
  created_at timestamptz not null default now()
);

-- Indexes for performance
create index idx_strategies_user_id on public.strategies(user_id);
create index idx_strategies_created_at on public.strategies(created_at desc);
create index idx_strategies_platform on public.strategies(platform);
create index idx_strategies_niche on public.strategies(niche);

-- Composite index for history queries
create index idx_strategies_user_created
  on public.strategies(user_id desc, created_at desc);

-- RLS policies
alter table public.strategies enable row level security;

create policy "Users can view their own strategies"
  on public.strategies for select
  using (auth.uid() = user_id);

create policy "Users can insert their own strategies"
  on public.strategies for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own strategies"
  on public.strategies for delete
  using (auth.uid() = user_id);
