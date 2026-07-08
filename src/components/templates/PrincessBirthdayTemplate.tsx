"use client";

import { motion, useInView } from 'framer-motion';
import { useMemo, useRef } from 'react';
import { EditorData, TemplateConfig } from '@/lib/types';

import Image from 'next/image';

// Soft, elegant fade-in animation suitable for a princess theme
function GentleFadeIn({ children, delay = 0, direction = "up" }: { children: React.ReactNode, delay?: number, direction?: "up" | "none" }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-20px" });

  const yOffset = direction === "up" ? 25 : 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: yOffset }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, ease: "easeOut", delay }}
      className="w-full flex justify-center"
    >
      {children}
    </motion.div>
  );
}

// Floating sparkle effect for the background
function FloatingSparkles() {
  const sparkles = useMemo(() => {
    return [...Array(8)].map(() => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      duration: 3 + Math.random() * 3,
      delay: Math.random() * 2,
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {sparkles.map((style, i) => (
        <motion.div
          key={i}
          className="absolute text-yellow-500/50 text-xl sm:text-2xl drop-shadow-sm"
          style={{
            top: style.top,
            left: style.left,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.1, 0.9, 0.1],
            scale: [0.7, 1.2, 0.7],
          }}
          transition={{
            duration: style.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: style.delay,
          }}
        >
          ✨
        </motion.div>
      ))}
    </div>
  );
}

type PrincessBirthdayTemplateProps = {
  template: TemplateConfig;
  data: EditorData;
};

export default function PrincessBirthdayTemplate({ template, data }: PrincessBirthdayTemplateProps) {
  const { defaultData, font } = template;
  const invitationData = { ...defaultData, ...data };
  
  // Design system: Blush pinks, champagne gold, elegant serif
  const theme = {
    bg: invitationData.backgroundColor || '#FDF6F8', // Fallback color
    textPrimary: invitationData.textPrimary || '#C28B96', // Dusty rose pink for scripts
    textGold: invitationData.textGold || '#B89766', // Champagne gold for headings
    textDark: invitationData.textDark || '#5A4A42', // Soft dark brown for readability
    cardBg: 'rgba(255, 255, 255, 0.65)', // Glassmorphism base
  };

  return (
    <div className={`w-full min-h-screen overflow-x-hidden relative pb-48 ${font}`} style={{ backgroundColor: theme.bg }}>

      {/* Background Image Layer */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/pinkBackground.jpg)' }}
      />
      {/* Subtle overlay to ensure the text and cards remain readable over the image */}
      <div className="absolute inset-0 z-0 bg-white/30 pointer-events-none" />

      <FloatingSparkles />

      {/* Decorative Castle - Fixed to bottom */}
      <div className="absolute bottom-0 left-0 w-full flex justify-center pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/40 opacity-30" />
        <div className="w-full max-w-[450px] h-[450px] relative">
          <Image 
            src="/castillo.png" 
            alt="Royal Castle" 
            fill
            className="object-contain opacity-80 drop-shadow-2xl" 
          />
        </div>
      </div>

      {/* Pink Bow Image Fixed at the Very Top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20 w-full flex justify-center mt-4">
        <GentleFadeIn direction="none">
          <div className="w-full max-w-xs h-24 relative">
            <Image 
              src="/pink-bow.png" 
              alt="Decorative Bow" 
              fill
              className="object-contain drop-shadow-md" 
            />
          </div>
        </GentleFadeIn>
      </div>

      {/* CONTENT LAYER */}
      <div className="relative z-10 max-w-md mx-auto flex flex-col items-center px-6 pt-48 text-center font-serif">

        {/* Header Strings */}
        <GentleFadeIn delay={0.2}>
          <div className="mb-8 flex flex-col items-center w-full">
            <p className="text-[1.75rem] italic tracking-wider mb-1" style={{ color: theme.textPrimary, fontFamily: "'Dancing Script', cursive" }}>
              {invitationData.age ? `Acompañanos a celebrar los ${invitationData.age} años de la` : "Había una vez..."}
            </p>
            <h2 className="text-4xl sm:text-5xl font-light tracking-[0.2em] uppercase" style={{ color: theme.textGold }}>
              Princesa
            </h2>
            <p className="mt-5 text-[10px] sm:text-xs tracking-[0.25em] uppercase font-semibold" style={{ color: theme.textDark }}>
              Sera una fiesta real llena de magia y diversión!
            </p>
            <h1 className="text-5xl sm:text-6xl mt-2 italic drop-shadow-sm" style={{ color: theme.textPrimary, fontFamily: "'Dancing Script', cursive" }}>
              {invitationData.heroNames ? `${invitationData.heroNames}'s Birthday` : "Olivia's Birthday"}
            </h1>
          </div>
        </GentleFadeIn>

        {/* Hero Section: Royal Portrait (Kid Photo) */}
        <GentleFadeIn delay={0.4}>
          <div className="w-full mb-12 relative flex flex-col items-center">

            {/* The Floating Name Badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 bg-white/95 backdrop-blur-md px-6 py-1.5 rounded-full border border-[#E6D089] shadow-md">
              <span className="text-lg tracking-wide" style={{ color: theme.textDark, fontFamily: "'Dancing Script', cursive" }}>
                {invitationData.heroNames || "Olivia"}
              </span>
            </div>

            {/* Elegant oval frame with gold border */}
            <div className="w-52 h-72 relative z-10 p-1 rounded-t-full rounded-b-full bg-gradient-to-b from-[#E6D089] to-[#AA7F39] shadow-[0_15px_35px_rgba(184,151,102,0.25)]">
              <div className="w-full h-full bg-white rounded-t-full rounded-b-full overflow-hidden border-4 border-white relative">
                {invitationData.photoUrl ? (
                  <Image 
                    src={invitationData.photoUrl} 
                    alt={invitationData.heroNames || "Royal Portrait"}
                    fill
                    className="object-cover" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#FCF1F1]">
                    <span className="text-[#C28B96] font-medium text-xs tracking-widest uppercase text-center px-4">Royal Portrait</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </GentleFadeIn>

        {/* Event Details: Glassmorphism Card */}
        <section className="w-full mb-6">
          <GentleFadeIn delay={0.6}>
            <div className="backdrop-blur-md rounded-[2.5rem] p-8 border border-white/80 shadow-[0_8px_32px_rgba(194,139,150,0.15)] relative w-full" style={{ backgroundColor: theme.cardBg }}>

              <div className="flex flex-col gap-5 text-center">

                {/* Date & Time block */}
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] mb-1.5 font-medium" style={{ color: theme.textGold }}>
                    {invitationData.event_date ? new Date(invitationData.event_date).toLocaleDateString('es-MX', { weekday: 'long' }) : "Miércoles"}
                  </p>
                  <p className="text-3xl font-light tracking-widest mb-2" style={{ color: theme.textDark }}>
                    {invitationData.event_date ? new Date(invitationData.event_date).toLocaleDateString('es-MX', { month: 'long', day: 'numeric' }) : "22 de Julio"}
                  </p>
                  <p className="text-sm font-medium tracking-[0.15em]" style={{ color: theme.textGold }}>
                    {invitationData.startTime && invitationData.endTime ? `${invitationData.startTime} - ${invitationData.endTime}` : (invitationData.time || "12:00 PM - 2:00 PM")}
                  </p>
                </div>

                <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-[#C28B96] to-transparent mx-auto opacity-40" />

                {/* Location */}
                <div>
                  <p className="text-[11px] uppercase tracking-[0.25em] mb-2 font-semibold" style={{ color: theme.textGold }}>
                    Ubicación de la Fiesta
                  </p>
                  <p className="text-xl font-light leading-relaxed px-2 tracking-wide" style={{ color: theme.textDark }}>
                    {invitationData.location || "William's Residence\n876 Street Ln, Boulder CO"}
                  </p>
                </div>

              </div>
            </div>
          </GentleFadeIn>
        </section>

        {/* Royal Decree (Parental Info) */}
        {(invitationData.parentalNotes || invitationData.extraInfo) && (
          <section className="w-full mb-8">
            <GentleFadeIn delay={0.7}>
              <div className="px-6 py-5 rounded-3xl border border-white/60 bg-white/50 backdrop-blur-sm shadow-sm w-full max-w-[90%] mx-auto relative overflow-hidden">
                <h3 className="text-[xl uppercase tracking-[0.25em] mb-2 font-bold relative z-10" style={{ color: theme.textGold }}>
                  Reglamento Real
                </h3>
                <p className="text-s sm:text-sm font-light italic leading-relaxed relative z-10" style={{ color: theme.textDark }}>
                  {invitationData.parentalNotes || invitationData.extraInfo || "¡Favor de asistir con su mejor atuendo real!"}
                </p>
              </div>
            </GentleFadeIn>
          </section>
        )}

        {/* Side-by-Side RSVP Section */}
        <section className="w-full mt-2 z-20">
          <GentleFadeIn delay={0.8}>
            <div className="flex flex-row items-center justify-between gap-4 w-full bg-white/40 p-2 rounded-full border border-white/50 backdrop-blur-sm shadow-lg">

              {/* Gold Pill Button */}
              <button 
                className="flex-1 text-white font-medium text-xs sm:text-sm py-4 px-2 rounded-full shadow-[0_4px_15px_rgba(184,151,102,0.4)] active:scale-[0.98] transition-transform uppercase tracking-widest border border-white/30"
                style={{ background: 'linear-gradient(135deg, #D4AF37 0%, #B89766 50%, #996515 100%)' }}
                onClick={() => alert("RSVP seleccionado!")}
              >
                RSVP para la fiesta
              </button>

              {/* RSVP Text Block aligned right */}
              <div className="flex-1 text-right pr-4">
                <p className="text-[9px] sm:text-[10px] tracking-[0.15em] uppercase leading-relaxed font-semibold opacity-70" style={{ color: theme.textDark }}>
                  Por favor responde antes del <br/>
                  <span className="text-xs sm:text-sm tracking-widest text-[#B89766]">{invitationData.rsvpDateText || "15 de julio"}</span>
                </p>
              </div>

            </div>
          </GentleFadeIn>
        </section>

      </div>
    </div>
  );
}