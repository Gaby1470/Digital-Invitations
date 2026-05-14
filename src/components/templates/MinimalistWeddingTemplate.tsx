"use client";

import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { TemplateConfig, TimelineItem, DressCode, dressCodeDescriptions, RecommendationItem } from '@/lib/types';
import { DressCodePreview } from './shared/DressCodePreview';
import { RsvpSection } from './shared/RsvpSection';

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
  
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const grayscaleValue = useTransform(scrollYProgress, [0, 0.5], ["grayscale(100%)", "grayscale(0%)"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  const mapSrc = invitationData.mainVenueAddress 
    ? `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(invitationData.mainVenueAddress)}`
    : "";
  
  const dressCode: DressCode | undefined = invitationData.dressCode;

  return (
    <div 
      className="w-full"
      style={{
        backgroundColor: invitationData.backgroundColor || '#ffffff',
        color: invitationData.textColor || '#171717'
      }}
    >
      {/* Hero Section */}
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
        <section className="py-40 px-6 border-t border-neutral-100" style={{ backgroundColor: invitationData.backgroundColor || '#ffffff' }}>
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
                    <p 
                      className="text-4xl font-light mb-6 text-neutral-300 transition-colors duration-500"
                      style={{color: invitationData.primaryColor}}
                    >
                      {item.time}
                    </p>
                    <div className="h-px w-full bg-neutral-100 mb-6" />
                    <h3 className="text-xl font-bold mb-2 tracking-tight" style={{ color: invitationData.textColor }}>{item.title}</h3>
                    <p className="text-sm text-neutral-500 tracking-wide leading-relaxed">{item.location}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Gallery Section */}
      {invitationData.galleryImages?.length > 0 && (
        <section className="py-40 bg-neutral-50">
          <div className="max-w-[1400px] mx-auto px-6">
            <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
              {invitationData.galleryImages.map((src: string, index: number) => (
                <FadeIn key={index}>
                  <div className="relative group cursor-crosshair overflow-hidden rounded-sm">
                    <img src={src} alt="" className="w-full h-auto grayscale hover:grayscale-0 transition-all duration-1000 ease-in-out" />
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
                <h2 className="text-5xl md:text-7xl font-light tracking-tighter" style={{ color: invitationData.textColor }}>The Venue</h2>
              </FadeIn>
              <FadeIn delay={0.2}>
                <p className="text-sm tracking-widest uppercase font-bold text-neutral-400 text-right">{invitationData.mainVenueAddress}</p>
              </FadeIn>
            </div>
            <div className="w-full aspect-[21/9] bg-neutral-100 filter grayscale contrast-125 rounded-sm overflow-hidden">
              <iframe width="100%" height="100%" style={{ border: 0 }} loading="lazy" src={mapSrc} />
            </div>
          </div>
        </section>
      )}

      {/* Dress Code Section */}
      {dressCode && (
        <section className="py-32 px-6" style={{ backgroundColor: invitationData.backgroundColor || '#ffffff' }}>
          <div className="max-w-2xl mx-auto text-center">
            <FadeIn>
              <h2 className="text-4xl md:text-5xl font-light tracking-tighter text-center mb-16" style={{ color: invitationData.textColor }}>
                Attire
              </h2>
              <DressCodePreview 
                dressCode={dressCode} 
                primaryColor={invitationData.primaryColor}
                textColor={invitationData.textColor}
              />
            </FadeIn>
          </div>
        </section>
      )}

      {/* Recommendations Section */}
      {features.recommendations && invitationData.recommendations?.length > 0 && (
        <section className="py-32 px-6 bg-neutral-50">
          <div className="max-w-4xl mx-auto">
            <FadeIn>
              <h2 className="text-4xl md:text-5xl font-light tracking-tighter text-center mb-16" style={{ color: invitationData.textColor }}>
                Where to Stay & What to Do
              </h2>
            </FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {invitationData.recommendations.map((item: RecommendationItem, index: number) => (
                <FadeIn key={index} delay={index * 0.1}>
                  <div className="p-6 rounded-lg bg-white shadow-sm">
                    <h3 className="text-xl font-bold mb-2 tracking-tight" style={{ color: invitationData.primaryColor }}>{item.name}</h3>
                    <p className="text-sm text-neutral-600 mb-4">{item.description}</p>
                    <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-sm font-bold tracking-widest uppercase" style={{ color: invitationData.primaryColor }}>
                      View More
                    </a>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* RSVP Section */}
      <section className="py-32 px-6 bg-neutral-50">
        <div className="max-w-xl mx-auto">
          <FadeIn>
            <h2 className="text-4xl md:text-5xl font-light tracking-tighter text-center mb-12" style={{ color: invitationData.textColor }}>
              Will you be joining us?
            </h2>
            <RsvpSection 
              invitationId={invitationData.id} 
              primaryColor={invitationData.primaryColor}
              textColor={invitationData.textColor}
            />
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
