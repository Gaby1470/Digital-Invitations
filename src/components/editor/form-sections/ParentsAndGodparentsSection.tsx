"use client";

import { produce } from 'immer';
import { Godparent, EditorData } from '@/lib/custom_types';
import TextInput from '../shared/TextInput';
import { PlusCircle, X } from 'lucide-react';

type ParentsAndGodparentsSectionProps = {
  data: EditorData;
  onFieldChange: (field: string, value: unknown) => void;
};

// A small component to manage a dynamic list of parent names
type ParentListEditorProps = {
  title: string;
  list: string[];
  onChange: (list: string[]) => void;
};

function ParentListEditor({ title, list, onChange }: ParentListEditorProps) {
  const handleAdd = () => {
    onChange([...(list || []), '']);
  };

  const handleRemove = (index: number) => {
    onChange(list.filter((_, i) => i !== index));
  };

  const handleChange = (index: number, value: string) => {
    const newList = [...list];
    newList[index] = value;
    onChange(newList);
  };

  return (
    <div className="p-4 border rounded-lg bg-slate-50 space-y-3">
      <h3 className="text-sm font-medium text-slate-600">{title}</h3>
      {(list || []).map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <TextInput
            label={`Nombre del Padre`}
            value={item}
            onChange={(val) => handleChange(index, val)}
          />
          <button
            type="button"
            onClick={() => handleRemove(index)}
            aria-label="Eliminar Padre"
            className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-md"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={handleAdd}
        className="flex items-center justify-center px-3 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50"
      >
        <PlusCircle className="h-4 w-4 mr-2" />
        Agregar Padre
      </button>
    </div>
  );
}


export default function ParentsAndGodparentsSection({ data, onFieldChange }: ParentsAndGodparentsSectionProps) {
  const godparents = data.godparents || [];

  const handleGodparentChange = (index: number, field: keyof Godparent, value: string) => {
    const nextState = produce(godparents, (draft: Godparent[]) => {
      if (draft[index]) {
        draft[index][field] = value;
      } else {
        draft[index] = { name: '', role: '', [field]: value };
      }
    });
    onFieldChange('godparents', nextState);
  };

  const godparent1 = godparents[0] || { role: '', name: '' };
  const godparent2 = godparents[1] || { role: '', name: '' };

  return (
    <div className="p-6 bg-white space-y-6">
      {/* Parents Section */}
      <div className="space-y-4">
        <TextInput
          label="Parents Section Title"
          value={data.parentsTitle || ''}
          onChange={(val) => onFieldChange('parentsTitle', val)}
          placeholder="e.g., Con la bendición de mis padres"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ParentListEditor
            title="Padre 1"
            list={data.partner1Parents}
            onChange={(val) => onFieldChange('partner1Parents', val)}
          />
          <ParentListEditor
            title="Padre 2"
            list={data.partner2Parents}
            onChange={(val) => onFieldChange('partner2Parents', val)}
          />
        </div>
      </div>

      {/* Divider */}
      <div className="border-b border-slate-200"></div>

      {/* Godparents Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-slate-800 pt-4">Padrinos</h3>
        <div className="p-4 border rounded-lg bg-slate-50 space-y-3">
          <TextInput
            label="Rol del Padrino/Madrina 1"
            value={godparent1.role}
            onChange={(val) => handleGodparentChange(0, 'role', val)}
            placeholder="e.g., Padrino"
          />
          <TextInput
            label="Nombre del Padrino/Madrina 1"
            value={godparent1.name}
            onChange={(val) => handleGodparentChange(0, 'name', val)}
            placeholder="e.g., Juan Pérez"
          />
        </div>
        <div className="p-4 border rounded-lg bg-slate-50 space-y-3">
          <TextInput
            label="Rol del Padrino/Madrina 2"
            value={godparent2.role}
            onChange={(val) => handleGodparentChange(1, 'role', val)}
            placeholder="e.g., Madrina"
          />
          <TextInput
            label="Nombre del Padrino/Madrina 2"
            value={godparent2.name}
            onChange={(val) => handleGodparentChange(1, 'name', val)}
            placeholder="e.g., María García"
          />
        </div>
      </div>
    </div>
  );
}
