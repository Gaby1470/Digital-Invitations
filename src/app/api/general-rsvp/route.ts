// src/app/api/general-rsvp/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { Database } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const { invitationId, attending_count, guest_names, notes } = await request.json();

  if (!invitationId) {
    return NextResponse.json({ error: 'Invitation ID is required' }, { status: 400 });
  }

  if (attending_count === undefined || attending_count < 0 || attending_count > 1) {
    return NextResponse.json({ error: 'This is a general RSVP and only allows for 0 or 1 guest.' }, { status: 400 });
  }

  const supabaseAdmin = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    const partyName = guest_names && guest_names.length > 0 ? guest_names[0] : 'General Guest';
    
    const { data: newParty, error: partyError } = await supabaseAdmin
      .from('guest_parties')
      .insert({
        invitation_id: invitationId,
        party_name: partyName,
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
        attending_count,
        guest_names: guest_names || [],
        notes: notes || null,
        submitted_at: new Date().toISOString()
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
    console.error('Unexpected error in POST /general-rsvp:', e);
    return NextResponse.json({ error: 'An unexpected server error occurred.' }, { status: 500 });
  }
}
