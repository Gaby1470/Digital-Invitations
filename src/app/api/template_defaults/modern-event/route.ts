// src/app/api/template_defaults/modern-event/route.ts
import { NextResponse } from 'next/server';
import { templateConfig } from '@/lib/templateConfig';

export async function GET() {
  const config = templateConfig['modern-event'];
  if (!config) {
    return NextResponse.json({ error: 'Template not found' }, { status: 404 });
  }
  return NextResponse.json(config.defaultData);
}
