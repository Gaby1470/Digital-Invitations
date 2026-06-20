// src/components/editor/form-sections/GiftSection.tsx
"use client";

import TextInput from '../shared/TextInput';
import { Gift } from 'lucide-react';

type GiftSectionProps = {
  data: { giftRegistryUrl?: string };
  onFieldChange: (field: string, value: string) => void;
};

export default function GiftSection({ data, onFieldChange }: GiftSectionProps) {
  return (
    <div className="p-6 space-y-6 bg-white">
      <div className="space-y-2">
        <TextInput 
          label="Gift Registry"
          placeholder="e.g., https://www.amazon.com/wedding/..."
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
