// src/components/editor/form-sections/GiftRegistrySection.tsx
"use client";

import { EditorData } from '@/lib/custom_types';
import TextInput from '../shared/TextInput';
import TextareaInput from '../shared/TextareaInput';

type GiftRegistrySectionProps = {
  data: EditorData;
  onFieldChange: (field: string, value: string) => void;
};

export default function GiftRegistrySection({ data, onFieldChange }: GiftRegistrySectionProps) {
  return (
    <div className="p-6 space-y-6 bg-white">
      <div className="space-y-2">
        <TextInput
          label="Título de la Sección de Regalos"
          placeholder="e.g., Mesa de Regalos"
          value={data.giftTitle}
          onChange={(val) => onFieldChange('giftTitle', val)}
        />
      </div>
      <div className="space-y-2">
        <TextareaInput
          label="Mensaje de la Sección de Regalos"
          placeholder="e.g., Tu presencia es nuestro mayor regalo..."
          value={data.giftMessage}
          onChange={(val) => onFieldChange('giftMessage', val)}
        />
      </div>
      <div className="space-y-2">
        <TextInput
          label="Texto del Botón de Regalos"
          placeholder="e.g., Ver Opciones de Regalo"
          value={data.giftButtonText}
          onChange={(val) => onFieldChange('giftButtonText', val)}
        />
      </div>
      <div className="space-y-2">
        <TextInput
          label="URL de la Mesa de Regalos"
          placeholder="e.g., https://www.amazon.com"
          value={data.giftRegistryUrl}
          onChange={(val) => onFieldChange('giftRegistryUrl', val)}
        />
      </div>
    </div>
  );
}