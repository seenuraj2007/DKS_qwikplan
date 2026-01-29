-- Delete user function for cascade deleting all user data
-- Safely deletes user data from all tables before removing auth user

create or replace function public.delete_user(user_id uuid)
returns text
language sql
security definer
set search_path = public
as $$
begin
  -- Delete from all related tables
  delete from public.user_streaks where user_id = $1;
  delete from public.feedback where user_id = $1;
  delete from public.strategies where user_id = $1;
  delete from public.profiles where user_id = $1;
  
  -- Delete from Supabase auth (requires admin privileges)
  -- Note: This needs to be called from a function with admin rights
  -- In production, use auth.admin.deleteUser() via Edge Function
  
  return 'DELETED';
end;
$$;

-- Grant execute permission to authenticated users
grant execute on function public.delete_user(uuid) to authenticated;

-- Create a safer version that only deletes application data
create or replace function public.delete_user_data(user_id uuid)
returns text
language sql
security definer
set search_path = public
as $$
begin
  delete from public.user_streaks where user_id = $1;
  delete from public.feedback where user_id = $1;
  delete from public.strategies where user_id = $1;
  delete from public.profiles where user_id = $1;
  
  return 'USER_DATA_DELETED';
end;
$$;

-- Grant execute permission to authenticated users
grant execute on function public.delete_user_data(uuid) to authenticated;
