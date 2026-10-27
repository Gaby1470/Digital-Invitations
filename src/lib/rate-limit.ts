import { createHmac } from 'crypto';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { Database } from '@/lib/types';

export async function enforceRateLimit(
  request: Request,
  scope: string,
  limit: number,
  windowSeconds: number
): Promise<NextResponse | null> {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    console.error('Rate limiting is unavailable because SUPABASE_SERVICE_ROLE_KEY is missing.');
    return NextResponse.json({ error: 'Service temporarily unavailable.' }, { status: 503 });
  }

  const address = request.headers.get('x-nf-client-connection-ip')
    || request.headers.get('x-real-ip')
    || request.headers.get('x-forwarded-for')?.split(',').pop()?.trim()
    || 'unknown';
  const addressHash = createHmac('sha256', serviceRoleKey).update(address).digest('hex');
  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey
  );

  const { data, error } = await supabase.rpc('consume_api_rate_limit', {
    p_bucket_key: `${scope}:${addressHash}`,
    p_limit: limit,
    p_window_seconds: windowSeconds,
  });

  if (error || !data?.[0]) {
    console.error('Rate limit check failed:', error);
    return NextResponse.json({ error: 'Service temporarily unavailable.' }, { status: 503 });
  }

  if (data[0].allowed) return null;

  return NextResponse.json(
    { error: 'Too many requests. Please try again later.' },
    { status: 429, headers: { 'Retry-After': String(data[0].retry_after) } }
  );
}