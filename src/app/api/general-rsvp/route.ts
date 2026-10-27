// src/app/api/general-rsvp/route.ts
import { NextResponse } from 'next/server';
import { handleGeneralRsvp } from '@/lib/general-rsvp';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }
  return handleGeneralRsvp(request, body.invitationId, body);
}
