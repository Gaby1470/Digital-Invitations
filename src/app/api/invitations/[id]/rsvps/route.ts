// src/app/api/invitations/[id]/rsvps/route.ts
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { Rsvp } from '@/lib/custom_types';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'You must be logged in to view RSVPs.' }, { status: 401 });
  }

  if (!id) {
    return NextResponse.json({ error: 'Invitation ID is required.' }, { status: 400 });
  }

  // First, verify the user owns the invitation
  const { data: invitation, error: fetchError } = await supabase
    .from('invitations')
    .select('user_id')
    .eq('id', id)
    .single();

  if (fetchError || !invitation) {
    return NextResponse.json({ error: 'Invitation not found.' }, { status: 404 });
  }

  if (invitation.user_id !== user.id) {
    return NextResponse.json({ error: 'You do not have permission to view RSVPs for this invitation.' }, { status: 403 });
  }

  // If ownership is verified, fetch the RSVPs
  const { data: rsvps, error: rsvpsError } = await supabase
    .from('rsvps')
    .select('*')
    .eq('invitation_id', id)
    .order('created_at', { ascending: false });

  if (rsvpsError) {
    console.error(`Supabase error fetching rsvps for invitation ${id}:`, rsvpsError);
    return NextResponse.json({ error: 'Failed to fetch RSVPs.', details: rsvpsError.message }, { status: 500 });
  }

  return NextResponse.json(rsvps as Rsvp[]);
}
