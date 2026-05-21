// src/app/api/invitations/[id]/route.ts
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

// GET a single invitation by ID (publicly accessible)
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  if (!id) {
    return NextResponse.json({ error: 'Invitation ID is required.' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('invitations')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Supabase error fetching invitation ${id}:`, error);
    return NextResponse.json({ error: 'Invitation not found.' }, { status: 404 });
  }

  return NextResponse.json(data);
}

// UPDATE an invitation by ID (protected)
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'You must be logged in to update an invitation.' }, { status: 401 });
  }

  const body = await request.json();

  if (!id) {
    return NextResponse.json({ error: 'Invitation ID is required.' }, { status: 400 });
  }

  // First, verify ownership
  const { data: existingInvitation, error: fetchError } = await supabase
    .from('invitations')
    .select('user_id')
    .eq('id', id)
    .single();

  if (fetchError || !existingInvitation) {
    return NextResponse.json({ error: 'Invitation not found.' }, { status: 404 });
  }

  if (existingInvitation.user_id !== user.id) {
    return NextResponse.json({ error: 'You do not have permission to edit this invitation.' }, { status: 403 });
  }

  // If ownership is verified, proceed with the update
  const updatedRecord = {
    data: body.data,
  };

  const { data, error } = await supabase
    .from('invitations')
    .update(updatedRecord)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error(`Supabase error updating invitation ${id}:`, error);
    return NextResponse.json({ error: 'Failed to update invitation.', details: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
