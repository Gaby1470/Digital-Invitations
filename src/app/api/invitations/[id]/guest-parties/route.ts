import { createClient } from '@/lib/supabase-server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { Database } from '@/lib/types';

export const dynamic = 'force-dynamic';

// GET handler to list all guest parties for an invitation
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  
  const { id: invitationId } = await params;

  if (!invitationId) {
    return NextResponse.json({ error: 'Invitation ID is required' }, { status: 400 });
  }

  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // First, verify the user owns the invitation
    const { data: invitation, error: invitationError } = await supabase
      .from('invitations')
      .select('id')
      .eq('id', invitationId)
      .eq('user_id', session.user.id)
      .single();

    if (invitationError || !invitation) {
      return NextResponse.json({ error: 'Invitation not found or access denied' }, { status: 404 });
    }

    // 1. Fetch guest parties
    const { data: parties, error: partiesError } = await supabase
      .from('guest_parties')
      .select('id, party_name, allocated_seats, rsvp_slug, is_edited')
      .eq('invitation_id', invitationId)
      .order('created_at', { ascending: true });

    if (partiesError) { 
      console.error('Error fetching guest parties:', partiesError);
      throw partiesError; 
    }
    if (!parties) { 
      return NextResponse.json([]); 
    }

    const partyIds = parties.map(p => p.id);

    // 2. Fetch RSVPs for those parties
    const { data: rsvps, error: rsvpsError } = await supabase
      .from('rsvps')
      .select('guest_party_id, attending_count, notes')
      .in('guest_party_id', partyIds);

    if (rsvpsError) { 
      console.error('Error fetching RSVPs:', rsvpsError);
      throw rsvpsError; 
    }

    // 3. Create a map for easy lookup
    const rsvpMap = new Map(rsvps.map(r => [r.guest_party_id, { attending_count: r.attending_count, notes: r.notes }]));

    // 4. Join the data
    const formattedData = parties.map(party => ({
      ...party,
      attending_count: rsvpMap.get(party.id)?.attending_count ?? 0,
      notes: rsvpMap.get(party.id)?.notes ?? null,
    }));

    return NextResponse.json(formattedData);
  } catch (e) {
    console.error('Unexpected error in GET /guest-parties:', e);
    const errorMessage = e instanceof Error ? e.message : 'An unexpected error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// POST handler to create a new guest party
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  
  const { id: invitationId } = await params;
  
  const { party_name, allocated_seats } = await request.json();

  if (!invitationId) {
    return NextResponse.json({ error: 'Invitation ID is required' }, { status: 400 });
  }
  if (!party_name || !allocated_seats) {
    return NextResponse.json({ error: 'Party name and allocated seats are required' }, { status: 400 });
  }

  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify the user owns the invitation
    const { data: invitation, error: invitationError } = await supabase
      .from('invitations')
      .select('id')
      .eq('id', invitationId)
      .eq('user_id', session.user.id)
      .single();

    if (invitationError || !invitation) {
      return NextResponse.json({ error: 'Invitation not found or access denied' }, { status: 404 });
    }
    
    // Insert the new guest party
    const { data, error } = await supabase
      .from('guest_parties')
      .insert({
        invitation_id: invitationId,
        party_name,
        allocated_seats,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating guest party:', error);
      return NextResponse.json({ error: 'Failed to create guest party' }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (e) {
    console.error('Unexpected error in POST /guest-parties:', e);
    const errorMessage = e instanceof Error ? e.message : 'An unexpected error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

