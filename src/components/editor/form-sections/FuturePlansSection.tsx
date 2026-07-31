"use client";

import { EditorData } from '@/lib/custom_types';
import TextInput from '../shared/TextInput';
import TextareaInput from '../shared/TextareaInput';

type FuturePlansSectionProps = {
  data: EditorData;
  onFieldChange: (field: string, value: string) => void;
};

export default function FuturePlansSection({ data, onFieldChange }: FuturePlansSectionProps) {
  return (
    <div className="p-6 space-y-4">
      <TextInput
        label="Título de la Sección"
        value={data.futurePlansTitle || ''}
        onChange={(value) => onFieldChange('futurePlansTitle', value)}
        placeholder="Planes Futuros"
      />
      <TextareaInput
        label="Descripción de Planes Futuros"
        value={data.futurePlans || ''}
        onChange={(value) => onFieldChange('futurePlans', value)}
        placeholder="Después de la graduación, planeo..."
      />
    </div>
  );
}
