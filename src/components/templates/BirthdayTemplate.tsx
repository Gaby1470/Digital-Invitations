"use client";

import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef } from 'react';
import { TemplateConfig, TimelineItem } from '@/lib/types';

/**
 * Playful "Pop" animation for sections
 */
function PopIn({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8, rotate: -2 }}
      animate={isInView ? { opacity: 1, scale: 1, rotate: 0 } : {}}
      transition={{ 
        type: "spring", 
        stiffness: 260, 
        damping: 20, 
        delay 
      }}
    >
      {children}
    </motion.div>
  );
}

type BirthdayTemplateProps = {
  template: TemplateConfig;
  data: any;
};

export default function BirthdayTemplate({ template, data }: BirthdayTemplateProps) {
  const { defaultData, features, font } = template;
  const invitationData = { ...defaultData, ...data };
  
  const theme = invitationData.theme || 'default';
  
  // Enhanced theme system with playful UI properties
  const themeClasses = {
    superhero: {
      bg: 'bg-[#FF0000]', // Action Red
      card: 'bg-[#0051FF]', // Hero Blue
      text: 'text-[#FFDE00]', // Comic Yellow
      accent: 'text-white',
      pattern: 'opacity-20 bg-[url("https://www.transparenttextures.com/patterns/pow-star.png")]'
    },
    boho: {
      bg: 'bg-[#FDF5E6]', 
      card: 'bg-[#E9DCC9]',
      text: 'text-[#8B4513]',
      accent: 'text-[#556B2F]',
      pattern: 'opacity-10 bg-[url("https://www.transparenttextures.com/patterns/leaves.png")]'
    },
    default: {
      bg: 'bg-[#6366F1]', // Indigo
      card: 'bg-white',
      text: 'text-neutral-900',
      accent: 'text-indigo-600',
      pattern: 'opacity-10 bg-[url("https://www.transparenttextures.com/patterns/confetti.png")]'
    }
  };
  
  const currentTheme = themeClasses[theme as keyof typeof themeClasses] || themeClasses.default;

  return (
    <div className={`w-full min-h-screen overflow-hidden ${currentTheme.bg} ${font} relative`}>
      {/* Dynamic Background Pattern */}
      <div className={`absolute inset-0 pointer-events-none ${currentTheme.pattern}`} />

      {/* Hero Section: The Big Announcement */}
      <section className="relative h-screen w-full flex flex-col justify-center items-center px-4">
        {/* Floating Background Circles for depth */}
        <motion.div 
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10 w-32 h-32 rounded-full bg-white/10 blur-xl"
        />
        
        <motion.div 
          className="z-10 text-center"
          initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ type: "spring", bounce: 0.5, duration: 1 }}
        >
          <div className="inline-block px-6 py-2 rounded-full bg-white/20 backdrop-blur-md mb-6 border border-white/30">
            <p className="text-white font-bold tracking-widest uppercase text-sm">
              {invitationData.heroTitle || "You're Invited!"}
            </p>
          </div>
          <h1 className={`text-6xl md:text-9xl font-black tracking-tighter drop-shadow-2xl ${theme === 'superhero' ? currentTheme.text : 'text-white'}`}>
            {invitationData.heroNames}
          </h1>
          <motion.div 
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mt-4 text-2xl md:text-4xl font-bold text-white/90 italic"
          >
            is turning {invitationData.age || '!!'}!
          </motion.div>
        </motion.div>
      </section>

      {/* Details Section: "The Party Plan" */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <PopIn>
            <h2 className={`text-4xl md:text-5xl font-black text-center mb-16 uppercase italic ${theme === 'superhero' ? currentTheme.text : 'text-white'}`}>
              {invitationData.timelineTitle}
            </h2>
          </PopIn>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {invitationData.timelineItems?.map((item: TimelineItem, index: number) => (
              <PopIn key={index} delay={index * 0.1}>
                <div className={`${currentTheme.card} p-8 rounded-[2rem] shadow-2xl transform rotate-${index % 2 === 0 ? '1' : '-1'} hover:rotate-0 transition-transform duration-300 border-b-8 border-black/10`}>
                  <p className={`text-3xl font-black mb-2 ${currentTheme.accent}`}>{item.time}</p>
                  <h3 className={`text-2xl font-bold mb-2 ${currentTheme.text}`}>{item.title}</h3>
                  <p className="text-neutral-500 font-medium">{item.location}</p>
                </div>
              </PopIn>
            ))}
          </div>
        </div>
      </section>

      {/* Parental Notes: Post-it Note Style */}
      {features.parentalNotes && invitationData.parentalNotes && (
        <section className="py-16 px-6">
          <PopIn>
            <div className="max-w-2xl mx-auto bg-yellow-200 p-10 rounded-lg shadow-xl transform -rotate-2 relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-8 bg-white/40 backdrop-blur-sm rounded-sm" />
              <h3 className="text-2xl font-black text-yellow-900 mb-4 uppercase tracking-tight">Note for Parents!</h3>
              <p className="text-xl text-yellow-800 font-medium leading-relaxed">
                {invitationData.parentalNotes}
              </p>
            </div>
          </PopIn>
        </section>
      )}

      {/* Allergy Tracker: Alert Bubble */}
      {features.allergyTracker && (
        <section className="py-24 px-6 text-center">
           <PopIn>
            <div className="inline-block bg-white/10 backdrop-blur-md p-10 rounded-[3rem] border-2 border-dashed border-white/30">
              <h2 className="text-3xl font-black text-white mb-4">Hungry? 🍕</h2>
              <p className="text-xl text-white/80 max-w-md mx-auto">
                Please let us know about any food allergies when you RSVP so we can keep the snacks safe for everyone!
              </p>
            </div>
          </PopIn>
        </section>
      )}

      {/* Decorative Confetti Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-4 h-4 rounded-sm bg-white/20"
            style={{ 
              top: `${Math.random() * 100}%`, 
              left: `${Math.random() * 100}%` 
            }}
            animate={{ 
              y: [0, 100, 0], 
              rotate: [0, 180, 360],
              opacity: [0.1, 0.4, 0.1]
            }}
            transition={{ 
              duration: 10 + Math.random() * 10, 
              repeat: Infinity, 
              ease: "linear" 
            }}
          />
        ))}
      </div>
    </div>
  );
}