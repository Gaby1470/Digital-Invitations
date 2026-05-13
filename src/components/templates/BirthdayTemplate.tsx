"use client";

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { TemplateConfig, TimelineItem } from '@/lib/types';

function AnimatedSection({ children }: { children: React.ReactNode }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px 0px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: 'easeOut' }}
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
  
  // A simple theme system - in a real app, this would be more robust
  const theme = invitationData.theme || 'default';
  const themeClasses = {
    superhero: {
      bg: 'bg-blue-500',
      text: 'text-yellow-300',
      accent: 'bg-red-600',
      font: 'font-mono'
    },
    boho: {
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      accent: 'bg-green-700',
      font: 'font-serif'
    },
    default: {
      bg: 'bg-gray-100',
      text: 'text-gray-800',
      accent: 'bg-indigo-500',
      font: 'font-sans'
    }
  };
  const currentTheme = themeClasses[theme as keyof typeof themeClasses] || themeClasses.default;

  return (
    <div className={`w-full ${currentTheme.bg} ${font} ${currentTheme.font}`}>
      {/* Hero Section */}
      <section 
        className={`h-screen w-full flex flex-col justify-center items-center ${currentTheme.text}`}
      >
        <motion.div 
          className="z-10 text-center p-8"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, ease: 'easeOut' }}
        >
          <h1 className="text-5xl md:text-8xl font-bold tracking-tighter">{invitationData.heroNames}</h1>
          <p className="text-2xl md:text-4xl mt-2">{invitationData.heroTitle}</p>
        </motion.div>
      </section>

      {/* Details Section */}
      <section className="py-20 px-4 max-w-4xl mx-auto text-center">
        <AnimatedSection>
          <h2 className="text-4xl font-bold mb-12">{invitationData.timelineTitle}</h2>
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16">
            {invitationData.timelineItems?.map((item: TimelineItem, index: number) => (
              <div key={index}>
                <p className="text-2xl font-bold">{item.time}</p>
                <h3 className="text-3xl font-semibold my-1">{item.title}</h3>
                <p className="text-xl text-gray-600">{item.location}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </section>

      {/* Parental Notes Section */}
      {features.parentalNotes && invitationData.parentalNotes && (
        <section className={`py-16 px-4 ${currentTheme.accent} text-white`}>
          <AnimatedSection>
            <div className="max-w-3xl mx-auto text-center">
              <h3 className="text-2xl font-bold mb-2">A Note for Parents</h3>
              <p className="text-lg">{invitationData.parentalNotes}</p>
            </div>
          </AnimatedSection>
        </section>
      )}

       {/* Allergy Tracker Info */}
      {features.allergyTracker && (
        <section className="py-20 px-4 max-w-4xl mx-auto text-center">
           <AnimatedSection>
            <h2 className="text-3xl font-bold mb-4">Food Allergies?</h2>
            <p className="text-lg text-gray-700">Please let us know about any food allergies when you RSVP so we can plan accordingly!</p>
          </AnimatedSection>
        </section>
      )}
    </div>
  );
}
