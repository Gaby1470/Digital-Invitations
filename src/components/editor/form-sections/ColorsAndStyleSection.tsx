// src/components/editor/form-sections/ColorsAndStyleSection.tsx
"use client";

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import ColorInput from '../shared/ColorInput';
import FontSelection from '../shared/FontSelection';
import PaletteSelection from '../shared/PaletteSelection';
import { TemplateConfig } from '@/lib/custom_types';
import { EditorData } from '@/lib/custom_types';
import { useIsAdmin } from '@/hooks/use-is-admin';
import { 
  Music, 
  Crown, 
  Sparkles, 
  Lock, 
  Play, 
  Pause, 
  Volume2, 
  CheckCircle2, 
  ExternalLink,
  Trash2,
  HelpCircle
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
    name: "Guitarra Suave & Cálida",
    url: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=acoustic-guitars-ambient-14197.mp3",
  },
  {
    name: "Celebración Alegre",
    url: "https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f792cb.mp3?filename=happy-acoustic-guitar-122744.mp3",
  },
];

export default function ColorsAndStyleSection({ data, template, onFieldChange, onMultipleFieldsChange }: ColorsAndStyleSectionProps) {
  const { isAdmin, isLoading: loadingAdmin } = useIsAdmin();
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
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

  const togglePreview = () => {
    if (!audioPreviewRef.current) return;
    if (isPlayingPreview) {
      audioPreviewRef.current.pause();
      setIsPlayingPreview(false);
    } else {
      audioPreviewRef.current.play().then(() => {
        setIsPlayingPreview(true);
      }).catch((e) => {
        console.warn("Could not play preview:", e);
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
                  <p className="text-xs text-amber-800/80">Configura el audio ambiental de esta invitación</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-200 text-amber-900 uppercase tracking-wider">
                Admin
              </span>
            </div>

            <div className="space-y-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  URL del archivo de audio (MP3 / WAV / M4A)
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={currentAudioUrl}
                    onChange={(e) => onFieldChange('audioUrl', e.target.value)}
                    placeholder="https://ejemplo.com/cancion.mp3"
                    className="flex-1 px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm"
                  />
                  {currentAudioUrl && (
                    <button
                      type="button"
                      onClick={() => onFieldChange('audioUrl', '')}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Eliminar música"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Botón de reproducción de prueba si hay URL */}
              {currentAudioUrl && (
                <div className="flex items-center justify-between bg-white/80 p-2.5 rounded-xl border border-amber-200/80">
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-700 truncate max-w-[210px]">
                    <Volume2 className="w-4 h-4 text-amber-600 shrink-0" />
                    <span className="truncate">{currentAudioUrl.split('/').pop() || 'Pista de audio'}</span>
                  </div>
                  <button
                    type="button"
                    onClick={togglePreview}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-sm transition"
                  >
                    {isPlayingPreview ? (
                      <>
                        <Pause className="w-3.5 h-3.5" /> Pausar
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5" /> Escuchar
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Pistas sugeridas para selección rápida */}
              <div className="pt-2">
                <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">
                  Sugerencias rápidas sin copyright:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTED_TRACKS.map((track, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => onFieldChange('audioUrl', track.url)}
                      className="text-[10px] px-2.5 py-1 bg-white hover:bg-amber-100 text-slate-700 hover:text-amber-900 border border-slate-200 rounded-md transition"
                    >
                      {track.name}
                    </button>
                  ))}
                </div>
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
                Haz que tu invitación cobre vida con tu canción favorita sonando de fondo mientras tus invitados la abren en sus teléfonos.
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
                      Las canciones de fondo son configuradas y optimizadas a medida por nuestro equipo para garantizar que no sean bloqueadas por los navegadores móviles.
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
