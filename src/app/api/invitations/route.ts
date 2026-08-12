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

  // Check user's plan and credits
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('plan, template_credits')
    .eq('id', user.id)
    .single();

  if (profileError) {
    return NextResponse.json({ error: 'Could not retrieve user profile.' }, { status: 500 });
  }

  // Plan-based authorization
  if (profile.plan === 'single_tier') {
    // For 'single_tier' users, allow only one active draft.
    const { count: draftCount, error: draftError } = await supabase
      .from('invitations')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('is_published', false);

    if (draftError) {
      return NextResponse.json({ error: 'Error checking for existing drafts.' }, { status: 500 });
    }

    if (draftCount > 0) {
      return NextResponse.json({ error: 'You already have an active draft. Please publish or delete it before creating a new one on this plan.' }, { status: 403 });
    }
  } else {
    // For all other plans (including NULL for new users), require credits.
    if (!profile.template_credits || profile.template_credits <= 0) {
      return NextResponse.json({ error: 'You have no template credits to create a new invitation. Please purchase more to continue.' }, { status: 403 });
    }
  }


  const body = await request.json();
  const { template, slug } = body;

  if (!template) {
    return NextResponse.json({ error: 'Se requiere un nombre de plantilla.' }, { status: 400 });
  }


  const selectedTemplate = templateConfig[template];

  if (!selectedTemplate) {
    return NextResponse.json({ error: `Plantilla "${template}" no encontrada.` }, { status: 404 });
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
      return NextResponse.json({ error: 'Este enlace personalizado ya está en uso. Por favor elige otro.' }, { status: 409 });
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
      return NextResponse.json({ error: 'Este enlace personalizado ya está en uso. Por favor elige otro.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Error al crear la invitación en la base de datos.', details: error.message }, { status: 500 });
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
