"use client";

import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { TemplateConfig } from '@/lib/custom_types';
import { EditorData } from "@/lib/custom_types";
import Image from 'next/image';
import { RsvpTrigger } from "./shared/RsvpTrigger";

function BounceIn({ children, delay = 0, direction = "up" }: { children: React.ReactNode, delay?: number, direction?: "up" | "left" | "right" }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-20px" });

  const yOffset = direction === "up" ? 30 : 0;
  const xOffset = direction === "left" ? 30 : direction === "right" ? -30 : 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8, y: yOffset, x: xOffset }}
      animate={isInView ? { opacity: 1, scale: 1, y: 0, x: 0 } : {}}
      transition={{ type: "spring", stiffness: 250, damping: 15, delay }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
}

type SportsBirthdayTemplateProps = {
  template: TemplateConfig;
  data: EditorData;
  invitationId?: string;
  onRsvpClick?: () => void;
};

export default function SportsBirthdayTemplate({ template, data, invitationId, onRsvpClick }: SportsBirthdayTemplateProps) {
  const { defaultData, font } = template;
  const invitationData = { ...defaultData, ...data };
  const [isRsvpModalOpen, setIsRsvpModalOpen] = useState(false);
  
  const mapSrc = invitationData.location
    ? `https://maps.google.com/maps?q=${encodeURIComponent(invitationData.location)}&t=&z=13&ie=UTF8&iwloc=&output=embed`
    : "";

  const theme = {
    bg: '#FFFFFF',
    text: invitationData.textColor || '#111827',
  };

  const formattedTime = (dateString: string | undefined) => {
    if (!dateString) return "00:00 PM";
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).toLowerCase();
  }

  return (
    <div className={`w-full min-h-screen overflow-x-hidden relative pb-24 ${font}`}>
      {/* Textured Grass Background */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/soccer-grass.jpg)' }}
      />
      <div className="absolute inset-0 z-0 bg-white opacity-10" />
      
      {/* DECORATION LAYER: Floating sports elements */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div 
          animate={{ y: [0, 10, 0], rotate: [-12, -8, -12] }} 
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-12 -right-8 w-28 h-28 opacity-90 drop-shadow-lg" 
        >
          <Image src="/soccer-ball.png" alt="" fill className="object-contain" />
        </motion.div>
        <motion.div 
          animate={{ y: [0, -12, 0], rotate: [45, 50, 45] }} 
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute top-1/3 -left-10 w-24 h-24 opacity-90 drop-shadow-lg"
        >
          <Image src="/basket-ball.png" alt="" fill className="object-contain" />
        </motion.div>
        <motion.div 
          animate={{ y: [0, 15, 0], rotate: [-6, 0, -6] }} 
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          className="absolute bottom-5 -right-6 w-32 h-32 opacity-90 drop-shadow-lg"
        >
          <Image src="/jersey.png" alt="" fill className="object-contain" />
        </motion.div>
        <motion.div 
          animate={{ y: [0, -10, 0], rotate: [6, 10, 6] }} 
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
          className="absolute bottom-1/2 -right-10 w-36 h-36 opacity-90 drop-shadow-lg"
        >
          <Image src="/trophy.png" alt="" fill className="object-contain" />
        </motion.div>
        <motion.div 
          animate={{ y: [0, 12, 0], rotate: [-12, -18, -12] }} 
          transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
          className="absolute bottom-10 -left-8 w-24 h-24 opacity-90 drop-shadow-lg"
        >
          <Image src="/soccer-ball.png" alt="" fill className="object-contain" />
        </motion.div>
      </div>

      {/* CONTENT LAYER */}
      <div className="relative z-10 max-w-md mx-auto flex flex-col items-center px-6 pt-12 text-center">
        
        {/* Header Section */}
        <BounceIn direction="up">
          <div className="mb-6 flex flex-col items-center">
            <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-widest drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]" style={{ color: '#FFF8E7' }}>
              {invitationData.heroTitle || (invitationData.age ? `JUEGO ${invitationData.age}` : "GAME TIME")}
            </h2>
          </div>
        </BounceIn>

        {/* Hero Section: Trading Card Aesthetic */}
        <BounceIn direction="up" delay={0.1}>
          <div className="w-full mb-12 relative flex flex-col items-center">
            <div className="w-[85%] bg-white p-3 rounded-[1rem] border-4 border-black shadow-[8px_8px_0px_#000000] relative z-10 transform -rotate-2">
              {invitationData.photoUrl ? (
                <div className="aspect-[4/5] w-full overflow-hidden rounded-[0.5rem] bg-neutral-100 border-2 border-black relative">
                  <Image 
                    src={invitationData.photoUrl} 
                    alt={invitationData.heroNames || "Hero Image"}
                    fill
                    className="object-cover" 
                  />
                </div>
              ) : (
                <div className="aspect-[4/5] w-full flex items-center justify-center rounded-[0.5rem] bg-neutral-100 border-2 border-dashed border-neutral-300">
                  <span className="text-neutral-400 font-bold uppercase text-sm tracking-wider">Imagen</span>
                </div>
              )}
            </div>
            
            {/* Chunky Name Overlay */}
            <div className="absolute -bottom-6 z-20 w-[95%]">
              <h1 className="text-5xl sm:text-6xl font-black uppercase tracking-tighter bg-white py-3 px-6 rounded-xl border-4 border-black shadow-[6px_6px_0px_#000000] transform rotate-1" 
                  style={{ color: theme.text }}>
                {invitationData.heroNames || "ALEX"}
              </h1>
            </div>
          </div>
        </BounceIn>

        {/* The Playbook (VIP Ticket Details Card - Time & Date Only) */}
        <section className="w-full mt-8 mb-6">
          <BounceIn direction="up" delay={0.2}>
            <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.3)] border-4 border-black relative overflow-hidden">
              
              {/* Ticket Header */}
              <div className="py-3" style={{ backgroundColor: "#111827" }}>
                <h3 className="text-white text-sm font-black uppercase tracking-[0.3em]">
                  {invitationData.playbookTitle || "El Partido"}
                </h3>
              </div>

              <div className="p-6 relative z-10 flex flex-col gap-5 text-left">
                
                {/* Date Row */}
                <div className="flex items-center gap-4">
                  <div className="bg-neutral-100 p-3 rounded-full border-2 shadow-sm" style={{ borderColor: invitationData.primaryColor }}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: invitationData.primaryColor }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-black text-neutral-400 tracking-wider">Fecha</p>
                    <p className="text-lg font-black uppercase leading-none mt-0.5" style={{ color: invitationData.primaryColor }}>
                      {invitationData.event_date ? new Date(invitationData.event_date).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }) : "MIÉRCOLES, 22 DE JULIO"}
                    </p>
                  </div>
                </div>

                <div className="w-full border-t-2 border-dashed border-neutral-200" />

                {/* Time Row */}
                <div className="flex items-center gap-4">
                  <div className="bg-neutral-100 p-3 rounded-full border-2 shadow-sm" style={{ borderColor: invitationData.primaryColor }}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: invitationData.primaryColor }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-black text-neutral-400 tracking-wider">Hora</p>
                    <p className="text-xl font-black leading-none mt-0.5" style={{ color: invitationData.primaryColor }}>
                      {formattedTime(invitationData.event_date)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </BounceIn>
        </section>

        {/* Dedicated Location / Stadium Section */}
        <section className="w-full mb-6">
          <BounceIn direction="up" delay={0.25}>
            <div className="bg-white rounded-2xl p-5 border-4 border-black text-left shadow-[4px_4px_0px_#000000]">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-black p-2 rounded-full">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                </div>
                <h3 className="text-lg font-black uppercase tracking-wider text-black">
                  El Estadio
                </h3>
              </div>
              
              {mapSrc && (
                <div className="w-full aspect-video rounded-lg border-2 border-black mb-4 overflow-hidden">
                  <iframe
                    src={mapSrc}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              )}

              <p className="text-base font-bold text-neutral-800 leading-tight mb-4">
                {invitationData.location || "The Local Park"}
              </p>

              <a 
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(invitationData.location || "The Local Park")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full block text-center bg-blue-500 hover:bg-blue-400 text-white font-black text-sm py-3 rounded-xl border-2 border-black shadow-[0_4px_0_0_#000000] active:shadow-[0_0px_0_0_#000000] active:translate-y-1 transition-all uppercase tracking-widest"
              >
                📍 Cómo Llegar
              </a>
            </div>
          </BounceIn>
        </section>

        {/* Notas del Entrenador */}
        {(invitationData.parentalNotes || invitationData.extraInfo) && (
          <section className="w-full mb-6">
            <BounceIn direction="up" delay={0.3}>
              <div className="bg-[#FFF8E7] rounded-2xl p-5 border-4 border-black text-left shadow-[4px_4px_0px_#000000]">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xl">📢</span>
                  <h3 className="text-sm font-black uppercase tracking-wider text-black">
                    Notas del Entrenador
                  </h3>
                </div>
                <p className="text-sm font-bold text-neutral-800 leading-relaxed">
                  {invitationData.parentalNotes || invitationData.extraInfo || "¡Trae tu mejor juego! Tendremos pizza y pastel después del partido."}
                </p>
              </div>
            </BounceIn>
          </section>
        )}

        {/* Action Buttons Section */}
        {/* <section className="w-full mt-2 flex flex-col gap-4"> */}
          {/* <BounceIn direction="up" delay={0.35}>
            <button 
              className="w-full bg-white hover:bg-gray-50 text-black font-black text-sm py-3 rounded-xl border-4 border-black shadow-[0_4px_0_0_#000000] active:shadow-[0_0px_0_0_#000000] active:translate-y-1 transition-all uppercase tracking-widest flex items-center justify-center gap-2"
              onClick={() => {
                // Future implementation: trigger ICS file download or native calendar intent
                alert("Calendar functionality to be implemented!");
              }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              Agregar al Calendario
            </button>
          </BounceIn>
        {/* </section> */}

        {onRsvpClick && (
          <section className="py-20 px-6 text-center">
            <RsvpTrigger onClick={onRsvpClick} primaryColor="#000" textColor="#FFF" />
          </section>
        )}
      </div>


    </div>
  );
}