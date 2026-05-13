"use client";

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { TemplateConfig, TimelineItem } from '@/lib/types';

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

// Props for the new, corrected TimelineTemplate
type TimelineTemplateProps = {
  template: TemplateConfig;
  data: any; // This would be the specific type for invitation data
};

export default function TimelineTemplate({ template, data }: TimelineTemplateProps) {
  const { features, defaultData } = template;
  // Combine default data with personalized data
  const invitationData = { ...defaultData, ...data };

  // Google Maps embed URL
  const mapSrc = invitationData.mainVenueAddress 
    ? `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(invitationData.mainVenueAddress)}`
    : "";

  return (
    <div className={`w-full bg-gray-50`} style={{ color: invitationData.textColor }}>
      {/* Hero Section */}
      <section 
        id="hero"
        className="h-screen w-full bg-cover bg-center flex flex-col justify-center items-center text-white relative"
        style={{ backgroundImage: `url(${invitationData.hero_image_url || 'https://picsum.photos/seed/wedding-hero/1200/800'})` }}
      >
        <div className="absolute inset-0 h-screen bg-black/50" />
        <motion.div 
          className="z-10 text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.0, delay: 0.5, ease: 'easeOut' }}
        >
          <p className="text-2xl mb-2">{invitationData.heroTitle}</p>
          <h1 className="text-6xl font-bold tracking-tight">{invitationData.heroNames}</h1>
          {invitationData.event_date && (
            <p className="text-2xl mt-4">
              {new Date(invitationData.event_date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          )}
        </motion.div>
      </section>

      {/* Timeline Section */}
      {features.multiEventSchedule && (
        <section id="timeline" className="py-20 px-4 max-w-4xl mx-auto">
          <AnimatedSection>
            <h2 className="text-4xl font-bold text-center mb-12" style={{ color: invitationData.primaryColor }}>{invitationData.timelineTitle}</h2>
          </AnimatedSection>
          <div className="relative">
            <div className="absolute left-1/2 w-0.5 h-full bg-gray-300 -translate-x-1/2"></div>
            {invitationData.timelineItems?.map((item: TimelineItem, index: number) => (
              <TimelineItemView 
                key={index}
                time={item.time} 
                title={item.title} 
                location={item.location} 
                alignment={index % 2 === 0 ? 'right' : 'left'}
                color={invitationData.primaryColor}
              />
            ))}
          </div>
        </section>
      )}

      {/* Location Map Section */}
      {mapSrc && (
        <section id="location" className="bg-gray-100 py-20 px-4">
          <AnimatedSection>
            <h2 className="text-4xl font-bold text-center mb-4" style={{ color: invitationData.primaryColor }}>How to Get There</h2>
            <p className="text-center text-gray-600 mb-8">{invitationData.mainVenueAddress}</p>
            <div className="max-w-5xl mx-auto h-96">
              <iframe
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                src={mapSrc}>
              </iframe>
            </div>
          </AnimatedSection>
        </section>
      )}

      {/* Lodging & Travel Section */}
      {features.lodgingAndTravel && invitationData.lodgingAndTravel?.length > 0 && (
        <section id="lodging" className="py-20 px-4">
          <AnimatedSection>
            <h2 className="text-4xl font-bold text-center mb-12" style={{ color: invitationData.primaryColor }}>Places to Stay</h2>
          </AnimatedSection>
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            {invitationData.lodgingAndTravel.map((place: any, index: number) => (
              <AnimatedSection key={index}>
                <div className="p-6 bg-white rounded-lg shadow-md">
                  <h3 className="text-2xl font-bold mb-2">{place.name}</h3>
                  <p className="text-gray-600 mb-4">{place.description}</p>
                  <a href={place.link} target="_blank" rel="noopener noreferrer" style={{ color: invitationData.primaryColor }}>
                    Book Now &rarr;
                  </a>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </section>
      )}
      
      {/* Gallery Section */}
      {invitationData.galleryImages?.length > 0 && (
        <section id="gallery" className="bg-gray-100 py-20 px-4">
          <AnimatedSection>
            <h2 className="text-4xl font-bold text-center mb-12" style={{ color: invitationData.primaryColor }}>{invitationData.galleryTitle || 'Our Story'}</h2>
          </AnimatedSection>
          <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {invitationData.galleryImages.map((src: string, index: number) => (
              <AnimatedSection key={index}>
                <div className="h-64 bg-gray-300 rounded-lg bg-cover bg-center" style={{backgroundImage: `url(${src})`}}></div>
              </AnimatedSection>
            ))}
          </div>
        </section>
      )}

      {/* Dress Code Section */}
      {invitationData.dressCode && (
        <section id="dress-code" className="py-20 px-4 max-w-4xl mx-auto text-center">
          <AnimatedSection>
            <h2 className="text-4xl font-bold mb-4" style={{ color: invitationData.primaryColor }}>{invitationData.dressCode.title || 'Dress Code'}</h2>
            <p className="text-lg">{invitationData.dressCode.description || 'Formal Attire.'}</p>
          </AnimatedSection>
        </section>
      )}
    </div>
  );
}

// Renamed to avoid conflict with the TimelineEditor component
function TimelineItemView({ time, title, location, alignment, color }: { time: string, title: string, location: string, alignment: 'left' | 'right', color: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px 0px" });
  const direction = alignment === 'left' ? -100 : 100;
  
  return (
    <div ref={ref} className="mb-8 flex justify-between items-center w-full">
      {alignment === 'left' && <div className="w-1/2"></div>}
      <motion.div 
        className="z-10 flex items-center shadow-xl w-12 h-12 rounded-full"
        style={{ backgroundColor: color }}
        initial={{ scale: 0 }}
        animate={isInView ? { scale: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h1 className="text-white text-lg font-bold mx-auto">{time.split(' ')[0]}</h1>
      </motion.div>
      <motion.div 
        className={`w-1/2 ${alignment === 'right' ? 'pl-8' : 'pr-8'}`}
        initial={{ opacity: 0, x: direction }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <div className={`p-4 bg-white rounded-lg shadow-md ${alignment === 'left' ? 'text-right' : ''}`}>
          <h3 className="text-xl font-bold mb-1">{title}</h3>
          <p className="text-gray-600">{location}</p>
        </div>
      </motion.div>
      {alignment === 'right' && <div className="w-1/2"></div>}
    </div>
  );
}
