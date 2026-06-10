// src/components/editor/form-sections/MainDetailsSection.tsx
"use client";

import { TemplateConfig } from '@/lib/types';
import TextInput from '../shared/TextInput';
import TextareaInput from '../shared/TextareaInput';
import DateTimePicker from '../shared/DateTimePicker';
import HeroImageUploader from '../shared/HeroImageUploader';
import { Type, User, GraduationCap, Calendar, MapPin } from 'lucide-react';

type MainDetailsSectionProps = {
  data: any;
  template: TemplateConfig;
  onFieldChange: (field: string, value: any) => void;
};

export default function MainDetailsSection({ data, template, onFieldChange }: MainDetailsSectionProps) {
  const { features: templateFeatures, defaultData } = template;
  const isBabyShower = defaultData.babyName !== undefined;
  const hasMap = templateFeatures.lodgingAndTravel || templateFeatures.multiEventSchedule;

  return (
    <div className="p-6 space-y-6 bg-white">
      {(defaultData.hero_image_url !== undefined || defaultData.family_image_url !== undefined) && (
        <HeroImageUploader
          label={defaultData.family_image_url ? "Family Image" : "Hero Image"}
          value={defaultData.family_image_url ? data.family_image_url : data.hero_image_url}
          onChange={(url) => onFieldChange(defaultData.family_image_url ? 'family_image_url' : 'hero_image_url', url)}
        />
      )}

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

      {defaultData.parentsNames !== undefined && (
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <User size={14} /> Parents' Names
          </label>
          <TextInput
            placeholder="e.g., John & Jane Doe"
            value={data.parentsNames}
            onChange={(val) => onFieldChange('parentsNames', val)}
          />
        </div>
      )}

      {defaultData.parentsDescription !== undefined && (
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <User size={14} /> Parents' Description
          </label>
          <TextareaInput
            placeholder="e.g., A few words from the happy couple..."
            value={data.parentsDescription}
            onChange={(val) => onFieldChange('parentsDescription', val)}
          />
        </div>
      )}

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

      {/* Generic Location - shown for non-map templates */}
      {!hasMap && (
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <MapPin size={14} /> Location
          </label>
          <TextInput
            placeholder="e.g., Mi Casa  Blvd 123, Ciudad, Estado"
            value={defaultData.locationName ? data.locationName : data.location}
            onChange={(val) => onFieldChange(defaultData.locationName ? 'locationName' : 'location', val)}
          />
        </div>
      )}

      {/* Date Subtitle */}
      {defaultData.dateSubtitle !== undefined && (
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <Type size={14} /> Date Section Subtitle
          </label>
          <TextInput
            placeholder="e.g., ¡No podemos esperar a verte!"
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
            placeholder="e.g., Licenciatura en Ingeniería Civil"
            value={data.degreeType} 
            onChange={(val) => onFieldChange('degreeType', val)} 
          />
        </div>
      )}

      {/* Birthday Age */}
      {templateFeatures.ageSpecificThemes && (
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <Calendar size={14} /> Edad a Celebrar  
          </label>
          <TextInput 
            placeholder="e.g., 5"
            value={data.age} 
            onChange={(val) => onFieldChange('age', val)} 
          />
        </div>
      )}

      {/* Corporate City */}
      {defaultData.venue_city !== undefined && (
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

      {/* Map-related fields */}
      {(hasMap || isBabyShower) && (
        <div className="space-y-4 pt-4 border-t border-slate-50">
          {defaultData.locationName !== undefined && (
            <div className='space-y-2'>
              <label className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider">
                <MapPin size={14} /> Venue Name
              </label>
              <TextInput 
                placeholder="e.g., The Grand Hall"
                value={data.locationName} 
                onChange={(val) => onFieldChange('locationName', val)} 
              />
            </div>
          )}

          <div className='space-y-2'>
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
        </div>
      )}

      {/* Reception Details */}
      {defaultData.receptionTitle !== undefined && (
        <div className="space-y-4 pt-4 border-t border-slate-50">
          <div className='space-y-2'>
            <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <Type size={14} /> Reception Title
            </label>
            <TextInput 
              placeholder="e.g., Recepción"
              value={data.receptionTitle} 
              onChange={(val) => onFieldChange('receptionTitle', val)} 
            />
          </div>
          <div className='space-y-2'>
            <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <Type size={14} /> Reception Text
            </label>
            <TextareaInput 
              placeholder="e.g., Acompáñanos a celebrar..."
              value={data.receptionText} 
              onChange={(val) => onFieldChange('receptionText', val)} 
            />
          </div>
          <div className='space-y-2'>
            <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <MapPin size={14} /> Reception Place
            </label>
            <TextInput 
              placeholder="e.g., Jardín de los Rosales"
              value={data.receptionPlace} 
              onChange={(val) => onFieldChange('receptionPlace', val)} 
            />
          </div>
        </div>
      )}
    </div>
  );
}