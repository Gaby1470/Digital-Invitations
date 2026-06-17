// src/app/api/invitations/route.ts
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { templateConfig } from '@/lib/templateConfig';
import { randomBytes } from 'crypto';

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
  const { template, slug } = body;

  if (!template) {
    return NextResponse.json({ error: 'A template name is required.' }, { status: 400 });
  }


  const selectedTemplate = templateConfig[template];

  if (!selectedTemplate) {
    return NextResponse.json({ error: `Template "${template}" not found.` }, { status: 404 });
  }
  
  let sanitizedSlug;

  if (slug) {
    sanitizedSlug = sanitizeSlug(slug);
    const { data: slugConflict, error: slugError } = await supabase
      .from('invitations')
      .select('id')
      .eq('slug', sanitizedSlug)
      .single();

    if (slugError && slugError.code !== 'PGRST116') { // PGRST116 = no rows found
      return NextResponse.json({ error: 'Error checking slug uniqueness.', details: slugError.message }, { status: 500 });
    }
    if (slugConflict) {
      return NextResponse.json({ error: 'This custom link is already in use. Please choose another.' }, { status: 409 });
    }
  } else {
    // If no slug is provided, generate a unique random one
    while (true) {
      const randomSlug = randomBytes(4).toString('hex');
      const { data: slugConflict } = await supabase
        .from('invitations')
        .select('id')
        .eq('slug', randomSlug)
        .single();
      
      if (!slugConflict) {
        sanitizedSlug = randomSlug;
        break;
      }
    }
  }

  const newInvitationRecord = {
    user_id: user.id,
    template: template,
    data: selectedTemplate.defaultData,
    slug: sanitizedSlug,
  };

  const { data, error } = await supabase
    .from('invitations')
    .insert(newInvitationRecord)
    .select('id')
    .single();

  if (error) {
    console.error('Supabase error creating invitation:', error);
    if (error.code === '23505') { // Unique constraint violation on slug
      return NextResponse.json({ error: 'This custom link is already in use. Please choose another.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create invitation in database.', details: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, invitation: { id: data.id } });
}

function sanitizeSlug(slug: string): string {
  return slug
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .slice(0, 50);
}
