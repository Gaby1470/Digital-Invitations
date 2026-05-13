"use client";

import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { TemplateConfig, TimelineItem } from '@/lib/types';

/**
 * Custom animation component to handle soft fade-in transitions.
 */
function FadeIn({ children, delay = 0, direction = "up" }: { 
  children: React.ReactNode, 
  delay?: number, 
  direction?: "up" | "down" | "none" 
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: direction === "none" ? 0 : direction === "up" ? 30 : -30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

type MinimalistWeddingTemplateProps = {
  template: TemplateConfig;
  data: any;
};

export default function MinimalistWeddingTemplate({ template, data }: MinimalistWeddingTemplateProps) {
  const { defaultData, features } = template;
  const invitationData = { ...defaultData, ...data };
  
  // Ref for the hero section to track scroll progress
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  // Transform scroll progress (0 to 1) into grayscale (100% to 0%)
  const grayscaleValue = useTransform(scrollYProgress, [0, 0.5], ["grayscale(100%)", "grayscale(0%)"]);
  // Optional: Add a slight zoom out as they scroll
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  const mapSrc = invitationData.mainVenueAddress 
    ? `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(invitationData.mainVenueAddress)}`
    : "";

  return (
    <div className="w-full bg-white text-neutral-900 selection:bg-neutral-900 selection:text-white">
      {/* Hero Section with Interactive Color Filter */}
      <section ref={heroRef} className="relative h-screen w-full flex flex-col justify-center items-center overflow-hidden">
        <motion.div 
          className="absolute inset-0 z-0"
          style={{ 
            filter: grayscaleValue,
            scale: imageScale 
          }}
        >
          <img 
            src={invitationData.hero_image_url || 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=2070&auto=format&fit=crop'} 
            className="w-full h-full object-cover"
            alt="Wedding Background"
          />
          <div className="absolute inset-0 bg-black/30" />
        </motion.div>

        {/* Foreground Content */}
        <div className="z-10 text-center text-white px-6">
          <FadeIn delay={0.5}>
            <p className="text-[10px] tracking-[0.6em] uppercase font-bold text-white/70 mb-8">
              {invitationData.heroTitle || "The Wedding of"}
            </p>
          </FadeIn>

          <FadeIn delay={0.8} direction="none">
            <h1 className="text-6xl md:text-9xl font-light tracking-tighter leading-none">
              {invitationData.heroNames?.split(' & ').map((name: string, i: number) => (
                <span key={i} className="block">{name}</span>
              ))}
            </h1>
          </FadeIn>
          
          <FadeIn delay={1.1}>
            <div className="flex items-center justify-center gap-6 mt-12">
              <div className="h-px w-12 bg-white/50" />
              <p className="text-lg md:text-xl font-medium tracking-tight">
                {invitationData.event_date && new Date(invitationData.event_date).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'long', day: 'numeric',
                })}
              </p>
              <div className="h-px w-12 bg-white/50" />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Timeline Section */}
      {features.multiEventSchedule && (
        <section className="py-40 px-6 border-t border-neutral-100 bg-white">
          <div className="max-w-6xl mx-auto">
            <FadeIn>
              <h2 className="text-xs tracking-[0.5em] uppercase font-bold text-neutral-400 mb-20 text-center">
                Schedule of Events
              </h2>
            </FadeIn>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-20 gap-x-12">
              {invitationData.timelineItems?.map((item: TimelineItem, index: number) => (
                <FadeIn key={index} delay={index * 0.1}>
                  <div className="group">
                    <p className="text-4xl font-light mb-6 text-neutral-300 group-hover:text-neutral-900 transition-colors duration-500">
                      {item.time}
                    </p>
                    <div className="h-px w-full bg-neutral-100 mb-6" />
                    <h3 className="text-xl font-bold mb-2 tracking-tight">{item.title}</h3>
                    <p className="text-sm text-neutral-500 tracking-wide leading-relaxed">{item.location}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Gallery Section with Individual Filters */}
      {invitationData.galleryImages?.length > 0 && (
        <section className="py-40 bg-neutral-50">
          <div className="max-w-[1400px] mx-auto px-6">
            <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
              {invitationData.galleryImages.map((src: string, index: number) => (
                <FadeIn key={index}>
                  <div className="relative group cursor-crosshair overflow-hidden rounded-sm">
                    <img 
                      src={src} 
                      alt="" 
                      className="w-full h-auto grayscale hover:grayscale-0 transition-all duration-1000 ease-in-out" 
                    />
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Map Section */}
      {mapSrc && (
        <section className="bg-white py-40 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
              <FadeIn direction="none">
                <h2 className="text-5xl md:text-7xl font-light tracking-tighter">The Venue</h2>
              </FadeIn>
              <FadeIn delay={0.2}>
                <p className="text-sm tracking-widest uppercase font-bold text-neutral-400 text-right">
                  {invitationData.mainVenueAddress}
                </p>
              </FadeIn>
            </div>
            
            <div className="w-full aspect-[21/9] bg-neutral-100 filter grayscale contrast-125 rounded-sm overflow-hidden">
              <iframe
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                src={mapSrc}
              />
            </div>
          </div>
        </section>
      )}
    </div>
  );
}