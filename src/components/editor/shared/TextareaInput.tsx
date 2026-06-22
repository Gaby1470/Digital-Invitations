// src/components/editor/shared/TextareaInput.tsx
"use client";

export default function TextareaInput({ label, value, onChange, placeholder }: { label: string, value: string | undefined, onChange: (value: string) => void, placeholder?: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <textarea
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow text-slate-900"
        rows={4}
        placeholder={placeholder}
      />
    </div>
  );
}
