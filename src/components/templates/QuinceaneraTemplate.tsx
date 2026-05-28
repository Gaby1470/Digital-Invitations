"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { TemplateConfig, TimelineItem, CourtMember } from "@/lib/types";

// Helper for animations
function AnimatedSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px 0px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

type QuinceaneraTemplateProps = {
  template: TemplateConfig;
  data: any;
};

// New "Ethereal Gala" Theme Component
export default function QuinceaneraTemplate({ template, data }: QuinceaneraTemplateProps) {
  const { defaultData, features } = template;
  const invitationData = { ...defaultData, ...data };

  // --- "Ethereal Gala" Color Palette ---
  const colors = {
    background: invitationData.backgroundColor || "#1a1a2e", // Deep Midnight Blue
    text: invitationData.textColor || "#f0f0f0", // Soft Off-White
    primary: invitationData.primaryColor || "#c06c84", // Electric Lavender
    highlight: invitationData.secondaryColor || "#FFD700" // Shimmering Gold
  };
  
  const photoDropUrl = invitationData.photoSharingUrl || "https://shared-album.google.com";
  const timelineTextColor = "#1f2937";
  const courtOfHonorCardColor = "#DBC4B4";
  
  // New Hero Image reflecting the theme
  const heroImageUrl = invitationData.hero_image_url || "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=2071&auto=format&fit=crop";

  return (
    <div 
      className="w-full antialiased overflow-x-hidden"
      style={{
        backgroundColor: colors.background,
        color: colors.text,
        fontFamily: 'var(--font-montserrat)',
      }}
    >
      {/* Hero Section */}
      <section 
        id="hero"
        className="relative h-[95vh] min-h-[600px] w-full flex flex-col justify-center items-center px-6 text-center"
      >
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImageUrl} 
            className="w-full h-full object-cover"
            alt="Ethereal celebration background"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-[#1a1a2e]/60 to-transparent" />
        </div>

        <div className="z-10 w-full max-w-md">
          <motion.p 
            initial={{ opacity: 0, letterSpacing: "0.1em" }}
            animate={{ opacity: 1, letterSpacing: "0.3em" }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-[11px] uppercase font-light tracking-[0.3em] mb-4"
            style={{ color: colors.primary }}
          >
            {invitationData.heroTitle || "Join us for a celestial night"}
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="text-6xl md:text-7xl font-bold leading-none mb-6"
            style={{ fontFamily: 'var(--font-playfair-display)', textShadow: `0 2px 20px ${colors.primary}40` }}
          >
            {invitationData.heroNames || "Valentina's XV"}
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="w-12 h-[2px] mx-auto rounded-full"
            style={{ backgroundColor: colors.primary }}
          />
        </div>
      </section>

      {/* Date Capsule: Glassmorphism */}
      {invitationData.event_date && (
        <section id="date-card" className="relative -mt-16 z-20 px-6 max-w-md mx-auto">
          <AnimatedSection>
            <div 
              className="backdrop-blur-xl p-6 rounded-3xl border text-center flex items-center justify-around"
              style={{
                backgroundColor: '#8debb340', // Semi-transparent darker midnight
                borderColor: `${colors.primary}30`
              }}
            >
              <div>
                <p className="text-[10px] tracking-widest uppercase font-bold opacity-60">Month</p>
                <p className="text-xl font-bold uppercase tracking-tight">
                  {new Date(invitationData.event_date).toLocaleDateString('en-US', { month: 'short' })}
                </p>
              </div>
              <div className="w-[1px] h-10" style={{ backgroundColor: `${colors.primary}30` }} />
              <div>
                <p className="text-4xl font-black tracking-tighter" style={{ color: colors.primary }}>
                  {new Date(invitationData.event_date).toLocaleDateString('en-US', { day: '2-digit' })}
                </p>
              </div>
              <div className="w-[1px] h-10" style={{ backgroundColor: `${colors.primary}30` }} />
              <div>
                <p className="text-[10px] tracking-widest uppercase font-bold opacity-60">Day</p>
                <p className="text-xl font-bold uppercase tracking-tight">
                  {new Date(invitationData.event_date).toLocaleDateString('en-US', { weekday: 'short' })}
                </p>
              </div>
            </div>
          </AnimatedSection>
        </section>
      )}

      {/* Timeline Itinerary Section */}
      <section id="timeline" className="py-24 px-6 max-w-md mx-auto">
        <AnimatedSection>
          <h2 className="text-xs tracking-[0.4em] uppercase font-bold text-center mb-16" style={{ color: colors.primary }}>
            {invitationData.timelineTitle || "The Itinerary"}
          </h2>
        </AnimatedSection>

        <div className="relative pl-8 space-y-10">
          <div 
            className="absolute left-2 top-2 bottom-2 w-0.5" 
            style={{ background: `linear-gradient(to bottom, transparent, ${colors.primary}40, transparent)` }} 
          />

          {invitationData.timelineItems?.map((item: TimelineItem, index: number) => (
            <AnimatedSection key={index} delay={index * 0.1}>
              <div className="relative text-left">
                <div 
                  className="absolute -left-[30px] top-1.5 w-3 h-3 rounded-full border-2 flex items-center justify-center"
                  style={{ borderColor: colors.primary }} 
                >
                  <div className="w-1 h-1 rounded-full" style={{ backgroundColor: colors.primary }} />
                </div>
                <span className="font-mono text-xs font-bold tracking-wider opacity-80 block mb-1" style={{ color: colors.primary }}>
                  {item.time}
                </span>
                <h3
                  className="text-2xl font-bold tracking-tight"
                  style={{
                    fontFamily: 'var(--font-playfair-display)',
                    color: timelineTextColor,
                  }}
                >
                  {item.title}
                </h3>
                <p className="text-sm tracking-wide opacity-70 mt-1" style={{ color: timelineTextColor }}>
                  {item.location}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Court of Honor Section */}
      {features.courtOfHonor && invitationData.courtOfHonor?.length > 0 && (
        <section id="court-of-honor" className="py-20" style={{ backgroundColor: '#e7dfd6' }}>
          <AnimatedSection>
            <h2 className="text-xs tracking-[0.4em] uppercase font-bold text-center mb-12" style={{ color: colors.primary }}>
              The Court of Honor
            </h2>
          </AnimatedSection>
          
          <div className="flex justify-center items-stretch gap-6 overflow-x-auto snap-x snap-mandatory px-6 no-scrollbar pb-6">
            {invitationData.courtOfHonor.map((member: CourtMember, idx: number) => (
              <div key={member.name} className="flex-none w-[70vw] max-w-[260px] snap-center">
                <AnimatedSection delay={idx * 0.08}>
                  <div
                    className="flex flex-col items-center border p-3 rounded-2xl text-center transition-all duration-300"
                    style={{
                      backgroundColor: courtOfHonorCardColor,
                      color: "#1f2937",
                      borderColor: "rgba(31, 41, 55, 0.12)",
                    }}
                  >
                    <div className="aspect-[4/5] w-full overflow-hidden rounded-xl bg-stone-800">
                      <img src={member.photoUrl} alt={member.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                    </div>
                    <h4 className="text-lg font-bold mt-4 tracking-tight">{member.name}</h4>
                    <p className="text-xs opacity-60 tracking-wide mt-1">{member.role}</p>
                  </div>
                </AnimatedSection>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Social Media Section */}
      {features.socialMediaWall && (
        <section id="social-media" className="py-24 px-6 max-w-md mx-auto text-center">
          <AnimatedSection>
            <div 
              className="p-10 rounded-[2.5rem] text-white shadow-2xl"
              style={{
                background: `linear-gradient(135deg, #2c2c44, #3c2c44)`,
                boxShadow: `0 10px 30px -10px ${colors.primary}30`
              }}
            >
              <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: 'var(--font-playfair-display)'}}>Capture the Night</h2>
              <p className="text-sm font-light leading-relaxed opacity-80 mb-6 max-w-xs mx-auto">
                Help us collect memories from this unforgettable night. Share your photos and videos in our collective album.
              </p>
              <a 
                href={photoDropUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 px-6 font-bold text-xs tracking-widest uppercase rounded-2xl shadow-lg inline-block active:scale-95 transition-transform"
                style={{
                  backgroundColor: colors.primary,
                  color: '#fff',
                  boxShadow: `0 4px 15px -2px ${colors.primary}50`
                }}
              >
                Share Your Photos
              </a>
              <div className="mt-5 text-[10px] tracking-widest uppercase opacity-50 font-medium">
                #ValentinaXV
              </div>
            </div>
          </AnimatedSection>
        </section>
      )}
    </div>
  );
}
