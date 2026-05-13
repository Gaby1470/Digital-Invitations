"use client";

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { TemplateConfig, TimelineItem, CourtMember } from '@/lib/types';

// Reusable animation component
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

type QuinceaneraTemplateProps = {
  template: TemplateConfig;
  data: any; // Replace with a more specific type later
};

export default function QuinceaneraTemplate({ template, data }: QuinceaneraTemplateProps) {
  const { defaultData, features } = template;
  const invitationData = { ...defaultData, ...data };

  return (
    <div className={`w-full bg-pink-50`}>
      {/* Hero Section */}
      <section 
        id="hero"
        className="h-screen w-full bg-cover bg-center flex flex-col justify-center items-center text-white relative"
        style={{ backgroundImage: `url(${invitationData.hero_image_url || 'https://picsum.photos/seed/quince-hero/1200/800'})` }}
      >
        <div className="absolute inset-0 h-screen bg-black/50" />
        <motion.div 
          className="z-10 text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.0, delay: 0.5, ease: 'easeOut' }}
        >
          <p className="text-3xl mb-2">{invitationData.heroTitle}</p>
          <h1 className={`text-7xl font-bold tracking-tight`}>{invitationData.heroNames}</h1>
          {invitationData.event_date && (
            <p className="text-2xl mt-4">
              {new Date(invitationData.event_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          )}
        </motion.div>
      </section>

      {/* Timeline Section */}
      <section id="timeline" className="py-20 px-4 max-w-4xl mx-auto">
        <AnimatedSection>
          <h2 className="text-4xl font-bold text-center text-pink-800 mb-12">{invitationData.timelineTitle}</h2>
        </AnimatedSection>
        {invitationData.timelineItems?.map((item: TimelineItem, index: number) => (
          <AnimatedSection key={index}>
            <div className="text-center mb-8">
              <p className="text-2xl text-pink-700 font-semibold">{item.time}</p>
              <h3 className="text-3xl font-bold my-1">{item.title}</h3>
              <p className="text-xl text-gray-600">{item.location}</p>
            </div>
          </AnimatedSection>
        ))}
      </section>

      {/* Court of Honor Section */}
      {features.courtOfHonor && invitationData.courtOfHonor?.length > 0 && (
        <section id="court-of-honor" className="bg-white py-20 px-4">
          <AnimatedSection>
            <h2 className="text-4xl font-bold text-center text-pink-800 mb-12">Court of Honor</h2>
          </AnimatedSection>
          <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 text-center">
            {invitationData.courtOfHonor.map((member: CourtMember) => (
              <AnimatedSection key={member.name}>
                <img src={member.photoUrl} alt={member.name} className="w-32 h-32 rounded-full mx-auto shadow-lg border-4 border-white" />
                <h4 className="text-xl font-bold mt-4">{member.name}</h4>
                <p className="text-md text-gray-500">{member.role}</p>
              </AnimatedSection>
            ))}
          </div>
        </section>
      )}

      {/* Social Media Wall Section */}
      {features.socialMediaWall && (
        <section id="social-media" className="py-20 px-4 text-center">
           <AnimatedSection>
            <h2 className="text-4xl font-bold text-pink-800 mb-4">Share Your Photos!</h2>
            <p className="text-2xl text-gray-600">Use the hashtag <span className="font-bold text-pink-600">#ValentinaXV</span></p>
          </AnimatedSection>
        </section>
      )}
    </div>
  );
}
