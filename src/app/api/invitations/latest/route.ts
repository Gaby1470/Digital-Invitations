// src/app/api/invitations/latest/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { cookies } from 'next/headers';

// GET the most recent invitation for the logged-in user
export async function GET(request: Request) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'You must be logged in.' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('invitations')
    .select('id')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error || !data) {
    console.error('Supabase error fetching latest invitation:', error);
    return NextResponse.json({ error: 'Could not find the latest invitation.' }, { status: 404 });
  }

  return NextResponse.json(data);
}
