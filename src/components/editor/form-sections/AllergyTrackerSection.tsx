"use client";

import TextInput from '../shared/TextInput';

type AllergyTrackerSectionProps = {
  data: {
    allergyTrackerTitle?: string;
    allergyTrackerText?: string;
  };
  onFieldChange: (field: string, value: any) => void;
};

export default function AllergyTrackerSection({ data, onFieldChange }: AllergyTrackerSectionProps) {
  return (
    <div className="p-6 space-y-4">
      <TextInput
        label="Title"
        value={data.allergyTrackerTitle || ''}
        onChange={(value) => onFieldChange('allergyTrackerTitle', value)}
        placeholder="¿Hambriento? 🍕"
      />
      <TextInput
        label="Text"
        value={data.allergyTrackerText || ''}
        onChange={(value) => onFieldChange('allergyTrackerText', value)}
        placeholder="¡Háznos saber sobre cualquier alergia cuando confirmes tu asistencia!"
      />
    </div>
  );
}
