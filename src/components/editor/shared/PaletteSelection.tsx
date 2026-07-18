// src/components/editor/shared/PaletteSelection.tsx
"use client";

type Palette = {
  name: string;
  primary: string;
  text: string;
};

type PaletteSelectionProps = {
  palettes: Palette[];
  onPaletteSelect: (palette: Palette) => void;
};

export default function PaletteSelection({ palettes, onPaletteSelect }: PaletteSelectionProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Paleta de colores pre-diseñada</label>
      <div className="grid grid-cols-3 gap-3">
        {palettes.map((palette) => (
          <div 
            key={palette.name}
            onClick={() => onPaletteSelect(palette)}
            className="cursor-pointer rounded-lg overflow-hidden shadow-sm transition-transform hover:scale-105"
          >
            <div className="h-12" style={{ backgroundColor: palette.primary }} />
            <div className="h-8" style={{ backgroundColor: palette.text }} />
            <p className="text-xs text-center p-1 bg-white">{palette.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
