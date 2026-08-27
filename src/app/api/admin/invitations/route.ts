// src/app/api/admin/invitations/route.ts
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { templateConfig } from '@/lib/templateConfig';
import { randomBytes } from 'crypto';
import { Database } from '@/lib/types';

// Helper to check if a user is an admin
async function checkAdmin(supabase: ReturnType<typeof createClient>) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { isAdmin: false, user: null };

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single();

  return { isAdmin: !!profile?.is_admin, user };
}

// GET all invitations (Admin only)
export async function GET() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { isAdmin } = await checkAdmin(supabase);
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
  }

  // Create admin client to bypass RLS and fetch all invitations
  const supabaseAdmin = createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Fetch invitations
  const { data: invitations, error: invsError } = await supabaseAdmin
    .from('invitations')
    .select('*')
    .order('created_at', { ascending: false });

  if (invsError) {
    console.error('Admin API: Error fetching invitations:', invsError.message);
    return NextResponse.json({ 
      error: 'Failed to fetch invitations.', 
      debugMessage: invsError.message,
      hasServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY
    }, { status: 500 });
  }

  if (!invitations || invitations.length === 0) {
    return NextResponse.json([]);
  }

  // Fetch profiles for these invitations separately to bypass any stale PostgREST relationship cache bugs
  const userIds = Array.from(new Set(invitations.map(inv => inv.user_id).filter(Boolean))) as string[];
  
  const profilesMap: Record<string, { email: string; full_name: string | null; is_admin: boolean }> = {};
  
  if (userIds.length > 0) {
    const { data: profiles, error: profilesError } = await supabaseAdmin
      .from('profiles')
      .select('id, email, full_name, is_admin')
      .in('id', userIds);

    if (profilesError) {
      console.error('Admin API: Error fetching profiles:', profilesError.message);
    } else if (profiles) {
      profiles.forEach(p => {
        profilesMap[p.id] = {
          email: p.email || '',
          full_name: p.full_name || null,
          is_admin: !!p.is_admin
        };
      });
    }
  }

  // Map profiles back to invitations
  const result = invitations.map(inv => ({
    ...inv,
    profiles: inv.user_id ? (profilesMap[inv.user_id] || null) : null
  }));

  return NextResponse.json(result);
}

// POST create a custom invitation (Admin only)
export async function POST(request: Request) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { isAdmin, user } = await checkAdmin(supabase);
  if (!isAdmin || !user) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
  }

  const body = await request.json();
  const { template, slug } = body;

  if (!template) {
    return NextResponse.json({ error: 'Se requiere una plantilla.' }, { status: 400 });
  }

  const selectedTemplate = templateConfig[template];
  if (!selectedTemplate) {
    return NextResponse.json({ error: `Plantilla "${template}" no encontrada.` }, { status: 404 });
  }

  let sanitizedSlug = '';
  const RESERVED_SLUGS = [
    'contact', 'dashboard', 'how-it-works', 'pricing', 'templates', 'editor',
    'api', 'auth', 'rsvp', 'invite', 'print', 'sitemap.xml', 'viewer', 'public',
    '_next', 'favicon.ico', 'sw.js', 'admin'
  ];

  if (slug) {
    sanitizedSlug = slug
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .slice(0, 50);

    if (RESERVED_SLUGS.includes(sanitizedSlug)) {
      return NextResponse.json({ error: 'Este es un enlace reservado y no se puede usar.' }, { status: 409 });
    }

    const { data: slugConflict } = await supabase
      .from('invitations')
      .select('id')
      .eq('slug', sanitizedSlug)
      .single();

    if (slugConflict) {
      return NextResponse.json({ error: 'Este enlace personalizado ya está en uso.' }, { status: 409 });
    }
  } else {
    // Generate a unique random slug
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

  // Create the custom invitation under the admin's user_id initially
  const newInvitationRecord = {
    user_id: user.id,
    template: template,
    data: selectedTemplate.defaultData,
    slug: sanitizedSlug,
    is_custom_design: true,
    is_published: false,
  };

  const { data, error } = await supabase
    .from('invitations')
    .insert(newInvitationRecord)
    .select()
    .single();

  if (error) {
    console.error('Admin API: Error creating custom invitation:', error);
    return NextResponse.json({ error: 'Failed to create invitation in database.' }, { status: 500 });
  }

  return NextResponse.json({ success: true, invitation: data });
}
