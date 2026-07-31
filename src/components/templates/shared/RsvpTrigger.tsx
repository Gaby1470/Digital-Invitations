'use client';

import React from 'react';

type RsvpTriggerProps = {
  primaryColor?: string;
  textColor?: string;
  onClick: () => void;
};

export function RsvpTrigger({ primaryColor, textColor, onClick }: RsvpTriggerProps) {
  return (
    <div className="w-full text-center">
      <h2 
        className="text-3xl md:text-4xl text-center mb-8 italic" 
        style={{ color: textColor || '#171717' }}
      >
        Confirma tu asistencia
      </h2>
      <p 
        className="text-sm text-center mb-6 opacity-80"
        style={{ color: textColor || '#171717' }}
      >
        ¡Tu respuesta es muy importante!
      </p>
      <button
        onClick={onClick}
        className="w-full max-w-xs mx-auto px-8 py-4 rounded-lg font-bold text-white uppercase tracking-wider shadow-lg transition-transform hover:scale-105 active:scale-95"
        style={{ backgroundColor: primaryColor || '#4f46e5' }}
      >
        RSVP
      </button>
    </div>
  );
}
