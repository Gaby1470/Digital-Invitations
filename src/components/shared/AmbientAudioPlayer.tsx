// src/components/shared/AmbientAudioPlayer.tsx
"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Volume2, VolumeX, Sparkles } from 'lucide-react';

export interface AmbientAudioPlayerProps {
  audioUrl?: string;
  title?: string;
  primaryColor?: string;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export function AmbientAudioPlayer({
  audioUrl,
  title = "Música de Fondo",
  primaryColor = "#d97706",
  position = 'top-right',
}: AmbientAudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);
  const [hasUserManuallyPaused, setHasUserManuallyPaused] = useState<boolean>(false);
  const [showTooltip, setShowTooltip] = useState<boolean>(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Intentar reproducir el audio de forma segura
  const playAudio = useCallback(async () => {
    if (!audioRef.current || hasUserManuallyPaused) return;

    try {
      audioRef.current.volume = 0.45; // Volumen ambiental agradable
      await audioRef.current.play();
      setIsPlaying(true);
    } catch (err) {
      // Bloqueado por política de autoplay del navegador hasta interacción del usuario
      setIsPlaying(false);
    }
  }, [hasUserManuallyPaused]);

  // Manejar el primer toque o interacción del usuario en la pantalla
  useEffect(() => {
    if (!audioUrl) return;

    const handleFirstInteraction = () => {
      setHasInteracted(true);
      if (!hasUserManuallyPaused && !isPlaying) {
        playAudio();
      }
    };

    // Escuchar el primer clic, touch o scroll en cualquier parte de la pantalla
    window.addEventListener('click', handleFirstInteraction, { once: true, passive: true });
    window.addEventListener('touchstart', handleFirstInteraction, { once: true, passive: true });
    window.addEventListener('scroll', handleFirstInteraction, { once: true, passive: true });

    // Ocultar el tooltip informativo después de 6 segundos
    const timer = setTimeout(() => {
      setShowTooltip(false);
    }, 6000);

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

  // Posicionamiento en pantalla
  const getPositionClasses = () => {
    switch (position) {
      case 'top-left':
        return 'top-4 left-4 sm:top-6 sm:left-6';
      case 'bottom-right':
        return 'bottom-5 right-5 sm:bottom-7 sm:right-7';
      case 'bottom-left':
        return 'bottom-5 left-5 sm:bottom-7 sm:left-7';
      case 'top-right':
      default:
        return 'top-4 right-4 sm:top-6 sm:right-6';
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

      {/* Tooltip discreto de bienvenida */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, x: 10, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.9 }}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/75 backdrop-blur-md text-white/90 text-xs shadow-lg border border-white/20"
          >
            <Sparkles className="w-3 h-3 text-amber-300 shrink-0" />
            <span className="font-medium whitespace-nowrap">
              {isPlaying ? 'Música activa' : 'Toca para música'}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botón flotante circular táctil */}
      <motion.button
        type="button"
        onClick={togglePlay}
        whileTap={{ scale: 0.92 }}
        className="relative group w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center bg-black/70 hover:bg-black/85 backdrop-blur-md text-white shadow-xl border border-white/30 transition-all duration-300 focus:outline-none"
        aria-label={isPlaying ? "Pausar música ambiental" : "Reproducir música ambiental"}
        title={title}
      >
        {/* Anillo de pulso sutil cuando está reproduciendo */}
        {isPlaying && (
          <motion.div
            animate={{ scale: [1, 1.35, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 rounded-full border border-white/60 pointer-events-none"
            style={{ borderColor: primaryColor }}
          />
        )}

        {/* Contenido del botón: Ondas sonoras animadas o Icono Silenciado */}
        {isPlaying ? (
          <div className="flex items-end justify-center gap-0.5 h-4 w-4">
            <motion.span
              animate={{ height: ['4px', '14px', '6px', '12px', '4px'] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
              className="w-1 bg-white rounded-full"
              style={{ backgroundColor: primaryColor ? '#ffffff' : undefined }}
            />
            <motion.span
              animate={{ height: ['10px', '4px', '16px', '8px', '10px'] }}
              transition={{ duration: 1.0, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
              className="w-1 bg-white rounded-full"
            />
            <motion.span
              animate={{ height: ['6px', '16px', '8px', '4px', '6px'] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
              className="w-1 bg-white rounded-full"
            />
          </div>
        ) : (
          <div className="relative">
            <VolumeX className="w-5 h-5 text-white/80 group-hover:text-white transition-colors" />
          </div>
        )}
      </motion.button>
    </div>
  );
}

export default AmbientAudioPlayer;
