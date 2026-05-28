// src/components/editor/form-sections/MainDetailsSection.tsx
"use client";

import { TemplateFeatures } from '@/lib/types';
import TextInput from '../shared/TextInput';
import DateTimePicker from '../shared/DateTimePicker';
import { Type, User, GraduationCap, Calendar, MapPin } from 'lucide-react';

type MainDetailsSectionProps = {
  data: any;
  templateFeatures: TemplateFeatures;
  onFieldChange: (field: string, value: any) => void;
};

export default function MainDetailsSection({ data, templateFeatures, onFieldChange }: MainDetailsSectionProps) {
  return (
    <div className="p-6 space-y-6 bg-white">
      {/* Hero Title */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
          <Type size={14} /> Hero Heading
        </label>
        <TextInput 
          placeholder="e.g., Save the Date"
          value={data.heroTitle} 
          onChange={(val) => onFieldChange('heroTitle', val)} 
        />
      </div>
      
      {/* Names */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
          <User size={14} /> Subject Name(s)
        </label>
        <TextInput 
          placeholder="e.g., Alguien & Alguien"
          value={data.heroNames} 
          onChange={(val) => onFieldChange('heroNames', val)} 
        />
      </div>

      {/* Event Date */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
          <Calendar size={14} /> Event Date
        </label>
        <DateTimePicker
          value={data.event_date || ''}
          onChange={(val) => onFieldChange('event_date', val)}
          label=""
        />
      </div>

      {/* Location */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
          <MapPin size={14} /> Location
        </label>
        <TextInput
          placeholder="e.g., My House"
          value={data.location}
          onChange={(val) => onFieldChange('location', val)}
        />
      </div>

      {/* Date Subtitle */}
      {data.dateSubtitle !== undefined && (
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <Type size={14} /> Date Section Subtitle
          </label>
          <TextInput
            placeholder="e.g., We can't wait to see you!"
            value={data.dateSubtitle}
            onChange={(val) => onFieldChange('dateSubtitle', val)}
          />
        </div>
      )}

      {/* Graduation Specifics */}
      {templateFeatures.futurePlans && (
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <GraduationCap size={14} /> Academic Degree
          </label>
          <TextInput 
            placeholder="e.g., BS in Civil Engineering"
            value={data.degreeType} 
            onChange={(val) => onFieldChange('degreeType', val)} 
          />
        </div>
      )}

      {/* Birthday Age */}
      {templateFeatures.ageSpecificThemes && (
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <Calendar size={14} /> Age Celebrating
          </label>
          <TextInput 
            placeholder="e.g., 5"
            value={data.age} 
            onChange={(val) => onFieldChange('age', val)} 
          />
        </div>
      )}

      {/* Corporate City */}
      {data.venue_city !== undefined && (
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <MapPin size={14} /> Event City
          </label>
          <TextInput 
            placeholder="e.g., New York, NY"
            value={data.venue_city} 
            onChange={(val) => onFieldChange('venue_city', val)} 
          />
        </div>
      )}

      {/* Map Integration Address */}
      {(templateFeatures.lodgingAndTravel || templateFeatures.multiEventSchedule) && (
        <div className="space-y-2 pt-4 border-t border-slate-50">
          <label className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider">
            <MapPin size={14} /> Main Venue Address
          </label>
          <TextInput 
            placeholder="Street, City, State, ZIP"
            value={data.mainVenueAddress} 
            onChange={(val) => onFieldChange('mainVenueAddress', val)} 
          />
          <p className="text-[10px] text-slate-400 italic">
            This address will be used to generate the "Get Directions" button for mobile users.
          </p>
        </div>
      )}
    </div>
  );
}