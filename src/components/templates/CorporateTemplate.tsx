"use client";

import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { TimelineItem, TemplateConfig, EditorData } from '@/lib/custom_types';
import React, { useRef } from 'react';
import { RsvpTrigger } from './shared/RsvpTrigger';
import { BrandingFooter } from './shared/BrandingFooter';

/**
 * Clean, sharp transition for professional blocks.
 */
function SectionReveal({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px 0px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

type CorporateTemplateProps = {
  template: TemplateConfig;
  data: EditorData;
  invitationId?: string;
  onRsvpClick?: () => void;
};

export default function CorporateTemplate({ template, data, invitationId, onRsvpClick }: CorporateTemplateProps) {
  const { defaultData, features } = template;
  const invitationData = { ...defaultData, ...data };
  const highlightTextColor = '#FACC15';

  return (
    <div 
      className="w-full font-sans"
      style={{
        backgroundColor: invitationData.backgroundColor || '#fffb79',
        color: invitationData.textColor || '#1A1A1A'
      }}
    >
      {/* Hero: The Keynote Entrance */}
      <section className="relative min-h-[90vh] w-full flex items-center px-6 md:px-20 overflow-hidden border-b" style={{ borderColor: `${invitationData.textColor}1A` }}>

        {/* Advanced Background Layers */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))]" style={{'--tw-gradient-from': `${invitationData.primaryColor}22`, '--tw-gradient-to': 'transparent'} as React.CSSProperties}/>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))]" style={{'--tw-gradient-from': `${highlightTextColor}15`, '--tw-gradient-to': 'transparent'} as React.CSSProperties}/>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay" />

          {/* Subtle Animated Glow Orb */}
          <motion.div 
            animate={{ y: [0, -30, 0], opacity: [0.2, 0.4, 0.2] }} 
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 right-[10%] w-96 h-96 rounded-full blur-[120px]" 
            style={{ backgroundColor: highlightTextColor }}
          />
        </div>

        <div className="z-10 w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-4xl flex-1 pt-12 md:pt-0">
            <SectionReveal>
              <div className="flex items-center gap-4 mb-8">
                <div className="h-[2px] w-16" style={{ backgroundColor: highlightTextColor }} />
                <p className="text-sm font-bold tracking-[0.4em] uppercase" style={{ color: highlightTextColor }}>
                  {invitationData.heroTitle || "Professional Summit 2026"}
                </p>
              </div>
            </SectionReveal>

            <SectionReveal delay={0.2}>
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-8 leading-[0.95]">
                {invitationData.heroNames || "Future of Tech"}
              </h1>
            </SectionReveal>

            <SectionReveal delay={0.4}>
              {/* Enhanced Glassmorphism Info Card */}
              <div 
                className="inline-flex flex-wrap gap-8 md:gap-12 mt-8 p-6 md:p-8 rounded-2xl backdrop-blur-md border shadow-2xl transition-transform hover:-translate-y-1" 
                style={{ 
                  backgroundColor: `${invitationData.textColor}08`,
                  borderColor: `${invitationData.textColor}1A` 
                }}
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke={highlightTextColor} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    <p className="text-xs uppercase tracking-widest" style={{ color: highlightTextColor }}>Date</p>
                  </div>
                  <p className="text-xl md:text-2xl font-medium opacity-90">
                    {invitationData.event_date ? new Date(invitationData.event_date).toLocaleDateString('en-US', {
                      month: 'long', day: 'numeric', year: 'numeric'
                    }) : "TBA"}
                  </p>
                </div>

                <div className="w-[1px] h-14 hidden md:block" style={{ backgroundColor: `${invitationData.textColor}22` }} />

                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke={highlightTextColor} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    <p className="text-xs uppercase tracking-widest" style={{ color: highlightTextColor }}>Location</p>
                  </div>
                  <p className="text-xl md:text-2xl font-medium opacity-90">{invitationData.venue_city || "San Francisco, CA"}</p>
                </div>
              </div>
            </SectionReveal>
          </div>
        </div>

        {/* Animated Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-60"
        >
          <span className="text-[10px] tracking-[0.3em] uppercase font-bold">Discover</span>
          <div className="w-[2px] h-12 rounded-full" style={{ backgroundColor: highlightTextColor }} />
        </motion.div>
      </section>

      {/* Agenda: The Strategic Flow */}
      {features.multiEventSchedule && (
        <section className="py-32 px-6 md:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-4">
              <SectionReveal>
                <h2 className="text-4xl font-bold mb-6">Summit Agenda</h2>
                <p className="leading-relaxed opacity-80">
                  Join industry leaders for a day of strategic insights and high-level networking.
                </p>
              </SectionReveal>
            </div>

            <div className="lg:col-span-8 space-y-4">
              {invitationData.timelineItems?.map((item: TimelineItem, index: number) => (
                <SectionReveal key={index} delay={index * 0.1}>
                  <div className="group flex items-center justify-between p-6 border rounded-xl transition-all duration-300" style={{ backgroundColor: `${invitationData.textColor}0D`, borderColor: `${invitationData.textColor}0D` }}>
                    <div className="flex gap-8 items-center">
                      <span className="font-mono font-bold text-lg" style={{ color: highlightTextColor }}>{item.time}</span>
                      <div>
                        <h3 className="text-xl font-bold group-hover:text-blue-400 transition-colors">{item.title}</h3>
                        <p className="text-sm opacity-80">{item.location}</p>
                      </div>
                    </div>
                    <div className="h-2 w-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: highlightTextColor }} />
                  </div>
                </SectionReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Speakers/Sponsors: Professional Grid */}
      <section className="py-32 px-6 md:px-20" style={{ backgroundColor: `${invitationData.textColor}08` }}>
        <SectionReveal>
          <div className="flex justify-between items-end mb-20">
            <h2 className="text-4xl font-bold">Featured Speakers</h2>
            <div className="hidden md:block h-[1px] flex-1 mx-12" style={{ backgroundColor: `${invitationData.textColor}1A` }} />
            <p className="font-bold uppercase tracking-widest text-xs" style={{ color: highlightTextColor }}>Excellence in Leadership</p>
          </div>
        </SectionReveal>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {(invitationData.speakerImages || []).map((src: string, i: number) => (
            <SectionReveal key={i} delay={i * 0.1}>
              <div className="group cursor-pointer">
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-neutral-800 mb-4 border" style={{ borderColor: `${invitationData.textColor}1A` }}>
                  <Image 
                    src={src} 
                    alt="Speaker"
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                  />
                </div>
                <h4 className="text-lg font-bold">Executive Name</h4>
                <p className="text-sm uppercase tracking-tighter" style={{ color: highlightTextColor }}>Chief Innovation Officer</p>
              </div>
            </SectionReveal>
          ))}
        </div>
      </section>


      {onRsvpClick && (
        <section className="py-32 px-6 md:px-20" style={{ backgroundColor: `${invitationData.textColor}08` }}>
          <div className="max-w-2xl mx-auto">
            <SectionReveal>
              <RsvpTrigger onClick={onRsvpClick} primaryColor={highlightTextColor} textColor={invitationData.textColor} />
            </SectionReveal>
          </div>
        </section>
      )}
      <BrandingFooter />
    </div>
  );
}
