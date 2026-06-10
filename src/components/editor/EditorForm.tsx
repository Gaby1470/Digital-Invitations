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
import ParentalNotesSection from './form-sections/ParentalNotesSection';
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
      {/* Header with Preview Toggles */}
      <div className="flex justify-between items-center p-4 bg-white border-b sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button 
              onClick={() => onViewModeChange('mobile')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'mobile' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
              title="Mobile View"
            >
              <Smartphone size={18} />
            </button>
            <button 
              onClick={() => onViewModeChange('desktop')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'desktop' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
              title="Desktop View"
            >
              <Monitor size={18} />
            </button>
          </div>
        </div>
        <button 
          onClick={onSave}
          disabled={isSaving}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-full font-bold text-sm flex items-center gap-2 transition-transform active:scale-95 shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <Save size={16} /> {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <Modal title="Upload Image" isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ImageUploader onImageUploaded={handleImageUploaded} />
      </Modal>

      {/* Editor Body */}
      <div className="flex-1 overflow-y-auto pb-10 custom-scrollbar">
        <div className="divide-y divide-slate-100">

          <CollapsibleSection 
            title="Main Details" 
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
            title="Invitation Link"
            isOpen={activeSection === "Link"}
            onToggle={() => setActiveSection(activeSection === "Link" ? null : "Link")}
          >
            <div className="p-4 space-y-4">
              <TextInput
                label="Custom Link"
                value={data.slug || ''}
                onChange={(value) => handleFieldChange('slug', value)}
                placeholder="your-event-name"
              />
              <p className="text-sm text-gray-500">
                Customize the link to your invitation. Use only lowercase letters, numbers, and hyphens.
                Example: <strong>{`https://yourapp.com/invite/sarah-and-toms-wedding`}</strong>
              </p>
            </div>
          </CollapsibleSection>

          <CollapsibleSection 
            title="Design & Style" 
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
              title="Attire"
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
              title="Accommodations" 
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
              title="Photo Gallery" 
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
            title="Event Schedule" 
            isOpen={activeSection === "Schedule"}
            onToggle={() => setActiveSection(activeSection === "Schedule" ? null : "Schedule")}
          >
            <EventScheduleSection
              data={data}
              onFieldChange={handleFieldChange}
            />
          </CollapsibleSection>

          {template.features.hasGodparents && (
            <CollapsibleSection
              title="Godparents"
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
              title="Gift Registry" 
              isOpen={activeSection === "Gifts"}
              onToggle={() => setActiveSection(activeSection === "Gifts" ? null : "Gifts")}
            >
              <GiftSection
                data={data}
                onFieldChange={handleFieldChange}
              />
            </CollapsibleSection>
          )}

          {template.name === 'Kids Birthday Bash' && (
            <CollapsibleSection 
              title="Note for Parents"
              isOpen={activeSection === "ParentalNotes"}
              onToggle={() => setActiveSection(activeSection === "ParentalNotes" ? null : "ParentalNotes")}
            >
              <ParentalNotesSection
                data={data}
                onFieldChange={handleFieldChange}
              />
            </CollapsibleSection>
          )}
        </div>
      </div>
    </div>
  );
}