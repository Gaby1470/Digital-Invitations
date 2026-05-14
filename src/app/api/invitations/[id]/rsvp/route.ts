// src/app/api/invitations/[id]/rsvp/route.ts

import { createClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const invitationId = params.id;
  
  // 1. Get the RSVP data from the request body
  let rsvpData;
  try {
    rsvpData = await request.json();
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  // 2. Validate the incoming data (basic validation)
  const { name, status, plus_ones, message } = rsvpData;
  if (!name || !status || !['ATTENDING', 'DECLINED'].includes(status)) {
    return NextResponse.json({ error: 'Name and status are required.' }, { status: 400 });
  }

  // 3. Insert the new RSVP into the database
  const { data, error } = await supabase
    .from('rsvps')
    .insert([
      {
        invitation_id: invitationId,
        name: name,
        status: status,
        plus_ones: plus_ones || 0,
        message: message || null,
      },
    ])
    .select()
    .single(); // .single() returns the newly created row

  // 4. Handle any database errors
  if (error) {
    console.error('Supabase error:', error);
    return NextResponse.json({ error: 'Could not save RSVP.' }, { status: 500 });
  }

  // 5. Return a success response
  return NextResponse.json({ message: 'RSVP submitted successfully!', rsvp: data }, { status: 201 });
}
