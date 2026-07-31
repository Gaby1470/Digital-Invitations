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
        label="Regalo para Team Boy"
        value={data.teamBoyProduct || ''}
        onChange={(value) => onFieldChange('teamBoyProduct', value)}
        placeholder="p. ej., pañales"
      />
      <TextInput
        label="Regalo para Team Girl"
        value={data.teamGirlProduct || ''}
        onChange={(value) => onFieldChange('teamGirlProduct', value)}
        placeholder="p. ej., toallitas para bebé"
      />
    </div>
  );
}
