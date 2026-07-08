// src/components/editor/form-sections/MainDetailsSection.tsx
"use client";

import { EditorData, TemplateConfig } from '@/lib/types';
import TextInput from '../shared/TextInput';
import TextareaInput from '../shared/TextareaInput';
import DateTimePicker from '../shared/DateTimePicker';
import TimePicker from '../shared/TimePicker';
import PortraitImageUploader from '../shared/PortraitImageUploader';
import HeroImageUploader from '../shared/HeroImageUploader';
import { Type, User, GraduationCap, Calendar, MapPin } from 'lucide-react';

type MainDetailsSectionProps = {
  data: EditorData;
  template: TemplateConfig;
  onFieldChange: (field: string, value: string) => void;
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

      {defaultData.photoUrl !== undefined && (
        <PortraitImageUploader
          label="Portrait Image"
          value={data.photoUrl}
          onChange={(url) => onFieldChange('photoUrl', url)}
        />
      )}

      {defaultData.heroTitle !== undefined && (
        <div className="space-y-2">
          <TextInput 
            label="Hero Heading"
            placeholder="e.g., Save the Date"
            value={data.heroTitle} 
            onChange={(val) => onFieldChange('heroTitle', val)} 
          />
        </div>
      )}

      {/* Names */}
      <div className="space-y-2">
        <TextInput 
          label="Subject Name(s)"
          placeholder="e.g., Alguien & Alguien"
          value={data.heroNames} 
          onChange={(val) => onFieldChange('heroNames', val)} 
        />
      </div>

      {defaultData.parentsNames !== undefined && (
        <div className="space-y-2">
          <TextInput
            label="Parents' Names"
            placeholder="e.g., John & Jane Doe"
            value={data.parentsNames}
            onChange={(val) => onFieldChange('parentsNames', val)}
          />
        </div>
      )}

      {defaultData.parentsDescription !== undefined && (
        <div className="space-y-2">
          <TextareaInput
            label="Parents' Description"
            placeholder="e.g., A few words from the happy couple..."
            value={data.parentsDescription}
            onChange={(val) => onFieldChange('parentsDescription', val)}
          />
        </div>
      )}

      {/* Event Date */}
      <div className="space-y-2">
        <DateTimePicker
          label="Event Date"
          value={data.event_date || ''}
          onChange={(val) => onFieldChange('event_date', val)}
        />
      </div>

      {/* Guest Count */}
      {templateFeatures.guestCount && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Número de Invitados</label>
          <input
            type="number"
            value={data.guestCount?.toString() || ''}
            onChange={(e) => onFieldChange('guestCount', e.target.value)}
            placeholder="p. ej., 2"
            min={0}
            className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow text-slate-900"
          />
        </div>
      )}

      {/* START TIME */}
      {defaultData.startTime !== undefined && (
        <div className="space-y-2">
          <TimePicker
            label="Start Time"
            value={data.startTime || ''}
            onChange={(val) => onFieldChange('startTime', val)}
          />
        </div>
      )}

      {/* END TIME */}
      {defaultData.endTime !== undefined && (
        <div className="space-y-2">
          <TimePicker
            label="End Time"
            value={data.endTime || ''}
            onChange={(val) => onFieldChange('endTime', val)}
          />
        </div>
      )}

      {/* RSVP Date Text */}
      {defaultData.rsvpDateText !== undefined && (
        <div className="space-y-2">
          <TextInput
            label="RSVP Date Text"
            placeholder="e.g., 15 de julio"
            value={data.rsvpDateText}
            onChange={(val) => onFieldChange('rsvpDateText', val)}
          />
        </div>
      )}

      {/* Generic Location - shown for non-map templates */}
      {!hasMap && (
        <div className="space-y-2">
          <TextInput
            label="Location"
            placeholder="e.g., Mi Casa  Blvd 123, Ciudad, Estado"
            value={defaultData.locationName ? data.locationName : data.location}
            onChange={(val) => onFieldChange(defaultData.locationName ? 'locationName' : 'location', val)}
          />
        </div>
      )}

      {/* Date Subtitle */}
      {defaultData.dateSubtitle !== undefined && (
        <div className="space-y-2">
          <TextInput
            label="Date Section Subtitle"
            placeholder="e.g., ¡No podemos esperar a verte!"
            value={data.dateSubtitle}
            onChange={(val) => onFieldChange('dateSubtitle', val)}
          />
        </div>
      )}

      {/* Graduation Specifics */}
      {templateFeatures.futurePlans && (
        <div className="space-y-2">
          <TextInput 
            label="Academic Degree"
            placeholder="e.g., Licenciatura en Ingeniería Civil"
            value={data.degreeType} 
            onChange={(val) => onFieldChange('degreeType', val)} 
          />
        </div>
      )}

      {/* Birthday Age */}
      {templateFeatures.ageSpecificThemes && (
        <div className="space-y-2">
          <TextInput 
            label="Edad a Celebrar"
            placeholder="e.g., 5"
            value={data.age?.toString()} 
            onChange={(val) => onFieldChange('age', val)} 
          />
        </div>
      )}

      {/* Corporate City */}
      {defaultData.venue_city !== undefined && (
        <div className="space-y-2">
          <TextInput 
            label="Event City"
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
              <TextInput 
                label="Venue Name"
                placeholder="e.g., The Grand Hall"
                value={data.locationName} 
                onChange={(val) => onFieldChange('locationName', val)} 
              />
            </div>
          )}

          <div className='space-y-2'>
            <TextInput 
              label="Main Venue Address"
              placeholder="Street, City, State, ZIP"
              value={data.mainVenueAddress} 
              onChange={(val) => onFieldChange('mainVenueAddress', val)} 
            />
            <p className="text-[10px] text-slate-400 italic">
              This address will be used to generate the &quot;Get Directions&quot; button for mobile users.
            </p>
          </div>
        </div>
      )}

      {/* Reception Details */}
      {defaultData.receptionTitle !== undefined && (
        <div className="space-y-4 pt-4 border-t border-slate-50">
          <div className='space-y-2'>
            <TextInput 
              label="Reception Title"
              placeholder="e.g., Recepción"
              value={data.receptionTitle} 
              onChange={(val) => onFieldChange('receptionTitle', val)} 
            />
          </div>
          <div className='space-y-2'>
            <TextareaInput 
              label="Reception Text"
              placeholder="e.g., Acompáñanos a celebrar..."
              value={data.receptionText} 
              onChange={(val) => onFieldChange('receptionText', val)} 
            />
          </div>
          <div className='space-y-2'>
            <TextInput 
              label="Reception Place"
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