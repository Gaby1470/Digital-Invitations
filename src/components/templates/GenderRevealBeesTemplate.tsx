// src/components/templates/GenderRevealBeesTemplate.tsx
"use client";

import React, { useRef, useState } from 'react';
import { TemplateConfig } from "@/lib/custom_types";
import { EditorData } from "@/lib/custom_types";
import { motion, useInView } from "framer-motion";
import { Calendar, MapPin, Gift, Clock, Sparkles, CheckCircle, XCircle, ExternalLink } from "lucide-react";
import Image from 'next/image';
import { RsvpTrigger } from './shared/RsvpTrigger';
import { BrandingFooter } from './shared/BrandingFooter';

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
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

type GenderRevealBeesTemplateProps = {
  template: TemplateConfig;
  data: EditorData;
  invitationId?: string;
  onRsvpClick?: () => void;
};

const FlipCard = ({
  selection,
  frontContent,
  backContent,
  bgColor,
  textColor: cardTextColor,
  unselectedTextColor,
  borderColor,
  hoverBgColor,
  isFlipped,
  onVote,
  vote,
}: {
  selection: 'boy' | 'girl';
  frontContent: React.ReactNode;
  backContent: React.ReactNode;
  bgColor: string;
  textColor: string;
  unselectedTextColor: string;
  borderColor: string;
  hoverBgColor: string;
  isFlipped: boolean;
  onVote: (selection: 'boy' | 'girl') => void;
  vote: 'boy' | 'girl' | null;
}) => {
  return (
    <div
      className="w-full h-24 [perspective:1000px] cursor-pointer"
      onClick={() => onVote(selection)}
    >
      <motion.div
        className="relative w-full h-full [transform-style:preserve-3d] transition-transform duration-700"
        initial={{ rotateY: 0 }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
      >
        {/* Front */}
        <div
          className={`absolute w-full h-full [backface-visibility:hidden] flex items-center justify-center gap-2 rounded-xl p-4 font-bold text-lg border-2 transition-all duration-300 ${
            vote === selection
              ? `${bgColor} ${cardTextColor} ${borderColor} scale-105 shadow-lg`
              : `${hoverBgColor} ${unselectedTextColor} ${borderColor.replace('500','200')} hover:${hoverBgColor} hover:scale-105`
          }`}
        >
          {frontContent}
        </div>
        {/* Back */}
        <div
          className={`absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] flex items-center justify-center rounded-xl p-4 font-bold text-lg border-2 ${bgColor} ${cardTextColor} ${borderColor}`}
        >
          <div className="text-center">
            {backContent}
          </div>
        </div>
      </motion.div>
    </div>
  );
};


const GenderRevealBeesTemplate: React.FC<GenderRevealBeesTemplateProps> = ({
  template,
  data,
  invitationId,
  onRsvpClick,
}) => {
  const { defaultData } = template;
  const invitationData = { ...defaultData, ...data };

  const [vote, setVote] = useState<'boy' | 'girl' | null>(null);
  const [isFlipped, setIsFlipped] = useState<'boy' | 'girl' | null>(null);

  const handleVote = (selection: 'boy' | 'girl') => {
    setVote(selection);
    setIsFlipped(selection);
  };

  const {
    parentsNames,
    event_date,
    timeRange,
    timeSubtitle,
    locationName,
    mainVenueAddress,
    giftRegistryUrl,
    primaryColor,
    backgroundColor,
    textColor,
    heroTitle,
    heroSubtitle,
  } = invitationData;

  const date = event_date ? new Date(event_date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) : '';

  return (
    <div 
      className="relative w-full min-h-screen antialiased font-sans overflow-hidden pb-20"
      style={{ backgroundColor: backgroundColor, color: textColor }}
    >
      {/* Decorative Bee Elements */}
      <div className="absolute top-1/4 left-4 w-8 h-8 opacity-80 animate-fly">
        <Image src="https://ykgyfxtzjedgastsuuaj.supabase.co/storage/v1/object/public/invitation-images/public/gender-reveal/bee.png" alt="Bee" width={32} height={32} />
      </div>
      <div className="absolute top-1/2 right-4 w-12 h-12 opacity-70 animate-fly-reverse" style={{ animationDuration: '12s' }}>
        <Image src="https://ykgyfxtzjedgastsuuaj.supabase.co/storage/v1/object/public/invitation-images/public/gender-reveal/bee.png" alt="Bee" width={48} height={48} />
      </div>
       <div className="absolute bottom-1/4 left-10 w-6 h-6 opacity-90 animate-fly" style={{ animationDuration: '8s' }}>
        <Image src="https://ykgyfxtzjedgastsuuaj.supabase.co/storage/v1/object/public/invitation-images/public/gender-reveal/bee.png" alt="Bee" width={24} height={24} />
      </div>
      <div className="absolute top-10 right-10 w-10 h-10 opacity-60 animate-fly" style={{ animationDuration: '15s' }}>
        <Image src="https://ykgyfxtzjedgastsuuaj.supabase.co/storage/v1/object/public/invitation-images/public/gender-reveal/bee.png" alt="Bee" width={40} height={40} />
      </div>
      <div className="absolute bottom-10 right-1/4 w-8 h-8 opacity-75 animate-fly-reverse" style={{ animationDuration: '9s' }}>
        <Image src="https://ykgyfxtzjedgastsuuaj.supabase.co/storage/v1/object/public/invitation-images/public/gender-reveal/bee.png" alt="Bee" width={32} height={32} />
      </div>
      <div className="absolute top-1/3 left-1/3 w-5 h-5 opacity-85 animate-fly" style={{ animationDuration: '7s' }}>
        <Image src="https://ykgyfxtzjedgastsuuaj.supabase.co/storage/v1/object/public/invitation-images/public/gender-reveal/bee.png" alt="Bee" width={20} height={20} />
      </div>
      <div className="absolute bottom-2/3 right-1/3 w-7 h-7 opacity-80 animate-fly-reverse" style={{ animationDuration: '11s' }}>
        <Image src="https://ykgyfxtzjedgastsuuaj.supabase.co/storage/v1/object/public/invitation-images/public/gender-reveal/bee.png" alt="Bee" width={28} height={28} />
      </div>
      <div className="absolute bottom-1/2 left-1/2 w-9 h-9 opacity-70 animate-fly" style={{ animationDuration: '13s' }}>
        <Image src="https://ykgyfxtzjedgastsuuaj.supabase.co/storage/v1/object/public/invitation-images/public/gender-reveal/bee.png" alt="Bee" width={36} height={36} />
      </div>

      {/* Header Section */}
      <header className="relative z-10 text-center pt-24 pb-16 px-4 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-48 bg-yellow-300/80" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 60%, 50% 100%, 0 60%)' }}></div>
        <div className="absolute top-0 left-0 w-full h-48 bg-yellow-400/80" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 60%, 50% 100%, 0 60%)', transform: 'translateY(10px) scale(1.02)' }}></div>

        <FadeIn>
          <div className="relative max-w-2xl mx-auto">
            <h2 className="text-xl font-bold tracking-widest uppercase text-yellow-900/80" style={{ color: textColor }}>
              {parentsNames}
            </h2>
            <h1 
              className="text-6xl md:text-8xl font-extrabold tracking-tight mt-2 text-white" 
              style={{
                fontFamily: "'Fredoka One', cursive",
                textShadow: `2px 2px 0px ${primaryColor}, 4px 4px 0px rgba(0,0,0,0.1)`
              }}
            >
              {heroTitle}
            </h1>
            <p className="mt-6 text-lg font-medium max-w-md mx-auto" style={{ color: textColor }}>
              {heroSubtitle}
            </p>
          </div>
        </FadeIn>
      </header>

      {/* Details Grid */}
      <main className="relative z-10 max-w-3xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 -mt-8 items-stretch">

        {/* Date & Time Card */}
        <FadeIn delay={0.1}>
          <div className="h-full flex flex-col justify-center items-center bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border-2 border-yellow-300/50 text-center transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
            <div className="mx-auto w-16 h-16 bg-yellow-300 rounded-full flex items-center justify-center mb-6 border-4 border-white shadow-md">
              <Calendar className="w-8 h-8 text-yellow-800" />
            </div>
            <h3 className="text-lg font-bold text-yellow-900 uppercase tracking-wider">{date}</h3>
            <div className="w-24 h-px bg-yellow-300 mx-auto my-4"></div>
            <p className="text-3xl font-extrabold" style={{ color: textColor }}>{timeRange}</p>
            <p className="text-sm font-semibold text-yellow-800 mt-2">{timeSubtitle}</p>
          </div>
        </FadeIn>

        {/* Location Card */}
        <FadeIn delay={0.2}>
          <div className="h-full flex flex-col justify-center items-center bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border-2 border-yellow-300/50 text-center transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
            <div className="mx-auto w-16 h-16 bg-yellow-300 rounded-full flex items-center justify-center mb-6 border-4 border-white shadow-md">
              <MapPin className="w-8 h-8 text-yellow-800" />
            </div>
            {/* Tag Name (Big) */}
            <h3 className="text-3xl font-extrabold text-yellow-900 mb-3 leading-tight">
              {locationName}
            </h3>
            {/* Full Address (Smaller) */}
            <p className="text-sm md:text-base font-medium px-2 break-words leading-relaxed opacity-80" style={{ color: textColor }}>
              {mainVenueAddress}
            </p>
          </div>
        </FadeIn>
      </main>

      {/* Gender Voting Section */}
      <section className="relative z-10 max-w-xl mx-auto px-4 mt-12">
        <FadeIn delay={0.3}>
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-yellow-300/60">
            <div className="text-center">
              <Sparkles className="mx-auto w-8 h-8 text-yellow-500 mb-4" />
              <h3 className="text-2xl font-bold tracking-tight mb-2" style={{ color: textColor }}>
                ¿Equipo rosa o equipo azul?
              </h3>
              <p className="text-sm font-medium max-w-md mx-auto opacity-80" style={{ color: textColor }}>
                Vota y ayúdanos a revelar el gran secreto. ¡No olvides traer tu mejor consejo para los futuros padres!
              </p>

              <div className="mt-8 grid grid-cols-2 gap-6 max-w-sm mx-auto">
                <FlipCard
                  selection="girl"
                  frontContent={<>
                    {vote === 'girl' ? <CheckCircle /> : null} ¡Niña!
                  </>}
                  backContent={invitationData.teamGirlProduct || 'toallas para bebé'}
                  bgColor="bg-pink-400"
                  textColor="text-white"
                  unselectedTextColor="text-pink-700"
                  borderColor="border-pink-500"
                  hoverBgColor="bg-pink-50"
                  isFlipped={isFlipped === 'girl'}
                  onVote={handleVote}
                  vote={vote}
                />
                <FlipCard
                  selection="boy"
                  frontContent={<>
                    {vote === 'boy' ? <CheckCircle /> : null} ¡Niño!
                  </>}
                  backContent={invitationData.teamBoyProduct || 'pañales'}
                  bgColor="bg-blue-400"
                  textColor="text-white"
                  unselectedTextColor="text-blue-700"
                  borderColor="border-blue-500"
                  hoverBgColor="bg-blue-50"
                  isFlipped={isFlipped === 'boy'}
                  onVote={handleVote}
                  vote={vote}
                />
              </div>
              {vote && (
                <div className="mt-6 text-center">
                    <p className="text-sm font-bold text-yellow-600 animate-pulse">¡Gracias por tu voto!</p>
                    <p className="text-sm font-medium max-w-md mx-auto opacity-80 mt-2" style={{ color: textColor }}>
                        Tu objetivo de celebración: Por favor trae un paquete de <span className="font-bold underline">{vote === 'boy' ? (invitationData.teamBoyProduct || 'pañales') : (invitationData.teamGirlProduct || 'toallas para bebé')}</span> a la fiesta. ¡Gracias por tu amor!
                    </p>
                </div>
              )}
            </div>
          </div>
        </FadeIn>
      </section>

      {/* Gift Registry Section */}
      {giftRegistryUrl && (
        <section className="relative z-10 max-w-xl mx-auto px-4 mt-8">
          <FadeIn delay={0.35}>
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border-2 border-yellow-300/60 text-center flex flex-col items-center">
              <div className="mx-auto w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                <Gift className="w-7 h-7 text-yellow-600" />
              </div>
              <h3 className="text-2xl font-bold text-yellow-900 mb-3">Mesa de Regalos</h3>
              <p className="text-sm md:text-base font-medium mb-6 opacity-80 max-w-md" style={{ color: textColor }}>
                Tu presencia es nuestro mejor regalo, pero si deseas tener un detalle con nuestro bebé, puedes ver nuestras sugerencias aquí:
              </p>
              <a
                href={giftRegistryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold py-3 px-8 rounded-full transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
              >
                Ver Mesa de Regalos
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </FadeIn>
        </section>
      )}

      {onRsvpClick && (
        <section className="relative z-10 py-6 px-4 max-w-xl mx-auto mt-4">
          <FadeIn delay={0.4}>
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl shadow-xl border-2 border-yellow-200/50 p-6 sm:p-8">
              <RsvpTrigger onClick={onRsvpClick} primaryColor={primaryColor} textColor={textColor} />
            </div>
          </FadeIn>
        </section>
      )}


      {/* Footer */}
      <footer className="relative z-10 mt-12 mb-8 text-center px-4">
        <p className="font-bold text-2xl" style={{ color: textColor }}>¡Los esperamos!</p>
        <p className="text-base font-medium mt-2 opacity-80" style={{ color: textColor }}>Con cariño, {parentsNames}</p>
      </footer>
      <BrandingFooter />

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Quicksand:wght@400;500;600;700&display=swap');

        .font-sans {
          font-family: 'Quicksand', sans-serif;
        }

        @keyframes fly {
          0% { transform: translateX(0) translateY(0) rotate(0deg); }
          50% { transform: translateX(20px) translateY(-30px) rotate(15deg); }
          100% { transform: translateX(0) translateY(0) rotate(0deg); }
        }

        @keyframes fly-reverse {
          0% { transform: translateX(0) translateY(0) rotate(0deg); }
          50% { transform: translateX(-25px) translateY(20px) rotate(-20deg); }
          100% { transform: translateX(0) translateY(0) rotate(0deg); }
        }

        .animate-fly {
          animation: fly 10s ease-in-out infinite;
        }

        .animate-fly-reverse {
          animation: fly-reverse 10s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default GenderRevealBeesTemplate;
