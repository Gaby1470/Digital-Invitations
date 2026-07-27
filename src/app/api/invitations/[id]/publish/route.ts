// src/app/api/invitations/[id]/publish/route.ts
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { templateConfig } from '@/lib/templateConfig';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'You must be logged in to publish an invitation.' }, { status: 401 });
  }

  if (!id) {
    return NextResponse.json({ error: 'Invitation ID is required.' }, { status: 400 });
  }

  // Get user profile and invitation details in parallel
  const [
    { data: profile, error: profileError },
    { data: invitation, error: invitationError }
  ] = await Promise.all([
    supabase.from('profiles').select('plan, template_credits').eq('id', user.id).single(),
    supabase.from('invitations').select('user_id, template, data').eq('id', id).single()
  ]);

  if (invitationError || !invitation) {
    return NextResponse.json({ error: 'Invitation not found.' }, { status: 404 });
  }

  if (invitation.user_id !== user.id) {
    return NextResponse.json({ error: 'You do not have permission to publish this invitation.' }, { status: 403 });
  }
  
  if (profileError || !profile) {
    return NextResponse.json({ error: 'Could not retrieve user profile.' }, { status: 500 });
  }

  // Handle 'single_tier' plan logic
  if (profile.plan === 'single_tier') {
    if (profile.template_credits <= 0) {
      return NextResponse.json({ error: 'You have no template credits left. Please purchase more to publish.' }, { status: 403 });
    }
  }

  // Calculate expiration date
  const templateInfo = templateConfig[invitation.template];
  let expires_at: string;

  if (templateInfo?.category === 'Boda') {
    const d = new Date();
    d.setFullYear(d.getFullYear() + 1);
    expires_at = d.toISOString();
  } else if (invitation.data?.eventDate) {
    const eventDate = new Date(invitation.data.eventDate);
    eventDate.setDate(eventDate.getDate() + 1);
    expires_at = eventDate.toISOString();
  } else {
    // Default expiration if eventDate is not available
    const d = new Date();
    d.setFullYear(d.getFullYear() + 1);
    expires_at = d.toISOString();
    console.warn(`Invitation ${id} published without an eventDate. Defaulting to 1 year expiration.`);
  }

  // Update invitation and decrement credits in a transaction
  const { error: publishError } = await supabase.rpc('publish_invitation_and_decrement_credit', {
    p_invitation_id: id,
    p_user_id: user.id,
    p_expires_at: expires_at,
    p_decrement: profile.plan === 'single_tier',
  });

  if (publishError) {
    console.error(`Error publishing invitation ${id}:`, publishError);
    return NextResponse.json({ error: 'Failed to publish invitation.', details: publishError.message }, { status: 500 });
  }
  
  return NextResponse.json({ message: 'Invitation published successfully.' }, { status: 200 });
}
