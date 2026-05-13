"use client";

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { TemplateConfig, TimelineItem } from '@/lib/types';

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
  data: any;
};

export default function CorporateTemplate({ template, data }: CorporateTemplateProps) {
  const { defaultData, features } = template;
  const invitationData = { ...defaultData, ...data };

  return (
    <div className="w-full bg-[#050505] text-white font-sans selection:bg-blue-500">
      {/* Hero: The Keynote Entrance */}
      <section className="relative h-[85vh] w-full flex items-center px-6 md:px-20 overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
        </div>

        <div className="z-10 max-w-4xl">
          <SectionReveal>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-[2px] w-12 bg-blue-500" />
              <p className="text-blue-400 text-sm font-bold tracking-[0.3em] uppercase">
                {invitationData.heroTitle || "Professional Summit 2026"}
              </p>
            </div>
          </SectionReveal>

          <SectionReveal delay={0.2}>
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9]">
              {invitationData.heroNames || "Future of Fintech"}
            </h1>
          </SectionReveal>

          <SectionReveal delay={0.4}>
            <div className="flex flex-wrap gap-10 mt-12 py-8 border-t border-white/10">
              <div>
                <p className="text-white/40 text-xs uppercase tracking-widest mb-1">Date</p>
                <p className="text-xl font-medium">
                  {invitationData.event_date && new Date(invitationData.event_date).toLocaleDateString('en-US', {
                    month: 'long', day: 'numeric', year: 'numeric'
                  })}
                </p>
              </div>
              <div>
                <p className="text-white/40 text-xs uppercase tracking-widest mb-1">Location</p>
                <p className="text-xl font-medium">{invitationData.venue_city || "San Francisco, CA"}</p>
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* Agenda: The Strategic Flow */}
      {features.multiEventSchedule && (
        <section className="py-32 px-6 md:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-4">
              <SectionReveal>
                <h2 className="text-4xl font-bold mb-6">Summit Agenda</h2>
                <p className="text-white/50 leading-relaxed">
                  Join industry leaders for a day of strategic insights and high-level networking.
                </p>
              </SectionReveal>
            </div>
            
            <div className="lg:col-span-8 space-y-4">
              {invitationData.timelineItems?.map((item: TimelineItem, index: number) => (
                <SectionReveal key={index} delay={index * 0.1}>
                  <div className="group flex items-center justify-between p-6 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl transition-all duration-300">
                    <div className="flex gap-8 items-center">
                      <span className="text-blue-500 font-mono font-bold text-lg">{item.time}</span>
                      <div>
                        <h3 className="text-xl font-bold group-hover:text-blue-400 transition-colors">{item.title}</h3>
                        <p className="text-sm text-white/40">{item.location}</p>
                      </div>
                    </div>
                    <div className="h-2 w-2 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </SectionReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Speakers/Sponsors: Professional Grid */}
      <section className="py-32 px-6 md:px-20 bg-neutral-900/50">
        <SectionReveal>
          <div className="flex justify-between items-end mb-20">
            <h2 className="text-4xl font-bold">Featured Speakers</h2>
            <div className="hidden md:block h-[1px] flex-1 mx-12 bg-white/10" />
            <p className="text-blue-500 font-bold uppercase tracking-widest text-xs">Excellence in Leadership</p>
          </div>
        </SectionReveal>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <SectionReveal key={i} delay={i * 0.1}>
              <div className="group cursor-pointer">
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-neutral-800 mb-4 border border-white/5">
                  <img 
                    src={`https://picsum.photos/seed/speaker${i}/600/800`} 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                    alt="Speaker"
                  />
                </div>
                <h4 className="text-lg font-bold">Executive Name</h4>
                <p className="text-sm text-white/40 uppercase tracking-tighter">Chief Innovation Officer</p>
              </div>
            </SectionReveal>
          ))}
        </div>
      </section>

      {/* Action Section: RSVP/Register */}
      <section className="py-40 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-blue-500 to-transparent" />
        <SectionReveal>
          <h2 className="text-4xl md:text-6xl font-black mb-10">Secure Your Presence</h2>
          <button className="px-12 py-5 bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-widest rounded-full shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)] transition-all hover:scale-105 active:scale-95">
            Register for Event
          </button>
        </SectionReveal>
      </section>
    </div>
  );
}