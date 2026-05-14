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
    <div 
      className="w-full"
      style={{
        backgroundColor: invitationData.backgroundColor || '#fdf2f8', // pink-50
        color: invitationData.textColor || '#4b5563' // gray-600
      }}
    >
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
          <h2 className="text-4xl font-bold text-center mb-12" style={{ color: invitationData.primaryColor }}>{invitationData.timelineTitle}</h2>
        </AnimatedSection>
        {invitationData.timelineItems?.map((item: TimelineItem, index: number) => (
          <AnimatedSection key={index}>
            <div className="text-center mb-8">
              <p className="text-2xl font-semibold" style={{ color: invitationData.primaryColor }}>{item.time}</p>
              <h3 className="text-3xl font-bold my-1" style={{ color: invitationData.textColor }}>{item.title}</h3>
              <p className="text-xl" style={{ color: invitationData.textColor }}>{item.location}</p>
            </div>
          </AnimatedSection>
        ))}
      </section>

      {/* Court of Honor Section */}
      {features.courtOfHonor && invitationData.courtOfHonor?.length > 0 && (
        <section id="court-of-honor" className="py-20 px-4" style={{ backgroundColor: invitationData.backgroundColor === '#fdf2f8' ? '#ffffff' : invitationData.backgroundColor }}>
          <AnimatedSection>
            <h2 className="text-4xl font-bold text-center mb-12" style={{ color: invitationData.primaryColor }}>Court of Honor</h2>
          </AnimatedSection>
          <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 text-center">
            {invitationData.courtOfHonor.map((member: CourtMember) => (
              <AnimatedSection key={member.name}>
                <img src={member.photoUrl} alt={member.name} className="w-32 h-32 rounded-full mx-auto shadow-lg border-4 border-white" />
                <h4 className="text-xl font-bold mt-4" style={{ color: invitationData.textColor }}>{member.name}</h4>
                <p className="text-md" style={{ color: invitationData.textColor }}>{member.role}</p>
              </AnimatedSection>
            ))}
          </div>
        </section>
      )}

      {/* Social Media Wall Section */}
      {features.socialMediaWall && (
        <section id="social-media" className="py-20 px-4 text-center">
           <AnimatedSection>
            <h2 className="text-4xl font-bold mb-4" style={{ color: invitationData.primaryColor }}>Share Your Photos!</h2>
            <p className="text-2xl" style={{ color: invitationData.textColor }}>
              Use the hashtag <span className="font-bold" style={{ color: invitationData.primaryColor }}>#ValentinaXV</span>
            </p>
          </AnimatedSection>
        </section>
      )}
    </div>
  );
}
