// src/app/api/invitations/claim/route.ts
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/lib/types';
import { enforceRateLimit } from '@/lib/rate-limit';

export async function POST(request: Request) {
  const rateLimitResponse = await enforceRateLimit(request, 'claim', 5, 15 * 60);
  if (rateLimitResponse) return rateLimitResponse;

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Debes iniciar sesión para reclamar una invitación.' }, { status: 401 });
  }

  const body = await request.json();
  const { claimCode } = body;

  if (!claimCode || typeof claimCode !== 'string') {
    return NextResponse.json({ error: 'El código de reclamo es requerido.' }, { status: 400 });
  }

  const cleanCode = claimCode.trim().toUpperCase();

  // Use service role to find and update the invitation
  const supabaseAdmin = createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: invitation, error: claimError } = await supabaseAdmin
    .rpc('claim_invitation_by_code', { p_code: cleanCode, p_user_id: user.id });

  if (claimError) {
    console.error('Claim API: Error redeeming invitation code:', claimError);
    return NextResponse.json({ error: 'No se pudo reclamar la invitación.' }, { status: 500 });
  }

  if (!invitation) {
    return NextResponse.json({ error: 'Código de reclamo inválido o la invitación ya ha sido reclamada.' }, { status: 404 });
  }

  if (typeof invitation === 'object' && invitation !== null && 'error' in invitation && invitation.error === 'already_owned') {
    return NextResponse.json({ error: 'Ya eres dueño de esta invitación.' }, { status: 400 });
  }

  return NextResponse.json({
    success: true,
    message: '¡Invitación reclamada con éxito!',
    invitation,
  });
}
