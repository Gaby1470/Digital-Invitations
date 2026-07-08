// src/components/editor/shared/ImageUploader.tsx
"use client";

import { useState } from 'react';
import { createClient } from '@/lib/supabase-client';

export default function ImageUploader({ onImageUploaded }: { onImageUploaded: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const supabase = createClient();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    
    setError('');
    setUploading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError('You must be logged in to upload images.');
      setUploading(false);
      return;
    }

    const filePath = `${user.id}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('invitation-images')
      .upload(filePath, file);

    if (uploadError) {
      setError('Failed to upload image. Make sure the invitation-images bucket is public and configured for uploads.');
      console.error(uploadError);
    } else {
      const { data: { publicUrl } } = supabase.storage
        .from('invitation-images')
        .getPublicUrl(filePath);
      
      onImageUploaded(publicUrl);
    }

    setUploading(false);
  };

  return (
    <div>
      <p className="text-sm text-gray-600 mb-4">
        Sube una imagen para tu invitación.
      </p>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-colors"
      />
      {uploading && <p className="text-sm text-indigo-600 mt-2">Uploading...</p>}
      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
    </div>
  );
}
