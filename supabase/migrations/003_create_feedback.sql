-- Feedback table for storing user feedback on generated content
-- Stores ratings and feedback text for quality improvement

create table public.feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  rating integer check (rating >= 1 and rating <= 5),
  feedback_text text not null,
  niche text,
  platform text,
  created_at timestamptz not null default now()
);

-- Indexes for performance
create index idx_feedback_user_id on public.feedback(user_id);
create index idx_feedback_created_at on public.feedback(created_at desc);
create index idx_feedback_rating on public.feedback(rating);

-- RLS policies
alter table public.feedback enable row level security;

create policy "Users can view their own feedback"
  on public.feedback for select
  using (auth.uid() = user_id);

create policy "Users can insert their own feedback"
  on public.feedback for insert
  with check (auth.uid() = user_id);
