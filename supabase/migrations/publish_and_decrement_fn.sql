-- supabase/migrations/publish_and_decrement_fn.sql
create or replace function publish_invitation_and_decrement_credit(
    p_invitation_id uuid,
    p_user_id uuid,
    p_expires_at timestamptz,
    p_decrement boolean
)
returns void as $$
begin
  -- Update the invitation
  update public.invitations
  set
    is_published = true,
    expires_at = p_expires_at
  where id = p_invitation_id and user_id = p_user_id;

  -- Decrement credits if required
  if p_decrement then
    update public.profiles
    set template_credits = template_credits - 1
    where id = p_user_id;
  end if;
end;
$$ language plpgsql security definer;
