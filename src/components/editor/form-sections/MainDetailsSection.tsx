// src/components/editor/form-sections/MainDetailsSection.tsx
"use client";

import { TemplateFeatures } from '@/lib/types';
import TextInput from '../shared/TextInput';

type MainDetailsSectionProps = {
  data: any;
  templateFeatures: TemplateFeatures;
  onFieldChange: (field: string, value: any) => void;
};

export default function MainDetailsSection({ data, templateFeatures, onFieldChange }: MainDetailsSectionProps) {
  return (
    <div className="p-6 border-b">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Main Details</h3>
      </div>
      <div className="space-y-6">
        <TextInput label="Hero Title" value={data.heroTitle} onChange={(val) => onFieldChange('heroTitle', val)} />
        <TextInput label="Hero Name(s)" value={data.heroNames} onChange={(val) => onFieldChange('heroNames', val)} />
        {templateFeatures.lodgingAndTravel && (
          <TextInput label="Main Venue Address" value={data.mainVenueAddress} onChange={(val) => onFieldChange('mainVenueAddress', val)} />
        )}
      </div>
    </div>
  );
}
