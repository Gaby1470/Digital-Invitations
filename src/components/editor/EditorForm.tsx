"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { TimelineItem, CourtMember, TemplateConfig, EditorData } from "@/lib/custom_types";
import Image from "next/image";
import { 
  CalendarPlus, 
  MapPin, 
  Navigation, 
  Music, 
  Music3, 
  Gift, 
  Shirt, 
  Clock 
} from "lucide-react";
import { RsvpTrigger } from "@/components/templates/shared/RsvpTrigger";

function AnimatedSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px 0px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

// --- NEW: Countdown Component ---
function Countdown({ targetDate, color }: { targetDate: string; color: string }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      const difference = new Date(targetDate).getTime() - new Date().getTime();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="flex justify-center gap-6 my-8">
      {[
        { label: "Días", value: timeLeft.days },
        { label: "Hrs", value: timeLeft.hours },
        { label: "Min", value: timeLeft.minutes }
      ].map((item, idx) => (
        <div key={idx} className="flex flex-col items-center">
          <span className="text-3xl font-bold font-serif" style={{ color }}>
            {item.value.toString().padStart(2, '0')}
          </span>
          <span className="text-[9px] uppercase tracking-widest opacity-60 mt-1">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}

type EditorFormProps = {
  template: TemplateConfig;
  data: EditorData;
  invitationId?: string;
  onRsvpClick?: () => void;
  onDataChange: React.Dispatch<React.SetStateAction<EditorData | null>>;
  onSave: () => Promise<void>;
  viewMode: 'editor' | 'preview';
  onViewModeChange: React.Dispatch<React.SetStateAction<'editor' | 'preview'>>;
  isSaving: boolean;
};

export default function EditorForm({ template, data, invitationId, onRsvpClick, onDataChange, onSave, viewMode, onViewModeChange, isSaving }: EditorFormProps) {
  const { defaultData, features } = template;
  const invitationData = { ...defaultData, ...data };
  const [isPlaying, setIsPlaying] = useState(false);

  const heroImageUrl = invitationData.hero_image_url || "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=2071&auto=format&fit=crop";

  return (
    <div 
      className="w-full min-h-screen antialiased overflow-x-hidden selection:bg-pink-500/30 relative pb-28"
      style={{
        backgroundColor: invitationData.backgroundColor,
        fontFamily: 'var(--font-montserrat), sans-serif',
        color: invitationData.textColor
      }}
    >
      {/* --- NEW: Floating Audio Player --- */}
      {features.audio && (
        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          className="fixed top-6 right-6 z-50 w-10 h-10 bg-white/20 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center text-white shadow-lg"
        >
          {isPlaying ? <Music3 size={18} className="animate-pulse" /> : <Music size={18} />}
        </button>
      )}

      {/* --- HERO SECTION --- */}
      <section className="relative h-[90svh] min-h-[600px] w-full flex flex-col justify-end pb-16 items-center px-6 text-center overflow-hidden bg-slate-900 rounded-b-[3rem] shadow-xl">
        <div className="absolute inset-0 z-0">
          <Image 
            src={heroImageUrl} 
            fill
            priority
            className="object-cover object-center opacity-80"
            alt="Celebration background"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        </div>

        <div className="z-10 w-full max-w-sm">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-[10px] uppercase font-bold tracking-[0.4em] mb-4 text-white/90"
          >
            {invitationData.heroTitle || "Mis Quince Años"}
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-7xl font-bold leading-none mb-6 text-white"
            style={{ fontFamily: 'var(--font-playfair-display), serif' }}
          >
            {invitationData.heroNames || "Valentina"}
          </motion.h1>
          
          {invitationData.event_date && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
              <p className="text-white/80 tracking-widest uppercase text-xs mb-2">
                 {new Date(invitationData.event_date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* --- NEW: COUNTDOWN --- */}
      {invitationData.event_date && (
        <AnimatedSection delay={0.2}>
          <Countdown targetDate={invitationData.event_date} color={invitationData.primaryColor} />
        </AnimatedSection>
      )}

      {/* --- NEW: LOCATION & MAP EMBED --- */}
      <section className="px-6 py-12 max-w-md mx-auto">
        <AnimatedSection>
          <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-50 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full" style={{ backgroundColor: invitationData.primaryColor }} />
            
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-full" style={{ backgroundColor: `${invitationData.primaryColor}15`, color: invitationData.primaryColor }}>
                <MapPin size={20} />
              </div>
              <h2 className="text-xl font-bold font-serif">La Recepción</h2>
            </div>
            
            <p className="text-sm font-semibold mb-1">{invitationData.venueName || "Salón de Eventos Las Perlas"}</p>
            <p className="text-xs opacity-70 mb-6">{invitationData.venueAddress || "Av. Revolución 1234, Zona Centro"}</p>
            
            {/* Google Maps Iframe */}
            <div className="w-full h-48 bg-slate-100 rounded-xl mb-4 overflow-hidden relative">
              {/* Replace src with dynamic invitationData.mapUrl if available */}
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3364.502010834164!2d-117.03960012351473!3d32.51268619747515!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80d94856f6ba3a6b%3A0x6fb8785368a5c378!2sTijuana%2C%20B.C.%2C%20Mexico!5e0!3m2!1sen!2sus!4v1707000000000!5m2!1sen!2sus" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={false} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <div className="flex gap-3">
              <a href={invitationData.googleMapsLink || "#"} target="_blank" rel="noreferrer" 
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold uppercase tracking-wide text-white transition-transform active:scale-95"
                style={{ backgroundColor: invitationData.primaryColor }}>
                <Navigation size={14} /> Cómo llegar
              </a>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* --- ITINERARY / TIMELINE --- */}
      <section className="py-8 px-8 max-w-md mx-auto">
        <AnimatedSection>
          <div className="flex items-center gap-3 mb-8">
            <Clock size={20} style={{ color: invitationData.primaryColor }} />
            <h2 className="text-xl font-bold font-serif">Itinerario</h2>
          </div>
        </AnimatedSection>

        <div className="relative pl-6 space-y-10 border-l-2" style={{ borderColor: `${invitationData.primaryColor}30` }}>
          {invitationData.timelineItems?.map((item: TimelineItem, index: number) => (
            <AnimatedSection key={index} delay={index * 0.1}>
              <div className="relative">
                <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full border-4 border-white" style={{ backgroundColor: invitationData.primaryColor }} />
                <span className="text-[10px] font-bold tracking-widest uppercase mb-1 opacity-70 block" style={{ color: invitationData.primaryColor }}>
                  {item.time}
                </span>
                <h3 className="text-lg font-bold font-serif mb-1">{item.title}</h3>
                <p className="text-xs opacity-70">{item.location}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* --- NEW: DRESS CODE & REGISTRY GRID --- */}
      <section className="px-6 py-12 max-w-md mx-auto grid grid-cols-2 gap-4">
        {/* Dress Code Card */}
        <AnimatedSection delay={0.1}>
          <div className="bg-white/50 border border-slate-200 p-6 rounded-3xl h-full flex flex-col items-center text-center justify-center">
            <Shirt size={28} className="mb-3 opacity-80" style={{ color: invitationData.primaryColor }} />
            <h3 className="text-sm font-bold uppercase tracking-wider mb-2">Dress Code</h3>
            <p className="text-xs opacity-70">{invitationData.dressCode || "Formal. Traje y Vestido Largo."}</p>
          </div>
        </AnimatedSection>

        {/* Gift / Registry Card */}
        <AnimatedSection delay={0.2}>
          <div className="bg-white/50 border border-slate-200 p-6 rounded-3xl h-full flex flex-col items-center text-center justify-center">
            <Gift size={28} className="mb-3 opacity-80" style={{ color: invitationData.primaryColor }} />
            <h3 className="text-sm font-bold uppercase tracking-wider mb-2">Regalos</h3>
            <button className="mt-2 text-[10px] font-bold uppercase tracking-widest border-b" style={{ color: invitationData.primaryColor, borderColor: invitationData.primaryColor }}>
              Ver Mesa
            </button>
          </div>
        </AnimatedSection>
      </section>

      {/* --- FOOTER --- */}
      <footer className="text-center pb-8 pt-4">
        <p className="text-[9px] tracking-widest uppercase opacity-40 font-bold">
          Powered by Tap to Invite
        </p>
      </footer>

      {/* --- STICKY RSVP FAB --- */}
      {onRsvpClick && (
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 200, damping: 20 }}
          className="fixed bottom-6 left-0 right-0 px-6 z-50 flex justify-center pointer-events-none"
        >
          <div className="pointer-events-auto w-full max-w-sm shadow-2xl shadow-black/20 rounded-full bg-white p-1">
            <RsvpTrigger onClick={onRsvpClick} primaryColor={invitationData.primaryColor} />
          </div>
        </motion.div>
      )}
    </div>
  );
}