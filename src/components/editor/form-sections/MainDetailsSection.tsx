// src/components/editor/form-sections/MainDetailsSection.tsx
"use client";

import { TemplateConfig } from '@/lib/custom_types';
import { EditorData } from '@/lib/custom_types';
import TextInput from '../shared/TextInput';
import TextareaInput from '../shared/TextareaInput';
import DateTimePicker from '../shared/DateTimePicker';
import TimePicker from '../shared/TimePicker';
import PortraitImageUploader from '../shared/PortraitImageUploader';
import HeroImageUploader from '../shared/HeroImageUploader';

type MainDetailsSectionProps = {
  data: EditorData;
  template: TemplateConfig;
  onFieldChange: (field: string, value: string) => void;
};

export default function MainDetailsSection({ data, template, onFieldChange }: MainDetailsSectionProps) {
  const { features: templateFeatures, defaultData } = template;
  const isBabyShower = defaultData.babyName !== undefined;
  const hasMap = templateFeatures.multiEventSchedule;

  return (
    <div className="p-8 space-y-6 bg-white">
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
            label="Titulo Principal"
            placeholder="e.g., Save the Date"
            value={data.heroTitle} 
            onChange={(val) => onFieldChange('heroTitle', val)} 
          />
        </div>
      )}

      {/* Names */}
      <div className="space-y-2">
        {isBabyShower ? (
          <TextInput
            label="Nombre del Bebe"
            placeholder="p. ej., Daniel"
            value={data.babyName}
            onChange={(val) => onFieldChange('babyName', val)}
          />
        ) : (
          <TextInput
            label="Nombre del Festjado(s)"
            placeholder="p. ej., Alguien & Alguien"
            value={data.heroNames}
            onChange={(val) => onFieldChange('heroNames', val)}
          />
        )}
      </div>

      {defaultData.eventDescription !== undefined && (
        <div className="space-y-2">
          <TextareaInput
            label="Descripción del Evento"
            placeholder="p. ej., Acompáñanos a celebrar..."
            value={data.eventDescription}
            onChange={(val) => onFieldChange('eventDescription', val)}
          />
        </div>
      )}

      {defaultData.heroSubtitle !== undefined && (
        <div className="space-y-2">
          <TextareaInput
            label="Subtítulo del Hero"
            placeholder="p. ej., Acompañanos a celebrar la dulce espera de nuestro bebé..."
            value={data.heroSubtitle}
            onChange={(val) => onFieldChange('heroSubtitle', val)}
          />
        </div>
      )}

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
            label="Descripción de los Padres"
            placeholder="e.g., unas palabras sobre los padres del festejado"
            value={data.parentsDescription}
            onChange={(val) => onFieldChange('parentsDescription', val)}
          />
        </div>
      )}

      {/* Event Date */}
      <div className="space-y-2">
        <DateTimePicker
          label="Fecha del Evento"
          value={data.event_date || ''}
          onChange={(val) => onFieldChange('event_date', val)}
        />
      </div>

      {/* START TIME */}
      {defaultData.startTime !== undefined && (
        <div className="space-y-2">
          <TimePicker
            label="Hora de Inicio"
            value={data.startTime || ''}
            onChange={(val) => onFieldChange('startTime', val)}
          />
        </div>
      )}

      {/* END TIME */}
      {defaultData.endTime !== undefined && (
        <div className="space-y-2">
          <TimePicker
            label="Hora de Finalización"
            value={data.endTime || ''}
            onChange={(val) => onFieldChange('endTime', val)}
          />
        </div>
      )}

      {/* RSVP Date Text */}
      {defaultData.rsvpDateText !== undefined && (
        <div className="space-y-2">
          <TextInput
            label="Fecha RSVP"
            placeholder="p. ej., 15 de julio"
            value={data.rsvpDateText}
            onChange={(val) => onFieldChange('rsvpDateText', val)}
          />
        </div>
      )}

      {/* Generic Location - shown for non-map templates */}
      {!hasMap && !isBabyShower && (
        <div className="space-y-2">
          <TextInput
            label="Ubicación"
            placeholder="p. ej., Mi Casa  Blvd 123, Ciudad, Estado"
            value={defaultData.locationName ? data.locationName : data.location}
            onChange={(val) => onFieldChange(defaultData.locationName ? 'locationName' : 'location', val)}
          />
        </div>
      )}

      {/* Date Subtitle */}
      {defaultData.dateSubtitle !== undefined && (
        <div className="space-y-2">
          <TextInput
            label="Subtítulo de la Sección de Fecha"
            placeholder="p. ej., ¡No podemos esperar a verte!"
            value={data.dateSubtitle}
            onChange={(val) => onFieldChange('dateSubtitle', val)}
          />
        </div>
      )}

      {/* Graduation Specifics */}
      {templateFeatures.futurePlans && (
        <div className="space-y-2">
          <TextInput 
            label="Grado Académico"
            placeholder="p. ej., Licenciatura en Ingeniería Civil"
            value={data.degreeType} 
            onChange={(val) => onFieldChange('degreeType', val)} 
          />
        </div>
      )}

      {/* Corporate City */}
      {defaultData.venue_city !== undefined && (
        <div className="space-y-2">
          <TextInput 
            label="Ciudad del Evento"
            placeholder="p. ej., Nueva York, NY"
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
                label="Nombre del Lugar"
                placeholder="p. ej., El Gran Salón"
                value={data.locationName} 
                onChange={(val) => onFieldChange('locationName', val)} 
              />
            </div>
          )}

          <div className='space-y-2'>
            <TextInput 
              label="Dirección Principal del Lugar"
              placeholder="https://maps.app.goo.gl/..."
              value={data.mainVenueAddress} 
              onChange={(val) => onFieldChange('mainVenueAddress', val)} 
            />
            <p className="text-[10px] text-slate-400 italic">
              Pega aquí tu enlace de Google Maps. Si escribes una dirección, también la convertiremos en enlace de mapa automáticamente.
            </p>
          </div>
        </div>
      )}

      {/* Reception Details */}
      {defaultData.receptionText !== undefined && (
        <div className="space-y-4 pt-4 border-t border-slate-50">
          <div className='space-y-2'>
            <TextareaInput 
              label="Texto de la Recepción"
              placeholder="p. ej., Acompáñanos a celebrar..."
              value={data.receptionText} 
              onChange={(val) => onFieldChange('receptionText', val)} 
            />
          </div>
        </div>
      )}
    </div>
  );
}