"use client";

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { TemplateConfig, TimelineItem } from '@/lib/types';

function AnimatedSection({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px 0px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.21, 0.45, 0.32, 0.9] }}
    >
      {children}
    </motion.div>
  );
}

type TimelineTemplateProps = {
  template: TemplateConfig;
  data: any;
};

export default function TimelineTemplate({ template, data }: TimelineTemplateProps) {
  const { features, defaultData } = template;
  const invitationData = { ...defaultData, ...data };

  const mapSrc = invitationData.mainVenueAddress 
    ? `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(invitationData.mainVenueAddress)}`
    : "";

  return (
    <div className="w-full bg-[#fdfdfc] text-neutral-900 selection:bg-stone-200">
      {/* Hero Section - Editorial Style */}
      <section 
        className="relative h-[90vh] w-full flex flex-col justify-center items-center overflow-hidden"
      >
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 z-0"
        >
          <img 
            src={invitationData.hero_image_url || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80'} 
            className="w-full h-full object-cover"
            alt="Wedding Hero"
          />
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />
        </motion.div>

        <div className="z-10 text-center text-white px-4">
          <motion.p 
            initial={{ opacity: 0, letterSpacing: "0.1em" }}
            animate={{ opacity: 1, letterSpacing: "0.3em" }}
            transition={{ duration: 1, delay: 0.5 }}
            className="uppercase text-sm mb-6 font-medium"
          >
            {invitationData.heroTitle || "Save the Date"}
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="text-6xl md:text-8xl font-serif italic"
          >
            {invitationData.heroNames}
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="mt-8 h-12 w-[1px] bg-white mx-auto"
          />
        </div>
      </section>

      {/* Modern Floating Timeline */}
      {features.multiEventSchedule && (
        <section className="py-32 px-6 bg-white">
          <div className="max-w-4xl mx-auto">
            <AnimatedSection>
              <h2 className="text-4xl md:text-5xl font-serif text-center mb-24 italic">
                {invitationData.timelineTitle}
              </h2>
            </AnimatedSection>
            
            <div className="relative space-y-24">
              {/* Central Line */}
              <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-neutral-200 -translate-x-1/2 hidden md:block" />
              
              {invitationData.timelineItems?.map((item: TimelineItem, index: number) => (
                <div key={index} className={`flex flex-col md:flex-row items-center gap-8 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                  <div className="flex-1 w-full text-center md:text-left">
                    <AnimatedSection delay={index * 0.1}>
                      <div className={`p-8 rounded-2xl border border-neutral-100 bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] transition-transform hover:scale-[1.02] duration-300 ${index % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}>
                        <span className="text-stone-400 font-mono text-sm tracking-widest uppercase mb-2 block">{item.time}</span>
                        <h3 className="text-2xl font-serif mb-2">{item.title}</h3>
                        <p className="text-neutral-500 font-light">{item.location}</p>
                      </div>
                    </AnimatedSection>
                  </div>
                  <div className="relative z-10 flex items-center justify-center w-4 h-4 rounded-full bg-stone-800 border-4 border-white shadow-sm hidden md:flex" />
                  <div className="flex-1 hidden md:block" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Gallery - Masonry Layout Vibe */}
      {invitationData.galleryImages?.length > 0 && (
        <section className="py-32 bg-[#f9f9f8]">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <h2 className="text-4xl font-serif text-center mb-20 italic">{invitationData.galleryTitle || 'Moments'}</h2>
            </AnimatedSection>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 max-w-6xl mx-auto">
              {invitationData.galleryImages.slice(0, 3).map((src: string, index: number) => (
                <motion.div 
                  key={index}
                  whileHover={{ scale: 0.98 }}
                  className={`relative overflow-hidden rounded-lg bg-stone-200 ${
                    index === 0 ? 'md:col-span-8 h-[500px]' : 'md:col-span-4 h-[500px]'
                  }`}
                >
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Travel & Lodging - Clean Cards */}
      {features.lodgingAndTravel && (
        <section className="py-32 px-6 max-w-6xl mx-auto">
          <AnimatedSection>
            <h2 className="text-4xl font-serif text-center mb-16 italic">Guest Information</h2>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {invitationData.lodgingAndTravel?.map((place: any, index: number) => (
              <AnimatedSection key={index} delay={index * 0.1}>
                <div className="group cursor-pointer">
                  <div className="overflow-hidden rounded-t-3xl aspect-video bg-stone-100 mb-6">
                    <img src={place.image || `https://picsum.photos/seed/${index}hotel/800/600`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" />
                  </div>
                  <h3 className="text-2xl font-serif mb-2">{place.name}</h3>
                  <p className="text-neutral-500 mb-4 font-light leading-relaxed">{place.description}</p>
                  <a href={place.link} className="inline-block text-xs uppercase tracking-[0.2em] font-bold border-b border-black pb-1 hover:text-stone-500 hover:border-stone-500 transition-colors">
                    View Details
                  </a>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </section>
      )}

      {/* Minimal Footer Map */}
      {mapSrc && (
        <section className="h-[60vh] relative grayscale hover:grayscale-0 transition-all duration-1000">
           <iframe
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              src={mapSrc}
            />
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-white px-8 py-4 shadow-xl rounded-full text-sm tracking-widest uppercase font-medium">
              {invitationData.mainVenueAddress}
            </div>
        </section>
      )}
    </div>
  );
}