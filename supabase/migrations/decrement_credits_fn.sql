-- decrement_template_credits.sql
create or replace function decrement_template_credits(user_id_input uuid, credits_to_decrement int)
returns void as $$
begin
  update public.profiles
  set template_credits = template_credits - credits_to_decrement
  where id = user_id_input;
end;
$$ language plpgsql security definer;
