"use client";

import TextInput from '../shared/TextInput';

type GenderBettingSectionProps = {
  data: {
    teamBoyProduct?: string;
    teamGirlProduct?: string;
  };
  onFieldChange: (field: string, value: string) => void;
};

export default function GenderBettingSection({ data, onFieldChange }: GenderBettingSectionProps) {
  return (
    <div className="p-6 space-y-4">
      <TextInput
        label="Team Boy Product"
        value={data.teamBoyProduct || ''}
        onChange={(value) => onFieldChange('teamBoyProduct', value)}
        placeholder="e.g., diapers"
      />
      <TextInput
        label="Team Girl Product"
        value={data.teamGirlProduct || ''}
        onChange={(value) => onFieldChange('teamGirlProduct', value)}
        placeholder="e.g., baby wipes"
      />
    </div>
  );
}
