// src/components/editor/form-sections/ColorsAndStyleSection.tsx
"use client";

import ColorInput from '../shared/ColorInput';
import FontSelection from '../shared/FontSelection';
import PaletteSelection from '../shared/PaletteSelection';
import { TemplateConfig } from '@/lib/custom_types';
import { EditorData } from '@/lib/custom_types';

type ColorsAndStyleSectionProps = {
  data: EditorData;
  template: TemplateConfig;
  onFieldChange: (field: string, value: string) => void;
  onMultipleFieldsChange: (fields: { [key: string]: string }) => void;
};

export default function ColorsAndStyleSection({ data, template, onFieldChange, onMultipleFieldsChange }: ColorsAndStyleSectionProps) {
  const handlePaletteSelect = (palette: { primary: string; text: string; secondary?: string; dark?: string; }) => {
    if (template.name === 'Princess Birthday') {
      onMultipleFieldsChange({
        backgroundColor: palette.primary,
        textPrimary: palette.text,
        textGold: palette.secondary || '',
        textDark: palette.dark || '',
      });
    } else {
      onMultipleFieldsChange({
        primaryColor: palette.primary,
        textColor: palette.text,
      });
    }
  };

  const isPrincess = template.name === 'Princess Birthday';

  return (
    <div className="p-6">
      <div className="space-y-6">
        {template.palettes && (
          <PaletteSelection palettes={template.palettes} onPaletteSelect={handlePaletteSelect} />
        )}
        {isPrincess ? (
          <>
            <ColorInput label="Gold Text Color" value={data.textGold} onChange={(val) => onFieldChange('textGold', val)} />
            <ColorInput label="Dark Text Color" value={data.textDark} onChange={(val) => onFieldChange('textDark', val)} />
          </>
        ) : (
          <>
            <ColorInput label="Color Principal" value={data.primaryColor} onChange={(val) => onFieldChange('primaryColor', val)} />
            <ColorInput label="Color del Texto" value={data.textColor} onChange={(val) => onFieldChange('textColor', val)} />
            {data.backgroundColor !== undefined && (
              <ColorInput label="Color de Fondo" value={data.backgroundColor} onChange={(val) => onFieldChange('backgroundColor', val)} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
