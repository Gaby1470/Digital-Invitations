// src/components/editor/form-sections/ParentalNotesSection.tsx
"use client";

import TextareaInput from '../shared/TextareaInput';
import TextInput from '../shared/TextInput';

type ParentalNotesSectionProps = {
  data: Record<string, unknown> & {
    parentalNotesTitle?: string;
    parentalNotes?: string;
  };
  onFieldChange: (field: string, value: unknown) => void;
};

export default function ParentalNotesSection({ data, onFieldChange }: ParentalNotesSectionProps) {
  return (
    <div className="p-6 space-y-4">
      <TextInput
        label="Título"
        value={data.parentalNotesTitle || ''}
        onChange={(value) => onFieldChange('parentalNotesTitle', value)}
        placeholder="Nota para los Padres"
      />
      <TextareaInput
        label="Contenido"
        name="parentalNotes"
        value={data.parentalNotes || ''}
        onFieldChange={onFieldChange}
        placeholder="e.g. Se requieren calcetines para el área de juegos."
      />
    </div>
  );
}
