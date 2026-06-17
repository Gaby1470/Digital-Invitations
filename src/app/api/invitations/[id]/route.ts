// src/app/api/invitations/[id]/route.ts
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

// GET a single invitation by ID (publicly accessible, but unpublished are owner-only)
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  if (!id) {
    return NextResponse.json({ error: 'Invitation ID is required.' }, { status: 400 });
  }

  // First, get the current user
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch the invitation
  const { data, error } = await supabase
    .from('invitations')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Supabase error fetching invitation ${id}:`, error.message);
    return NextResponse.json({ error: 'Invitation not found.' }, { status: 404 });
  }

  // If the invitation isn't published, only the owner can see it
  if (!data.is_published) {
    if (!user || user.id !== data.user_id) {
      console.error(`Unauthorized access attempt for unpublished invitation ${id}`);
      return NextResponse.json({ error: 'This invitation has not been published yet.' }, { status: 403 });
    }
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
  const { data: invitationData, slug } = body;

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

  const sanitizedSlug = slug ? sanitizeSlug(slug) : null;

  if (sanitizedSlug) {
    const { data: slugConflict, error: slugError } = await supabase
      .from('invitations')
      .select('id')
      .eq('slug', sanitizedSlug)
      .not('id', 'eq', id)
      .single();

    if (slugError && slugError.code !== 'PGRST116') { // PGRST116 = no rows found
      return NextResponse.json({ error: 'Error checking slug uniqueness.', details: slugError.message }, { status: 500 });
    }
    if (slugConflict) {
      return NextResponse.json({ error: 'This custom link is already in use. Please choose another.' }, { status: 409 });
    }
  }

  // If ownership is verified, proceed with the update
  const { slug: slug_from_data, is_published, ...cleanedData } = invitationData;

  const updatedRecord: { data: any; slug?: string } = {
    data: cleanedData,
  };

  if (sanitizedSlug) {
    updatedRecord.slug = sanitizedSlug;
  }

  const { data, error } = await supabase
    .from('invitations')
    .update(updatedRecord)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error(`Supabase error updating invitation ${id}:`, error);
    if (error.code === '23505') { // Unique constraint violation
      return NextResponse.json({ error: 'This custom link is already in use. Please choose another.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to update invitation.', details: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

function sanitizeSlug(slug: string): string {
  return slug
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .slice(0, 50);
}

// DELETE an invitation by ID (protected)
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'You must be logged in to delete an invitation.' }, { status: 401 });
  }

  if (!id) {
    return NextResponse.json({ error: 'Invitation ID is required.' }, { status: 400 });
  }

  // First, verify ownership and check if the invitation is published
  const { data: existingInvitation, error: fetchError } = await supabase
    .from('invitations')
    .select('user_id, is_published')
    .eq('id', id)
    .single();

  if (fetchError || !existingInvitation) {
    return NextResponse.json({ error: 'Invitation not found.' }, { status: 404 });
  }

  if (existingInvitation.user_id !== user.id) {
    return NextResponse.json({ error: 'You do not have permission to delete this invitation.' }, { status: 403 });
  }

  if (existingInvitation.is_published) {
    return NextResponse.json({ error: 'You cannot delete a published invitation.' }, { status: 403 });
  }

  // If all checks pass, delete the invitation
  const { error: deleteError } = await supabase
    .from('invitations')
    .delete()
    .eq('id', id);

  if (deleteError) {
    console.error(`Supabase error deleting invitation ${id}:`, deleteError);
    return NextResponse.json({ error: 'Failed to delete invitation.', details: deleteError.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Invitation deleted successfully.' }, { status: 200 });
}
