// src/app/api/admin/invitations/[id]/generate-claim-code/route.ts
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/lib/types';

// Helper to check if a user is an admin
async function checkAdmin(supabase: ReturnType<typeof createClient>) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return false;

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single();

  return !!profile?.is_admin;
}

// Generate a random uppercase alphanumeric string
function generateClaimCode(length = 6): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Avoid ambiguous chars like O, 0, I, 1
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `CLAIM-${result}`;
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: invitationId } = await params;
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const isAdmin = await checkAdmin(supabase);
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
  }

  const supabaseAdmin = createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Generate a unique claim code
  let claimCode = '';
  while (true) {
    claimCode = generateClaimCode();
    const { data: codeConflict } = await supabaseAdmin
      .from('invitations')
      .select('id')
      .eq('claim_code', claimCode)
      .single();

    if (!codeConflict) break;
  }

  // Update the invitation with the new claim code
  const { data, error } = await supabaseAdmin
    .from('invitations')
    .update({ claim_code: claimCode })
    .eq('id', invitationId)
    .select()
    .single();

  if (error) {
    console.error('Admin API: Error generating claim code:', error);
    return NextResponse.json({ error: 'Failed to generate claim code.' }, { status: 500 });
  }

  return NextResponse.json({ success: true, claimCode: data.claim_code });
}
