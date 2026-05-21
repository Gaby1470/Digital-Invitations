"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { TemplateConfig, TimelineItem, CourtMember } from "@/lib/types";

// Mobile-optimized trigger boundary
function AnimatedSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px 0px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 25 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

type QuinceaneraTemplateProps = {
  template: TemplateConfig;
  data: any;
};

export default function QuinceaneraTemplate({ template, data }: QuinceaneraTemplateProps) {
  const { defaultData, features } = template;
  const invitationData = { ...defaultData, ...data };

  // Sample or dynamic photo drop target link
  const photoDropUrl = invitationData.photoSharingUrl || "https://shared-album.google.com";

  return (
    <div 
      className="w-full font-sans antialiased overflow-x-hidden selection:bg-rose-200"
      style={{
        backgroundColor: invitationData.backgroundColor || "#fff1f2", // rose-50 base
        color: invitationData.textColor || "#1f2937" 
      }}
    >
      {/* Hero Section: Fixed height to prevent mobile browser search bar jumping */}
      <section 
        id="hero"
        className="relative h-[92vh] min-h-[540px] w-full flex flex-col justify-end items-center px-6 pb-16 overflow-hidden"
      >
        <div className="absolute inset-0 z-0">
          <img 
            src={invitationData.hero_image_url || "https://images.unsplash.com/photo-1549417229-aa67d3263c09?q=80&w=2070&auto=format&fit=crop"} 
            className="w-full h-full object-cover"
            alt="Celebration Snapshot"
          />
          {/* Custom warm, modern vignette drop */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-stone-900/10" />
        </div>

        <div className="z-10 text-center text-white w-full max-w-sm">
          <motion.p 
            initial={{ opacity: 0, tracking: "0.1em" }}
            animate={{ opacity: 1, tracking: "0.3em" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-[10px] uppercase font-bold tracking-[0.3em] mb-3 text-rose-300"
          >
            {invitationData.heroTitle || "You're Invited"}
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4 }}
            className="text-5xl font-extrabold tracking-tight lowercase leading-none mb-6"
          >
            {invitationData.heroNames || "mis xv"}
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="w-8 h-[2px] bg-white/40 mx-auto rounded-full"
          />
        </div>
      </section>

      {/* DATE BREAKOUT CAPSULE */}
      {invitationData.event_date && (
        <section id="date-card" className="relative -mt-10 z-20 px-6 max-w-md mx-auto">
          <AnimatedSection>
            <div className="bg-white/90 backdrop-blur-md p-6 rounded-3xl border border-white shadow-xl shadow-stone-900/5 text-center flex items-center justify-around">
              <div className="text-left">
                <p className="text-[10px] tracking-widest uppercase font-bold text-stone-400">Month</p>
                <p className="text-xl font-bold uppercase tracking-tight text-stone-800">
                  {new Date(invitationData.event_date).toLocaleDateString('en-US', { month: 'short' })}
                </p>
              </div>
              <div className="w-[1px] h-10 bg-stone-200" />
              <div>
                <p className="text-3xl font-black tracking-tighter text-rose-500">
                  {new Date(invitationData.event_date).toLocaleDateString('en-US', { day: '2-digit' })}
                </p>
              </div>
              <div className="w-[1px] h-10 bg-stone-200" />
              <div className="text-right">
                <p className="text-[10px] tracking-widest uppercase font-bold text-stone-400">Day</p>
                <p className="text-xl font-bold uppercase tracking-tight text-stone-800">
                  {new Date(invitationData.event_date).toLocaleDateString('en-US', { weekday: 'short' })}
                </p>
              </div>
            </div>
          </AnimatedSection>
        </section>
      )}

      {/* Timeline Itinerary Section: Left-Anchored Mobile Timeline */}
      <section id="timeline" className="py-20 px-6 max-w-md mx-auto">
        <AnimatedSection>
          <h2 className="text-xs tracking-[0.4em] uppercase font-black text-center mb-12" style={{ color: invitationData.primaryColor || "#f43f5e" }}>
            {invitationData.timelineTitle || "The Itinerary"}
          </h2>
        </AnimatedSection>

        <div className="relative pl-6 space-y-8">
          {/* Subtle Accent Axis Vector Line */}
          <div 
            className="absolute left-1 top-2 bottom-2 w-[1px]" 
            style={{ background: `linear-gradient(to bottom, transparent, ${invitationData.primaryColor || '#f43f5e'}40, transparent)` }} 
          />

          {invitationData.timelineItems?.map((item: TimelineItem, index: number) => (
            <AnimatedSection key={index} delay={index * 0.05}>
              <div className="relative text-left group">
                <div 
                  className="absolute -left-[23px] top-1.5 w-2.5 h-2.5 rounded-full bg-white border-2 shadow-sm"
                  style={{ borderColor: invitationData.primaryColor || "#f43f5e" }} 
                />
                <span className="font-mono text-[11px] font-bold tracking-wider opacity-60 block mb-0.5" style={{ color: invitationData.primaryColor }}>
                  {item.time}
                </span>
                <h3 className="text-xl font-bold tracking-tight text-stone-800">{item.title}</h3>
                <p className="text-xs tracking-wide text-stone-500 mt-0.5">{item.location}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Court of Honor Section: Horizontal Swiping Polaroid Cards */}
      {features.courtOfHonor && invitationData.courtOfHonor?.length > 0 && (
        <section id="court-of-honor" className="py-16 bg-white border-y border-stone-100">
          <AnimatedSection>
            <h2 className="text-xs tracking-[0.4em] uppercase font-black text-center mb-10" style={{ color: invitationData.primaryColor || "#f43f5e" }}>
              The Court
            </h2>
          </AnimatedSection>
          
          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory px-6 no-scrollbar pb-4">
            {invitationData.courtOfHonor.map((member: CourtMember, idx: number) => (
              <div key={member.name} className="flex-none w-[65vw] max-w-[220px] snap-center">
                <AnimatedSection delay={idx * 0.05}>
                  <div className="p-3 bg-stone-50 border border-stone-200/60 rounded-2xl text-center shadow-sm">
                    <div className="aspect-square w-full overflow-hidden rounded-xl bg-stone-200">
                      <img src={member.photoUrl} alt={member.name} className="w-full h-full object-cover filter contrast-[102%]" />
                    </div>
                    <h4 className="text-base font-bold mt-3 tracking-tight text-stone-800">{member.name}</h4>
                    <p className="text-xs text-stone-500 tracking-wide mt-0.5">{member.role}</p>
                  </div>
                </AnimatedSection>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Shared Interactive Photo Dump Block */}
      {features.socialMediaWall && (
        <section id="social-media" className="py-20 px-6 max-w-sm mx-auto text-center">
          <AnimatedSection>
            <div className="bg-gradient-to-br from-rose-500 to-pink-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-rose-500/10">
              <h2 className="text-2xl font-black tracking-tight mb-2">Live Photo Dump 📸</h2>
              <p className="text-xs text-rose-100 font-light leading-relaxed mb-6 max-w-[240px] mx-auto">
                Don't let your pictures sit in your camera roll! Tap below to drop your snaps directly into our shared album.
              </p>
              <a 
                href={photoDropUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-6 bg-white text-rose-600 font-bold font-sans text-xs tracking-widest uppercase rounded-2xl shadow-md inline-block active:scale-95 transition-transform"
              >
                Upload Your Photos
              </a>
              <div className="mt-4 text-[10px] tracking-widest uppercase text-rose-200/80 font-medium">
                #ValentinaXV
              </div>
            </div>
          </AnimatedSection>
        </section>
      )}
    </div>
  );
}