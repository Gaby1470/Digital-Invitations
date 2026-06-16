// src/components/editor/EditorForm.tsx
"use client";

import { useState } from 'react';
import { produce } from 'immer';
import { Smartphone, Monitor, Save } from 'lucide-react';
import { TemplateConfig } from '@/lib/types';

import MainDetailsSection from './form-sections/MainDetailsSection';
import ColorsAndStyleSection from './form-sections/ColorsAndStyleSection';
import DressCodeSection from './form-sections/DressCodeSection';
import GallerySection from './form-sections/GallerySection';
import EventScheduleSection from './form-sections/EventScheduleSection';
import GiftSection from './form-sections/GiftSection';
import GodparentsSection from './form-sections/GodparentsSection';
import CourtOfHonorSection from './form-sections/CourtOfHonorSection';
import ParentalNotesSection from './form-sections/ParentalNotesSection';
import AllergyTrackerSection from './form-sections/AllergyTrackerSection';
import GenderBettingSection from './form-sections/GenderBettingSection';
import RecommendationsSection from './form-sections/RecommendationsSection';
import CollapsibleSection from './shared/CollapsibleSection';
import Modal from './shared/Modal';
import ImageUploader from './shared/ImageUploader';
import TextInput from './shared/TextInput';

type EditorData = TemplateConfig['defaultData'] & { slug?: string } & Record<string, unknown>;

type EditorFormProps = {
  data: EditorData;
  onDataChange: (data: EditorData) => void;
  onSave: () => void;
  template: TemplateConfig;
  viewMode: 'mobile' | 'desktop';
  onViewModeChange: (mode: 'mobile' | 'desktop') => void;
  isSaving?: boolean;
};

export default function EditorForm({ 
  data, 
  onDataChange, 
  onSave, 
  template,
  viewMode,
  onViewModeChange,
  isSaving = false
}: EditorFormProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>("Main Details");

  const handleFieldChange = (field: string, value: unknown) => {
    const nextState = produce(data, (draft: EditorData) => {
      draft[field] = value;
    });
    onDataChange(nextState);
  };

  const handleMultipleFieldsChange = (fields: Record<string, unknown>) => {
    const nextState = produce(data, (draft: EditorData) => {
      for (const field in fields) {
        draft[field] = fields[field];
      }
    });
    onDataChange(nextState);
  };

  const handleImageUploaded = (url: string) => {
    const newImages = [...(data.galleryImages || []), url];
    handleFieldChange('galleryImages', newImages);
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 border-r border-slate-200">
      <Modal title="Upload Image" isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ImageUploader onImageUploaded={handleImageUploaded} />
      </Modal>

      {/* Editor Body */}
      <div className="flex-1 overflow-y-auto pb-10 custom-scrollbar">
        <div className="divide-y divide-slate-100">

          <CollapsibleSection 
            title="Datos Principales" 
            isOpen={activeSection === "Main Details"}
            onToggle={() => setActiveSection(activeSection === "Main Details" ? null : "Main Details")}
          >
            <MainDetailsSection
              data={data}
              template={template}
              onFieldChange={handleFieldChange}
            />
          </CollapsibleSection>

          <CollapsibleSection
            title="Enlace de Invitación"
            isOpen={activeSection === "Link"}
            onToggle={() => setActiveSection(activeSection === "Link" ? null : "Link")}
          >
            <div className="p-4 space-y-4">
              <TextInput
                label="Enlace Personalizado"
                value={data.slug || ''}
                onChange={(value) => handleFieldChange('slug', value)}
                placeholder="nombre-de-tu-evento"
              />
              <p className="text-sm text-gray-500">
                Personaliza el enlace de tu invitación. Usa solo letras minúsculas, números y guiones.
                Ejemplo: <strong>{`https://yourapp.com/invite/sarah-and-toms-wedding`}</strong>
              </p>
            </div>
          </CollapsibleSection>

          <CollapsibleSection 
            title="Diseño y Estilo" 
            isOpen={activeSection === "Design"}
            onToggle={() => setActiveSection(activeSection === "Design" ? null : "Design")}
          >
            <ColorsAndStyleSection
              data={data}
              template={template}
              onFieldChange={handleFieldChange}
              onMultipleFieldsChange={handleMultipleFieldsChange}
            />
          </CollapsibleSection>

          {data.dressCode && (
            <CollapsibleSection
              title="Código de Vestimenta"
              isOpen={activeSection === "DressCode"}
              onToggle={() => setActiveSection(activeSection === "DressCode" ? null : "DressCode")}
            >
              <DressCodeSection
                data={data}
                onFieldChange={handleFieldChange}
              />
            </CollapsibleSection>
          )}

          {template.features.recommendations && (
            <CollapsibleSection 
              title="Alojamientos y Recomendaciones" 
              isOpen={activeSection === "Travel"}
              onToggle={() => setActiveSection(activeSection === "Travel" ? null : "Travel")}
            >
              <RecommendationsSection
                data={data}
                onFieldChange={handleFieldChange}
              />
            </CollapsibleSection>
          )}

          {template.features.gallery && (
            <CollapsibleSection 
              title="Galería de Fotos" 
              isOpen={activeSection === "Gallery"}
              onToggle={() => setActiveSection(activeSection === "Gallery" ? null : "Gallery")}
            >
              <GallerySection
                data={data}
                onFieldChange={handleFieldChange}
                onOpenModal={() => setIsModalOpen(true)}
              />
            </CollapsibleSection>
          )}

          <CollapsibleSection 
            title="Horario del Evento" 
            isOpen={activeSection === "Schedule"}
            onToggle={() => setActiveSection(activeSection === "Schedule" ? null : "Schedule")}
          >
            <EventScheduleSection
              data={data}
              onFieldChange={handleFieldChange}
            />
          </CollapsibleSection>

          {template.features.courtOfHonor && (
            <CollapsibleSection
              title="Amigas"
              isOpen={activeSection === "CourtOfHonor"}
              onToggle={() => setActiveSection(activeSection === "CourtOfHonor" ? null : "CourtOfHonor")}
            >
              <CourtOfHonorSection
                data={data}
                onFieldChange={handleFieldChange}
              />
            </CollapsibleSection>
          )}

          {template.features.socialMediaWall && (
            <CollapsibleSection
                title="Muro de Redes Sociales"
                isOpen={activeSection === "SocialMedia"}
                onToggle={() => setActiveSection(activeSection === "SocialMedia" ? null : "SocialMedia")}
            >
                <div className="p-6">
                    <TextInput
                        label="URL para Compartir Fotos"
                        value={data.photoSharingUrl || ''}
                        onChange={(value) => handleFieldChange('photoSharingUrl', value)}
                        placeholder="https://youraalbum.com/..."
                    />
                    <p className="text-sm text-gray-500 mt-2">
                        El enlace donde los invitados pueden subir y ver fotos del evento.
                    </p>
                </div>
            </CollapsibleSection>
          )}

          {template.features.hasGodparents && (
            <CollapsibleSection
              title="Padrinos"
              isOpen={activeSection === "Godparents"}
              onToggle={() => setActiveSection(activeSection === "Godparents" ? null : "Godparents")}
            >
              <GodparentsSection
                data={data}
                onFieldChange={handleFieldChange}
              />
            </CollapsibleSection>
          )}

          {data.giftRegistryUrl !== undefined && (
            <CollapsibleSection 
              title="Registro de Regalos" 
              isOpen={activeSection === "Gifts"}
              onToggle={() => setActiveSection(activeSection === "Gifts" ? null : "Gifts")}
            >
              <GiftSection
                data={data}
                onFieldChange={handleFieldChange}
              />
            </CollapsibleSection>
          )}

          {template.name === 'Fiesta de Cumpleaños Infantil' && (
            <CollapsibleSection 
              title="Nota para los Padres"
              isOpen={activeSection === "ParentalNotes"}
              onToggle={() => setActiveSection(activeSection === "ParentalNotes" ? null : "ParentalNotes")}
            >
              <ParentalNotesSection
                data={data}
                onFieldChange={handleFieldChange}
              />
            </CollapsibleSection>
          )}

          {template.features.allergyTracker && (
            <CollapsibleSection 
              title="Alergias"
              isOpen={activeSection === "AllergyTracker"}
              onToggle={() => setActiveSection(activeSection === "AllergyTracker" ? null : "AllergyTracker")}
            >
              <AllergyTrackerSection
                data={data}
                onFieldChange={handleFieldChange}
              />
            </CollapsibleSection>
          )}

          {template.features.genderBetting && (
            <CollapsibleSection
              title="Juego de Revelación"
              isOpen={activeSection === "GenderBetting"}
              onToggle={() => setActiveSection(activeSection === "GenderBetting" ? null : "GenderBetting")}
            >
              <GenderBettingSection
                data={data}
                onFieldChange={handleFieldChange}
              />
            </CollapsibleSection>
          )}
        </div>
      </div>
      {/* Fixed Save Button Footer */}
      <div className="p-4 bg-white/90 backdrop-blur-sm border-t border-slate-200 flex justify-end">
        <button
          onClick={onSave}
          disabled={isSaving}
          className="inline-flex h-14 items-center justify-center rounded-full bg-indigo-600 px-8 text-lg font-medium text-white shadow-lg shadow-indigo-500/30 transition-all gap-3 hover:bg-indigo-700 hover:shadow-indigo-500/50 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 disabled:bg-indigo-400 disabled:shadow-none disabled:cursor-not-allowed disabled:translate-y-0"
        >
          <Save size={20} />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}