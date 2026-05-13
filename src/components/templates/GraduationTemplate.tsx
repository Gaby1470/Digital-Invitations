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

type GraduationTemplateProps = {
  template: TemplateConfig;
  data: any;
};

export default function GraduationTemplate({ template, data }: GraduationTemplateProps) {
  const { defaultData, features } = template;
  const invitationData = { ...defaultData, ...data };

  return (
    <div className={`w-full bg-gray-800 text-white`}>
      {/* Hero Section */}
      <section 
        id="hero"
        className="h-screen w-full flex flex-col justify-center items-center text-center relative"
        style={{ backgroundImage: `url(${invitationData.hero_image_url || 'https://picsum.photos/seed/grad-hero/1200/800'})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 h-screen bg-black/60" />
        <motion.div 
          className="z-10"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, ease: 'easeOut' }}
        >
          <p className="text-2xl uppercase tracking-widest">{invitationData.heroTitle}</p>
          <h1 className="text-7xl font-bold my-2">{invitationData.heroNames}</h1>
          {invitationData.event_date && (
            <p className="text-xl">
              {new Date(invitationData.event_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          )}
        </motion.div>
      </section>

      {/* Future Plans Section */}
      {features.futurePlans && invitationData.futurePlans && (
        <section id="future-plans" className="py-20 px-4 max-w-4xl mx-auto text-center">
          <AnimatedSection>
            <h2 className="text-4xl font-bold mb-4">What's Next?</h2>
            <p className="text-2xl text-gray-300">{invitationData.futurePlans}</p>
          </AnimatedSection>
        </section>
      )}
      
      {/* Event Details Section */}
      <section id="timeline" className="bg-gray-900 py-20 px-4 text-center">
        <AnimatedSection>
          <h2 className="text-4xl font-bold mb-12">{invitationData.timelineTitle}</h2>
          {invitationData.timelineItems?.map((item: TimelineItem, index: number) => (
            <div key={index} className="mb-8">
              <p className="text-xl font-bold text-gray-400">{item.time}</p>
              <h3 className="text-3xl font-semibold my-1">{item.title}</h3>
              <p className="text-xl text-gray-300">{item.location}</p>
            </div>
          ))}
        </AnimatedSection>
      </section>

      {/* Tribute Section */}
      {features.tributeSection && invitationData.tribute && (
        <section id="tribute" className="py-20 px-4 max-w-4xl mx-auto text-center">
           <AnimatedSection>
            <h2 className="text-4xl font-bold mb-4">A Note of Thanks</h2>
            <p className="text-lg text-gray-300 leading-relaxed">{invitationData.tribute}</p>
          </AnimatedSection>
        </section>
      )}
    </div>
  );
}
