"use client";

import { produce } from 'immer';
import { Godparent } from '@/lib/custom_types';
import TextInput from '../shared/TextInput';

type GodparentsSectionProps = {
  data: { godparents?: Godparent[] };
  onFieldChange: (field: string, value: Godparent[]) => void;
};

export default function GodparentsSection({ data, onFieldChange }: GodparentsSectionProps) {
  const godparents = data.godparents || [];

  const handleGodparentChange = (index: number, field: keyof Godparent, value: string) => {
    const nextState = produce(godparents, (draft) => {
      if (draft[index]) {
        draft[index][field] = value;
      } else {
        // This case should ideally not be hit if defaultData is correct
        draft[index] = { name: '', role: '', [field]: value };
      }
    });
    onFieldChange('godparents', nextState);
  };

  const godparent1 = godparents[0] || { role: '', name: '' };
  const godparent2 = godparents[1] || { role: '', name: '' };

  return (
    <div className="p-6 bg-white space-y-6">
      <div className="p-4 border rounded-lg bg-slate-50">
        <h3 className="text-sm font-medium mb-3 text-slate-600">Godparent 1</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextInput 
            label="Role (e.g., Godmother)"
            value={godparent1.role} 
            onChange={(val) => handleGodparentChange(0, 'role', val)} 
          />
          <TextInput 
            label="Full Name"
            value={godparent1.name} 
            onChange={(val) => handleGodparentChange(0, 'name', val)} 
          />
        </div>
      </div>
      <div className="p-4 border rounded-lg bg-slate-50">
        <h3 className="text-sm font-medium mb-3 text-slate-600">Godparent 2</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextInput 
            label="Role (e.g., Godfather)"
            value={godparent2.role} 
            onChange={(val) => handleGodparentChange(1, 'role', val)} 
          />
          <TextInput 
            label="Name"
            value={godparent2.name} 
            onChange={(val) => handleGodparentChange(1, 'name', val)} 
          />
        </div>
      </div>
    </div>
  );
}
