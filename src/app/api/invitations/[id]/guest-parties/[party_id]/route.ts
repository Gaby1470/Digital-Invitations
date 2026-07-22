import { createClient } from '@/lib/supabase-server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { Database } from '@/lib/types';

export const dynamic = 'force-dynamic';

async function checkPermissions(
    supabase: ReturnType<typeof createClient>,
    invitationId: string,
    partyId: string
) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        return { error: 'Unauthorized', status: 401 };
    }

    const { data, error } = await supabase
        .from('guest_parties')
        .select('invitation_id')
        .eq('id', partyId)
        .single();

    if (error || !data) {
        return { error: 'Guest party not found', status: 404 };
    }

    if (data.invitation_id !== invitationId) {
        return { error: 'Mismatch between invitation and guest party', status: 400 };
    }

    const { data: invitation, error: invitationError } = await supabase
        .from('invitations')
        .select('id')
        .eq('id', invitationId)
        .eq('user_id', session.user.id)
        .single();

    if (invitationError || !invitation) {
        return { error: 'Invitation not found or access denied', status: 404 };
    }
    
    return { error: null, status: 200 };
}


// PATCH handler to update a guest party
export async function PATCH(
  request: Request,
  { params }: { params: { id: string, party_id: string } }
) {
  const supabase = createClient(cookies());

  const url = new URL(request.url);
  const pathSegments = url.pathname.split('/');
  const invitationId = pathSegments[3];
  const partyId = pathSegments[5];

  const { party_name, allocated_seats } = await request.json();

  if (!party_name && allocated_seats === undefined) {
    return NextResponse.json({ error: 'At least one field to update must be provided' }, { status: 400 });
  }

  try {
    const permCheck = await checkPermissions(supabase, invitationId, partyId);
    if (permCheck.error) {
        return NextResponse.json({ error: permCheck.error }, { status: permCheck.status });
    }

    const updateData: { party_name?: string; allocated_seats?: number } = {};
    if (party_name) updateData.party_name = party_name;
    if (allocated_seats !== undefined) updateData.allocated_seats = allocated_seats;

    const { data, error } = await supabase
      .from('guest_parties')
      .update(updateData)
      .eq('id', partyId)
      .select()
      .single();

    if (error) {
      console.error('Error updating guest party:', error);
      return NextResponse.json({ error: 'Failed to update guest party' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (e) {
    console.error('Unexpected error in PATCH /guest-parties/[party_id]:', e);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}

// DELETE handler to remove a guest party
export async function DELETE(
  request: Request,
  { params }: { params: { id: string, party_id: string } }
) {
  const supabase = createClient(cookies());
  
  const url = new URL(request.url);
  const pathSegments = url.pathname.split('/');
  const invitationId = pathSegments[3];
  const partyId = pathSegments[5];

  try {
    const permCheck = await checkPermissions(supabase, invitationId, partyId);
    if (permCheck.error) {
        return NextResponse.json({ error: permCheck.error }, { status: permCheck.status });
    }
    
    const { error } = await supabase
      .from('guest_parties')
      .delete()
      .eq('id', partyId);

    if (error) {
      console.error('Error deleting guest party:', error);
      return NextResponse.json({ error: 'Failed to delete guest party' }, { status: 500 });
    }

    return new Response(null, { status: 204 }); // Success, no content
  } catch (e) {
    console.error('Unexpected error in DELETE /guest-parties/[party_id]:', e);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}

