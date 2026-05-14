// src/components/editor/form-sections/MainDetailsSection.tsx
"use client";

import { TemplateFeatures } from '@/lib/types';
import TextInput from '../shared/TextInput';

type MainDetailsSectionProps = {
  data: any;
  templateFeatures: TemplateFeatures;
  onFieldChange: (field: string, value: any) => void;
};

export default function MainDetailsSection({ data, templateFeatures, onFieldChange }: MainDetailsSectionProps) {
  return (
    <div className="p-6 border-b">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Main Details</h3>
      </div>
      
      <div className="space-y-6">
        {/* Core Fields for All Templates */}
        <TextInput 
          label="Hero Title" 
          placeholder="e.g., You're Invited to the Wedding of"
          value={data.heroTitle} 
          onChange={(val) => onFieldChange('heroTitle', val)} 
        />
        
        <TextInput 
          label="Name(s)" 
          placeholder="e.g., Olivia & Liam"
          value={data.heroNames} 
          onChange={(val) => onFieldChange('heroNames', val)} 
        />

        {/* Dynamic Graduation Field */}
        {templateFeatures.futurePlans && (
          <TextInput 
            label="Degree / Major" 
            placeholder="e.g., Bachelor of Science in Engineering"
            value={data.degreeType} 
            onChange={(val) => onFieldChange('degreeType', val)} 
          />
        )}

        {/* Dynamic Birthday Field */}
        {templateFeatures.ageSpecificThemes && (
          <TextInput 
            label="Age Turning" 
            placeholder="e.g., 5"
            value={data.age} 
            onChange={(val) => onFieldChange('age', val)} 
          />
        )}

        {/* Corporate Specific Field */}
        {data.venue_city !== undefined && (
          <TextInput 
            label="Event City" 
            placeholder="e.g., San Francisco, CA"
            value={data.venue_city} 
            onChange={(val) => onFieldChange('venue_city', val)} 
          />
        )}

        {/* Location Logic */}
        {templateFeatures.lodgingAndTravel || templateFeatures.multiEventSchedule ? (
          <TextInput 
            label="Main Venue Address" 
            placeholder="Full Address for Map Integration"
            value={data.mainVenueAddress} 
            onChange={(val) => onFieldChange('mainVenueAddress', val)} 
          />
        ) : null}
      </div>
    </div>
  );
}