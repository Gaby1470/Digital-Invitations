"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { EditorData, TemplateConfig, TimelineItem, CourtMember } from "@/lib/types";
import Image from "next/image";
import { RsvpSection } from "./shared/RsvpSection";

// Helper for smooth scroll animations
function AnimatedSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px 0px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

type QuinceaneraTemplateProps = {
  template: TemplateConfig;
  data: EditorData;
  invitationId?: string;
};

export default function QuinceaneraTemplate({ template, data, invitationId }: QuinceaneraTemplateProps) {
  const { defaultData, features } = template;
  const invitationData = { ...defaultData, ...data };

  const photoDropUrl = invitationData.photoSharingUrl || "https://shared-album.google.com";
  const heroImageUrl = invitationData.hero_image_url || "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=2071&auto=format&fit=crop";

  return (
    <div 
      className="w-full min-h-screen antialiased overflow-x-hidden selection:bg-pink-500/30"
      style={{
        backgroundColor: invitationData.backgroundColor,
        fontFamily: 'var(--font-montserrat), sans-serif',
      }}
    >
      {/* --- ENHANCED HERO SECTION --- */}
      <section 
        id="hero"
        className="relative h-[100svh] min-h-[660px] w-full flex flex-col justify-end pb-24 items-center px-6 text-center overflow-hidden bg-slate-900"
      >
        <div className="absolute inset-0 z-0">
          {/* Subtle Ken Burns zoom effect */}
          <motion.div 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, ease: "easeOut" }}
            className="w-full h-full"
          >
            <Image 
              src={heroImageUrl} 
              fill
              className="object-cover object-center"
              alt="Celebration background"
            />
          </motion.div>
          {/* Heavy vignette gradient for perfect text legibility without muddying the center */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />
        </div>

        <div className="z-10 w-full max-w-sm backdrop-blur-[2px] py-8 rounded-3xl">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-[11px] uppercase font-bold tracking-[0.4em] mb-4 text-white drop-shadow-lg"
          >
            {invitationData.heroTitle || "Estás invitado a los XV de"}
          </motion.p>

          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="text-7xl font-bold leading-tight mb-6 text-white drop-shadow-2xl"
            style={{ fontFamily: 'var(--font-playfair-display), serif' }}
          >
            {invitationData.heroNames || "Valentina"}
          </motion.h1>

          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "60px" }}
            transition={{ duration: 1, delay: 1 }}
            className="h-[2px] mx-auto rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)]"
          />
        </div>

        {/* Minimalist Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-8 flex flex-col items-center gap-3 opacity-80"
        >
          <span className="text-[9px] uppercase tracking-widest font-medium text-white/70">Scroll</span>
          <motion.div 
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-[1px] h-8 bg-white/50"
          />
        </motion.div>
      </section>

      {/* --- TIMELINE SECTION (Centered Editorial Style) --- */}
      <section id="timeline" className="py-24 px-8 max-w-md mx-auto">
        <AnimatedSection>
          <h2 className="text-sm tracking-[0.3em] uppercase font-bold text-center mb-8" style={{ color: invitationData.primaryColor }}>
            {invitationData.timelineTitle || "La Celebración"}
          </h2>
          {invitationData.event_date && (
            <div className="text-center mb-16">
              <p className="text-2xl" style={{ color: invitationData.textColor, fontFamily: 'var(--font-playfair-display), serif' }}>
                {new Date(invitationData.event_date).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
              <p className="text-lg mt-2" style={{ color: invitationData.textColor, opacity: 0.8 }}>
                {new Date(invitationData.event_date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
              </p>
            </div>
          )}
        </AnimatedSection>

        <div className="space-y-12">
          {invitationData.timelineItems?.map((item: TimelineItem, index: number) => (
            <AnimatedSection key={index} delay={index * 0.1}>
              <div className="flex flex-col items-center text-center">
                <span className="text-[11px] font-bold tracking-widest uppercase mb-3" style={{ color: invitationData.primaryColor }}>
                  {item.time}
                </span>
                <h3
                  className="text-3xl font-bold tracking-tight mb-2"
                  style={{
                    fontFamily: 'var(--font-playfair-display), serif',
                    color: invitationData.textColor,
                  }}
                >
                  {item.title}
                </h3>
                <p className="text-sm tracking-wide leading-relaxed opacity-70 max-w-[220px]" style={{ color: invitationData.textColor }}>
                  {item.location}
                </p>
                {/* Thin vertical separator between items */}
                {index !== invitationData.timelineItems.length - 1 && (
                  <div className="w-[1px] h-10 mt-12" style={{ backgroundColor: `${invitationData.primaryColor}30` }} />
                )}
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* --- COURT OF HONOR SECTION --- */}
      {features.courtOfHonor && (invitationData.courtOfHonor?.length || 0) > 0 && (
        <section id="court-of-honor" className="py-16 relative">
          <AnimatedSection>
            <h2 className="text-sm tracking-[0.3em] uppercase font-bold text-center mb-12" style={{ color: invitationData.primaryColor }}>
              The Court of Honor
            </h2>
          </AnimatedSection>

          {/* Horizontal scroll with hidden scrollbar classes */}
          <div className="flex justify-start items-stretch gap-5 overflow-x-auto snap-x snap-mandatory px-8 pb-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {invitationData.courtOfHonor?.map((member: CourtMember, idx: number) => (
              <div key={member.name} className="flex-none w-[65vw] max-w-[220px] snap-center first:ml-0 last:mr-8">
                <AnimatedSection delay={idx * 0.05}>
                  <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[2rem] shadow-xl shadow-black/5 bg-slate-200 group">
                    <Image 
                      src={member.photoUrl} 
                      alt={member.name} 
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105" 
                    />
                    {/* Strong dark gradient ensures names are always readable */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                    <div className="absolute bottom-0 left-0 w-full p-5 text-center">
                      <h4 className="text-xl font-bold tracking-tight text-white">{member.name}</h4>
                      <p className="text-[10px] uppercase tracking-widest mt-1 font-medium text-white/80">{member.role}</p>
                    </div>
                  </div>
                </AnimatedSection>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* --- SOCIAL MEDIA SECTION --- */}
      {features.socialMediaWall && (
        <section id="social-media" className="py-20 px-6 max-w-sm mx-auto text-center pb-32">
          <AnimatedSection>
            <div 
              className="p-10 rounded-[2.5rem] bg-white shadow-2xl shadow-slate-200/60 border border-slate-100"
            >
              <h2 
                className="text-3xl font-bold mb-4" 
                style={{ fontFamily: 'var(--font-playfair-display), serif', color: invitationData.textColor }}
              >
                Comparte tus momentos favoritos de la noche
              </h2>
              <p className="text-sm leading-relaxed mb-6 max-w-[250px] mx-auto opacity-70" style={{ color: invitationData.textColor }}>
                Ayúdanos a recopilar recuerdos de esta noche inolvidable. Sube tus fotos a nuestra galería compartida.
              </p>

              <a 
                href={photoDropUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-5 px-6 font-bold text-xs tracking-[0.15em] uppercase rounded-full inline-block active:scale-[0.98] transition-transform"
                style={{
                  backgroundColor: invitationData.primaryColor,
                  color: '#fff',
                  boxShadow: `0 8px 20px -5px ${invitationData.primaryColor}50`
                }}
              >
                Comparte tus fotos
              </a>

              <div className="mt-8 text-[11px] tracking-widest uppercase font-semibold opacity-40" style={{ color: invitationData.textColor }}>
                Gracias
              </div>
            </div>
          </AnimatedSection>
        </section>
      )}

      {/* RSVP Section */}
      <section className="py-20 px-6 max-w-sm mx-auto text-center pb-32">
        <AnimatedSection>
          <div className="p-10 rounded-[2.5rem] bg-white shadow-2xl shadow-slate-200/60 border border-slate-100">
            <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-playfair-display), serif', color: invitationData.textColor }}>
              Confirma tu asistencia
            </h2>
            {invitationId ? (
              <RsvpSection
                invitationId={invitationId}
                primaryColor={invitationData.primaryColor}
                textColor={invitationData.textColor}
              />
            ) : (
              <div className="text-center text-gray-500">
                <p>The RSVP form will be displayed here on the live invitation.</p>
              </div>
            )}
          </div>
        </AnimatedSection>
      </section>
    </div>
  );
}
