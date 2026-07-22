"use client";

import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { EditorData, TemplateConfig, TimelineItem } from '@/lib/types';
import { Feather } from 'lucide-react';
import Image from 'next/image';
import { RsvpTrigger } from "./shared/RsvpTrigger";

// Smooth, organic fade-in utility
function GentleFade({ children, delay = 0, yOffset = 20 }: { children: React.ReactNode, delay?: number, yOffset?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: yOffset }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

type GraduationTemplateProps = {
  template: TemplateConfig;
  data: EditorData;
  invitationId?: string;
  onRsvpClick?: () => void;
};

export default function GraduationTemplate({ template, data, invitationId, onRsvpClick }: GraduationTemplateProps) {
  const { defaultData, features } = template;
  const invitationData = { ...defaultData, ...data };


  const eventDate = invitationData.event_date ? new Date(invitationData.event_date).toLocaleDateString('es-ES', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  }) : '';

  const colorPalette = {
    '--background': invitationData.backgroundColor || '#F9F8F6',
    '--text': invitationData.textColor || '#4A4B4D',
    '--primary': invitationData.primaryColor || '#8B8682',
    '--border': invitationData.borderColor || '#D4CEC4',
    '--selection': invitationData.selectionColor || '#E5E0D8',
    '--hero-subtitle': '#6B6B6B',
    '--hero-title': '#3A3B3C',
    '--placeholder': '#A39B8E',
  };

  return (
    <div 
      className="w-full font-serif text-[var(--text)] selection:bg-[var(--selection)]"
      style={{
        ...colorPalette,
        backgroundColor: 'var(--background)',
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.04'/%3E%3C/svg%3E")`
      }}
    >
      {/* Hero Section - Poetic & Minimal */}
      <section className="min-h-[90vh] w-full flex flex-col justify-center items-center text-center relative px-6 py-20">
        <div className="z-10 max-w-3xl flex flex-col items-center">
          
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8 opacity-80"
          >
            <Image 
              src="https://ykgyfxtzjedgastsuuaj.supabase.co/storage/v1/object/public/invitation-images/public/Graduation/graduation-cap.png" 
              alt="Graduation Cap" 
              width={150} 
              height={150} 
            />
          </motion.div>

          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1.5 }}
            className="text-sm md:text-base tracking-[0.25em] uppercase text-[var(--hero-subtitle)] mb-8 font-serif"
          >
            {invitationData.heroTitle || "Celebrando la Graduación de"}
          </motion.span>
          
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-6xl md:text-8xl lg:text-9xl tracking-normal mb-8 leading-tight text-[var(--hero-title)]"
            style={{ fontFamily: "'Great Vibes', 'Alex Brush', cursive" }} 
          >
            {invitationData.heroNames}
          </motion.h1>

          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1.5 }}
            className="text-sm md:text-base tracking-[0.2em] uppercase text-[var(--hero-subtitle)] font-serif"
          >
            {invitationData.degreeType || "Clase de 2026"}
          </motion.h2>
          
          <motion.div 
            initial={{ height: 0 }}
            animate={{ height: '50px' }}
            transition={{ delay: 1, duration: 1 }}
            className="w-[1px] bg-[var(--border)] mt-10"
          />
        </div>
      </section>

      {/* Timeline Section - Mobile Optimized */}
      <section className="py-24 px-6 md:px-12 relative">
        <div className="max-w-3xl mx-auto">
          <GentleFade>
            <h2 className="text-3xl md:text-4xl font-light text-center mb-20 tracking-wide">
              Horario de la Ceremonia
            </h2>
          </GentleFade>
          
          <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 md:before:mx-auto before:-translate-x-px md:before:translate-x-0 before:h-full before:w-[1px] before:bg-gradient-to-b before:from-transparent before:via-[var(--border)] before:to-transparent">
            {invitationData.timelineItems?.map((item: TimelineItem, index: number) => (
              <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-[var(--selection)] bg-[var(--background)] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                  <div className="w-2 h-2 bg-[var(--primary)] rounded-full" />
                </div>

                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-4 rounded-xl transition-all">
                  <GentleFade delay={index * 0.1}>
                    <div className="flex flex-col md:group-odd:text-right">
                      <span className="font-sans text-xl font-medium tracking-[0.15em] text-[var(--primary)] uppercase mb-2">
                        {item.time}
                      </span>
                      <h3 className="text-2xl font-normal text-[var(--text)] mb-1">{item.title}</h3>
                      <p className="text-base font-sans">{item.location}</p>
                    </div>
                  </GentleFade>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Photo Gallery - Horizontal Scroll for Mobile */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <GentleFade>
            <h2 className="text-3xl md:text-4xl font-light text-center mb-4 tracking-wide">Captured Moments</h2>
             <p className="text-center text-lg text-[var(--primary)] mb-12">{eventDate}</p>
          </GentleFade>
          <div className="flex overflow-x-auto snap-x snap-mandatory md:grid md:grid-cols-4 gap-6 pb-8 md:pb-0 hide-scrollbar">
            {invitationData.galleryImages?.slice(0, 4).map((image: string, index: number) => (
              <div key={index} className="min-w-[80vw] md:min-w-0 snap-center shrink-0">
                <GentleFade delay={index * 0.15}>
                  <div className="aspect-[4/5] relative rounded-lg overflow-hidden bg-[var(--selection)] shadow-sm">
                    <Image src={image} alt={`Gallery image ${index + 1}`} layout="fill" objectFit="cover" className="hover:scale-105 transition-transform duration-700 ease-out" />
                  </div>
                </GentleFade>
              </div>
            ))}
          </div>
        </div>
      </section>


      
      {/* Future Plans Section - Grounded Footer */}
      {features.futurePlans && invitationData.futurePlans && (
        <section className="border-t border-[var(--border)]">
          <div className="max-w-3xl mx-auto px-6 py-24 text-center">
            <GentleFade>
              <h2 className="text-xs uppercase tracking-[0.25em] text-[var(--primary)] mb-6 font-sans">Planes Futuros</h2>
              <p className="text-xl md:text-2xl font-light leading-relaxed italic text-[var(--text)] opacity-90">
                &quot;{invitationData.futurePlans}&quot;
              </p>
            </GentleFade>
          </div>
        </section>
      )}

      {onRsvpClick && (
        <section className="py-20 px-6 text-center">
          <RsvpTrigger onClick={onRsvpClick} primaryColor={colorPalette['--primary']} />
        </section>
      )}
    </div>
  );
}

