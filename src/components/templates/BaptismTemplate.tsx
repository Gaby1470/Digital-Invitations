"use client";

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { TemplateConfig, TimelineItem } from '@/lib/types';

/**
 * Ethereal fade-in for sacred milestones, optimized for mobile performance.
 */
function SacredFadeIn({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-30px 0px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 15 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1.0, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

type BaptismTemplateProps = {
  template: TemplateConfig;
  data: any;
};

export default function BaptismTemplate({ template, data }: BaptismTemplateProps) {
  const { defaultData } = template;
  
  // --- EXACT COLORIMETRY FROM THE WATERCOLOR INVITATION ---
  const invitationData = {
    backgroundColor: '#FCFBF7', // Creamy watercolor paper texture background
    textColor: '#A27B5C',       // Elegant warm mocha brown (from "Hernandez")
    goldColor: '#D2AC6A',       // Soft watercolor gold (from "Bautizo")
    blueColor: '#8BB4CE',       // Soft sky blue (from "Sofía")
    peachColor: '#EAA97E',      // Peach/Coral accent from the floral wreath
    greenColor: '#9BB284',      // Soft sage green from the leaves
    ...defaultData,
    ...data
  };

  return (
    <div 
      className="w-full font-serif overflow-x-hidden relative select-none"
      style={{
        backgroundColor: invitationData.backgroundColor,
        color: invitationData.textColor
      }}
    >
      {/* Background Ambient Watercolor Glows */}
      <div className="absolute top-0 left-0 right-0 h-[600px] overflow-hidden pointer-events-none z-0 opacity-40">
        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full blur-[80px]" style={{ backgroundColor: invitationData.peachColor }} />
        <div className="absolute top-40 -right-20 w-72 h-72 rounded-full blur-[80px]" style={{ backgroundColor: invitationData.blueColor }} />
      </div>

      {/* Hero: Elegant Calligraphy & Header */}
      <section className="relative min-h-[92vh] w-full flex flex-col justify-between items-center text-center px-6 pt-16 pb-12 z-10">
        <div className="flex-1 flex flex-col justify-center items-center w-full max-w-lg mx-auto">
          
          {/* Subtle Cross Motif */}
          <SacredFadeIn delay={0.2}>
            <div className="flex justify-center items-center mb-6">
              <svg width="24" height="36" viewBox="0 0 24 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2V34M6 11H18" stroke={invitationData.goldColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </SacredFadeIn>

          {/* Header Title */}
          <SacredFadeIn delay={0.4}>
            <h2 
              className="text-4xl sm:text-5xl md:text-6xl tracking-wide mb-4 font-normal"
              style={{ color: invitationData.goldColor, fontFamily: "'Sofia', 'Great Vibes', cursive, serif" }}
            >
              Bautizo
            </h2>
          </SacredFadeIn>
          
          {/* Main Watercolor Floral Frame Wrapper for Mobile */}
          <div className="relative my-4 py-6 px-4 w-full flex flex-col items-center">
            {/* The Child's Name */}
            <SacredFadeIn delay={0.7}>
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-light tracking-tight leading-tight mb-2">
                <span style={{ color: invitationData.blueColor, fontFamily: "'Sofia', 'Great Vibes', cursive, serif" }}>Sofía</span>
                <br />
                <span className="text-3xl sm:text-4xl uppercase tracking-[0.2em] font-sans font-light block mt-2" style={{ color: invitationData.textColor }}>
                  Hernández
                </span>
              </h1>
            </SacredFadeIn>
          </div>

          {/* Date Stamp derived from the actual card */}
          <SacredFadeIn delay={1.0}>
            <div className="mt-6 flex flex-col items-center">
              <div className="h-px w-16 mb-4" style={{ backgroundColor: invitationData.goldColor, opacity: 0.5 }} />
              <p className="text-xl sm:text-2xl tracking-wide font-light" style={{ color: invitationData.greenColor }}>
                25 de Abril de 2026
              </p>
              <div className="h-px w-16 mt-4" style={{ backgroundColor: invitationData.goldColor, opacity: 0.5 }} />
            </div>
          </SacredFadeIn>

        </div>

        {/* Floating Peace Dove Indicator */}
        <div className="w-full text-center opacity-40 animate-bounce mt-4 text-xl">
          🕊️
        </div>
      </section>

      {/* Timeline/Ceremony Section */}
      <section className="py-16 px-6 relative z-10 max-w-md mx-auto">
        <SacredFadeIn>
          <div className="text-center mb-12">
            <span className="text-xs uppercase tracking-[0.3em] font-sans font-medium block mb-2" style={{ color: invitationData.goldColor }}>
              Agenda del Día
            </span>
            <h3 className="text-2xl font-light italic">Nuestra Celebración</h3>
          </div>
        </SacredFadeIn>
        
        <div className="relative border-l-2 ml-4 pl-6 space-y-12" style={{ borderColor: `${invitationData.goldColor}30` }}>
          {invitationData.timelineItems?.map((item: TimelineItem, index: number) => (
            <div key={index} className="relative">
              {/* Custom Watercolor Leaf Bullet Node */}
              <div 
                className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 bg-white flex items-center justify-center"
                style={{ borderColor: invitationData.greenColor }}
              >
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: invitationData.peachColor }} />
              </div>
              
              <SacredFadeIn delay={index * 0.1}>
                <span className="font-sans text-xs font-bold tracking-wider uppercase block mb-1" style={{ color: invitationData.blueColor }}>
                  {item.time}
                </span>
                {/* ENLARGED: Increased timeline item text size for better emphasis (e.g., "Catedral de García") */}
                <h4 className="text-3xl font-medium tracking-tight mb-1" style={{ color: invitationData.textColor }}>
                  {item.title}
                </h4>
                <p className="text-1xl font-light opacity-90 leading-relaxed">
                  {item.location}
                </p>
              </SacredFadeIn>
            </div>
          ))}
        </div>
      </section>

      {/* Godparents/Padrinos Section */}
      <section className="py-16 px-6 text-center bg-white rounded-t-[40px] shadow-[0_-10px_30px_rgba(162,123,92,0.04)] relative z-10">
        <div className="max-w-md mx-auto">
          <SacredFadeIn>
            <span className="text-xs uppercase tracking-[0.3em] font-sans font-medium block mb-2" style={{ color: invitationData.goldColor }}>
              Guías de Fe
            </span>
            <h3 className="text-3xl font-light mb-10" style={{ fontFamily: "'Sofia', 'Great Vibes', cursive, serif", color: invitationData.textColor }}>
              Mis Padrinos
            </h3>
            
            <div className="flex flex-col gap-8">
              <div className="p-4 rounded-2xl bg-[#FCFBF7] border border-dashed" style={{ borderColor: `${invitationData.greenColor}40` }}>
                <p className="text-[10px] uppercase tracking-widest font-sans font-semibold mb-1" style={{ color: invitationData.peachColor }}>Madrina</p>
                <p className="text-1xl font-normal" style={{ color: invitationData.textColor }}>Elizabeth Montgomery</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#FCFBF7] border border-dashed" style={{ borderColor: `${invitationData.blueColor}40` }}>
                <p className="text-[10px] uppercase tracking-widest font-sans font-semibold mb-1" style={{ color: invitationData.blueColor }}>Padrino</p>
                <p className="text-1xl font-normal" style={{ color: invitationData.textColor }}>Christopher Rhodes</p>
              </div>
            </div>
          </SacredFadeIn>
        </div>
      </section>

      {/* Reception / Closing Card */}
      <section className="py-20 px-6 text-center relative z-10" style={{ backgroundColor: invitationData.backgroundColor }}>
        <SacredFadeIn>
          <div className="max-w-sm mx-auto p-8 rounded-3xl border relative bg-white shadow-sm" style={{ borderColor: `${invitationData.goldColor}40` }}>
            {/* Elegant corner accents */}
            <div className="absolute top-3 left-3 w-3 h-3 border-t border-l" style={{ borderColor: invitationData.goldColor }} />
            <div className="absolute bottom-3 right-3 w-3 h-3 border-b border-r" style={{ borderColor: invitationData.goldColor }} />
            
            <h3 className="text-lg uppercase tracking-widest font-sans font-medium mb-4" style={{ color: invitationData.textColor }}>
              Recepción
            </h3>
            {/* ENLARGED: Increased font size and comfort space for the invitation paragraph */}
            <p className="text-lg font-light italic leading-relaxed mb-6 opacity-95">
              "Después de la bendición sagrada, acompáñanos a celebrar con un brindis especial en honor a Sofía."
            </p>
            <p className="text-sm font-sans font-medium tracking-wide" style={{ color: invitationData.greenColor }}>
              Lugar: Jardín de los Rosales Conservatorio
            </p>
          </div>
        </SacredFadeIn>
      </section>
    </div>
  );
}