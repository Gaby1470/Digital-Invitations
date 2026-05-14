// src/components/editor/form-sections/DressCodeSection.tsx
"use client";
import { useState } from 'react';
import { DressCode, DressCodeStyle, dressCodeDescriptions } from '@/lib/types';
import { produce } from 'immer';

type DressCodeSectionProps = {
  data: {
    dressCode?: DressCode;
  };
  onFieldChange: (field: string, value: any) => void;
};

const dressCodeOptions: DressCodeStyle[] = ['Formal', 'Semi-Formal', 'Cocktail', 'Garden Attire', 'Casual', 'Black Tie'];

export default function DressCodeSection({ data, onFieldChange }: DressCodeSectionProps) {
  const [isPinterest, setIsPinterest] = useState(!!(data.dressCode?.pinterestUrlMan || data.dressCode?.pinterestUrlWoman));
  const currentDressCode = data.dressCode || { man: 'Formal', woman: 'Formal' };

  const handleStyleChange = (gender: 'man' | 'woman', newStyle: DressCodeStyle) => {
    const nextState = produce(currentDressCode, (draft) => {
      draft[gender] = newStyle;
    });
    onFieldChange('dressCode', nextState);
  };

  const handlePinterestUrlChange = (gender: 'man' | 'woman', url: string) => {
    const nextState = produce(currentDressCode, (draft) => {
      if (gender === 'man') {
        draft.pinterestUrlMan = url;
      } else {
        draft.pinterestUrlWoman = url;
      }
    });
    onFieldChange('dressCode', nextState);
  };

  const toggleInputMethod = () => {
    setIsPinterest(!isPinterest);
    const nextState = produce(currentDressCode, (draft) => {
      if (isPinterest) {
        delete draft.pinterestUrlMan;
        delete draft.pinterestUrlWoman;
      } else {
        draft.man = 'Formal';
        draft.woman = 'Formal';
      }
    });
    onFieldChange('dressCode', nextState);
  };
  
  return (
    <div className="p-6">
      <div className='flex justify-between items-center'>
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Dress Code</h3>
        <button
          onClick={toggleInputMethod}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500 mb-6"
        >
          {isPinterest ? 'Use Predefined Styles' : 'Use Pinterest Board'}
        </button>
      </div>

      <div className="space-y-6">
        {isPinterest ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="pinterest-url-man" className="block text-sm font-medium text-gray-700 mb-2">
                Men's Pinterest Board
              </label>
              <input
                type="url"
                id="pinterest-url-man"
                placeholder="https://pinterest.com/board/..."
                value={currentDressCode.pinterestUrlMan || ''}
                onChange={(e) => handlePinterestUrlChange('man', e.target.value)}
                className="block w-full border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
              />
            </div>
            <div>
              <label htmlFor="pinterest-url-woman" className="block text-sm font-medium text-gray-700 mb-2">
                Women's Pinterest Board
              </label>
              <input
                type="url"
                id="pinterest-url-woman"
                placeholder="https://pinterest.com/board/..."
                value={currentDressCode.pinterestUrlWoman || ''}
                onChange={(e) => handlePinterestUrlChange('woman', e.target.value)}
                className="block w-full border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="dress-code-man" className="block text-sm font-medium text-gray-700 mb-2">
                Men's Attire
              </label>
              <select
                id="dress-code-man"
                value={currentDressCode.man}
                onChange={(e) => handleStyleChange('man', e.target.value as DressCodeStyle)}
                className="block w-full border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
              >
                {dressCodeOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-2">
                {dressCodeDescriptions[currentDressCode.man]}
              </p>
            </div>
            <div>
              <label htmlFor="dress-code-woman" className="block text-sm font-medium text-gray-700 mb-2">
                Women's Attire
              </label>
              <select
                id="dress-code-woman"
                value={currentDressCode.woman}
                onChange={(e) => handleStyleChange('woman', e.target.value as DressCodeStyle)}
                className="block w-full border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
              >
                {dressCodeOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-2">
                {dressCodeDescriptions[currentDressCode.woman]}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
