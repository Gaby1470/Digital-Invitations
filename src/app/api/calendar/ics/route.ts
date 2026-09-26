// src/app/api/calendar/ics/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { generateIcsContent } from '@/lib/calendar';
import { createClient } from '@/lib/supabase-server';
import { cookies } from 'next/headers';
import { getCalendarEventFromData } from '@/lib/calendar';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    let title = searchParams.get('title') || '';
    let startDate = searchParams.get('startDate') || '';
    let endDate = searchParams.get('endDate') || '';
    let startTime = searchParams.get('startTime') || undefined;
    let endTime = searchParams.get('endTime') || undefined;
    let location = searchParams.get('location') || '';
    let description = searchParams.get('description') || '';
    let eventUrl = searchParams.get('url') || '';

    // Si se pasa un slug y faltan datos principales, buscamos la invitación en Supabase
    if (slug && (!startDate || !title)) {
      const cookieStore = cookies();
      const supabase = createClient(cookieStore);
      const { data: invitation, error } = await supabase
        .from('invitations')
        .select('*')
        .eq('slug', slug)
        .single();

      if (!error && invitation) {
        const extracted = getCalendarEventFromData(invitation.data);
        title = title || extracted.title;
        startDate = startDate || (typeof extracted.startDate === 'string' ? extracted.startDate : extracted.startDate.toISOString());
        startTime = startTime || extracted.startTime;
        endTime = endTime || extracted.endTime;
        location = location || extracted.location || '';
        description = description || extracted.description || '';
        if (!eventUrl) {
          eventUrl = `${request.nextUrl.origin}/${slug}`;
        }
      }
    }

    if (!startDate) {
      return new NextResponse('Fecha de inicio no especificada', { status: 400 });
    }

    const icsString = generateIcsContent({
      title: title || 'Evento',
      startDate,
      endDate: endDate || undefined,
      startTime,
      endTime,
      location,
      description,
      url: eventUrl,
    });

    const safeFilename = (title || 'evento')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .toLowerCase();

    return new Response(icsString, {
      status: 200,
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': `attachment; filename="${safeFilename || 'evento'}.ics"`,
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Error generating .ics file:', error);
    return new NextResponse('Error al generar el archivo de calendario', { status: 500 });
  }
}
