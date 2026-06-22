// src/components/editor/form-sections/ColorsAndStyleSection.tsx
"use client";

import ColorInput from '../shared/ColorInput';
import FontSelection from '../shared/FontSelection';
import PaletteSelection from '../shared/PaletteSelection';
import { EditorData, TemplateConfig } from '@/lib/types';

type ColorsAndStyleSectionProps = {
  data: EditorData;
  template: TemplateConfig;
  onFieldChange: (field: string, value: string) => void;
  onMultipleFieldsChange: (fields: { [key: string]: string }) => void;
};

export default function ColorsAndStyleSection({ data, template, onFieldChange, onMultipleFieldsChange }: ColorsAndStyleSectionProps) {
  const handlePaletteSelect = (palette: { primary: string; text: string }) => {
    onMultipleFieldsChange({
      primaryColor: palette.primary,
      textColor: palette.text,
    });
  };

  return (
    <div className="p-6">
      <div className="space-y-6">
        {template.palettes && (
          <PaletteSelection palettes={template.palettes} onPaletteSelect={handlePaletteSelect} />
        )}
        <ColorInput label="Primary Color" value={data.primaryColor} onChange={(val) => onFieldChange('primaryColor', val)} />
        <ColorInput label="Text Color" value={data.textColor} onChange={(val) => onFieldChange('textColor', val)} />
        {data.backgroundColor !== undefined && (
          <ColorInput label="Background Color" value={data.backgroundColor} onChange={(val) => onFieldChange('backgroundColor', val)} />
        )}

      </div>
    </div>
  );
}
