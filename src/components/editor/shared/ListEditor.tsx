// src/components/editor/shared/ListEditor.tsx
"use client";

import { produce } from 'immer';

export default function ListEditor<T>({ items, onChange, renderItem, defaultItem, title, addItemText }: { items: T[], onChange: (items: T[]) => void, renderItem: (item: T, index: number, handleItemChange: (index: number, field: keyof T, value: any) => void) => React.ReactNode, defaultItem: T, title: string, addItemText: string }) {
  const handleItemChange = (index: number, field: keyof T, value: any) => {
    const newItems = produce(items, draft => {
      (draft[index] as any)[field] = value;
    });
    onChange(newItems);
  };

  const handleAddItem = () => {
    onChange([...items, defaultItem]);
  };

  const handleRemoveItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="p-4 border rounded-lg bg-gray-50 relative shadow-sm">
            <button onClick={() => handleRemoveItem(index)} className="absolute top-3 right-3 text-red-500 hover:text-red-700 font-bold text-xl">&times;</button>
            {renderItem(item, index, handleItemChange)}
          </div>
        ))}
      </div>
      <button onClick={handleAddItem} className="mt-4 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">{addItemText}</button>
    </div>
  );
}
