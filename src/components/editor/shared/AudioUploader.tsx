// src/components/editor/shared/AudioUploader.tsx
"use client";

import { useState, useRef } from 'react';
import { createClient } from '@/lib/supabase-client';
import { UploadCloud, Music, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

interface AudioUploaderProps {
  onAudioUploaded: (url: string, fileName?: string) => void;
  className?: string;
}

export default function AudioUploader({ onAudioUploaded, className = '' }: AudioUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const supabase = createClient();

  const handleUpload = async (file: File) => {
    // Validar tipo de archivo
    const validTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/x-wav', 'audio/m4a', 'audio/x-m4a', 'audio/aac', 'audio/ogg'];
    const extension = file.name.split('.').pop()?.toLowerCase();
    const isAudioExt = ['mp3', 'wav', 'm4a', 'aac', 'ogg'].includes(extension || '');

    if (!validTypes.includes(file.type) && !isAudioExt) {
      setError('Por favor sube un archivo de audio válido (.mp3, .m4a, .wav, .ogg)');
      return;
    }

    // Validar tamaño máximo (25MB)
    const MAX_SIZE = 25 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setError('El archivo de audio es muy grande (máximo 25 MB)');
      return;
    }

    setError('');
    setUploading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('Debes iniciar sesión para subir archivos de audio.');
        setUploading(false);
        return;
      }

      const cleanFileName = file.name
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9._-]/g, '_')
        .toLowerCase();

      const uniqueFileName = `${Date.now()}-${cleanFileName}`;
      const filePath = `${user.id}/audio/${uniqueFileName}`;

      const { error: uploadError } = await supabase.storage
        .from('invitation-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
          contentType: file.type || 'audio/mpeg',
        });

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        setError(`Error al subir audio: ${uploadError.message}`);
        setUploading(false);
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('invitation-images')
        .getPublicUrl(filePath);

      onAudioUploaded(publicUrl, file.name);
    } catch (err: unknown) {
      console.error('Unexpected error during audio upload:', err);
      const message = err instanceof Error ? err.message : 'Error inesperado';
      setError(`Error: ${message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleUpload(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*,.mp3,.m4a,.wav,.ogg,.aac"
        onChange={handleFileChange}
        className="hidden"
      />

      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-4 sm:p-5 text-center cursor-pointer transition-all ${
          isDragging 
            ? 'border-amber-500 bg-amber-50/70' 
            : 'border-slate-300 hover:border-amber-400 bg-white/70 hover:bg-amber-50/30'
        } ${uploading ? 'opacity-60 cursor-not-allowed' : ''}`}
      >
        <div className="flex flex-col items-center justify-center gap-2">
          {uploading ? (
            <div className="flex items-center gap-2 text-amber-700 font-medium text-xs py-2">
              <Loader2 className="w-5 h-5 animate-spin text-amber-600" />
              <span>Subiendo archivo de música a la nube...</span>
            </div>
          ) : (
            <>
              <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shadow-sm">
                <UploadCloud className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">
                  Haz clic para subir o arrastra tu archivo de audio
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Archivos MP3, M4A o WAV (máximo 25 MB)
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
