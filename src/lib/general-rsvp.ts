import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { Database } from '@/lib/types';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const MAX_NAME_LENGTH = 120;
const MAX_NOTES_LENGTH = 1000;

type RawBody = { attending_count?: unknown; guest_names?: unknown; notes?: unknown };

export async function handleGeneralRsvp(invitationId: unknown, body: RawBody) {
  if (typeof invitationId !== 'string' || !UUID_RE.test(invitationId)) {
    return NextResponse.json({ error: 'A valid invitation ID is required.' }, { status: 400 });
  }

  const attendingCount = body.attending_count;
  if (attendingCount !== 0 && attendingCount !== 1) {
    return NextResponse.json({ error: 'This is a general RSVP and only allows for 0 or 1 guest.' }, { status: 400 });
  }

  const rawNames = Array.isArray(body.guest_names) ? body.guest_names : [];
  const guestNames = rawNames
    .filter((n): n is string => typeof n === 'string')
    .map((n) => n.trim().slice(0, MAX_NAME_LENGTH))
    .filter(Boolean)
    .slice(0, 1);

  if (attendingCount === 1 && guestNames.length === 0) {
    return NextResponse.json({ error: 'A guest name is required.' }, { status: 400 });
  }

  const notes = typeof body.notes === 'string' ? body.notes.trim().slice(0, MAX_NOTES_LENGTH) : '';

  const supabaseAdmin = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    // Only accept RSVPs for invitations that are live
    const { data: invitation } = await supabaseAdmin
      .from('invitations')
      .select('id, is_published, is_expired, expires_at')
      .eq('id', invitationId)
      .maybeSingle();

    const expired = invitation?.is_expired || (invitation?.expires_at && new Date(invitation.expires_at) < new Date());
    if (!invitation || !invitation.is_published || expired) {
      return NextResponse.json({ error: 'This invitation is not accepting responses.' }, { status: 404 });
    }

    const { data: newParty, error: partyError } = await supabaseAdmin
      .from('guest_parties')
      .insert({
        invitation_id: invitationId,
        party_name: guestNames[0] ?? 'General Guest',
        allocated_seats: 1,
      })
      .select('id')
      .single();

    if (partyError || !newParty) {
      console.error('Error creating guest party for general RSVP:', partyError);
      return NextResponse.json({ error: 'Failed to create a guest entry for your RSVP.' }, { status: 500 });
    }

    const { data: rsvpData, error: rsvpError } = await supabaseAdmin
      .from('rsvps')
      .insert({
        guest_party_id: newParty.id,
        attending_count: attendingCount,
        guest_names: guestNames,
        notes: notes || null,
        submitted_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (rsvpError) {
      console.error('Error submitting general RSVP:', rsvpError);
      await supabaseAdmin.from('guest_parties').delete().eq('id', newParty.id);
      return NextResponse.json({ error: 'Failed to submit RSVP.' }, { status: 500 });
    }

    return NextResponse.json(rsvpData, { status: 201 });
  } catch (e) {
    console.error('Unexpected error in general RSVP:', e);
    return NextResponse.json({ error: 'An unexpected server error occurred.' }, { status: 500 });
  }
}
