"use client";

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { EditorData, Godparent, TemplateConfig, TimelineItem } from '@/lib/types';
import { RsvpTrigger } from "./shared/RsvpTrigger";

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
  data: EditorData;
  onRsvpClick?: () => void;
};

export default function BaptismTemplate({ template, data, onRsvpClick }: BaptismTemplateProps) {
  const { defaultData } = template;
  const invitationData = { ...defaultData, ...data };

  const mapSrc = invitationData.mainVenueAddress
    ? `https://maps.google.com/maps?q=${encodeURIComponent(invitationData.mainVenueAddress)}&t=&z=13&ie=UTF8&iwloc=&output=embed`
    : "";

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(invitationData.mainVenueAddress || '')}`;

  const date = invitationData.event_date ? new Date(invitationData.event_date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }) : '';

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
        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full blur-[80px]" style={{ backgroundColor: invitationData.primaryColor }} />
        <div className="absolute top-40 -right-20 w-72 h-72 rounded-full blur-[80px]" style={{ backgroundColor: invitationData.primaryColor }} />
      </div>

      {/* Hero: Elegant Calligraphy & Header */}
      <section className="relative min-h-[92vh] w-full flex flex-col justify-between items-center text-center px-6 pt-16 pb-12 z-10">
        <div className="flex-1 flex flex-col justify-center items-center w-full max-w-lg mx-auto">

          {/* Subtle Cross Motif */}
          <SacredFadeIn delay={0.2}>
            <div className="flex justify-center items-center mb-6">
              <svg width="24" height="36" viewBox="0 0 24 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2V34M6 11H18" stroke={invitationData.primaryColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </SacredFadeIn>

          {/* Header Title */}
          <SacredFadeIn delay={0.4}>
            <h2 
              className="text-4xl sm:text-5xl md:text-6xl tracking-wide mb-4 font-normal"
              style={{ color: invitationData.primaryColor, fontFamily: "'Sofia', 'Great Vibes', cursive, serif" }}
            >
              {invitationData.heroTitle}
            </h2>
          </SacredFadeIn>

          {/* Main Watercolor Floral Frame Wrapper for Mobile */}
          <div className="relative my-4 py-6 px-4 w-full flex flex-col items-center">
            {/* The Child's Name */}
            <SacredFadeIn delay={0.7}>
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-light tracking-tight leading-tight mb-2" style={{color: invitationData.textColor}}>
                {invitationData.heroNames}
              </h1>
            </SacredFadeIn>
          </div>

          {/* Date Stamp derived from the actual card */}
          <SacredFadeIn delay={1.0}>
            <div className="mt-6 flex flex-col items-center">
              <div className="h-px w-16 mb-4" style={{ backgroundColor: invitationData.primaryColor, opacity: 0.5 }} />
              <p className="text-xl sm:text-2xl tracking-wide font-light" style={{ color: invitationData.textColor }}>
                {date}
              </p>
              <div className="h-px w-16 mt-4" style={{ backgroundColor: invitationData.primaryColor, opacity: 0.5 }} />
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
            <span className="text-xs uppercase tracking-[0.3em] font-sans font-medium block mb-2" style={{ color: invitationData.primaryColor }}>
              Agenda del Día
            </span>
            <h3 className="text-2xl font-light italic">{invitationData.timelineTitle}</h3>
          </div>
        </SacredFadeIn>

        <div className="relative border-l-2 ml-4 pl-6 space-y-12" style={{ borderColor: `${invitationData.primaryColor}30` }}>
          {invitationData.timelineItems?.map((item: TimelineItem, index: number) => (
            <div key={index} className="relative">
              {/* Custom Watercolor Leaf Bullet Node */}
              <div 
                className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 bg-white flex items-center justify-center"
                style={{ borderColor: invitationData.primaryColor }}
              >
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: invitationData.primaryColor }} />
              </div>

              <SacredFadeIn delay={index * 0.1}>
                <span className="font-sans text-xs font-bold tracking-wider uppercase block mb-1" style={{ color: invitationData.textColor }}>
                  {item.time}
                </span>
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
            <span className="text-xs uppercase tracking-[0.3em] font-sans font-medium block mb-2" style={{ color: invitationData.primaryColor }}>
              Guías de Fe
            </span>
            <h3 className="text-3xl font-light mb-10" style={{ fontFamily: "'Sofia', 'Great Vibes', cursive, serif", color: invitationData.textColor }}>
              Mis Padrinos
            </h3>

            <div className="flex flex-col gap-8">
              {invitationData.godparents?.map((godparent: Godparent, index: number) => (
                <div key={index} className="p-4 rounded-2xl bg-[#FCFBF7] border border-dashed" style={{ borderColor: `${invitationData.primaryColor}40` }}>
                  <p className="text-[10px] uppercase tracking-widest font-sans font-semibold mb-1" style={{ color: invitationData.textColor }}>{godparent.role}</p>
                  <p className="text-1xl font-normal" style={{ color: invitationData.textColor }}>{godparent.name}</p>
                </div>
              ))}
            </div>
          </SacredFadeIn>
        </div>
      </section>

      {/* Map Section */}
      {mapSrc && (
        <section className="py-16 px-6 bg-white relative z-10">
          <div className="max-w-md mx-auto p-8 rounded-3xl border relative bg-white shadow-lg" style={{ borderColor: `${invitationData.primaryColor}40` }}>
            <div className="absolute top-3 left-3 w-3 h-3 border-t border-l" style={{ borderColor: invitationData.primaryColor }} />
            <div className="absolute bottom-3 right-3 w-3 h-3 border-b border-r" style={{ borderColor: invitationData.primaryColor }} />

            <div className="text-center">
              <SacredFadeIn>
                <span className="text-xs uppercase tracking-[0.3em] font-sans font-medium block mb-2" style={{ color: invitationData.primaryColor }}>
                  Ubicación
                </span>
                <h3 className="text-3xl font-light italic" style={{ fontFamily: "'Sofia', 'Great Vibes', cursive, serif" }}>
                  {invitationData.locationName}
                </h3>
                <p className="text-sm mt-2 opacity-80">
                  {invitationData.mainVenueAddress}
                </p>
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 px-6 py-2 rounded-full font-sans text-xs tracking-widest uppercase border active:bg-stone-50 transition-colors shadow-sm inline-block"
                  style={{ borderColor: invitationData.primaryColor, color: invitationData.primaryColor }}
                >
                  Open in Maps
                </a>
              </SacredFadeIn>
              <SacredFadeIn delay={0.2}>
                <div className="mt-8 aspect-video w-full rounded-2xl overflow-hidden">
                  <iframe
                    width="100%"
                    height="100%"
                    style={{ border: 0, filter: 'grayscale(80%)' }}
                    loading="lazy"
                    src={mapSrc}
                  />
                </div>
              </SacredFadeIn>
            </div>
          </div>
        </section>
      )}

      {/* Reception / Closing Card */}
      <section className="py-20 px-6 text-center relative z-10" style={{ backgroundColor: invitationData.backgroundColor }}>
        <SacredFadeIn>
          <div className="max-w-sm mx-auto p-8 rounded-3xl border relative bg-white shadow-sm" style={{ borderColor: `${invitationData.primaryColor}40` }}>
            {/* Elegant corner accents */}
            <div className="absolute top-3 left-3 w-3 h-3 border-t border-l" style={{ borderColor: invitationData.primaryColor }} />
            <div className="absolute bottom-3 right-3 w-3 h-3 border-b border-r" style={{ borderColor: invitationData.primaryColor }} />

            <h3 className="text-lg uppercase tracking-widest font-sans font-medium mb-4" style={{ color: invitationData.textColor }}>
              {invitationData.receptionTitle}
            </h3>
            <p className="text-lg font-light italic leading-relaxed mb-6 opacity-95">
              {invitationData.receptionText}
            </p>
            <p className="text-sm font-sans font-medium tracking-wide" style={{ color: invitationData.textColor }}>
              {invitationData.receptionPlace}
            </p>
          </div>
        </SacredFadeIn>
      </section>
      
      {onRsvpClick && (
        <section className="py-20 px-6 text-center">
          <RsvpTrigger onClick={onRsvpClick} primaryColor={invitationData.primaryColor} />
        </section>
      )}
    </div>
  );
}