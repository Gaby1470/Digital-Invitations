"use client";

import { useState } from 'react';
import Modal from './Modal';
import ImageUploader from './ImageUploader';
import { Image as ImageIcon, UploadCloud } from 'lucide-react';

type PortraitImageUploaderProps = {
  value: string | undefined;
  onChange: (value: string) => void;
  label: string;
};

export default function PortraitImageUploader({ value, onChange, label }: PortraitImageUploaderProps) {
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
      
      <div className="relative w-52 h-72 rounded-lg bg-slate-100 overflow-hidden border-2 border-dashed border-slate-200">
        {value && (
          <img src={value} alt="Portrait image preview" className="w-full h-full object-cover" />
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

      <Modal title="Upload Portrait Image" isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ImageUploader onImageUploaded={handleImageUploaded} />
      </Modal>
    </div>
  );
}
