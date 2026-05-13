// src/app/api/invitations/route.ts
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { templateConfig } from '@/lib/templateConfig';

export async function POST(request: Request) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'You must be logged in to create an invitation.' }, { status: 401 });
  }

  const body = await request.json();

  if (!body.template) {
    return NextResponse.json({ error: 'A template name is required.' }, { status: 400 });
  }

  const selectedTemplate = templateConfig[body.template];

  if (!selectedTemplate) {
    return NextResponse.json({ error: `Template "${body.template}" not found.` }, { status: 404 });
  }

  const newInvitationRecord = {
    user_id: user.id,
    template: body.template,
    data: selectedTemplate.defaultData, 
  };

  const { data, error } = await supabase
    .from('invitations')
    .insert(newInvitationRecord)
    .select('id')
    .single();

  if (error) {
    console.error('Supabase error creating invitation:', error);
    return NextResponse.json({ error: 'Failed to create invitation in database.', details: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, invitation: { id: data.id } });
}
