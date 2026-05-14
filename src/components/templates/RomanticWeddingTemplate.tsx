"use client";

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { TemplateConfig, TimelineItem, DressCode, dressCodeDescriptions, RecommendationItem } from '@/lib/types';
import { DressCodePreview } from './shared/DressCodePreview';
import { RsvpSection } from './shared/RsvpSection';

function FadeIn({ children, delay = 0, direction = "up" }: { children: React.ReactNode, delay?: number, direction?: "up" | "down" | "none" }) {
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

type RomanticWeddingTemplateProps = {
  template: TemplateConfig;
  data: any;
};

export default function RomanticWeddingTemplate({ template, data }: RomanticWeddingTemplateProps) {
  const { defaultData, features } = template;
  const invitationData = { ...defaultData, ...data };
  
  const mapSrc = invitationData.mainVenueAddress 
    ? `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(invitationData.mainVenueAddress)}`
    : "";

  const dressCode: DressCode | undefined = invitationData.dressCode;

  return (
    <div 
      className="w-full font-serif" 
      style={{
        backgroundColor: invitationData.backgroundColor || '#fffaf9',
        color: invitationData.textColor || '#44403c'
      }}
    >
      {/* Hero: The Ethereal Entrance */}
      <section className="relative h-screen w-full flex flex-col justify-center items-center overflow-hidden">
        <motion.div 
          className="absolute inset-0 z-0 scale-110"
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, ease: "linear" }}
        >
          <img 
            src={invitationData.hero_image_url || 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2069&auto=format&fit=crop'} 
            className="w-full h-full object-cover"
            alt="Wedding Portrait"
          />
          <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px]" />
        </motion.div>

        <div className="z-10 text-center max-w-4xl px-4">
          <FadeIn delay={0.5}>
            <p className="text-sm tracking-[0.4em] uppercase mb-8 font-sans font-light" style={{ color: invitationData.textColor }}>
              {invitationData.heroTitle || "Together with their families"}
            </p>
          </FadeIn>
          <FadeIn delay={0.8} direction="none">
            <h1 className="text-7xl md:text-9xl font-['Great_Vibes'] leading-tight" style={{ color: invitationData.primaryColor || '#44403c' }}>
              {invitationData.heroNames}
            </h1>
          </FadeIn>
          <FadeIn delay={1.1}>
            <div className="mt-8 flex flex-col items-center gap-4">
              <div className="h-px w-24" style={{ backgroundColor: invitationData.primaryColor }}/>
              <p className="text-xl md:text-2xl italic tracking-wide" style={{ color: invitationData.textColor }}>
                {invitationData.event_date && new Date(invitationData.event_date).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'long', day: 'numeric',
                })}
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Narrative Section: The Schedule */}
      {features.multiEventSchedule && (
        <section className="py-32 px-6 bg-white flex flex-col items-center">
          <FadeIn>
            <h2 className="text-5xl md:text-6xl font-['Great_Vibes'] text-center mb-24" style={{ color: invitationData.primaryColor }}>
              {invitationData.timelineTitle}
            </h2>
          </FadeIn>
          
          <div className="max-w-2xl w-full space-y-20 relative">
            {/* Delicate Flowing Divider */}
            <div className="absolute left-1/2 -top-10 bottom-0 w-px" style={{ background: `linear-gradient(to bottom, transparent, ${invitationData.primaryColor}20, transparent)` }} />
            
            {invitationData.timelineItems?.map((item: TimelineItem, index: number) => (
              <FadeIn key={index} delay={index * 0.2}>
                <div className="flex flex-col items-center text-center group">
                  <div 
                    className="relative z-10 w-3 h-3 rounded-full border-4 border-white shadow-sm mb-6 group-hover:scale-150 transition-transform duration-500" 
                    style={{ backgroundColor: invitationData.primaryColor }}
                  />
                  <span className="text-xs tracking-[0.3em] uppercase text-stone-400 font-sans mb-2">{item.time}</span>
                  <h3 className="text-3xl font-light mb-2" style={{ color: invitationData.textColor }}>{item.title}</h3>
                  <p className="italic font-light" style={{ color: invitationData.textColor }}>{item.location}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>
      )}

      {/* Gallery: Floating Memory Wall */}
      {invitationData.galleryImages?.length > 0 && (
        <section className="py-32" style={{ backgroundColor: invitationData.backgroundColor || '#fffaf9' }}>
          <FadeIn>
            <h2 className="text-5xl font-['Great_Vibes'] text-center mb-20" style={{ color: invitationData.textColor }}>
              {invitationData.galleryTitle || 'Our Story'}
            </h2>
          </FadeIn>
          <div className="max-w-6xl mx-auto px-4 columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
            {invitationData.galleryImages.map((src: string, index: number) => (
              <motion.div 
                key={index}
                whileHover={{ y: -10 }}
                className="relative overflow-hidden rounded-2xl shadow-xl"
                style={{ shadowColor: `${invitationData.primaryColor}20` }}
              >
                <img src={src} alt="" className="w-full h-auto object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-700" />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Location: Artistic Focus */}
      {mapSrc && (
        <section className="py-32 px-6 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <FadeIn direction="none">
                <div className="space-y-6">
                  <h2 className="text-6xl font-['Great_Vibes']" style={{ color: invitationData.primaryColor, opacity: 0.7 }}>Location</h2>
                  <p className="text-xl leading-relaxed italic" style={{ color: invitationData.textColor }}>
                    "Where the journey begins..."
                  </p>
                  <p className="text-lg font-sans tracking-wide" style={{ color: invitationData.textColor }}>
                    {invitationData.mainVenueAddress}
                  </p>
                  <button 
                    className="mt-8 px-10 py-4 rounded-full hover:bg-rose-50 transition-colors duration-300 font-sans text-sm tracking-widest uppercase"
                    style={{ 
                      borderColor: invitationData.primaryColor, 
                      color: invitationData.primaryColor,
                      borderWidth: '1px'
                    }}
                  >
                    Get Directions
                  </button>
                </div>
              </FadeIn>
              <FadeIn>
                <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl border-[12px] border-white" style={{ shadowColor: `${invitationData.primaryColor}30` }}>
                  <iframe
                    width="100%"
                    height="100%"
                    style={{ border: 0, filter: "sepia(20%) contrast(90%)" }}
                    loading="lazy"
                    src={mapSrc}
                  />
                </div>
              </FadeIn>
            </div>
          </div>
        </section>
      )}

      {/* Dress Code Section */}
      {dressCode && (
        <section className="py-32" style={{ backgroundColor: invitationData.backgroundColor || '#fffaf9' }}>
          <div className="max-w-xl mx-auto text-center px-6">
            <FadeIn>
              <h2 className="text-5xl md:text-6xl font-['Great_Vibes'] text-center mb-16" style={{ color: invitationData.primaryColor }}>
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
        <section className="py-32 bg-white">
          <div className="max-w-4xl mx-auto text-center px-6">
            <FadeIn>
              <h2 className="text-5xl md:text-6xl font-['Great_Vibes'] text-center mb-16" style={{ color: invitationData.primaryColor }}>
                Guest Accommodations
              </h2>
            </FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {invitationData.recommendations.map((item: RecommendationItem, index: number) => (
                <FadeIn key={index} delay={index * 0.1}>
                  <div className="p-8 rounded-2xl" style={{ backgroundColor: invitationData.backgroundColor || '#fffaf9' }}>
                    <h3 className="text-2xl font-serif mb-3" style={{ color: invitationData.primaryColor }}>{item.name}</h3>
                    <p className="text-sm mb-4" style={{ color: invitationData.textColor, opacity: 0.8 }}>{item.description}</p>
                    <a 
                      href={item.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="font-sans text-xs tracking-widest uppercase"
                      style={{ color: invitationData.primaryColor }}
                    >
                      Learn More
                    </a>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* RSVP SECTION */}
      <section className="py-32 px-6 bg-white">
        <div className="max-w-xl mx-auto">
          <FadeIn>
            <h2 className="text-5xl md:text-6xl font-['Great_Vibes'] text-center mb-12" style={{ color: invitationData.primaryColor }}>
              RSVP
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
