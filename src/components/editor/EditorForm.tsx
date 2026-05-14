// src/components/editor/EditorForm.tsx
"use client";

import { TemplateConfig } from '@/lib/types';
import { produce } from 'immer';
import { useState } from 'react';

import MainDetailsSection from './form-sections/MainDetailsSection';
import ColorsAndStyleSection from './form-sections/ColorsAndStyleSection';
import GallerySection from './form-sections/GallerySection';
import EventScheduleSection from './form-sections/EventScheduleSection';
import DressCodeSection from './form-sections/DressCodeSection'; // Import the new component
import RecommendationsSection from './form-sections/RecommendationsSection';

import Modal from './shared/Modal';
import ImageUploader from './shared/ImageUploader';

export default function EditorForm({ data, onDataChange, onSave, template }: { data: any, onDataChange: (data: any) => void, onSave: () => void, template: TemplateConfig }) {
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFieldChange = (field: string, value: any) => {
    const nextState = produce(data, (draft: any) => {
      draft[field] = value;
    });
    onDataChange(nextState);
  };

  const handleMultipleFieldsChange = (fields: { [key: string]: any }) => {
    const nextState = produce(data, (draft: any) => {
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
    <>
      <Modal title="Upload Image" isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ImageUploader onImageUploaded={handleImageUploaded} />
      </Modal>

      <div className="bg-white h-full">
        <div className="flex justify-between items-center p-6 sticky top-0 bg-white/80 backdrop-blur-lg z-10 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Personalize Invitation</h2>
          <button 
            onClick={onSave}
            className="bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
          >
            Save
          </button>
        </div>
        
        <div className="divide-y divide-gray-200">
          <MainDetailsSection
            data={data}
            templateFeatures={template.features}
            onFieldChange={handleFieldChange}
          />
          
          <ColorsAndStyleSection
            data={data}
            template={template}
            onFieldChange={handleFieldChange}
            onMultipleFieldsChange={handleMultipleFieldsChange}
          />

          <DressCodeSection 
            data={data}
            onFieldChange={handleFieldChange}
          />

          {template.features.recommendations && (
            <RecommendationsSection
              data={data}
              onFieldChange={handleFieldChange}
            />
          )}

          <GallerySection
            data={data}
            onFieldChange={handleFieldChange}
            onOpenModal={() => setIsModalOpen(true)}
          />

          {template.features.multiEventSchedule && (
            <EventScheduleSection
              data={data}
              onFieldChange={handleFieldChange}
            />
          )}
        </div>
      </div>
    </>
  );
}
