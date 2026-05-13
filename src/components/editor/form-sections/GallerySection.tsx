// src/components/editor/form-sections/GallerySection.tsx
"use client";

import GalleryEditor from '../shared/GalleryEditor';

type GallerySectionProps = {
  data: any;
  onFieldChange: (field: string, value: any) => void;
  onOpenModal: () => void;
};

export default function GallerySection({ data, onFieldChange, onOpenModal }: GallerySectionProps) {
  return (
    <div className="p-6 border-b">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-900">Gallery Images</h3>
        <button onClick={onOpenModal} className="text-sm bg-indigo-100 hover:bg-indigo-200 text-indigo-800 font-semibold py-2 px-4 rounded-lg transition-colors">
          Upload Image
        </button>
      </div>
      <GalleryEditor
        images={data.galleryImages || []}
        onImagesChange={(images) => onFieldChange('galleryImages', images)}
      />
    </div>
  );
}
