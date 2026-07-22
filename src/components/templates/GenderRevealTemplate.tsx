"use client";

import { motion, useInView, AnimatePresence, TargetAndTransition } from 'framer-motion';
import { useRef, useState } from 'react';
import Image from 'next/image';
import { EditorData, TemplateConfig, TimelineItem } from '@/lib/types';
import { MapPin } from 'lucide-react';
import { RsvpTrigger } from "./shared/RsvpTrigger";

/**
 * Enhanced FadeIn for organic baby-themed entries.
 */
function FadeIn({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px 0px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

type GenderRevealTemplateProps = {
  template: TemplateConfig;
  data: EditorData;
  onRsvpClick?: () => void;
};

export default function GenderRevealTemplate({ template, data, onRsvpClick }: GenderRevealTemplateProps) {
  const { defaultData, features } = template;
  const invitationData = { ...defaultData, ...data };
  const [team, setTeam] = useState<'boy' | 'girl' | null>(null);

  const mapSrc = invitationData.mainVenueAddress
    ? `https://maps.google.com/maps?q=${encodeURIComponent(invitationData.mainVenueAddress)}&t=&z=13&ie=UTF8&iwloc=&output=embed`
    : "";
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(invitationData.mainVenueAddress || '')}`;

  const date = invitationData.event_date ? new Date(invitationData.event_date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }) : '';

  // Floating animation configuration for the balloons
  const floatAnimation = (yValue: number, duration: number): TargetAndTransition => ({
    y: [0, yValue, 0],
    rotate: [-1, 1, -1],
    transition: {
      duration: duration,
      repeat: Infinity,
      ease: "easeInOut"
    }
  });

  return (
    <div 
      className="w-full font-sans overflow-x-hidden min-h-screen relative selection:bg-amber-100"
      style={{
        backgroundColor: invitationData.backgroundColor,
        color: invitationData.textColor
      }}
    >
      {/* Whimsical Sunset Background Elements */}
      <div className="absolute top-0 left-0 right-0 h-[100vh] bg-gradient-to-b from-[#FAD0C4] via-[#FFD1FF] to-[#FFF9F5] opacity-40 pointer-events-none z-0" />

      {/* Hero Section with Floating Balloons */}
      <section className="min-h-[85vh] sm:h-screen w-full flex flex-col justify-center items-center relative overflow-hidden px-4 py-12 bg-gradient-to-b from-[#FFF0FA] via-[#F4FAFF] to-[#FFF9F5]">

        {/* Balloon Layer */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {/* Left Side - Pastel Pink / Rose Balloons */}
          <motion.div 
            animate={floatAnimation(-15, 6)}
            className="absolute top-12 left-[-20px] sm:left-10 w-28 h-36 sm:w-40 sm:h-52 rounded-full opacity-80 blur-[0.5px] shadow-[inset_-8px_-12px_20px_rgba(0,0,0,0.06)]"
            style={{ 
              borderRadius: '50% 50% 50% 50% / 40% 40% 60% 60%',
              backgroundColor: invitationData.textColor 
            }}
          >
            <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px]" style={{borderBottomColor: invitationData.textColor}} />
          </motion.div>
          <motion.div 
            animate={floatAnimation(-25, 7)}
            className="absolute top-36 left-12 sm:left-32 w-20 h-26 sm:w-28 sm:h-36 rounded-full opacity-60 blur-[1px]"
            style={{ 
              borderRadius: '50% 50% 50% 50% / 40% 40% 60% 60%',
              backgroundColor: invitationData.textColor
            }}
          >
            <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[7px]" style={{borderBottomColor: invitationData.textColor}} />
          </motion.div>

          {/* Right Side - Baby Blue / Sky Balloons */}
          <motion.div 
            animate={floatAnimation(-18, 6.5)}
            className="absolute top-8 right-[-20px] sm:right-10 w-28 h-36 sm:w-40 sm:h-52 rounded-full opacity-80 blur-[0.5px] shadow-[inset_-8px_-12px_20px_rgba(0,0,0,0.06)]"
            style={{ 
              borderRadius: '50% 50% 50% 50% / 40% 40% 60% 60%',
              backgroundColor: invitationData.primaryColor
            }}
          >
            <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px]" style={{borderBottomColor: invitationData.primaryColor}}/>
          </motion.div>
          <motion.div 
            animate={floatAnimation(-22, 5.8)}
            className="absolute top-40 right-10 sm:right-36 w-20 h-26 sm:w-28 sm:h-36 rounded-full opacity-60 blur-[1px]"
            style={{ 
              borderRadius: '50% 50% 50% 50% / 40% 40% 60% 60%',
              backgroundColor: invitationData.primaryColor
            }}
          >
            <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[7px]" style={{borderBottomColor: invitationData.primaryColor}}/>
          </motion.div>

          {/* Subtle Confetti Dots */}
          <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full opacity-40 animate-ping" style={{backgroundColor: invitationData.textColor}}/>
          <div className="absolute top-1/3 right-1/4 w-3 h-3 rounded-full opacity-40 animate-pulse" style={{backgroundColor: invitationData.primaryColor}}/>
        </div>

        {/* Hero Content */}
        <motion.div 
          className="z-10 text-center max-w-xl mx-auto flex flex-col items-center justify-center pt-8"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <span 
            className="bg-white/80 backdrop-blur-md px-5 py-2 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] shadow-sm mb-6 inline-block text-amber-800/80 border border-amber-100/60"
          >
            {invitationData.heroTitle || "¿Niño o Niña? • Gender Reveal"}
          </span>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-black tracking-tight px-2 leading-tight drop-shadow-sm" style={{color: invitationData.textColor}}>
            {invitationData.heroNames}
          </h1>

          <div className="w-16 h-[2px] bg-gradient-to-r from-pink-300 via-amber-200 to-sky-300 my-6 rounded-full" />

          <p className="text-sm sm:text-base font-medium opacity-70 max-w-xs sm:max-w-md italic px-4">
            Acompañanos a celebrar la dulce espera de nuestro bebé con una divertida revelación de género. ¡Será un día lleno de amor, risas y sorpresas!
          </p>

          {date && (
            <p className="text-2xl sm:text-3xl font-serif font-bold mt-6 tracking-wider" style={{color: invitationData.textColor}}>
              {date}
            </p>
          )}
        </motion.div>
      </section>

      {/* Meet the Parents Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 relative z-10 bg-white/60 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <FadeIn>
              <div className="relative mx-auto max-w-xs sm:max-w-sm md:max-w-none group">
                <div className="absolute -inset-3 rounded-[2.5rem] rotate-2 bg-gradient-to-tr from-pink-200/50 via-amber-100/50 to-sky-200/50 group-hover:rotate-0 transition-transform duration-500" />
                <div className="relative overflow-hidden rounded-[2rem] shadow-xl border-8 border-white aspect-[4/5]">
                  <Image 
                    src={invitationData.family_image_url || 'https://ykgyfxtzjedgastsuuaj.supabase.co/storage/v1/object/public/invitation-images/public/gender-reveal/gender-1.jpg'} 
                    alt="The Happy Family"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div className="space-y-5 text-center md:text-left px-2">
                <h2 className="text-3xl sm:text-4xl font-black italic" style={{color: invitationData.textColor}}>Los papás</h2>
                <p className="text-base sm:text-lg leading-relaxed font-light opacity-90">
                  {invitationData.parentsDescription}
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Details / Itinerary Section */}
      <section className="py-20 px-4 sm:px-6 rounded-t-[3rem] sm:rounded-t-[4rem] relative z-10 bg-gradient-to-b from-[#FFF2EC] to-[#FFF9F5]">
        <div className="max-w-3xl mx-auto text-center">
          <FadeIn>
            <h2 className="text-3xl sm:text-4xl font-bold mb-12" style={{color: invitationData.textColor}}>
              {invitationData.timelineTitle || "The Big Day Itinerary"}
            </h2>
            <div className="space-y-4 max-w-md mx-auto">
              {invitationData.timelineItems?.map((item: TimelineItem, index: number) => (
                <div key={index} className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-orange-50/50 relative overflow-hidden group text-left flex flex-col justify-center">
                  <div className="absolute top-3 right-4 text-3xl opacity-15">
                    {index % 2 === 0 ? '🎁' : '🎉'}
                  </div>
                  <p className="font-bold text-xs sm:text-sm tracking-wider uppercase text-amber-700/80 mb-1">{item.time}</p>
                  <h3 className="text-lg font-bold break-words [overflow-wrap:anywhere] whitespace-normal pr-6" style={{color: invitationData.textColor}}>
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm italic opacity-70 mt-1">{item.location}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

{/* Enhanced Map Section */}
      {mapSrc && (
        <section className="py-20 px-4 sm:px-6 relative z-10">
          <div className="max-w-xl mx-auto">
            <FadeIn>
              <div className="bg-white/70 backdrop-blur-xl rounded-[3rem] p-6 sm:p-10 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] border border-white relative overflow-hidden text-center">
                
                {/* Subtle Decorative Ambient Background Glows inside the card */}
                <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full blur-3xl opacity-40 pointer-events-none" style={{ backgroundColor: invitationData.textColor }} />
                <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-40 pointer-events-none" style={{ backgroundColor: invitationData.primaryColor }} />

                <div className="relative z-10">
                  {/* Elevated Pin Icon */}
                  <div 
                    className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-xl border-4 border-white"
                    style={{ backgroundColor: invitationData.textColor }} 
                  >
                    <MapPin className="w-7 h-7 text-white drop-shadow-md" />
                  </div>

                  <h3 className="text-3xl font-black mb-2" style={{color: invitationData.textColor}}>
                    {invitationData.locationName || "Ubicación"}
                  </h3>
                  
                  <p className="text-base font-medium mb-8 px-2 opacity-80" style={{color: invitationData.textColor}}>
                    {invitationData.mainVenueAddress}
                  </p>

                  {/* Framed Map */}
                  <div className="relative w-full h-[260px] sm:h-[320px] rounded-[2rem] overflow-hidden shadow-inner bg-slate-100 border-[6px] border-white mb-8 group">
                    {/* Subtle tint overlay to blend map with pastel theme */}
                    <div className="absolute inset-0 pointer-events-none mix-blend-color z-10 opacity-30 transition-opacity group-hover:opacity-0" style={{ backgroundColor: invitationData.textColor }} />
                    <iframe
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      loading="lazy"
                      allowFullScreen
                      referrerPolicy="no-referrer-when-downgrade"
                      src={mapSrc}
                    />
                  </div>

                  {/* Big Tappable Action Button */}
                  <a 
                    href={googleMapsUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 rounded-full text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-white shadow-lg active:scale-95 transition-transform"
                    style={{ 
                      backgroundColor: invitationData.textColor, 
                      boxShadow: `0 10px 25px -5px ${invitationData.textColor}80` 
                    }}
                  >
                    Abrir en Google Maps
                  </a>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      {/* Creative Gender Betting Section */}
      {features.genderBetting && (
        <section className="py-20 px-4 sm:px-6 bg-gradient-to-b from-[#FFF9F5] via-[#FFF0FA] to-[#F5FCFF] rounded-b-[3rem]">
          <FadeIn>
            <div className="text-center mb-10">
              <h2 className="text-3xl sm:text-4xl font-black italic" style={{color: invitationData.textColor}}>¿Niño o Niña?</h2>
              <p className="text-sm sm:text-base opacity-70 mt-2">¡Elige una opción y descubre tu misión especial en la fiesta!</p>
            </div>

            <div className="max-w-2xl mx-auto">
              <AnimatePresence mode="wait">
                {!team ? (
                  <motion.div 
                    key="selector"
                    exit={{ opacity: 0, y: -10 }}
                    className="grid grid-cols-2 gap-4 sm:gap-6"
                  >
                    {/* Team Boy Button */}
                    <button 
                      onClick={() => setTeam('boy')}
                      className="group relative h-48 sm:h-60 rounded-3xl overflow-hidden shadow-md active:scale-98 transition-transform border"
                      style={{backgroundColor: invitationData.primaryColor, color: '#fff', borderColor: `${invitationData.primaryColor}80`}}
                    >
                      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                      <div className="relative z-10 flex flex-col items-center justify-center h-full p-3 text-center">
                        <span className="text-4xl sm:text-5xl mb-2 drop-shadow-sm">🚗</span>
                        <span className="text-lg sm:text-xl font-bold tracking-tight">Equipo Niño</span>
                      </div>
                    </button>

                    {/* Team Girl Button */}
                    <button 
                      onClick={() => setTeam('girl')}
                      className="group relative h-48 sm:h-60 rounded-3xl overflow-hidden shadow-md active:scale-98 transition-transform border"
                      style={{backgroundColor: invitationData.textColor, color: '#fff', borderColor: `${invitationData.textColor}80`}}
                    >
                      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/hearts-of-love.png')] opacity-10" />
                      <div className="relative z-10 flex flex-col items-center justify-center h-full p-3 text-center">
                        <span className="text-4xl sm:text-5xl mb-2 drop-shadow-sm">🌸</span>
                        <span className="text-lg sm:text-xl font-bold tracking-tight">Equipo Niña</span>
                      </div>
                    </button>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="result"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`p-8 sm:p-12 rounded-3xl text-center shadow-lg border`}
                    style={{
                      backgroundColor: team === 'boy' ? invitationData.primaryColor : invitationData.textColor,
                      color: '#fff',
                      borderColor: team === 'boy' ? `${invitationData.primaryColor}80` : `${invitationData.textColor}80`,
                    }}
                  >
                    <div className="text-5xl sm:text-6xl mb-4 animate-bounce">{team === 'boy' ? '🎖️' : '👑'}</div>
                    <h3 className="text-2xl sm:text-3xl font-black mb-2">
                      Bienvenidos a {team === 'boy' ? 'Team Boy' : 'Team Girl'}!
                    </h3>
                    <p className="text-sm sm:text-base opacity-90 max-w-md mx-auto leading-relaxed mb-8">
                      Tu objetivo de celebración: Por favor trae un paquete de <span className="font-bold underline">{team === 'boy' ? (invitationData.teamBoyProduct || 'pañales') : (invitationData.teamGirlProduct || 'toallas para bebé')}</span> a la fiesta. ¡Gracias por tu amor!
                    </p>
                    <button 
                      onClick={() => setTeam(null)} 
                      className="text-[10px] font-bold uppercase tracking-widest bg-white/60 hover:bg-white/80 active:bg-white/40 px-5 py-2.5 rounded-full shadow-sm transition-colors"
                      style={{color: team === 'boy' ? invitationData.primaryColor : invitationData.textColor}}
                    >
                      Cambiar elección
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </FadeIn>
        </section>
      )}

      {onRsvpClick && (
        <section className="py-20 px-6 text-center">
          <RsvpTrigger onClick={onRsvpClick} primaryColor={invitationData.primaryColor} />
        </section>
      )}
    </div>
  );
}