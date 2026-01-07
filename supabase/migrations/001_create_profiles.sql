-- Profiles table for user plan and usage tracking
-- Stores plan limits and monthly usage for each user

create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  plan_usage integer not null default 0 check (plan_usage >= 0),
  monthly_limit integer not null default 50 check (monthly_limit > 0),
  plan_type text not null default 'free' check (plan_type in ('free', 'pro', 'enterprise')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Indexes for performance
create index idx_profiles_user_id on public.profiles(user_id);
create index idx_profiles_plan_type on public.profiles(plan_type);

-- RLS policies
alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = user_id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = user_id);

-- Trigger to update updated_at
create function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_profiles_updated_at
  before update on public.profiles
  for each row
  execute function update_updated_at_column();
