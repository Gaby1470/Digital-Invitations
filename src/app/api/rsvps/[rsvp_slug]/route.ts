import { createClient as createServerClient } from '@/lib/supabase-server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { Database } from '@/lib/types';

export const dynamic = 'force-dynamic';

// GET handler to fetch guest party details for the RSVP form
export async function GET(
  request: Request,
  { params }: { params: any }
) {
  const supabase = createServerClient(cookies());
  const { rsvp_slug } = await params;

  if (!rsvp_slug) {
    return NextResponse.json({ error: 'RSVP slug is required' }, { status: 400 });
  }

  try {
    const { data: party, error } = await supabase
      .from('guest_parties')
      .select('id, party_name, allocated_seats, invitation_id, rsvps(*)')
      .eq('rsvp_slug', rsvp_slug)
      .single();

    if (error || !party) {
      console.error(`Invitation not found for slug: ${rsvp_slug}`, error);
      return NextResponse.json({ error: 'Invitation not found' }, { status: 404 });
    }

    const rsvp = (party.rsvps && party.rsvps.length > 0) ? party.rsvps[0] : null;

    const responseData = {
        party_name: party.party_name,
        allocated_seats: party.allocated_seats,
        invitation_id: party.invitation_id,
        rsvp: rsvp
    }

    return NextResponse.json(responseData);
  } catch (e) {
    console.error('Unexpected error in GET /rsvps/[rsvp_slug]:', e);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}

// POST handler to submit an RSVP
export async function POST(
  request: Request,
  { params }: { params: any }
) {
  const { rsvp_slug } = await params;
  const { attending_count, guest_names, notes } = await request.json();

  if (attending_count === undefined) {
    return NextResponse.json({ error: 'Attending count is required' }, { status: 400 });
  }

  const supabaseAdmin = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    // 1. Fetch the guest party by slug
    const { data: party, error: partyError } = await supabaseAdmin
      .from('guest_parties')
      .select('id, allocated_seats')
      .eq('rsvp_slug', rsvp_slug)
      .single();

    if (partyError || !party) {
      console.error(`Party not found for slug during POST: ${rsvp_slug}`, partyError);
      return NextResponse.json({ error: 'Invitation not found' }, { status: 404 });
    }

    // 2. Validate the attending count
    if (attending_count > party.allocated_seats) {
      return NextResponse.json({ error: `You can only RSVP for up to ${party.allocated_seats} guests.` }, { status: 400 });
    }

    // 3. Check if an RSVP already exists
    const { data: existingRsvp } = await supabaseAdmin
      .from('rsvps')
      .select('id')
      .eq('guest_party_id', party.id)
      .single();

    let rsvpData;
    let rsvpError;

    const rsvpPayload = {
      guest_party_id: party.id,
      attending_count,
      guest_names: guest_names || [],
      notes: notes || null,
      submitted_at: new Date().toISOString()
    };

    if (existingRsvp) {
      // 4a. Update existing RSVP
      const { data, error } = await supabaseAdmin
        .from('rsvps')
        .update(rsvpPayload)
        .eq('id', existingRsvp.id)
        .select()
        .single();
      rsvpData = data;
      rsvpError = error;

      if (!rsvpError) {
        await supabaseAdmin
          .from('guest_parties')
          .update({ is_edited: true })
          .eq('id', party.id);
      }
    } else {
      // 4b. Insert new RSVP
      const { data, error } = await supabaseAdmin
        .from('rsvps')
        .insert(rsvpPayload)
        .select()
        .single();
      rsvpData = data;
      rsvpError = error;
    }

    if (rsvpError) {
      console.error('Error submitting RSVP:', rsvpError);
      return NextResponse.json({ error: 'Failed to submit RSVP' }, { status: 500 });
    }

    return NextResponse.json(rsvpData, { status: 200 });
  } catch (e) {
    console.error('Unexpected error in POST /rsvps/[rsvp_slug]:', e);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
