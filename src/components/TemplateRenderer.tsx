"use client";

import dynamic from 'next/dynamic';
import { TemplateConfig } from '@/lib/types';

// Existing imports...
const TimelineWedding = dynamic(() => import('./templates/TimelineTemplate'));
const MinimalistWedding = dynamic(() => import('./templates/MinimalistWeddingTemplate'));
const RomanticWedding = dynamic(() => import('./templates/RomanticWeddingTemplate'));
const Quinceanera = dynamic(() => import('./templates/QuinceaneraTemplate'));
const BirthdayBash = dynamic(() => import('./templates/BirthdayTemplate'));
const GenderReveal = dynamic(() => import('./templates/BabyShowerTemplate'));
const Graduation = dynamic(() => import('./templates/GraduationTemplate'));

// --- ADD THESE NEW IMPORTS ---
const BaptismTemplate = dynamic(() => import('./templates/BaptismTemplateProps'));
const CorporateTemplate = dynamic(() => import('./templates/CorporateTemplate'));

const TEMPLATE_COMPONENTS: { [key: string]: any } = {
  'timeline-wedding': TimelineWedding,
  'minimalist-wedding': MinimalistWedding,
  'romantic-wedding': RomanticWedding,
  'quinceanera-dream': Quinceanera,
  'kids-birthday-bash': BirthdayBash,
  'gender-reveal-party': GenderReveal,
  'graduation-celebration': Graduation,
  
  // --- REGISTER THE NEW TEMPLATES HERE ---
  // The keys MUST match the IDs in your templateConfig.ts
  'baptism-ethereal': BaptismTemplate,
  'corporate-summit': CorporateTemplate,
};

interface TemplateRendererProps {
  templateId: string;
  template: TemplateConfig;
  data: any;
}

export default function TemplateRenderer({ templateId, template, data }: TemplateRendererProps) {
  const SelectedComponent = TEMPLATE_COMPONENTS[templateId];

  if (!SelectedComponent) {
    return (
      <div className="p-8 text-center bg-red-50 text-red-600 rounded-lg">
        <h2 className="text-xl font-bold">Template component for "{template.name}" not found.</h2>
        <p className="mt-2">Make sure the ID <strong>{templateId}</strong> is registered in TemplateRenderer.tsx</p>
      </div>
    );
  }

  return <SelectedComponent template={template} data={data} />;
}