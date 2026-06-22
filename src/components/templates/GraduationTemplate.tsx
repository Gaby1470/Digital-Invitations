"use client";

import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { EditorData, TemplateConfig, TimelineItem } from '@/lib/types';
import { Feather } from 'lucide-react';
import Image from 'next/image';

// Smooth, organic fade-in utility
function GentleFade({ children, delay = 0, yOffset = 20 }: { children: React.ReactNode, delay?: number, yOffset?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: yOffset }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

type GraduationTemplateProps = {
  template: TemplateConfig;
  data: EditorData;
  invitationId?: string;
};

export default function GraduationTemplate({ template, data, invitationId }: GraduationTemplateProps) {
  const { defaultData, features } = template;
  const invitationData = { ...defaultData, ...data };
  const [guestName, setGuestName] = useState("");
  const [guestMessage, setGuestMessage] = useState("");
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'submitted' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async () => {
    if (!invitationId) {
      setErrorMessage('RSVP is not available in preview mode.');
      setFormState('error');
      return;
    }
    if (!guestName) {
      setErrorMessage('Please provide your name.');
      setFormState('error');
      return;
    }
    setFormState('submitting');
    setErrorMessage('');

    try {
      const response = await fetch(`/api/invitations/${invitationId}/rsvp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: guestName,
          status: 'ATTENDING',
          plus_ones: 0,
          message: guestMessage,
        }),
      });

      if (!response.ok) {
        throw new Error('Something went wrong. Please try again.');
      }
      setFormState('submitted');
    } catch (error: any) {
      setFormState('error');
      setErrorMessage(error.message);
    }
  };


  const eventDate = invitationData.event_date ? new Date(invitationData.event_date).toLocaleDateString('es-ES', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  }) : '';

  const colorPalette = {
    '--background': invitationData.backgroundColor || '#F9F8F6',
    '--text': invitationData.textColor || '#4A4B4D',
    '--primary': invitationData.primaryColor || '#8B8682',
    '--border': invitationData.borderColor || '#D4CEC4',
    '--selection': invitationData.selectionColor || '#E5E0D8',
    '--hero-subtitle': '#6B6B6B',
    '--hero-title': '#3A3B3C',
    '--placeholder': '#A39B8E',
  };

  return (
    <div 
      className="w-full font-serif text-[var(--text)] selection:bg-[var(--selection)]"
      style={{
        ...colorPalette,
        backgroundColor: 'var(--background)',
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.04'/%3E%3C/svg%3E")`
      }}
    >
      {/* Hero Section - Poetic & Minimal */}
      <section className="min-h-[90vh] w-full flex flex-col justify-center items-center text-center relative px-6 py-20">
        <div className="z-10 max-w-3xl flex flex-col items-center">
          
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8 opacity-80"
          >
            <Image 
              src="https://ykgyfxtzjedgastsuuaj.supabase.co/storage/v1/object/public/invitation-images/public/Graduation/graduation-cap.png" 
              alt="Graduation Cap" 
              width={150} 
              height={150} 
            />
          </motion.div>

          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1.5 }}
            className="text-sm md:text-base tracking-[0.25em] uppercase text-[var(--hero-subtitle)] mb-8 font-serif"
          >
            {invitationData.heroTitle || "Celebrando la Graduación de"}
          </motion.span>
          
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-6xl md:text-8xl lg:text-9xl tracking-normal mb-8 leading-tight text-[var(--hero-title)]"
            style={{ fontFamily: "'Great Vibes', 'Alex Brush', cursive" }} 
          >
            {invitationData.heroNames}
          </motion.h1>

          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1.5 }}
            className="text-sm md:text-base tracking-[0.2em] uppercase text-[var(--hero-subtitle)] font-serif"
          >
            {invitationData.degreeType || "Clase de 2026"}
          </motion.h2>
          
          <motion.div 
            initial={{ height: 0 }}
            animate={{ height: '50px' }}
            transition={{ delay: 1, duration: 1 }}
            className="w-[1px] bg-[var(--border)] mt-10"
          />
        </div>
      </section>

      {/* Timeline Section - Mobile Optimized */}
      <section className="py-24 px-6 md:px-12 relative">
        <div className="max-w-3xl mx-auto">
          <GentleFade>
            <h2 className="text-3xl md:text-4xl font-light text-center mb-20 tracking-wide">
              Horario de la Ceremonia
            </h2>
          </GentleFade>
          
          <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 md:before:mx-auto before:-translate-x-px md:before:translate-x-0 before:h-full before:w-[1px] before:bg-gradient-to-b before:from-transparent before:via-[var(--border)] before:to-transparent">
            {invitationData.timelineItems?.map((item: TimelineItem, index: number) => (
              <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-[var(--selection)] bg-[var(--background)] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                  <div className="w-2 h-2 bg-[var(--primary)] rounded-full" />
                </div>

                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-4 rounded-xl transition-all">
                  <GentleFade delay={index * 0.1}>
                    <div className="flex flex-col md:group-odd:text-right">
                      <span className="font-sans text-xl font-medium tracking-[0.15em] text-[var(--primary)] uppercase mb-2">
                        {item.time}
                      </span>
                      <h3 className="text-2xl font-normal text-[var(--text)] mb-1">{item.title}</h3>
                      <p className="text-base font-sans">{item.location}</p>
                    </div>
                  </GentleFade>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Photo Gallery - Horizontal Scroll for Mobile */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <GentleFade>
            <h2 className="text-3xl md:text-4xl font-light text-center mb-4 tracking-wide">Captured Moments</h2>
             <p className="text-center text-lg text-[var(--primary)] mb-12">{eventDate}</p>
          </GentleFade>
          <div className="flex overflow-x-auto snap-x snap-mandatory md:grid md:grid-cols-4 gap-6 pb-8 md:pb-0 hide-scrollbar">
            {invitationData.galleryImages?.slice(0, 4).map((image: string, index: number) => (
              <div key={index} className="min-w-[80vw] md:min-w-0 snap-center shrink-0">
                <GentleFade delay={index * 0.15}>
                  <div className="aspect-[4/5] relative rounded-lg overflow-hidden bg-[var(--selection)] shadow-sm">
                    <Image src={image} alt={`Gallery image ${index + 1}`} layout="fill" objectFit="cover" className="hover:scale-105 transition-transform duration-700 ease-out" />
                  </div>
                </GentleFade>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guestbook Section - Soft & Welcoming */}
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto">
          <GentleFade>
            <div className="bg-white/40 backdrop-blur-sm border border-[var(--selection)] p-8 md:p-14 rounded-2xl shadow-sm">
              <div className="flex flex-col items-center justify-center gap-4 mb-10">
                <Feather className="text-[var(--primary)]" size={28} strokeWidth={1} />
                <h2 className="text-2xl md:text-3xl font-light text-center">Palabras de inspiración para el graduado</h2>
              </div>
              
              {formState === 'submitted' ? (
                <div className="text-center">
                  <h3 className="text-2xl font-bold" style={{ color: 'var(--primary)' }}>¡Gracias!</h3>
                  <p>Tu mensaje ha sido enviado.</p>
                </div>
              ) : (
                <div className="space-y-6 font-sans">
                   <input
                    type="text"
                    className="w-full p-3 bg-transparent border-b border-[var(--border)] focus:border-[var(--primary)] outline-none transition-all"
                    placeholder="Tu nombre"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                  />
                  <textarea 
                    className="w-full p-5 bg-transparent border-b border-[var(--border)] focus:border-[var(--primary)] outline-none transition-all min-h-[140px] text-[var(--text)] placeholder:text-[var(--placeholder)] resize-none"
                    placeholder="Escribe tus mejores deseos, consejos o recuerdos para el graduado..."
                    value={guestMessage}
                    onChange={(e) => setGuestMessage(e.target.value)}
                  />
                  {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}
                  <div className="flex justify-center">
                    <button 
                      className="px-10 py-4 text-[var(--text)] border border-[var(--text)] text-xs font-medium uppercase tracking-[0.2em] rounded hover:bg-[var(--text)] hover:text-white transition-colors duration-300 disabled:opacity-50"
                      onClick={handleSubmit}
                      disabled={formState === 'submitting'}
                    >
                      {formState === 'submitting' ? 'Enviando...' : 'Compartir Mensaje'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </GentleFade>
        </div>
      </section>
      
      {/* Future Plans Section - Grounded Footer */}
      {features.futurePlans && invitationData.futurePlans && (
        <section className="border-t border-[var(--border)]">
          <div className="max-w-3xl mx-auto px-6 py-24 text-center">
            <GentleFade>
              <h2 className="text-xs uppercase tracking-[0.25em] text-[var(--primary)] mb-6 font-sans">Planes Futuros</h2>
              <p className="text-xl md:text-2xl font-light leading-relaxed italic text-[var(--text)] opacity-90">
                &quot;{invitationData.futurePlans}&quot;
              </p>
            </GentleFade>
          </div>
        </section>
      )}
    </div>
  );
}
