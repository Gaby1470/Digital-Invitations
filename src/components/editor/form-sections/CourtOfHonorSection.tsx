"use client";

import { produce } from 'immer';
import { CourtMember } from '@/lib/types';
import TextInput from '../shared/TextInput';
import ImageUploader from '../shared/ImageUploader';
import { Plus, Trash2 } from 'lucide-react';

type CourtOfHonorSectionProps = {
  data: { courtOfHonor?: CourtMember[] };
    onFieldChange: (field: string, value: CourtMember[]) => void;
};

export default function CourtOfHonorSection({ data, onFieldChange }: CourtOfHonorSectionProps) {
  const courtOfHonor = data.courtOfHonor || [];

  const handleItemChange = (index: number, field: keyof CourtMember, value: string) => {
    const nextState = produce(courtOfHonor, (draft) => {
      const member = draft[index];
      if (member) {
        (member[field] as string) = value;
      }
    });
    onFieldChange('courtOfHonor', nextState);
  };

  const handleAddItem = () => {
    const nextState = produce(courtOfHonor, (draft) => {
      draft.push({ name: 'New Member', role: 'Dama', photoUrl: '' });
    });
    onFieldChange('courtOfHonor', nextState);
  };

  const handleRemoveItem = (index: number) => {
    const nextState = produce(courtOfHonor, (draft) => {
      draft.splice(index, 1);
    });
    onFieldChange('courtOfHonor', nextState);
  };

  return (
    <div className="p-6">
      <div className="space-y-4">
        {courtOfHonor.map((item, index) => (
          <div key={index} className="space-y-4 p-4 border rounded-lg relative">
            <button 
              onClick={() => handleRemoveItem(index)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
            >
              <Trash2 size={16} />
            </button>
            <TextInput
              label="Name"
              value={item.name}
              onChange={(value) => handleItemChange(index, 'name', value)}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select
                value={item.role}
                onChange={(e) => handleItemChange(index, 'role', e.target.value as 'Dama' | 'Chambelán')}
                className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Dama">Dama</option>
                <option value="Chambelán">Chambelán</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Photo</label>
              {item.photoUrl && (
                <div className="mb-2">
                  <img src={item.photoUrl} alt={item.name} className="w-24 h-24 object-cover rounded-lg" />
                </div>
              )}
              <ImageUploader onImageUploaded={(url) => handleItemChange(index, 'photoUrl', url)} />
            </div>
          </div>
        ))}
      </div>
      <button 
        onClick={handleAddItem}
        className="mt-4 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-2"
      >
        <Plus size={16} /> Add Member
      </button>
    </div>
  );
}
