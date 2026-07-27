// src/app/api/cron/expire-invitations/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  const authToken = (request.headers.get('authorization') || '').split('Bearer ')[1];

  if (authToken !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Use admin client for cron jobs to bypass RLS
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const now = new Date().toISOString();

  const { data: expired, error: fetchError } = await supabase
    .from('invitations')
    .select('id')
    .eq('is_published', true)
    .eq('is_expired', false)
    .lt('expires_at', now);

  if (fetchError) {
    console.error('Cron: Error fetching expired invitations:', fetchError);
    return NextResponse.json({ success: false, error: fetchError.message }, { status: 500 });
  }

  if (!expired || expired.length === 0) {
    return NextResponse.json({ success: true, message: 'No invitations to expire.' });
  }

  const idsToExpire = expired.map(inv => inv.id);

  const { error: updateError } = await supabase
    .from('invitations')
    .update({ is_expired: true })
    .in('id', idsToExpire);

  if (updateError) {
    console.error('Cron: Error updating invitations to expired:', updateError);
    return NextResponse.json({ success: false, error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, expiredCount: idsToExpire.length });
}
