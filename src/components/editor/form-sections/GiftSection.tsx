// src/components/editor/form-sections/GiftSection.tsx
"use client";

import TextInput from '../shared/TextInput';
import TextareaInput from '../shared/TextareaInput';

type GiftSectionProps = {
  data: {
    giftRegistryUrl?: string;
    giftTitle?: string;
    giftMessage?: string;
  };
  onFieldChange: (field: string, value: string) => void;
};

export default function GiftSection({ data, onFieldChange }: GiftSectionProps) {
  return (
    <div className="p-6 space-y-6 bg-white">
      <div className="space-y-2">
        <TextInput
          label="Título de la sección de regalos"
          placeholder="p. ej., Mesa de Regalos"
          value={data.giftTitle}
          onChange={(val) => onFieldChange('giftTitle', val)}
        />
      </div>
      <div className="space-y-2">
        <TextareaInput
          label="Mensaje de regalos"
          placeholder="Escribe un mensaje sobre los regalos..."
          value={data.giftMessage}
          onChange={(val) => onFieldChange('giftMessage', val)}
        />
      </div>
      <div className="space-y-2">
        <TextInput
          label="Enlace a la mesa de regalos"
          placeholder="p. ej., https://www.amazon.com/wedding/..."
          value={data.giftRegistryUrl}
          onChange={(val) => onFieldChange('giftRegistryUrl', val)}
        />
        <p className="text-[10px] text-slate-400 italic">
          Provide a link to your external gift registry (e.g., Amazon, Zola, etc.).
        </p>
      </div>
    </div>
  );
}
