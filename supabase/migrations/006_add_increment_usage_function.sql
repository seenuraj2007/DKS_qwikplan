-- Function to safely increment plan usage
create or replace function public.increment_plan_usage(profile_id uuid)
returns public.profiles as $$
declare
  updated_profile public.profiles;
begin
  update public.profiles
  set plan_usage = plan_usage + 1,
      updated_at = now()
  where id = profile_id
  returning * into updated_profile;
  
  return updated_profile;
end;
$$ language plpgsql security definer;
