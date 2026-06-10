"use client";

import ListEditor from '../shared/ListEditor';
import TextInput from '../shared/TextInput';

type GodparentsSectionProps = {
  data: any;
  onFieldChange: (field: string, value: any) => void;
};

export default function GodparentsSection({ data, onFieldChange }: GodparentsSectionProps) {
  const handleGodparentsChange = (godparents: any[]) => {
    onFieldChange('godparents', godparents);
  };

  return (
    <div className="p-6 bg-white">
      <ListEditor
        items={data.godparents || []}
        onItemsChange={handleGodparentsChange}
        renderItem={(item, index, handleItemChange) => (
          <div className="grid grid-cols-2 gap-4">
            <TextInput 
              label="Role"
              value={item.role} 
              onChange={(val) => handleItemChange(index, 'role', val)} 
            />
            <TextInput 
              label="Name"
              value={item.name} 
              onChange={(val) => handleItemChange(index, 'name', val)} 
            />
          </div>
        )}
      />
    </div>
  );
}
