// src/app/api/invitations/[id]/general-rsvp/route.ts
import { NextResponse } from 'next/server';
import { handleGeneralRsvp } from '@/lib/general-rsvp';

export const dynamic = 'force-dynamic';

// POST handler to submit a "general" RSVP for an invitation that doesn't have a pre-existing guest party
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: invitationId } = await params;
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }
  return handleGeneralRsvp(request, invitationId, body);
}
