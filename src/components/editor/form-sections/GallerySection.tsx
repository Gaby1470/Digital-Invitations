// src/components/editor/form-sections/GallerySection.tsx
"use client";

import GalleryEditor from '../shared/GalleryEditor';

type GallerySectionProps = {
  data: { galleryImages?: string[] };
  onFieldChange: (field: string, value: string[]) => void;
  onOpenModal: () => void;
};

export default function GallerySection({ data, onFieldChange, onOpenModal }: GallerySectionProps) {
  return (
    <div className="p-6">
      <div className="flex justify-end items-center mb-4">
        <button onClick={onOpenModal} className="text-sm bg-indigo-100 hover:bg-indigo-200 text-indigo-800 font-semibold py-2 px-4 rounded-lg transition-colors">
          Subir Imágenes
        </button>
      </div>
      <GalleryEditor
        images={data.galleryImages || []}
        onImagesChange={(images) => onFieldChange('galleryImages', images)}
      />
    </div>
  );
}
