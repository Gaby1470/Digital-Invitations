// src/components/shared/AmbientAudioPlayer.tsx
"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Music, Sparkles } from 'lucide-react';

export interface AmbientAudioPlayerProps {
  audioUrl?: string;
  title?: string;
  primaryColor?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

export function AmbientAudioPlayer({
  audioUrl,
  title = "Música de Fondo",
  primaryColor,
  position = 'bottom-right',
}: AmbientAudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [hasUserManuallyPaused, setHasUserManuallyPaused] = useState<boolean>(false);
  const [showTooltip, setShowTooltip] = useState<boolean>(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Intentar reproducir el audio de forma segura
  const playAudio = useCallback(async () => {
    if (!audioRef.current || hasUserManuallyPaused) return;

    try {
      audioRef.current.volume = 0.45; // Volumen ambiental sutil
      await audioRef.current.play();
      setIsPlaying(true);
    } catch {
      // Bloqueado por política de autoplay del navegador hasta que el usuario interactúe
      setIsPlaying(false);
    }
  }, [hasUserManuallyPaused]);

  // Manejar la primera interacción del usuario en la pantalla
  useEffect(() => {
    if (!audioUrl) return;

    const handleFirstInteraction = () => {
      if (!hasUserManuallyPaused && !isPlaying) {
        playAudio();
      }
    };

    window.addEventListener('click', handleFirstInteraction, { once: true, passive: true });
    window.addEventListener('touchstart', handleFirstInteraction, { once: true, passive: true });
    window.addEventListener('scroll', handleFirstInteraction, { once: true, passive: true });

    const timer = setTimeout(() => {
      setShowTooltip(false);
    }, 5000);

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
      window.removeEventListener('scroll', handleFirstInteraction);
      clearTimeout(timer);
    };
  }, [audioUrl, hasUserManuallyPaused, isPlaying, playAudio]);

  if (!audioUrl || audioUrl.trim() === '') {
    return null;
  }

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      setHasUserManuallyPaused(true);
      setShowTooltip(false);
    } else {
      setHasUserManuallyPaused(false);
      setShowTooltip(false);
      audioRef.current.volume = 0.45;
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.warn("Audio play failed:", err);
      });
    }
  };

  // Posicionamiento en esquina inferior por defecto
  const getPositionClasses = () => {
    switch (position) {
      case 'bottom-left':
        return 'bottom-5 left-5 sm:bottom-6 sm:left-6 flex-row-reverse';
      case 'top-right':
        return 'top-5 right-5 sm:top-6 sm:right-6 flex-row';
      case 'top-left':
        return 'top-5 left-5 sm:top-6 sm:left-6 flex-row-reverse';
      case 'bottom-right':
      default:
        return 'bottom-5 right-5 sm:bottom-6 sm:right-6 flex-row';
    }
  };

  return (
    <div className={`fixed ${getPositionClasses()} z-40 select-none flex items-center gap-2 pointer-events-auto`}>
      {/* Elemento de audio nativo oculto */}
      <audio
        ref={audioRef}
        src={audioUrl}
        loop
        preload="auto"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Tooltip ultra-translúcido */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 4 }}
            transition={{ duration: 0.25 }}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/40 hover:bg-white/60 backdrop-blur-xl text-neutral-800 text-[11px] font-medium shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-white/60 transition-all cursor-pointer"
            onClick={togglePlay}
          >
            <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
            <span className="whitespace-nowrap">
              {isPlaying ? 'Música activa' : 'Toca para música'}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botón flotante translúcido (Glassmorphism sutil y estético) */}
      <motion.button
        type="button"
        onClick={togglePlay}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        className="relative group w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center bg-white/30 hover:bg-white/45 active:bg-white/50 backdrop-blur-xl text-neutral-800 shadow-[0_8px_32px_0_rgba(0,0,0,0.12)] border border-white/60 transition-all duration-300 focus:outline-none"
        aria-label={isPlaying ? "Pausar música ambiental" : "Reproducir música ambiental"}
        title={title}
      >
        {/* Anillo de pulso sutil cuando reproduce */}
        {isPlaying && (
          <motion.div
            animate={{ scale: [1, 1.35, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 rounded-full border border-white/80 pointer-events-none"
            style={{ borderColor: primaryColor || 'rgba(255, 255, 255, 0.8)' }}
          />
        )}

        {/* Ondas sonoras animadas o icono silenciado */}
        {isPlaying ? (
          <div className="flex items-end justify-center gap-[3px] h-4 w-4">
            <motion.span
              animate={{ height: ['4px', '14px', '6px', '12px', '4px'] }}
              transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
              className="w-[2.5px] bg-neutral-800/90 rounded-full"
              style={{ backgroundColor: primaryColor || undefined }}
            />
            <motion.span
              animate={{ height: ['10px', '4px', '16px', '8px', '10px'] }}
              transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
              className="w-[2.5px] bg-neutral-800/90 rounded-full"
              style={{ backgroundColor: primaryColor || undefined }}
            />
            <motion.span
              animate={{ height: ['6px', '16px', '8px', '4px', '6px'] }}
              transition={{ duration: 1.3, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
              className="w-[2.5px] bg-neutral-800/90 rounded-full"
              style={{ backgroundColor: primaryColor || undefined }}
            />
          </div>
        ) : (
          <div className="relative flex items-center justify-center">
            <VolumeX className="w-5 h-5 text-neutral-600 group-hover:text-neutral-900 transition-colors" />
          </div>
        )}
      </motion.button>
    </div>
  );
}

export default AmbientAudioPlayer;
