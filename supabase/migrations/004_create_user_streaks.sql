-- User streaks table for tracking daily engagement
-- Stores current streak, last active date, and streak history

create table public.user_streaks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  current_streak integer not null default 0 check (current_streak >= 0),
  longest_streak integer not null default 0 check (longest_streak >= 0),
  last_active_at timestamptz not null default now(),
  streak_history jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Indexes for performance
create index idx_user_streaks_user_id on public.user_streaks(user_id);
create index idx_user_streaks_last_active on public.user_streaks(last_active_at desc);
create index idx_user_streaks_current_streak on public.user_streaks(current_streak desc);

-- RLS policies
alter table public.user_streaks enable row level security;

create policy "Users can view their own streaks"
  on public.user_streaks for select
  using (auth.uid() = user_id);

create policy "Users can insert their own streaks"
  on public.user_streaks for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own streaks"
  on public.user_streaks for update
  using (auth.uid() = user_id);

-- Trigger to update updated_at
create trigger update_user_streaks_updated_at
  before update on public.user_streaks
  for each row
  execute function update_updated_at_column();
