"use client";

import { motion, useInView } from 'framer-motion';
import { useRef, useEffect } from 'react';
import { TemplateConfig, TimelineItem } from '@/lib/types';
import confetti from 'canvas-confetti';

function PopIn({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-30px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.92, y: 15 }}
      animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
      transition={{ type: "spring", stiffness: 200, damping: 18, delay }}
    >
      {children}
    </motion.div>
  );
}

type BirthdayTemplateProps = {
  template: TemplateConfig;
  data: any;
};

function formatTimelineTime(rawTime?: string) {
  if (!rawTime) return "";
  const value = rawTime.trim();

  const amPmMatch = value.match(/^(\d{1,2})(?::(\d{2}))?\s*([AaPp][Mm])$/);
  if (amPmMatch) {
    const hour = parseInt(amPmMatch[1], 10);
    const minutes = amPmMatch[2] ?? "00";
    const suffix = amPmMatch[3].toUpperCase();
    if (hour >= 1 && hour <= 12) {
      return `${hour}:${minutes} ${suffix}`;
    }
  }

  const twentyFourHourMatch = value.match(/^(\d{1,2}):(\d{2})$/);
  if (twentyFourHourMatch) {
    const hour24 = parseInt(twentyFourHourMatch[1], 10);
    const minutes = twentyFourHourMatch[2];
    if (hour24 >= 0 && hour24 <= 23) {
      const suffix = hour24 >= 12 ? "PM" : "AM";
      const hour12 = hour24 % 12 || 12;
      return `${hour12}:${minutes} ${suffix}`;
    }
  }
  return value;
}

export default function BirthdayTemplate({ template, data }: BirthdayTemplateProps) {
  const { defaultData, features, font } = template;
  const invitationData = { ...defaultData, ...data };
  const theme = invitationData.theme || 'default';

  useEffect(() => {
    // Left burst closer to top corner
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 60,
      origin: { x: -0.05, y: 0.1 }
    });
    // Right burst closer to top corner
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 60,
      origin: { x: 1.05, y: 0.1 }
    });
  }, []);
  
  const themeClasses = {
    superhero: {
      bg: '#E11D48', // deep vibrant red
      card: '#1E40AF', // royal superhero blue
      text: '#FDE047', // bright comic yellow
      accent: '#FFFFFF',
      pattern: 'opacity-15 bg-[url("https://www.transparenttextures.com/patterns/pow-star.png")]'
    },
    boho: {
      bg: '#F5EBE6', 
      card: '#E4D4C8',
      text: '#6B4423',
      accent: '#4A5D4E',
      pattern: 'opacity-10 bg-[url("https://www.transparenttextures.com/patterns/leaves.png")]'
    },
    default: {
      bg: invitationData.backgroundColor || '#4F46E5',
      card: '#FFFFFF',
      text: invitationData.textColor || '#1F2937',
      accent: invitationData.primaryColor || '#4F46E5',
      pattern: 'opacity-10 bg-[url("https://www.transparenttextures.com/patterns/confetti.png")]'
    }
  };
  
  const currentTheme = themeClasses[theme as keyof typeof themeClasses] || themeClasses.default;
  const gallery = invitationData.galleryImages || [];

  return (
    <div className={`w-full min-h-screen overflow-x-hidden ${font} relative pb-16`} style={{ backgroundColor: currentTheme.bg }}>
      <div className={`absolute inset-0 pointer-events-none ${currentTheme.pattern}`} />

      {/* Hero Section: Stabilized mobile height */}
      <section className="relative h-[65vh] min-h-[440px] w-full flex flex-col justify-center items-center px-6 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 120, delay: 0.15 }}
          className="w-full max-w-sm"
        >
          <div className="inline-block px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md mb-5 border border-white/20 shadow-sm">
            <p className="text-white font-bold tracking-[0.15em] uppercase text-xs">
              {invitationData.heroTitle || "You're Invited!"}
            </p>
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight drop-shadow-md break-words uppercase leading-none" style={{ color: theme === 'superhero' ? currentTheme.text : 'white' }}>
            {invitationData.heroNames}
          </h1>
          
          <motion.div 
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="mt-4 text-lg sm:text-2xl font-bold text-white/95 italic tracking-wide"
          >
            Ven a divertirte conmigo!!!
          </motion.div>
        </motion.div>
      </section>

      {/* Birthday Kid Photo Gallery: Structured Swipe Tray */}
      {gallery.length > 0 && (
        <section className="py-4 px-4 relative z-10 max-w-md mx-auto -mt-8">
          <PopIn>
            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-6 px-4">
              {gallery.map((src: string, index: number) => (
                <motion.div
                  key={index}
                  className="flex-none w-[65vw] max-w-[210px] snap-center bg-white p-2.5 pb-6 rounded-2xl shadow-lg border border-neutral-200/40"
                  style={{ rotate: index % 2 === 0 ? '-1.5deg' : '1.5deg' }}
                  whileTap={{ rotate: 0, scale: 0.98 }}
                >
                  <div className="aspect-square w-full overflow-hidden rounded-xl bg-neutral-50">
                    <img 
                      src={src} 
                      alt={`Birthday portrait memory ${index + 1}`} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="mt-3 text-center font-mono text-[9px] text-neutral-400 uppercase tracking-widest font-bold">
                    🎉 Recuerdos {index + 1}
                  </div>
                </motion.div>
              ))}
            </div>
          </PopIn>
        </section>
      )}

      {/* Date Block: Modular Visual Calendar Card */}
      {invitationData.event_date && (
        <section className="py-6 px-6 relative z-10 max-w-sm mx-auto">
          <PopIn>
            <div className="w-full bg-white/10 backdrop-blur-md p-6 rounded-[2rem] border border-white/20 shadow-md text-center">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4 text-white/70">
                ¿Cuándo y Dónde?
              </p>
              
              {/* Split layout block for date display */}
              <div className="flex items-center justify-center gap-4 text-white mb-4">
                <div className="text-right flex-1">
                  <p className="text-xs uppercase font-bold opacity-75">
                    {new Date(invitationData.event_date).toLocaleDateString('en-US', { weekday: 'short' })}
                  </p>
                  <p className="text-sm font-medium opacity-90">
                    {new Date(invitationData.event_date).toLocaleDateString('en-US', { month: 'short' })}
                  </p>
                </div>
                <div className="h-10 w-[1px] bg-white/30" />
                <div className="text-4xl font-black tracking-tighter">
                  {new Date(invitationData.event_date).toLocaleDateString('en-US', { day: '2-digit' })}
                </div>
                <div className="h-10 w-[1px] bg-white/30" />
                <div className="text-left flex-1">
                  <p className="text-xs uppercase font-bold opacity-75">Year</p>
                  <p className="text-sm font-medium opacity-90">
                    {new Date(invitationData.event_date).toLocaleDateString('en-US', { year: 'numeric' })}
                  </p>
                </div>
              </div>

              <div className="h-[1px] w-12 bg-white/20 mx-auto my-3" />
              
              <p className="text-base font-bold tracking-tight text-white px-2">
                {invitationData.location || 'TBA'}
              </p>
              
              {invitationData.dateSubtitle && (
                <p className="mt-2 text-xs font-medium italic text-white/80">
                  {invitationData.dateSubtitle}
                </p>
              )}
            </div>
          </PopIn>
        </section>
      )}

      {/* Details Section: Adaptive 1-Column Stack */}
      <section className="py-8 px-6 relative z-10 max-w-sm mx-auto">
        <PopIn>
          <h2 className="text-2xl font-black text-center mb-8 uppercase tracking-wide italic" style={{ color: theme === 'superhero' ? currentTheme.text : 'white' }}>
            {invitationData.timelineTitle || "Party Schedule"}
          </h2>
        </PopIn>
        
        <div className="space-y-4">
          {invitationData.timelineItems?.map((item: TimelineItem, index: number) => (
            <PopIn key={index} delay={index * 0.05}>
              <div className="w-full p-5 flex flex-col justify-center items-center text-center rounded-2xl shadow-md border-b-4 border-black/10 transition-transform" 
                   style={{ backgroundColor: currentTheme.card }}>
                <p className="text-2xl font-black mb-0.5" style={{ color: currentTheme.accent }}>
                  {formatTimelineTime(item.time)}
                </p>
                <h3 className="text-base font-bold" style={{ color: currentTheme.text }}>{item.title}</h3>
                <p className="text-[11px] text-neutral-400 font-bold uppercase tracking-wider mt-0.5">{item.location}</p>
              </div>
            </PopIn>
          ))}
        </div>
      </section>

      {/* Parental Notes */}
      {features.parentalNotes && invitationData.parentalNotes && (
        <section className="pb-8 px-6 max-w-sm mx-auto">
          <PopIn>
            <div className="bg-amber-100 p-5 rounded-2xl shadow-sm border-b-4 border-black/5">
              <h3 className="text-[9px] font-black text-amber-800/60 mb-1 uppercase tracking-wider">Note for Parents</h3>
              <p className="text-sm text-amber-900 font-bold leading-relaxed">
                {invitationData.parentalNotes}
              </p>
            </div>
          </PopIn>
        </section>
      )}

      {/* Allergy Tracker */}
      {features.allergyTracker && (
        <section className="pb-4 px-6 text-center max-w-sm mx-auto">
           <PopIn>
            <div className="w-full bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-sm">
              <h2 className="text-lg font-black text-white mb-1">¿Hambriento? 🍕</h2>
              <p className="text-xs text-white/80 max-w-[240px] mx-auto font-medium">
                ¡Háznos saber sobre cualquier alergia cuando confirmes tu asistencia!
              </p>
            </div>
          </PopIn>
        </section>
      )}
    </div>
  );
}