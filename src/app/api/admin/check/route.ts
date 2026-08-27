// src/app/api/admin/check/route.ts
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export async function GET() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser();

  if (authError) {
    console.error("Admin check: Error getting user session:", authError.message);
    return NextResponse.json({ isAdmin: false, debugError: `Auth error: ${authError.message}` });
  }

  if (!user) {
    console.warn("Admin check: No active user session found in cookies.");
    return NextResponse.json({ isAdmin: false, debugError: "No active session. Please log in." });
  }

  console.log(`Admin check: Active session found for user ID: ${user.id}, Email: ${user.email}`);

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error(`Admin check query failed for user ID ${user.id}:`, error.message, error.details);
    return NextResponse.json({ isAdmin: false, debugError: error.message });
  }

  if (!profile) {
    console.error(`Admin check query returned no profile for user ID ${user.id}`);
    return NextResponse.json({ isAdmin: false, debugError: 'No profile found' });
  }

  console.log(`Admin check success for user ID ${user.id}: is_admin =`, profile.is_admin);
  return NextResponse.json({ isAdmin: !!profile.is_admin });
}
