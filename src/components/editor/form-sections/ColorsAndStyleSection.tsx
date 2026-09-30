// src/components/editor/form-sections/ColorsAndStyleSection.tsx
"use client";

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import ColorInput from '../shared/ColorInput';
import FontSelection from '../shared/FontSelection';
import PaletteSelection from '../shared/PaletteSelection';
import AudioUploader from '../shared/AudioUploader';
import { TemplateConfig } from '@/lib/custom_types';
import { EditorData } from '@/lib/custom_types';
import { useIsAdmin } from '@/hooks/use-is-admin';
import { 
  Music, 
  Crown, 
  Sparkles, 
  Play, 
  Pause, 
  Volume2, 
  CheckCircle2, 
  ExternalLink,
  Trash2,
  AlertCircle,
  FileAudio,
  Link as LinkIcon
} from 'lucide-react';

type ColorsAndStyleSectionProps = {
  data: EditorData;
  template: TemplateConfig;
  onFieldChange: (field: string, value: string) => void;
  onMultipleFieldsChange: (fields: { [key: string]: string }) => void;
};

// Pistas de prueba de muestra libres de derechos para sugerencias rápidas de administradores
const SUGGESTED_TRACKS = [
  {
    name: "Vals Romántico Acústico",
    url: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-wedding-piano-113262.mp3",
  },
  {
    name: "Guitarra Suave",
    url: "/audio/wedding-music.mp3",
  },
];

export default function ColorsAndStyleSection({ data, template, onFieldChange, onMultipleFieldsChange }: ColorsAndStyleSectionProps) {
  const { isAdmin, isLoading: loadingAdmin } = useIsAdmin();
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [audioError, setAudioError] = useState('');
  const [urlWarning, setUrlWarning] = useState('');
  const [activeTab, setActiveTab] = useState<'upload' | 'url'>('upload');
  const audioPreviewRef = useRef<HTMLAudioElement | null>(null);

  const currentAudioUrl = typeof data.audioUrl === 'string' ? data.audioUrl : '';

  const handlePaletteSelect = (palette: { primary: string; text: string; secondary?: string; dark?: string; }) => {
    if (template.name === 'Princess Birthday') {
      onMultipleFieldsChange({
        backgroundColor: palette.primary,
        textPrimary: palette.text,
        textGold: palette.secondary || '',
        textDark: palette.dark || '',
      });
    } else {
      onMultipleFieldsChange({
        primaryColor: palette.primary,
        textColor: palette.text,
      });
    }
  };

  const handleUrlChange = (val: string) => {
    setAudioError('');
    onFieldChange('audioUrl', val);

    // Validación inteligente de URLs comunes que NO son archivos de audio directo
    if (val.includes('pixabay.com/music/') && !val.includes('.mp3')) {
      setUrlWarning('⚠️ Este enlace es la página web de Pixabay, no el archivo MP3. Para usarlo, pulsa el botón "Descargar" en Pixabay y sube el archivo descargado en la pestaña "Subir Archivo".');
    } else if (val.includes('youtube.com') || val.includes('youtu.be')) {
      setUrlWarning('⚠️ YouTube no permite reproducción de audio de fondo directo. Descarga la pista en formato MP3 y súbela desde tu computadora.');
    } else if (val.includes('spotify.com')) {
      setUrlWarning('⚠️ Spotify no permite reproducción externa directa de MP3. Utiliza un archivo de audio descargado.');
    } else {
      setUrlWarning('');
    }
  };

  const togglePreview = () => {
    if (!audioPreviewRef.current) return;
    setAudioError('');

    if (isPlayingPreview) {
      audioPreviewRef.current.pause();
      setIsPlayingPreview(false);
    } else {
      audioPreviewRef.current.play().then(() => {
        setIsPlayingPreview(true);
      }).catch((e) => {
        console.warn("Could not play preview:", e);
        setIsPlayingPreview(false);
        setAudioError('No se pudo reproducir este audio. Verifica que sea un enlace directo a un archivo MP3/WAV o sube un archivo desde tu computadora.');
      });
    }
  };

  const isPrincess = template.name === 'Princess Birthday';

  return (
    <div className="p-6 space-y-8">
      {/* 1. SELECCIÓN DE PALETAS Y COLORES */}
      <div className="space-y-6">
        {template.palettes && (
          <PaletteSelection palettes={template.palettes} onPaletteSelect={handlePaletteSelect} />
        )}
        {isPrincess ? (
          <>
            <ColorInput label="Gold Text Color" value={data.textGold} onChange={(val) => onFieldChange('textGold', val)} />
            <ColorInput label="Dark Text Color" value={data.textDark} onChange={(val) => onFieldChange('textDark', val)} />
          </>
        ) : (
          <>
            <ColorInput label="Color Principal" value={data.primaryColor} onChange={(val) => onFieldChange('primaryColor', val)} />
            <ColorInput label="Color del Texto" value={data.textColor} onChange={(val) => onFieldChange('textColor', val)} />
            {data.backgroundColor !== undefined && (
              <ColorInput label="Color de Fondo" value={data.backgroundColor} onChange={(val) => onFieldChange('backgroundColor', val)} />
            )}
          </>
        )}
      </div>

      {/* 2. SECCIÓN DE MÚSICA AMBIENTAL (FEATURE SPOTLIGHT / PREMIUM CONTROL) */}
      <div className="pt-6 border-t border-slate-200">
        {/* Audio tag oculto para prueba */}
        {currentAudioUrl && (
          <audio
            ref={audioPreviewRef}
            src={currentAudioUrl}
            onEnded={() => setIsPlayingPreview(false)}
            onPause={() => setIsPlayingPreview(false)}
            onPlay={() => setIsPlayingPreview(true)}
            onError={() => {
              setIsPlayingPreview(false);
              setAudioError('El archivo de audio no pudo ser decodificado. Asegúrate de que sea un archivo de audio directo (.mp3, .wav, .m4a).');
            }}
          />
        )}

        {/* MODO ADMINISTRADOR */}
        {isAdmin ? (
          <div className="bg-gradient-to-br from-amber-50 to-orange-50/50 rounded-2xl p-5 border border-amber-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-amber-500 text-white shadow-sm">
                  <Crown className="w-4 h-4" />
                </span>
                <div>
                  <h4 className="text-sm font-bold text-amber-950">Música de Fondo (Admin)</h4>
                  <p className="text-xs text-amber-800/80">Sube un archivo de audio o configura la URL ambiental</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-200 text-amber-900 uppercase tracking-wider">
                Admin
              </span>
            </div>

            {/* Pestañas para elegir método: Subir Archivo vs Pegar Enlace */}
            <div className="flex gap-2 p-1 bg-amber-100/60 rounded-xl border border-amber-200/60 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab('upload')}
                className={`flex-1 py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition ${
                  activeTab === 'upload' 
                    ? 'bg-white text-amber-900 shadow-sm' 
                    : 'text-amber-800 hover:text-amber-950'
                }`}
              >
                <FileAudio className="w-3.5 h-3.5" />
                <span>Subir Archivo (.mp3)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('url')}
                className={`flex-1 py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition ${
                  activeTab === 'url' 
                    ? 'bg-white text-amber-900 shadow-sm' 
                    : 'text-amber-800 hover:text-amber-950'
                }`}
              >
                <LinkIcon className="w-3.5 h-3.5" />
                <span>Pegar Enlace Directo</span>
              </button>
            </div>

            {/* Contenido según pestaña */}
            {activeTab === 'upload' ? (
              <div className="space-y-2">
                <AudioUploader
                  onAudioUploaded={(url, fileName) => {
                    onFieldChange('audioUrl', url);
                    setAudioError('');
                    setUrlWarning('');
                  }}
                />
              </div>
            ) : (
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700">
                  Enlace directo al archivo (.mp3 / .wav / .m4a)
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={currentAudioUrl}
                    onChange={(e) => handleUrlChange(e.target.value)}
                    placeholder="https://ejemplo.com/cancion.mp3"
                    className="flex-1 px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm"
                  />
                  {currentAudioUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        onFieldChange('audioUrl', '');
                        setAudioError('');
                        setUrlWarning('');
                      }}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Eliminar música"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {urlWarning && (
                  <div className="flex items-start gap-2 p-2.5 rounded-lg bg-amber-100 border border-amber-300 text-amber-900 text-xs">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-700" />
                    <span>{urlWarning}</span>
                  </div>
                )}
              </div>
            )}

            {/* Error de audio si falla la reproducción */}
            {audioError && (
              <div className="flex items-start gap-2 p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{audioError}</span>
              </div>
            )}

            {/* Tarjeta de pista activa con prueba de audio */}
            {currentAudioUrl && (
              <div className="flex items-center justify-between bg-white/90 p-3 rounded-xl border border-amber-200 shadow-sm">
                <div className="flex items-center gap-2.5 text-xs font-medium text-slate-800 truncate max-w-[200px]">
                  <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                    <Volume2 className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <p className="font-semibold truncate">
                      {decodeURIComponent(currentAudioUrl.split('/').pop() || 'Pista de audio')}
                    </p>
                    <p className="text-[10px] text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Lista para sonar
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={togglePreview}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-sm transition"
                  >
                    {isPlayingPreview ? (
                      <>
                        <Pause className="w-3.5 h-3.5" /> Pausar
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5" /> Probar
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onFieldChange('audioUrl', '');
                      setAudioError('');
                      setUrlWarning('');
                    }}
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition"
                    title="Quitar audio"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Pistas sugeridas para selección rápida */}
            <div className="pt-2 border-t border-amber-200/60">
              <span className="text-[11px] font-semibold text-slate-600 block mb-1.5">
                O selecciona una de nuestras pistas curadas:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTED_TRACKS.map((track, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      onFieldChange('audioUrl', track.url);
                      setAudioError('');
                      setUrlWarning('');
                    }}
                    className="text-[10px] px-2.5 py-1 bg-white hover:bg-amber-100 text-slate-700 hover:text-amber-900 border border-slate-200 rounded-md transition shadow-xs"
                  >
                    {track.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* MODO USUARIO NORMAL: FEATURE SPOTLIGHT Y TEASER PREMIUM */
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-5 shadow-md relative overflow-hidden border border-indigo-500/30">
            {/* Brillo decorativo */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-gradient-to-tr from-amber-400 to-amber-200 text-slate-900 shadow-sm">
                    <Music className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                      Música de Fondo
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/40">
                        Premium
                      </span>
                    </h4>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[11px] text-amber-300/80">
                  <Crown className="w-3.5 h-3.5 text-amber-400" />
                  <span>Exclusivo</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Haz que tu invitación cobre vida con tu canción favorita sonando suavemente de fondo mientras tus invitados la abren en sus teléfonos.
              </p>

              {/* Si ya tiene música asignada por el admin */}
              {currentAudioUrl ? (
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Música personalizada activa</span>
                    </div>
                    <button
                      type="button"
                      onClick={togglePreview}
                      className="px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-xs font-semibold transition flex items-center gap-1"
                    >
                      {isPlayingPreview ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                      <span>{isPlayingPreview ? 'Pausar' : 'Probar'}</span>
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-300 italic">
                    Configurada especialmente por el equipo de diseño de Tap 2 Invite.
                  </p>
                </div>
              ) : (
                /* Si no tiene música todavía */
                <div className="pt-1">
                  <div className="bg-white/5 rounded-xl p-3 border border-white/10 mb-3 space-y-1.5 text-left">
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-200">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>¿Quieres incluir tu canción?</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-snug">
                      Las canciones de fondo son configuradas y optimizadas a medida por nuestro equipo para garantizar que se reproduzcan sin anuncios ni bloqueos en dispositivos móviles.
                    </p>
                  </div>

                  <Link
                    href="/contact"
                    target="_blank"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all"
                  >
                    <span>Solicitar Música para mi Invitación</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
