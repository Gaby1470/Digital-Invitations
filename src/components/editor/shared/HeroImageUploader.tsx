"use client";

import { useState } from 'react';
import Modal from './Modal';
import ImageUploader from './ImageUploader';
import { Image as ImageIcon, UploadCloud } from 'lucide-react';

type HeroImageUploaderProps = {
  value: string | undefined;
  onChange: (value: string) => void;
  label: string;
};

export default function HeroImageUploader({ value, onChange, label }: HeroImageUploaderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleImageUploaded = (url: string) => {
    onChange(url);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
        <ImageIcon size={14} /> {label}
      </label>
      
      <div className="relative w-full aspect-[21/9] rounded-lg bg-slate-100 overflow-hidden border-2 border-dashed border-slate-200">
        {value && (
          <img src={value} alt="Hero image preview" className="w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="bg-white/80 hover:bg-white text-slate-800 font-bold text-xs px-4 py-2 rounded-full flex items-center gap-2 shadow-md backdrop-blur-sm"
          >
            <UploadCloud size={16} />
            Change Image
          </button>
        </div>
      </div>

      <Modal title="Upload Hero Image" isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ImageUploader onImageUploaded={handleImageUploaded} />
      </Modal>
    </div>
  );
}
