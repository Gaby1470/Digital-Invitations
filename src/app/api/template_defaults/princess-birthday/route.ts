// src/app/api/template_defaults/princess-birthday/route.ts
import { NextResponse } from 'next/server';
import { templateConfig } from '@/lib/templateConfig';

export async function GET() {
  const config = templateConfig['princess-birthday'];
  if (!config) {
    return NextResponse.json({ error: 'Template not found' }, { status: 404 });
  }
  return NextResponse.json(config.defaultData);
}
