// src/components/editor/form-sections/ParentsAndGodparentsSection.tsx
"use client";

import { useState } from 'react';
import CollapsibleSection from '../shared/CollapsibleSection';

type ParentsAndGodparentsSectionProps = {
  partner1Parents: string[];
  partner2Parents: string[];
  godparents: string[];
  onUpdate: (data: { partner1Parents?: string[]; partner2Parents?: string[]; godparents?: string[] }) => void;
  partner1Name?: string;
  partner2Name?: string;
};

function StringListEditor({ label, items, onUpdate, placeholder, verb }: { label: string, items: string[], onUpdate: (items: string[]) => void, placeholder: string, verb: string }) {
  const [newItem, setNewItem] = useState('');

  const handleAddItem = () => {
    if (newItem.trim() !== '') {
      onUpdate([...items, newItem.trim()]);
      setNewItem('');
    }
  };

  const handleRemoveItem = (index: number) => {
    onUpdate(items.filter((_, i) => i !== index));
  };
  
  const handleItemChange = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = value;
    onUpdate(newItems);
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-3">{label}</h3>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
            <input
              type="text"
              value={item}
              onChange={(e) => handleItemChange(index, e.target.value)}
              className="flex-grow border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow text-slate-900"
            />
            <button onClick={() => handleRemoveItem(index)} className="text-red-500 hover:text-red-700 font-bold text-xl px-2">&times;</button>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder={placeholder}
          className="flex-grow border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow text-slate-900"
        />
        <button onClick={handleAddItem} className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors whitespace-nowrap">{verb}</button>
      </div>
    </div>
  );
}


export function ParentsAndGodparentsSection({
  partner1Parents,
  partner2Parents,
  godparents,
  onUpdate,
  partner1Name = "Partner 1",
  partner2Name = "Partner 2",
}: ParentsAndGodparentsSectionProps) {
  return (
    <CollapsibleSection title="Family & Godparents">
      <div className="space-y-6 p-6">
        <StringListEditor
          label={`Parents of ${partner1Name}`}
          items={partner1Parents || []}
          onUpdate={(newParents) => onUpdate({ partner1Parents: newParents })}
          placeholder="Enter parent's full name"
          verb="Add Parent"
        />
        <StringListEditor
          label={`Parents of ${partner2Name}`}
          items={partner2Parents || []}
          onUpdate={(newParents) => onUpdate({ partner2Parents: newParents })}
          placeholder="Enter parent's full name"
          verb="Add Parent"
        />
        <StringListEditor
          label="Godparents"
          items={godparents || []}
          onUpdate={(newGodparents) => onUpdate({ godparents: newGodparents })}
          placeholder="Enter godparent's full name"
          verb="Add Godparent"
        />
      </div>
    </CollapsibleSection>
  );
}
