// src/components/templates/shared/AddToCalendar.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar as CalendarIcon, 
  CalendarPlus, 
  Clock, 
  MapPin, 
  X, 
  Download, 
  Check, 
  Sparkles 
} from 'lucide-react';
import { 
  CalendarEvent, 
  generateGoogleCalendarUrl, 
  generateOutlookUrl, 
  downloadIcsFile, 
  getMobilePlatform, 
  parseEventDates 
} from '@/lib/calendar';

export interface AddToCalendarProps {
  event: CalendarEvent;
  variant?: 'solid' | 'outline' | 'glass' | 'subtle' | 'pill' | 'compact';
  primaryColor?: string;
  textColor?: string;
  className?: string;
  buttonText?: string;
  showIcon?: boolean;
}

export function AddToCalendar({
  event,
  variant = 'solid',
  primaryColor = '#4f46e5',
  textColor,
  className = '',
  buttonText = 'Añadir al Calendario',
  showIcon = true,
}: AddToCalendarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);
  const [platform, setPlatform] = useState<'ios' | 'android' | 'other'>('other');

  useEffect(() => {
    setMounted(true);
    setPlatform(getMobilePlatform());
  }, []);

  // Bloquear scroll de la página cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!event || !event.startDate) {
    return null;
  }

  const { start, end } = parseEventDates(event);

  // Formato de fecha para el resumen en español
  const formattedDate = start.toLocaleDateString('es-MX', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const formattedTime = start.toLocaleTimeString('es-MX', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  const formattedEndTime = end.toLocaleTimeString('es-MX', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  // Manejo de acciones por plataforma
  const handleAppleCalendar = () => {
    // Para iOS / macOS, abrir enlace al endpoint .ics o descargar
    const params = new URLSearchParams({
      title: event.title || '',
      startDate: typeof event.startDate === 'string' ? event.startDate : event.startDate.toISOString(),
      location: event.location || '',
      description: event.description || '',
    });
    if (event.startTime) params.set('startTime', event.startTime);
    if (event.endTime) params.set('endTime', event.endTime);
    if (event.url) params.set('url', event.url);

    // En iOS Safari, abrir la ruta .ics activa el visor nativo de Calendario
    if (platform === 'ios') {
      window.location.href = `/api/calendar/ics?${params.toString()}`;
    } else {
      downloadIcsFile(event);
    }
    showFeedback();
  };

  const handleGoogleCalendar = () => {
    const url = generateGoogleCalendarUrl(event);
    window.open(url, '_blank', 'noopener,noreferrer');
    showFeedback();
  };

  const handleOutlook = () => {
    const url = generateOutlookUrl(event);
    window.open(url, '_blank', 'noopener,noreferrer');
    showFeedback();
  };

  const handleIcsDownload = () => {
    downloadIcsFile(event);
    showFeedback();
  };

  const showFeedback = () => {
    setCopiedNotification(true);
    setTimeout(() => {
      setCopiedNotification(false);
      setIsOpen(false);
    }, 1500);
  };

  // Clases del botón de acuerdo con la variante
  const getButtonStyles = () => {
    const base = "inline-flex items-center justify-center gap-2.5 transition-all duration-300 font-medium select-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2";
    
    switch (variant) {
      case 'glass':
        return `${base} px-5 py-2.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/40 shadow-md hover:shadow-lg active:scale-95 text-xs sm:text-sm tracking-wider uppercase`;
      case 'outline':
        return `${base} px-6 py-3 rounded-xl border-2 hover:scale-[1.02] active:scale-95 text-sm font-semibold shadow-sm`;
      case 'pill':
        return `${base} px-6 py-3 rounded-full hover:scale-105 active:scale-95 text-sm font-bold uppercase tracking-wider shadow-md hover:shadow-lg`;
      case 'subtle':
        return `${base} px-5 py-2.5 rounded-lg hover:opacity-90 active:scale-95 text-xs sm:text-sm font-medium tracking-wide`;
      case 'compact':
        return `${base} px-3.5 py-1.5 rounded-lg text-xs font-semibold hover:opacity-90 active:scale-95 shadow-sm`;
      case 'solid':
      default:
        return `${base} px-6 py-3.5 rounded-xl hover:scale-105 active:scale-95 text-sm font-bold uppercase tracking-wider shadow-lg hover:shadow-xl`;
    }
  };

  // Estilos inline para colores dinámicos
  const getInlineStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'outline':
        return {
          borderColor: primaryColor,
          color: textColor || primaryColor,
          backgroundColor: 'transparent',
        };
      case 'subtle':
        return {
          backgroundColor: `${primaryColor}18`,
          color: textColor || primaryColor,
        };
      case 'glass':
        return {
          color: textColor || '#ffffff',
        };
      case 'solid':
      case 'pill':
      case 'compact':
      default:
        return {
          backgroundColor: primaryColor,
          color: textColor || '#ffffff',
        };
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`${getButtonStyles()} ${className}`}
        style={getInlineStyles()}
        aria-label="Añadir evento al calendario"
      >
        {showIcon && <CalendarPlus className="w-4 h-4 shrink-0" />}
        <span>{buttonText}</span>
      </button>

      {/* Modal / Bottom Sheet renderizado vía Portal */}
      {mounted && createPortal(
        <AnimatePresence>
          {isOpen && (
            <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center forced-light-theme">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              />

              {/* Sheet / Dialog */}
              <motion.div
                initial={{ y: '100%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: '100%', opacity: 0 }}
                transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl p-6 sm:p-7 z-10 max-h-[92vh] overflow-y-auto text-gray-900 border border-gray-100"
              >
                {/* Pull handle en móvil */}
                <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4 sm:hidden" />

                {/* Encabezado */}
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
                      style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
                    >
                      <CalendarIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 leading-tight">
                        Añadir a mi Calendario
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Elige tu aplicación preferida
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
                    aria-label="Cerrar"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Tarjeta resumen del evento */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100/70 rounded-xl p-4 border border-gray-200/80 mb-6 space-y-2 text-left">
                  <p className="font-bold text-sm text-gray-800 line-clamp-1">
                    {event.title}
                  </p>
                  
                  <div className="flex items-center gap-2 text-xs text-gray-600 capitalize">
                    <CalendarIcon className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span>{formattedDate}</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span>{formattedTime} {formattedEndTime && `– ${formattedEndTime}`}</span>
                  </div>

                  {event.location && (
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span className="line-clamp-1">{event.location}</span>
                    </div>
                  )}
                </div>

                {/* Notificación de éxito al hacer clic */}
                {copiedNotification && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-center gap-2 text-xs font-semibold text-emerald-800"
                  >
                    <Check className="w-4 h-4 text-emerald-600" />
                    ¡Abriendo calendario... Recuerda guardarlo!
                  </motion.div>
                )}

                {/* Opciones de Calendario */}
                <div className="space-y-3">
                  
                  {/* Opción 1: Apple Calendar */}
                  <button
                    type="button"
                    onClick={handleAppleCalendar}
                    className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${
                      platform === 'ios'
                        ? 'border-indigo-400 bg-indigo-50/50 shadow-sm hover:bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Logo Apple */}
                      <div className="w-9 h-9 rounded-lg bg-black text-white flex items-center justify-center shrink-0 shadow-sm">
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 170 170">
                          <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.08-7.7-7.86-12.01-14.36-5.88-8.81-10.36-18.9-13.44-30.25-3.08-11.36-4.63-22.12-4.63-32.3 0-14.79 3.86-27.27 11.58-37.45 7.72-10.18 17.51-15.34 29.38-15.48 4.7 0 9.87 1.25 15.52 3.75 5.64 2.5 9.53 3.86 11.66 4.09 1.93-.23 5.92-1.66 11.96-4.29 6.04-2.63 11.16-3.84 15.37-3.63 11.41.68 20.67 4.76 27.78 12.24-9.98 6.06-14.86 14.38-14.64 24.96.22 8.44 3.4 15.48 9.54 21.12 6.14 5.64 13.43 9.04 21.87 10.21-2.02 6.13-4.54 12.56-7.57 19.29zM119.22 31.84c0-7.3 2.66-14.07 7.99-20.31 5.33-6.24 11.75-10.32 19.27-12.24.23 1.13.34 2.22.34 3.28 0 7.21-2.77 14.15-8.31 20.82-5.54 6.67-12.01 10.74-19.41 12.21-.11-1.25-.17-2.17-.17-2.76z" />
                        </svg>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-gray-900">Apple Calendar</span>
                          {platform === 'ios' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700">
                              <Sparkles className="w-2.5 h-2.5" /> Recomendado
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">Para iPhone, iPad y Mac</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400 font-medium sm:block">Abrir</span>
                  </button>

                  {/* Opción 2: Google Calendar */}
                  <button
                    type="button"
                    onClick={handleGoogleCalendar}
                    className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${
                      platform === 'android'
                        ? 'border-emerald-400 bg-emerald-50/50 shadow-sm hover:bg-emerald-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Logo Google Calendar */}
                      <div className="w-9 h-9 rounded-lg bg-white border border-gray-200 flex items-center justify-center shrink-0 shadow-sm p-1.5">
                        <svg className="w-full h-full" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
                          <path fill="#fff" d="M19 19H5V8h14v11z"/>
                          <path fill="#EA4335" d="M11 10H7v4h4v-4z"/>
                          <path fill="#34A853" d="M17 10h-4v4h4v-4z"/>
                          <path fill="#FBBC05" d="M11 15H7v3h4v-3z"/>
                        </svg>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-gray-900">Google Calendar</span>
                          {platform === 'android' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                              <Sparkles className="w-2.5 h-2.5" /> Recomendado
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">Para Android, web y Gmail</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400 font-medium sm:block">Abrir</span>
                  </button>

                  {/* Opción 3: Outlook / Otros */}
                  <button
                    type="button"
                    onClick={handleOutlook}
                    className="w-full flex items-center justify-between p-3.5 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-left transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#0078D4] text-white flex items-center justify-center shrink-0 shadow-sm">
                        <CalendarIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-semibold text-sm text-gray-900">Outlook</span>
                        <p className="text-xs text-gray-500">Microsoft Outlook Web / App</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400 font-medium sm:block">Abrir</span>
                  </button>

                  {/* Opción 4: Descargar archivo universal .ics */}
                  <button
                    type="button"
                    onClick={handleIcsDownload}
                    className="w-full flex items-center justify-between p-3.5 rounded-xl border border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-left transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center shrink-0">
                        <Download className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-semibold text-sm text-gray-900">Descargar archivo .ics</span>
                        <p className="text-xs text-gray-500">Universal para cualquier calendario</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400 font-medium sm:block">Descargar</span>
                  </button>

                </div>

                {/* Pie del modal */}
                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[11px] text-gray-400">
                    Recordatorios configurados automáticamente
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="text-xs font-semibold text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition"
                  >
                    Cerrar
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
export default AddToCalendar;
