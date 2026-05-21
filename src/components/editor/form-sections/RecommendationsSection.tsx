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
    <div className="p-6 bg-white">
      <ListEditor
        title="Recommendations"
        addItemText="+ Add Recommendation"
        items={data.recommendations || []}
        defaultItem={{ name: "", description: "", link: "" }}
        onChange={(items) => onFieldChange('recommendations', items)}
        renderItem={(item, index, handleItemChange) => (
          <div className="space-y-4 border-b border-slate-50 pb-4 mb-4 last:border-0 last:mb-0">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Place Name
              </label>
              <TextInput 
                placeholder="e.g., The Grand Hotel"
                value={item.name} 
                onChange={(val) => handleItemChange(index, 'name', val)} 
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Description / Notes
              </label>
              {/* TextareaInput allows the container to grow with long text */}
              <TextareaInput 
                placeholder="Details about booking, location, or why you recommend it..."
                value={item.description} 
                onChange={(val) => handleItemChange(index, 'description', val)}
                className="min-h-[100px] resize-none" 
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Website Link
              </label>
              <TextInput 
                placeholder="https://..."
                value={item.link} 
                onChange={(val) => handleItemChange(index, 'link', val)} 
              />
            </div>
          </div>
        )}
      />
    </div>
  );
}