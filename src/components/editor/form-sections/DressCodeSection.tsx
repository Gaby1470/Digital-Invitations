// src/components/editor/form-sections/DressCodeSection.tsx
"use client";

import { DressCode } from '@/lib/types';
import { Link as LinkIcon, Sparkles } from 'lucide-react';

type DressCodeSectionProps = {
  data: { dressCode?: DressCode };
  onFieldChange: (field: string, value: DressCode) => void;
};

export default function DressCodeSection({ data, onFieldChange }: DressCodeSectionProps) {
  const currentDressCode: DressCode = data.dressCode || {};

  const handlePinterestChange = (field: 'pinterestUrlMan' | 'pinterestUrlWoman', url: string) => {
    onFieldChange('dressCode', { ...currentDressCode, [field]: url });
  };

  return (
    <div className="p-6 bg-white space-y-6">
        <div className="space-y-4">
          <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl flex gap-3">
            <Sparkles className="text-indigo-600 shrink-0" size={18} />
            <p className="text-xs text-indigo-800 leading-relaxed">
              Pega el link de tus tableros de Pinterest para hombres y mujeres (opcional) y los invitados podrán ver ejemplos visuales del estilo de vestimenta que deseas para tu evento. ¡Hazlo divertido y fácil para todos!
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
    </div>
  );
}