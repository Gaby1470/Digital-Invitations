// src/app/api/invitations/by-slug/[slug]/route.ts
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export async function GET(request: Request, { params }: { params: Promise<{ slug:string }> }) {
  const { slug } = await params;
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  if (!slug) {
    return NextResponse.json({ error: 'Slug is required.' }, { status: 400 });
  }

  // First, get the current user
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch the invitation by slug
  const { data, error } = await supabase
    .from('invitations')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error(`Supabase error fetching invitation with slug ${slug}:`, error.message);
    return NextResponse.json({ error: 'Invitation not found.' }, { status: 404 });
  }

  // If the invitation isn't published, only the owner can see it
  if (!data.is_published) {
    if (!user || user.id !== data.user_id) {
      console.error(`Unauthorized access attempt for unpublished invitation with slug ${slug}`);
      return NextResponse.json({ error: 'This invitation has not been published yet.' }, { status: 403 });
    }
  }

  return NextResponse.json(data);
}
