"use client";

import { motion, useInView } from "framer-motion";
import React, { useRef } from "react";
import { TimelineItem, DressCode, Godparent, TemplateConfig, EditorData } from "@/lib/custom_types";
import Image from "next/image";
import { RsvpTrigger } from './shared/RsvpTrigger';

function AnimatedSection({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px 0px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.21, 0.45, 0.32, 0.9] }}
    >
      {children}
    </motion.div>
  );
}

type OldMoneyTemplateProps = {
  template: TemplateConfig;
  data: EditorData;
  invitationId?: string;
  onRsvpClick?: () => void;
};

function normalizePinterestUrl(url?: string): string {
  if (!url) return '#';
  const trimmed = url.trim();
  if (trimmed.startsWith('https://') || trimmed.startsWith('http://')) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

const formatUrl = (urlOrAddress: string | undefined): string => {
    if (!urlOrAddress) return '';
    const trimmed = urlOrAddress.trim();
    if (!trimmed || trimmed === '#') return '';

    // If it's already a valid, absolute URL, return it.
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
        return trimmed;
    }

    // If it looks like a domain name (e.g., www.google.com), prepend https.
    if (trimmed.includes('.') && !trimmed.includes(' ')) {
        return `https://${trimmed}`;
    }

    // Otherwise, assume it's a physical address and create a Google Maps search URL.
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(trimmed)}`;
};


export default function OldMoneyTemplate({
  template,
  data,
  invitationId,
  onRsvpClick,
}: OldMoneyTemplateProps) {
  const { features, defaultData } = template;
  const invitationData = { ...defaultData, ...data };

  // Theme colors derived from the video's aesthetic
  const primaryText = invitationData.textColor || "#292524"; // stone-800
  const accentColor = invitationData.primaryColor || "#9a825e"; // soft gold/brown
  const bgColor = invitationData.backgroundColor || "#fcfbf9"; // warm off-white

  const dressCode: DressCode | undefined = invitationData.dressCode;

  // Formatting date for the central display
  const eventDateRaw = invitationData.event_date ? new Date(invitationData.event_date) : new Date("2024-11-16T00:00:00");
  const dayName = eventDateRaw.toLocaleDateString("es-MX", { weekday: "long" });
  const dayNumber = eventDateRaw.getDate();
  const monthName = eventDateRaw.toLocaleDateString("es-MX", { month: "long" });
  const year = eventDateRaw.getFullYear();

  return (
    <div
      className="w-full antialiased overflow-x-hidden selection:bg-stone-200 font-sans"
      style={{ backgroundColor: bgColor, color: primaryText }}
    >
      {/* 1. HERO SECTION */}
      <section className="relative h-[85dvh] min-h-[600px] w-full flex flex-col items-center overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 z-0"
        >
          <Image
            src={
              invitationData.hero_image_url ||
              "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80"
            }
            fill
            className="object-cover object-top"
            alt="Couple"
          />
          {/* Subtle gradient overlay to ensure text legibility */}
        </motion.div>

        <div className="z-10 mt-auto mb-20 text-center text-white px-6 w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <p className="uppercase text-[10px] tracking-[0.3em] mb-4 opacity-90 font-medium">
              {invitationData.heroTitle || "Nuestra Boda"}
            </p>
            <h1 className="text-5xl sm:text-6xl font-serif tracking-widest uppercase leading-none">
              {invitationData.heroNames || "Yoselin & Ivan"}
            </h1>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 w-full z-20 leading-none translate-y-[1px]">
          <svg 
            viewBox="0 0 1440 80" 
            preserveAspectRatio="none" 
            className="w-full h-[40px] sm:h-[60px]"
          >
            <path 
              fill={bgColor} 
              opacity="0.4"
              d="M0,40 Q120,60 240,40 T480,50 T720,30 T960,50 T1200,30 T1440,40 L1440,80 L0,80 Z" 
            />
            <path 
              fill={bgColor} 
              opacity="0.6"
              d="M0,50 Q140,70 280,45 T560,55 T840,35 T1120,60 T1440,45 L1440,80 L0,80 Z" 
            />
            <path 
              fill={bgColor} 
              d="M0,60 Q160,80 320,55 T640,65 T960,45 T1280,70 T1440,55 L1440,80 L0,80 Z" 
            />
          </svg>
        </div>
      </section>

      {/* 2. ROMANTIC QUOTE & PARENTS */}
      <section className="py-16 px-8 max-w-md mx-auto text-center space-y-12">
        <AnimatedSection>
          <p className="text-xs leading-relaxed uppercase tracking-wider font-medium opacity-80" style={{ color: primaryText }}>
            {invitationData.quote || 
              "Tú siempre serás mi referente del amor en pareja, por qué siempre quise esto y tú me lo has regalado"}
          </p>
        </AnimatedSection>

        {((invitationData.partner1Parents && invitationData.partner1Parents.length > 0) || (invitationData.partner2Parents && invitationData.partner2Parents.length > 0)) && (
          <AnimatedSection delay={0.2}>
            <div className="space-y-6">
                <h3 className="font-serif italic text-2xl" style={{ color: accentColor }}>
                    {invitationData.parentsTitle || "Con la bendición de nuestros padres"}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-center text-sm uppercase tracking-widest opacity-80 font-medium">
                    <div>
                        {invitationData.partner1Parents?.map((p: string) => <p key={p}>{p}</p>)}
                    </div>
                    <div>
                        {invitationData.partner2Parents?.map((p: string) => <p key={p}>{p}</p>)}
                    </div>
                </div>
            </div>
          </AnimatedSection>
        )}
      </section>

      {/* 3. DATE HIGHLIGHT */}
      <section className="px-6 max-w-md mx-auto">
        <AnimatedSection>
          <div className="text-center space-y-4 mb-16">
            <p className="text-xs uppercase tracking-widest font-medium opacity-80">
              ¡Nos Casamos!
            </p>
            <p className="text-[10px] uppercase tracking-wider opacity-60">
              Los esperamos para celebrar juntos el día:
            </p>

            <div className="flex items-center justify-center py-6 border-y" style={{ borderColor: `${primaryText}20` }}>
              <div className="flex items-center space-x-4">
                <span className="uppercase text-sm tracking-widest font-medium">{dayName}</span>
                <span className="text-4xl font-serif">{dayNumber}</span>
                <div className="flex flex-col text-left text-sm uppercase tracking-widest font-medium leading-tight">
                  <span>{monthName}</span>
                  <span>{year}</span>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* 4. VENUES (Ceremony & Reception) */}
      <section className="px-6 max-w-md mx-auto space-y-12 pb-20">
        {invitationData.timelineItems?.map((item: TimelineItem, index: number) => {
          const mapUrl = formatUrl(item.mapLink);
          return (
          <React.Fragment key={index}>
            <AnimatedSection>
              <div className="text-center space-y-5">
                <h3 className="font-serif italic text-3xl" style={{ color: accentColor }}>
                  {item.title}
                </h3>
                <p className="text-[11px] uppercase tracking-wider opacity-80 leading-relaxed max-w-[280px] mx-auto whitespace-pre-line">
                  {item.location}
                </p>
                <p className="text-sm font-medium tracking-widest">{item.time}</p>
                {mapUrl && (
                  <>
                    <p className="text-[10px] uppercase tracking-widest opacity-60 mt-4 mb-2">
                      ¿Cómo llegar?
                    </p>
                    <button
                      onClick={() => window.open(mapUrl, '_blank')}
                      className="inline-block px-10 py-3 rounded-full text-xs uppercase tracking-widest text-white transition-opacity hover:opacity-90"
                      style={{ backgroundColor: accentColor }}
                    >
                      Ubicación
                    </button>
                  </>
                )}
              </div>
            </AnimatedSection>
            {invitationData.timelineItems && index < invitationData.timelineItems.length - 1 && (
              <AnimatedSection>
                <p className="text-center text-[10px] uppercase tracking-widest opacity-60 max-w-[250px] mx-auto leading-relaxed">
                  {invitationData.venueDividerText || '~'}
                </p>
              </AnimatedSection>
            )}
          </React.Fragment>
        )})}
      </section>

      {/* 5. DRESS CODE (Dark Theme Block) */}
      {dressCode && (
        <section className="py-20 px-6 bg-[#fcfbf9] border-t" style={{ borderColor: `${primaryText}20` }}>
            <AnimatedSection>
            <div className="max-w-md mx-auto text-center">
                <h2 className="font-serif italic text-4xl text-center mb-8" style={{ color: accentColor }}>
                    Vestimenta
                </h2>
                <div className="flex justify-center gap-4">
                  {dressCode.pinterestUrlMan && (
                    <a
                      href={normalizePinterestUrl(dressCode.pinterestUrlMan)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-10 py-3 rounded-full text-xs uppercase tracking-widest text-white transition-opacity hover:opacity-90"
                      style={{ backgroundColor: accentColor }}
                    >
                      Hombre
                    </a>
                  )}
                  {dressCode.pinterestUrlWoman && (
                    <a
                      href={normalizePinterestUrl(dressCode.pinterestUrlWoman)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-10 py-3 rounded-full text-xs uppercase tracking-widest text-white transition-opacity hover:opacity-90"
                      style={{ backgroundColor: accentColor }}
                    >
                      Mujer
                    </a>
                  )}
                </div>
            </div>
            </AnimatedSection>
        </section>
      )}

      {/* 6. GALLERY (Collage Style) */}
      {(invitationData.galleryImages?.length || 0) > 0 && (
        <section className="py-2 px-2 bg-white">
          <AnimatedSection>
            <div className="grid grid-cols-2 gap-2 max-w-md mx-auto">
              {invitationData.galleryImages?.map((src: string, idx: number) => (
                <div key={idx} className="aspect-square relative">
                  <Image 
                    src={src} 
                    alt={`Gallery ${idx + 1}`} 
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </AnimatedSection>
        </section>
      )}

      {/* 7. ITINERARY (Vertical Timeline) */}
      {features.multiEventSchedule && (invitationData.itineraryItems?.length || 0) > 0 && (
        <section className="py-20 px-6 bg-[#fcfbf9]">
          <div className="max-w-md mx-auto">
            <AnimatedSection>
              <h2 className="font-serif italic text-4xl text-center mb-16" style={{ color: accentColor }}>
                Itinerario
              </h2>
            </AnimatedSection>

            <div className="relative border-l border-[#d4c5b0] ml-8 space-y-12 py-4">
              {invitationData.itineraryItems?.map((item: TimelineItem, index: number) => {
                const mapUrl = formatUrl(item.mapLink);
                return (
                <AnimatedSection key={index} delay={index * 0.1}>
                  <div className="relative pl-8 flex flex-col justify-center min-h-[40px] text-left">
                    {/* Timeline Node marker */}
                    <div 
                      className="absolute left-[-5px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: accentColor }}
                    />

                    <div className="flex justify-between items-start w-full">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium tracking-widest">{item.time}</span>
                        <span className="text-xs uppercase tracking-wider opacity-70 mt-1">
                          {item.title}
                        </span>
                        {item.location && (
                            <span className="text-xs opacity-60 mt-2 whitespace-pre-line">{item.location}</span>
                        )}
                      </div>
                    </div>
                    {mapUrl && (
                      <button
                      onClick={() => window.open(mapUrl, '_blank')}
                      className="inline-block mt-4 px-6 py-2 rounded-full text-xs uppercase tracking-widest text-white transition-opacity hover:opacity-90"
                      style={{ backgroundColor: accentColor }}
                    >
                      Ubicación
                    </button>
                    )}
                  </div>
                </AnimatedSection>
              )})
            }
            </div>
          </div>
        </section>
      )}

      {/* 8. RESERVED PLACES & RSVP */}
      <section className="py-10 px-6 bg-white text-center">
        <div className="max-w-md mx-auto space-y-12">
          <AnimatedSection>
            <p className="text-xs uppercase tracking-wider opacity-80 mt-8 max-w-[250px] mx-auto leading-relaxed">
              Es muy importante para nosotros contar con tu presencia.
            </p>
          </AnimatedSection>
          
          {onRsvpClick && (
            <AnimatedSection>
                <div className="mt-8">
                    <RsvpTrigger onClick={onRsvpClick} primaryColor={accentColor} textColor={primaryText} />
                </div>
            </AnimatedSection>
          )}

        </div>
      </section>

    </div>
  );
}
