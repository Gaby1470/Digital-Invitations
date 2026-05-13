// src/components/editor/shared/FontSelection.tsx
"use client";

type FontSelectionProps = {
  fonts: string[];
  selectedFont: string;
  onFontChange: (font: string) => void;
};

export default function FontSelection({ fonts, selectedFont, onFontChange }: FontSelectionProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Font</label>
      <select
        value={selectedFont}
        onChange={(e) => onFontChange(e.target.value)}
        className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
      >
        {fonts.map((font) => (
          <option key={font} value={font}>
            {font}
          </option>
        ))}
      </select>
    </div>
  );
}
