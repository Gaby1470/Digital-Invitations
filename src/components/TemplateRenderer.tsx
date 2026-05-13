// src/components/TemplateRenderer.tsx
"use client";

import { TemplateConfig } from '@/lib/types';
import TimelineTemplate from '@/components/templates/TimelineTemplate';
import QuinceaneraTemplate from '@/components/templates/QuinceaneraTemplate';
import BirthdayTemplate from '@/components/templates/BirthdayTemplate';
import BabyShowerTemplate from '@/components/templates/BabyShowerTemplate';
import GraduationTemplate from '@/components/templates/GraduationTemplate';

type TemplateRendererProps = {
  template: TemplateConfig;
  data: any;
};

const templateMap = {
  'Wedding': TimelineTemplate,
  'XV Years': QuinceaneraTemplate,
  'Birthday': BirthdayTemplate,
  'Baby Shower': BabyShowerTemplate,
  'Graduation': GraduationTemplate,
};

export default function TemplateRenderer({ template, data }: TemplateRendererProps) {
  const Component = templateMap[template.category];
  const selectedFont = data.font || template.defaultFont;

  const fontUrl = selectedFont ? `https://fonts.googleapis.com/css2?family=${selectedFont.replace(/ /g, '+')}:wght@400;700&display=swap` : '';

  if (!Component) {
    return <div>Error: Template component for category "{template.category}" not found.</div>;
  }

  return (
    <>
      {fontUrl && (
        <style jsx global>{`
          @import url('${fontUrl}');
        `}</style>
      )}
      <div style={{ fontFamily: selectedFont ? `'${selectedFont}', sans-serif` : 'inherit' }}>
        <Component template={template} data={data} />
      </div>
    </>
  );
}
