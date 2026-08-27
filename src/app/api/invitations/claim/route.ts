// src/app/api/invitations/claim/route.ts
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/lib/types';

export async function POST(request: Request) {
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

  // Fetch the invitation with the matching claim code
  const { data: invitation, error: fetchError } = await supabaseAdmin
    .from('invitations')
    .select('id, user_id, is_custom_design')
    .eq('claim_code', cleanCode)
    .single();

  if (fetchError || !invitation) {
    return NextResponse.json({ error: 'Código de reclamo inválido o la invitación ya ha sido reclamada.' }, { status: 404 });
  }

  // Prevent claiming an invitation you already own
  if (invitation.user_id === user.id) {
    return NextResponse.json({ error: 'Ya eres dueño de esta invitación.' }, { status: 400 });
  }

  // Update the invitation: assign it to the user, and clear the claim code
  const { data: updatedInvitation, error: updateError } = await supabaseAdmin
    .from('invitations')
    .update({
      user_id: user.id,
      claim_code: null, // Clear code so it can only be redeemed once
      is_custom_design: true, // Mark it as custom designed
    })
    .eq('id', invitation.id)
    .select()
    .single();

  if (updateError) {
    console.error('Claim API: Error transferring invitation ownership:', updateError);
    return NextResponse.json({ error: 'Error al transferir la invitación. Por favor inténtalo de nuevo.' }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    message: '¡Invitación reclamada con éxito!',
    invitation: updatedInvitation,
  });
}
