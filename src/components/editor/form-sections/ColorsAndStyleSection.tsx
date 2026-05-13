// src/components/editor/form-sections/ColorsAndStyleSection.tsx
"use client";

import ColorInput from '../shared/ColorInput';
import FontSelection from '../shared/FontSelection';
import PaletteSelection from '../shared/PaletteSelection';
import { TemplateConfig } from '@/lib/types';

type ColorsAndStyleSectionProps = {
  data: any;
  template: TemplateConfig;
  onFieldChange: (field: string, value: any) => void;
};

export default function ColorsAndStyleSection({ data, template, onFieldChange }: ColorsAndStyleSectionProps) {
  const handlePaletteSelect = (palette: { primary: string; text: string }) => {
    onFieldChange('primaryColor', palette.primary);
    onFieldChange('textColor', palette.text);
  };

  return (
    <div className="p-6 border-b">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Colors & Style</h3>
      <div className="space-y-6">
        {template.palettes && (
          <PaletteSelection palettes={template.palettes} onPaletteSelect={handlePaletteSelect} />
        )}
        <ColorInput label="Primary Color" value={data.primaryColor} onChange={(val) => onFieldChange('primaryColor', val)} />
        <ColorInput label="Text Color" value={data.textColor} onChange={(val) => onFieldChange('textColor', val)} />
        {template.fonts && (
          <FontSelection
            fonts={template.fonts}
            selectedFont={data.font || template.defaultFont}
            onFontChange={(val) => onFieldChange('font', val)}
          />
        )}
      </div>
    </div>
  );
}
