// src/lib/calendar.ts
import { EditorData } from './custom_types';

export interface CalendarEvent {
  title: string;
  description?: string;
  startDate: string | Date;
  endDate?: string | Date;
  startTime?: string;
  endTime?: string;
  location?: string;
  url?: string;
  uid?: string;
}

/**
 * Normaliza y formatea la hora en formato HH:mm (24 horas)
 */
function parseTimeComponents(timeStr?: string): { hours: number; minutes: number } | null {
  if (!timeStr) return null;
  const cleaned = timeStr.trim().toLowerCase();
  
  const match12 = cleaned.match(/^(\d{1,2}):(\d{2})(?::\d{2})?\s*(am|pm)?$/);
  if (!match12) return null;

  let hours = parseInt(match12[1], 10);
  const minutes = parseInt(match12[2], 10);
  const period = match12[3];

  if (period === 'pm' && hours < 12) hours += 12;
  if (period === 'am' && hours === 12) hours = 0;

  return { hours, minutes };
}

/**
 * Parsea el inicio y fin del evento asegurando fechas válidas
 */
export function parseEventDates(event: CalendarEvent): { start: Date; end: Date } {
  let start: Date;

  if (event.startDate instanceof Date) {
    start = new Date(event.startDate.getTime());
  } else if (typeof event.startDate === 'string' && event.startDate.trim() !== '') {
    const rawDateStr = event.startDate.trim();
    
    // Si la fecha es solo YYYY-MM-DD y se suministró startTime
    if (/^\d{4}-\d{2}-\d{2}$/.test(rawDateStr) && event.startTime) {
      const timeComp = parseTimeComponents(event.startTime);
      if (timeComp) {
        const [year, month, day] = rawDateStr.split('-').map(Number);
        start = new Date(year, month - 1, day, timeComp.hours, timeComp.minutes, 0);
      } else {
        start = new Date(rawDateStr);
      }
    } else {
      start = new Date(rawDateStr);
    }
  } else {
    start = new Date();
  }

  // Si start es una fecha inválida, usar la fecha actual
  if (isNaN(start.getTime())) {
    start = new Date();
  }

  // Determinar la fecha de fin
  let end: Date;
  if (event.endDate instanceof Date) {
    end = new Date(event.endDate.getTime());
  } else if (typeof event.endDate === 'string' && event.endDate.trim() !== '') {
    end = new Date(event.endDate);
    if (isNaN(end.getTime())) {
      end = new Date(start.getTime() + 4 * 60 * 60 * 1000); // 4 horas por defecto
    }
  } else if (event.endTime) {
    const endComp = parseTimeComponents(event.endTime);
    if (endComp) {
      end = new Date(start);
      end.setHours(endComp.hours, endComp.minutes, 0, 0);
      // Si la hora de fin es menor que la de inicio, asume que termina al día siguiente
      if (end.getTime() <= start.getTime()) {
        end.setDate(end.getDate() + 1);
      }
    } else {
      end = new Date(start.getTime() + 4 * 60 * 60 * 1000);
    }
  } else {
    // 4 horas de duración predeterminada
    end = new Date(start.getTime() + 4 * 60 * 60 * 1000);
  }

  return { start, end };
}

/**
 * Formatea una fecha a formato UTC ISO para iCal / Google (YYYYMMDDTHHmmssZ)
 */
export function formatIcsDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

/**
 * Escapa caracteres especiales según la especificación RFC 5545
 */
function escapeIcsText(text: string): string {
  if (!text) return '';
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

/**
 * Genera el archivo .ics (iCalendar) compatible con Apple Calendar, Google Calendar, Outlook, etc.
 */
export function generateIcsContent(event: CalendarEvent): string {
  const { start, end } = parseEventDates(event);
  const now = new Date();
  const nowIso = formatIcsDate(now);
  const startIso = formatIcsDate(start);
  const endIso = formatIcsDate(end);
  const uid = event.uid || `${now.getTime()}-${Math.random().toString(36).substring(2, 9)}@tap2invite.com`;

  const title = escapeIcsText(event.title || 'Evento');
  const description = escapeIcsText(
    [event.description, event.url ? `Ver invitación: ${event.url}` : ''].filter(Boolean).join('\n\n')
  );
  const location = escapeIcsText(event.location || '');
  const urlLine = event.url ? `URL:${event.url}` : '';

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Tap 2 Invite//Invitaciones Digitales//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${nowIso}`,
    `DTSTART:${startIso}`,
    `DTEND:${endIso}`,
    `SUMMARY:${title}`,
    description ? `DESCRIPTION:${description}` : '',
    location ? `LOCATION:${location}` : '',
    urlLine,
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
    // Recordatorio 24 horas antes
    'BEGIN:VALARM',
    'TRIGGER:-P1D',
    'ACTION:DISPLAY',
    `DESCRIPTION:Recordatorio: ${title}`,
    'END:VALARM',
    // Recordatorio 2 horas antes
    'BEGIN:VALARM',
    'TRIGGER:-PT2H',
    'ACTION:DISPLAY',
    `DESCRIPTION:Recordatorio: ${title} pronto comenzará`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].filter(Boolean);

  return lines.join('\r\n');
}

/**
 * Genera el enlace directo para añadir a Google Calendar
 */
export function generateGoogleCalendarUrl(event: CalendarEvent): string {
  const { start, end } = parseEventDates(event);
  const startStr = formatIcsDate(start);
  const endStr = formatIcsDate(end);

  const details = [event.description, event.url ? `Invitación: ${event.url}` : ''].filter(Boolean).join('\n\n');

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title || 'Evento',
    dates: `${startStr}/${endStr}`,
    details: details || '',
    location: event.location || '',
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Genera el enlace directo para añadir a Outlook Web
 */
export function generateOutlookUrl(event: CalendarEvent): string {
  const { start, end } = parseEventDates(event);
  const details = [event.description, event.url ? `Invitación: ${event.url}` : ''].filter(Boolean).join('\n\n');

  const params = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    subject: event.title || 'Evento',
    startdt: start.toISOString(),
    enddt: end.toISOString(),
    body: details || '',
    location: event.location || '',
  });

  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}

/**
 * Descarga en el cliente el archivo .ics
 */
export function downloadIcsFile(event: CalendarEvent): void {
  if (typeof window === 'undefined') return;

  const icsContent = generateIcsContent(event);
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const rawFileName = (event.title || 'evento')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .toLowerCase();
  const filename = `${rawFileName || 'evento'}.ics`;

  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => window.URL.revokeObjectURL(link.href), 2000);
}

/**
 * Detecta la plataforma móvil del visitante (iOS / Android / Other)
 */
export function getMobilePlatform(): 'ios' | 'android' | 'other' {
  if (typeof window === 'undefined') return 'other';
  const ua = navigator.userAgent || navigator.vendor || (window as unknown as { opera?: string }).opera || '';

  // Detección de iOS (iPhone, iPad, iPod y Safari en iPadOS)
  if (/iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) {
    return 'ios';
  }
  // Detección de Android
  if (/android/i.test(ua)) {
    return 'android';
  }

  return 'other';
}

/**
 * Extrae de forma estandarizada los datos de evento para calendario desde EditorData de cualquier plantilla
 */
export function getCalendarEventFromData(data?: EditorData | null): CalendarEvent {
  if (!data) {
    return {
      title: 'Invitación a Evento',
      startDate: new Date().toISOString(),
    };
  }

  // Resolver título del evento
  let title = 'Invitación a Evento';
  if (data.heroNames && typeof data.heroNames === 'string') {
    title = data.heroTitle ? `${data.heroTitle}: ${data.heroNames}` : data.heroNames;
  } else if (data.babyName && typeof data.babyName === 'string') {
    title = `Baby Shower de ${data.babyName}`;
  } else if (data.heroTitle && typeof data.heroTitle === 'string') {
    title = data.heroTitle;
  }

  // Resolver descripción
  const description =
    (typeof data.heroSubtitle === 'string' && data.heroSubtitle) ||
    (typeof data.eventDescription === 'string' && data.eventDescription) ||
    (typeof data.quote === 'string' && data.quote) ||
    '';

  // Resolver ubicación
  const location =
    (typeof data.locationName === 'string' && data.locationName) ||
    (typeof data.location === 'string' && data.location) ||
    (typeof data.mainVenueAddress === 'string' && data.mainVenueAddress) ||
    (typeof data.venue_city === 'string' && data.venue_city) ||
    '';

  const startDate = (typeof data.event_date === 'string' && data.event_date) || new Date().toISOString();
  const startTime = (typeof data.startTime === 'string' && data.startTime) || undefined;
  const endTime = (typeof data.endTime === 'string' && data.endTime) || undefined;

  return {
    title,
    description,
    location,
    startDate,
    startTime,
    endTime,
  };
}
