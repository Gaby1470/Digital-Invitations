// src/components/editor/form-sections/ParentalNotesSection.tsx
"use client";

import TextareaInput from '../shared/TextareaInput';

type ParentalNotesSectionProps = {
  data: Record<string, unknown> & {
    parentalNotes?: string;
  };
  onFieldChange: (field: string, value: unknown) => void;
};

export default function ParentalNotesSection({ data, onFieldChange }: ParentalNotesSectionProps) {
  return (
    <div className="p-6">
      <TextareaInput
        label="Note for Parents"
        name="parentalNotes"
        value={data.parentalNotes || ''}
        onFieldChange={onFieldChange}
        placeholder="e.g. Socks are required for the play area."
      />
    </div>
  );
}
