// src/components/editor/form-sections/RecommendationsSection.tsx
"use client";

import ListEditor from '../shared/ListEditor';
import TextInput from '../shared/TextInput';
import TextareaInput from '../shared/TextareaInput';

type RecommendationsSectionProps = {
  data: any;
  onFieldChange: (field: string, value: any) => void;
};

export default function RecommendationsSection({ data, onFieldChange }: RecommendationsSectionProps) {
  return (
    <div className="p-6">
      <ListEditor
        title="Recommendations"
        addItemText="+ Add Recommendation"
        items={data.recommendations || []}
        defaultItem={{ name: "New Recommendation", description: "", link: "" }}
        onChange={(items) => onFieldChange('recommendations', items)}
        renderItem={(item, index, handleItemChange) => (
          <div className="space-y-4">
            <TextInput label="Name" value={item.name} onChange={(val) => handleItemChange(index, 'name', val)} />
            <TextareaInput label="Description" value={item.description} onChange={(val) => handleItemChange(index, 'description', val)} />
            <TextInput label="Link" value={item.link} onChange={(val) => handleItemChange(index, 'link', val)} />
          </div>
        )}
      />
    </div>
  );
}
