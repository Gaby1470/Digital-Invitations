// src/components/editor/shared/DateTimePicker.tsx
"use client";

import { ChangeEvent } from 'react';

type DateTimePickerProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

export default function DateTimePicker({ label, value, onChange }: DateTimePickerProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        type="datetime-local"
        value={value}
        onChange={handleChange}
        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
      />
    </div>
  );
}
