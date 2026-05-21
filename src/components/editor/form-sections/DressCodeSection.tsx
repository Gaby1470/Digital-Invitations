// src/components/editor/form-sections/DressCodeSection.tsx
"use client";

import { useState } from 'react';
import { DressCode, DressCodeStyle, dressCodeDescriptions } from '@/lib/types';
import { Link as LinkIcon, Sparkles } from 'lucide-react';

const dressCodeOptions: DressCodeStyle[] = ['Formal', 'Semi-Formal', 'Cocktail', 'Garden Attire', 'Casual', 'Black Tie'];

type DressCodeSectionProps = {
  data: { dressCode?: DressCode };
  onFieldChange: (field: string, value: DressCode) => void;
};

export default function DressCodeSection({ data, onFieldChange }: DressCodeSectionProps) {
  const hasPinterestBoards = !!data.dressCode?.pinterestUrlMan || !!data.dressCode?.pinterestUrlWoman;
  const [isPinterest, setIsPinterest] = useState(hasPinterestBoards);
  const currentDressCode: DressCode = data.dressCode || { man: 'Formal', woman: 'Formal' };

  const handleStyleSelect = (style: DressCodeStyle) => {
    onFieldChange('dressCode', {
      ...currentDressCode,
      man: style,
      woman: style,
      pinterestUrlMan: undefined,
      pinterestUrlWoman: undefined,
    });
  };

  const handlePinterestChange = (field: 'pinterestUrlMan' | 'pinterestUrlWoman', url: string) => {
    onFieldChange('dressCode', { ...currentDressCode, [field]: url });
  };

  return (
    <div className="p-6 bg-white space-y-6">
      <div className="flex bg-slate-100 p-1 rounded-lg">
        <button
          onClick={() => setIsPinterest(false)}
          className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${!isPinterest ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}
        >
          Preset Styles
        </button>
        <button
          onClick={() => setIsPinterest(true)}
          className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${isPinterest ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}
        >
          Pinterest Board
        </button>
      </div>

      {!isPinterest ? (
        <div className="grid grid-cols-2 gap-3">
          {dressCodeOptions.map((option) => (
            <button
              key={option}
              onClick={() => handleStyleSelect(option)}
              className={`p-3 text-left rounded-xl border-2 transition-all ${
                currentDressCode.man === option && currentDressCode.woman === option
                ? 'border-indigo-600 bg-indigo-50' 
                : 'border-slate-100 hover:border-slate-200'
              }`}
            >
              <p className={`text-sm font-bold ${currentDressCode.man === option && currentDressCode.woman === option ? 'text-indigo-600' : 'text-slate-700'}`}>
                {option}
              </p>
              <p className="text-[10px] text-slate-400 mt-1 line-clamp-1 italic">
                {dressCodeDescriptions[option]}
              </p>
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
          <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl flex gap-3">
            <Sparkles className="text-indigo-600 shrink-0" size={18} />
            <p className="text-xs text-indigo-800 leading-relaxed">
              Paste Pinterest board URLs to show guests visual inspiration for both looks.
            </p>
          </div>
          <div className="relative">
            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="url"
              placeholder="Men's board: https://pinterest.com/..."
              value={currentDressCode.pinterestUrlMan || ''}
              onChange={(e) => handlePinterestChange('pinterestUrlMan', e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
            />
          </div>
          <div className="relative">
            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="url"
              placeholder="Women's board: https://pinterest.com/..."
              value={currentDressCode.pinterestUrlWoman || ''}
              onChange={(e) => handlePinterestChange('pinterestUrlWoman', e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
            />
          </div>
        </div>
      )}
    </div>
  );
}