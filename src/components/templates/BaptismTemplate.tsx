"use client";

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { TemplateConfig, TimelineItem } from '@/lib/types';

/**
 * Ethereal fade-in for sacred milestones.
 */
function SacredFadeIn({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px 0px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, filter: "blur(10px)" }}
      animate={isInView ? { opacity: 1, filter: "blur(0px)" } : {}}
      transition={{ duration: 1.5, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

type BaptismTemplateProps = {
  template: TemplateConfig;
  data: any;
};

export default function BaptismTemplate({ template, data }: BaptismTemplateProps) {
  const { defaultData, features } = template;
  const invitationData = { ...defaultData, ...data };

  return (
    <div 
      className="w-full font-serif"
      style={{
        backgroundColor: invitationData.backgroundColor || '#FCFBF7',
        color: invitationData.textColor || '#292524'
      }}
    >
      {/* Hero: The Ethereal Light */}
      <section className="relative h-screen w-full flex flex-col justify-center items-center text-center px-6">
        <motion.div 
          className="absolute inset-0 z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
        >
          <img 
            src={invitationData.hero_image_url || 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2069&auto=format&fit=crop'} 
            className="w-full h-full object-cover opacity-30"
            alt={`${invitationData.heroNames} Ceremony`}
          />
          <div 
            className="absolute inset-0 bg-gradient-to-b from-transparent" 
            style={{
              '--gradient-via': `${invitationData.backgroundColor}80` || '#FCFBF780',
              '--gradient-to': invitationData.backgroundColor || '#FCFBF7'
            } as any}
          />
        </motion.div>

        <div className="z-10 max-w-3xl">
          <SacredFadeIn delay={0.5}>
            <p className="text-sm tracking-[0.4em] uppercase mb-8 font-sans font-light" style={{ color: invitationData.textColor, opacity: 0.7 }}>
              {invitationData.heroTitle || "A Sacred Celebration"}
            </p>
          </SacredFadeIn>
          
          <SacredFadeIn delay={0.8}>
            <h1 className="text-6xl md:text-8xl font-light tracking-tight mb-6 italic" style={{ color: invitationData.textColor }}>
              {invitationData.heroNames}
            </h1>
          </SacredFadeIn>

          <SacredFadeIn delay={1.1}>
            <div className="flex items-center justify-center gap-4 mb-12" style={{ color: invitationData.primaryColor }}>
              <div className="h-px w-8" style={{ backgroundColor: invitationData.primaryColor, opacity: 0.5 }} />
              <span className="text-2xl font-['Great_Vibes']">The Holy Blessing</span>
              <div className="h-px w-8" style={{ backgroundColor: invitationData.primaryColor, opacity: 0.5 }} />
            </div>
            <p className="text-xl tracking-wide uppercase font-sans font-light" style={{ color: invitationData.textColor }}>
              {invitationData.event_date && new Date(invitationData.event_date).toLocaleDateString('en-US', {
                month: 'long', day: 'numeric', year: 'numeric'
              })}
            </p>
          </SacredFadeIn>
        </div>
        
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-20 text-4xl">🕊️</div>
      </section>

      {/* Ceremony Details: Elegant & Minimal */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <SacredFadeIn>
            <h2 className="text-4xl md:text-5xl font-['Great_Vibes'] text-center mb-24" style={{ color: invitationData.primaryColor }}>
              {invitationData.timelineTitle || "The Blessed Order"}
            </h2>
          </SacredFadeIn>
          
          <div className="space-y-16">
            {invitationData.timelineItems?.map((item: TimelineItem, index: number) => (
              <SacredFadeIn key={index} delay={index * 0.1}>
                <div className="flex flex-col items-center text-center">
                  <span className="font-sans text-xs tracking-widest uppercase mb-4" style={{ color: invitationData.primaryColor, opacity: 0.6 }}>{item.time}</span>
                  <h3 className="text-3xl font-light mb-2" style={{ color: invitationData.textColor }}>{item.title}</h3>
                  <p className="italic font-light" style={{ color: invitationData.textColor, opacity: 0.7 }}>{item.location}</p>
                  {index < invitationData.timelineItems.length - 1 && (
                    <div className="mt-16 h-12 w-px bg-gradient-to-b to-transparent" style={{ '--gradient-from': invitationData.primaryColor + '30' } as any} />
                  )}
                </div>
              </SacredFadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Godparents / Special Mention Section */}
      <section className="py-32 bg-white rounded-[100%_100%_0_0] shadow-[0_-20px_50px_-20px_rgba(0,0,0,0.05)]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <SacredFadeIn>
            <h2 className="text-3xl font-bold mb-12 italic tracking-tighter" style={{ color: invitationData.textColor }}>Godparents</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-2">
                <p className="uppercase text-[10px] tracking-widest font-sans font-bold" style={{ color: invitationData.primaryColor }}>Godmother</p>
                <p className="text-2xl font-light" style={{ color: invitationData.textColor }}>Elizabeth Montgomery</p>
              </div>
              <div className="space-y-2">
                <p className="uppercase text-[10px] tracking-widest font-sans font-bold" style={{ color: invitationData.primaryColor }}>Godfather</p>
                <p className="text-2xl font-light" style={{ color: invitationData.textColor }}>Christopher Rhodes</p>
              </div>
            </div>
          </SacredFadeIn>
        </div>
      </section>

      {/* Reception Invite */}
      <section className="py-40 text-center px-6" style={{ backgroundColor: invitationData.backgroundColor || '#FCFBF7' }}>
        <SacredFadeIn>
          <div className="inline-block p-12 border bg-white shadow-sm relative" style={{ borderColor: invitationData.primaryColor + '30' }}>
            <div className="absolute -top-3 -left-3 w-6 h-6 border-t border-l" style={{ borderColor: invitationData.primaryColor + '50' }} />
            <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b border-r" style={{ borderColor: invitationData.primaryColor + '50' }} />
            
            <h2 className="text-2xl font-bold uppercase tracking-widest mb-6" style={{ color: invitationData.textColor }}>Reception to Follow</h2>
            <p className="text-lg font-light max-w-md mx-auto leading-relaxed italic" style={{ color: invitationData.textColor, opacity: 0.8 }}>
              "We invite you to share in a celebratory brunch immediately following the ceremony."
            </p>
            <p className="mt-8 font-sans text-sm" style={{ color: invitationData.textColor, opacity: 0.6 }}>Venue: The Rose Garden Conservatory</p>
          </div>
        </SacredFadeIn>
      </section>
    </div>
  );
}
