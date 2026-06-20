// src/components/templates/BabyShowerTemplate.tsx
"use client";

import React, { useRef } from 'react';
import { TemplateConfig, TimelineItem } from "@/lib/types";
import { motion, useInView } from "framer-motion";
import { RsvpSection } from "./shared/RsvpSection";
import { Calendar, MapPin, Baby, Heart, PartyPopper, Utensils, Clock } from "lucide-react";
import GiftSection from './shared/GiftSection';

function FadeIn({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

type BabyShowerTemplateProps = {
  template: TemplateConfig;
  data: any;
};

export const BabyShowerTemplate: React.FC<BabyShowerTemplateProps> = ({
  template,
  data,
}) => {
  const { defaultData } = template;
  const invitationData = { ...defaultData, ...data };

  const {
    babyName,
    parentsNames,
    event_date,
    locationName,
    mainVenueAddress,
    rsvpDeadline,
    rsvpContact,
    giftRegistryUrl,
    timelineItems,
    heroTitle,
    backgroundColor,
    primaryColor,
    textColor,
  } = invitationData;
  
  const date = event_date ? new Date(event_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '';
  const time = event_date ? new Date(event_date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) : '';

  return (
    <div 
      className="relative w-full min-h-screen antialiased font-sans overflow-hidden pb-12"
      style={{ backgroundColor: backgroundColor, color: textColor }}
    >
      
{/* Safari Animals Sidebar Image */}
      <div 
        className="absolute top-5 left-0 h-[75vh] w-40 md:w-56 lg:w-72 pointer-events-none select-none z-0"
        style={{
          WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 95%)',
          maskImage: 'linear-gradient(to bottom, black 50%, transparent 95%)'
        }}
      >
        <img 
          src="https://ykgyfxtzjedgastsuuaj.supabase.co/storage/v1/object/public/invitation-images/public/gender-reveal/animals-babyshower.png" 
          alt="Safari Animals" 
          className="w-full h-full object-contain object-left-top opacity-85"
        />
      </div>

      {/* Whimsical Decorative Background Elements */}
      <div className="absolute top-4 left-4 md:left-1/4 text-2xl opacity-40 select-none animate-bounce" style={{ animationDuration: '4s' }}>🌙</div>
      <div className="absolute top-12 right-6 text-3xl opacity-50 animate-pulse select-none">⭐</div>
      <div className="absolute top-40 right-1/4 text-xl opacity-30 select-none">✨</div>
      <div className="absolute top-64 right-8 text-2xl opacity-40 select-none animate-bounce" style={{ animationDuration: '5s' }}>🐝</div>
      <div className="absolute top-1/2 left-8 md:left-1/3 text-3xl opacity-20 select-none">🧸</div>
      <div className="absolute top-3/4 right-8 text-3xl opacity-30 select-none animate-pulse">🎈</div>
      
      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center pt-20 pb-10 px-4 max-w-2xl mx-auto">
        <FadeIn>
          <div className="relative pt-12 pb-4 px-6 flex flex-col items-center">
            {/* Floating Clouds */}
            <div className="absolute -top-4 left-4 w-20 h-9 bg-white/80 rounded-full blur-[2px] shadow-sm animate-pulse" style={{ animationDuration: '6s' }}></div>
            <div className="absolute top-6 -right-6 w-24 h-10 bg-white/70 rounded-full blur-[2px] shadow-sm animate-pulse" style={{ animationDuration: '8s' }}></div>
            
            <div className="bg-white/40 p-3 rounded-full mb-4 shadow-sm backdrop-blur-sm border border-white/60">
              <Baby className="w-8 h-8" style={{ color: primaryColor }} />
            </div>

            <h1 className="text-5xl sm:text-7xl font-extrabold tracking-wide drop-shadow-[0_2px_4px_rgba(255,255,255,0.9)] leading-tight">
              <span style={{ color: primaryColor }} className="font-serif">Baby</span>{' '}
              <span className="text-[#F5B041] font-serif">Shower</span>
            </h1>
            
            <p className="mt-6 text-xs font-bold uppercase tracking-widest bg-white/50 px-3 py-1 rounded-full border border-white/40" style={{ color: primaryColor }}>
              {heroTitle || "Celebramos la llegada de un nuevo miembro a la familia"}
            </p>
            
            <h2 className="mt-4 text-3xl sm:text-4xl font-black tracking-tight" style={{ color: textColor }}>
              {babyName || "Little One"}
            </h2>
            
            <p className="text-sm md:text-base font-medium mt-2 max-w-sm mx-auto">
              Para los orgullosos padres <span className="font-semibold" style={{ color: textColor }}>{parentsNames}</span>
            </p>
          </div>
        </FadeIn>
      </section>

      {/* Activities Section */}
      <section className="relative z-10 max-w-xl mx-auto px-4 mb-4">
        <FadeIn delay={0.1}>
          <div className="bg-white/60 backdrop-blur-md rounded-2xl p-6 border border-white/80 shadow-md text-center">
            <div className="flex justify-center items-center gap-4 mb-3">
              <div className="w-12 h-12 bg-[#FFF9C4] rounded-full flex items-center justify-center text-[#F5B041] shadow-sm">
                <PartyPopper className="w-6 h-6" />
              </div>
              <div className="w-12 h-12 bg-[#FFF9C4] rounded-full flex items-center justify-center text-[#F5B041] shadow-sm">
                <Utensils className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-xl font-bold mb-2 tracking-tight" style={{ color: textColor }}>¡Únete a la Diversión!</h3>
            <p className="text-sm md:text-base font-medium">
              Prepárate para una tarde llena de juegos divertidos, comida deliciosa y compañía maravillosa mientras celebramos la llegada del pequeño.
            </p>
          </div>
        </FadeIn>
      </section>

      {/* Details Section */}
      <section className="relative z-10 py-6 px-4">
        <div className="container mx-auto max-w-xl grid grid-cols-1 gap-6">
          
          {(!timelineItems || timelineItems.length === 0) && (
            <>
              {/* Date Card */}
              <FadeIn delay={0.2}>
                <div className="group bg-white/60 backdrop-blur-md rounded-2xl p-6 shadow-md border border-white/80 text-center transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
                  <div className="mx-auto w-10 h-10 bg-[#E8F5E9] rounded-xl flex items-center justify-center text-[#7CB342] mb-3 group-hover:scale-110 transition-transform">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div className="text-[#689F38] font-bold uppercase tracking-wider text-xs mb-1">
                    Cuándo
                  </div>
                  <div className="text-xl font-bold" style={{ color: textColor }}>{date}</div>
                  <div className="text-md font-medium mt-0.5">{time}</div>
                </div>
              </FadeIn>
            </>
          )}

          {/* Schedule Card */}
          {timelineItems && timelineItems.length > 0 && (
            <FadeIn delay={0.2}>
              <div className="bg-white/60 backdrop-blur-md rounded-2xl p-6 shadow-md border border-white/80 transition-all duration-300 hover:shadow-lg">
                <div className="flex justify-center mb-4">
                  <div className="mx-auto w-10 h-10 bg-[#E8F5E9] rounded-xl flex items-center justify-center text-[#7CB342]">
                    <Calendar className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-center text-[#689F38] font-bold uppercase tracking-wider text-xs mb-4">
                  Programa
                </div>
                <div className="space-y-4">
                  {timelineItems.map((item: TimelineItem, index: number) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="flex-shrink-0 bg-white/80 rounded-lg p-2">
                         <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold" style={{ color: textColor }}>{item.title}</p>
                        <p className="text-sm">{item.time} - {item.location}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          )}
          
          {/* Location Card */}
          <FadeIn delay={0.3}>
            <div className="group bg-white/60 backdrop-blur-md rounded-2xl p-6 shadow-md border border-white/80 text-center transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
              <div className="mx-auto w-10 h-10 bg-[#E3F2FD] rounded-xl flex items-center justify-center text-[#0288D1] mb-3 group-hover:scale-110 transition-transform">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="text-[#0288D1] font-bold uppercase tracking-wider text-xs mb-1">
                Dónde
              </div>
              <div className="text-xl font-bold" style={{ color: textColor }}>{locationName}</div>
              <div className="text-sm px-4 mt-1 break-words font-medium">{mainVenueAddress}</div>
            </div>
          </FadeIn>

        </div>
      </section>

      {/* Separate Gift Registry Section */}
      {giftRegistryUrl && (
        <section className="relative z-10 py-2 px-4  max-w-xl mx-auto">
          <FadeIn delay={0.35}>
            {/* Removed the extra background, border, and padding wrapper to avoid the double box effect */}
            <div className="transition-all duration-300 hover:-translate-y-1">
              <GiftSection 
                giftRegistryUrl={giftRegistryUrl}
                primaryColor={primaryColor}
                textColor={textColor}
              />
            </div>
          </FadeIn>
        </section>
      )}

      {/* RSVP Section */}
      <section className="relative z-10 py-4 px-4 max-w-xl mx-auto">
        <FadeIn delay={0.4}>
          <div className="bg-white/70 backdrop-blur-md rounded-3xl shadow-xl border-2 border-white/80 p-6 sm:p-8">
            {/* Managed RSVP Area */}
            <div className="text-center">
              <RsvpSection
                invitationId={data.id}
                primaryColor={primaryColor}
                textColor={textColor}
              />
            </div>
          </div>
        </FadeIn>
      </section>

      {/* Footer */}
      <footer className="relative z-10 mt-12 mx-4 max-w-xl sm:mx-auto bg-white/40 backdrop-blur-sm rounded-2xl py-6 border border-white/50 flex flex-col items-center justify-center gap-2 text-center shadow-sm">
        <Heart className="w-5 h-5 text-red-400 fill-red-400 animate-pulse" />
        <p className="text-sm font-bold tracking-wide" style={{ color: textColor }}>
          ¡No podemos esperar para celebrar contigo!
        </p>
      </footer>
    </div>
  );
};

export default BabyShowerTemplate;