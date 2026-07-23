// src/app/api/invitations/[id]/publish/route.ts
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
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
    return NextResponse.json({ error: 'You do not have permission to publish this invitation.' }, { status: 403 });
  }

  // If ownership is verified, update the is_published flag
  const { error: updateError } = await supabase
    .from('invitations')
    .update({ is_published: true })
    .eq('id', id);

  if (updateError) {
    console.error(`Supabase error publishing invitation ${id}:`, updateError);
    return NextResponse.json({ error: 'Failed to publish invitation.', details: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Invitation published successfully.' }, { status: 200 });
}
