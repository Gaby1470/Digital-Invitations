"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { TemplateConfig, TimelineItem } from "@/lib/types";
import Image from "next/image";

// Floating animation utility for stickers/elements
function FloatingSticker({
  children,
  delay = 0,
  yOffset = 15,
  duration = 4,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  yOffset?: number;
  duration?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={`absolute ${className}`}
      animate={{ y: [0, -yOffset, 0], rotate: [-2, 2, -2] }}
      transition={{
        repeat: Infinity,
        duration: duration,
        delay: delay,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
}

// Fade-in utility
function PopIn({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8, filter: "blur(4px)" }}
      animate={isInView ? { opacity: 1, scale: 1, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.8, delay, type: "spring", bounce: 0.4 }}
    >
      {children}
    </motion.div>
  );
}

// Hardcoded pattern to avoid hydration mismatch while looking random
const ransomLetters = [
  {
    char: "G",
    bg: "bg-[#1A1A1A]",
    text: "text-white",
    font: "font-sans font-black",
    rotate: "-rotate-6",
    padding: "p-2",
  },
  {
    char: "r",
    bg: "bg-[#E5E5E5]",
    text: "text-[#1A1A1A]",
    font: "font-serif font-bold",
    rotate: "rotate-3",
    padding: "p-1",
  },
  {
    char: "a",
    bg: "bg-transparent",
    text: "text-[#1A1A1A]",
    font: "font-mono font-bold",
    rotate: "-rotate-2",
    padding: "p-1",
  },
  {
    char: "D",
    bg: "bg-[#1A1A1A]",
    text: "text-white",
    font: "font-serif font-black",
    rotate: "rotate-6",
    padding: "p-2",
  },
  {
    char: "u",
    bg: "bg-[#E5E5E5]",
    text: "text-[#1A1A1A]",
    font: "font-sans font-medium",
    rotate: "-rotate-3",
    padding: "p-1 md:p-2",
  },
  {
    char: "a",
    bg: "bg-transparent",
    text: "text-[#1A1A1A]",
    font: "font-serif font-black",
    rotate: "rotate-12",
    padding: "p-1",
  },
  {
    char: "c",
    bg: "bg-[#E5E5E5]",
    text: "text-[#1A1A1A]",
    font: "font-mono font-bold",
    rotate: "-rotate-6",
    padding: "p-2",
  },
  {
    char: "i",
    bg: "bg-[#1A1A1A]",
    text: "text-white",
    font: "font-sans font-light",
    rotate: "rotate-2",
    padding: "p-2",
  },
  {
    char: "o",
    bg: "bg-transparent",
    text: "text-[#1A1A1A]",
    font: "font-serif font-bold",
    rotate: "-rotate-12",
    padding: "p-1",
  },
  {
    char: "N",
    bg: "bg-[#1A1A1A]",
    text: "text-white",
    font: "font-sans font-black",
    rotate: "rotate-6",
    padding: "p-2",
  },
];

type GraduationTemplateProps = {
  template: TemplateConfig;
  data: any;
};

export default function ScrapbookGraduationTemplate({
  template,
  data,
}: GraduationTemplateProps) {
  const { defaultData, features } = template;
  const invitationData = { ...defaultData, ...data };
  const [guestMessage, setGuestMessage] = useState("");

  return (
    <div
      className="w-full min-h-screen text-[#1A1A1A] overflow-hidden selection:bg-[#FF69B4] selection:text-white"
      style={{
        backgroundColor: "#F4EFE6", // Warmer, sandier cream base
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.06'/%3E%3C/svg%3E")`,
      }}
    >
      {/* Hero Collage Section */}
      <section className="relative min-h-[95vh] w-full flex flex-col items-center pt-8 md:pt-20 pb-10 px-4">
        {/* Background Decorative Stickers */}
        <FloatingSticker
          className="top-2 left-2 md:top-10 md:left-[10%] w-20 h-20 md:w-28 md:h-28 opacity-90 z-10"
          duration={5}
        >
          <Image
            src={
              invitationData.discoBallImage ||
              "https://ykgyfxtzjedgastsuuaj.supabase.co/storage/v1/object/public/invitation-images/public/Graduation/discoball.png"
            }
            alt="Disco Ball"
            layout="fill"
            objectFit="contain"
          />
        </FloatingSticker>

        <FloatingSticker
          className="top-2 right-2 md:top-4 md:right-[5%] w-15 h-15 md:w-30 md:h-30 opacity-90 z-10"
          delay={1}
          duration={3}
        >
          <Image
            src={
              invitationData.starBalloonImage ||
              "https://ykgyfxtzjedgastsuuaj.supabase.co/storage/v1/object/public/invitation-images/public/Graduation/star.png"
            }
            alt="Star Balloon"
            layout="fill"
            objectFit="contain"
          />
        </FloatingSticker>

        <div className="z-20 w-full max-w-lg flex flex-col items-center relative mt-20 md:mt-10">
          {/* Handwritten Intro */}
          <PopIn delay={0.2}>
            <p
              className="text-center text-lg md:text-2xl leading-relaxed mb-8 transform -rotate-2 px-2"
              style={{ fontFamily: "'Permanent Marker', 'Caveat', cursive" }}
            >
              {invitationData.heroTitle ||
                "¡Por fin terminé! Me encantaría invitarte a ser parte de mi graduación y festejar conmigo"}
            </p>
          </PopIn>

          {/* Central Cutout Image */}
          <PopIn delay={0.4}>
            <div className="relative w-[280px] h-[320px] md:w-[350px] md:h-[400px] mb-6">
              <div className="absolute inset-0 bg-black/10 translate-x-2 translate-y-2 blur-sm" />
              <Image
                src={
                  invitationData.mainImage ||
                  "https://ykgyfxtzjedgastsuuaj.supabase.co/storage/v1/object/public/invitation-images/public/Graduation/grad-profile.png"
                }
                alt="Graduate"
                layout="fill"
                objectFit="contain"
                className="relative z-10 filter grayscale contrast-125"
              />
            </div>
          </PopIn>

          {/* Ransom Note "GRADUATION" */}
          <PopIn delay={0.6}>
            <div className="flex justify-center items-center flex-wrap gap-1 mb-12">
              {ransomLetters.map((letter, i) => (
                <span
                  key={i}
                  className={`inline-block text-3xl md:text-3xl ${letter.bg} ${letter.text} ${letter.font} ${letter.rotate} ${letter.padding} shadow-sm border border-black/10`}
                >
                  {letter.char}
                </span>
              ))}
            </div>
          </PopIn>

          {/* Event Details - Typewriter Style */}
          <PopIn delay={0.8}>
            <div className="flex flex-col items-center space-y-4 font-mono font-bold text-center z-30 bg-[#F4EFE6]/80 backdrop-blur-sm p-4 rounded-xl">
              <p className="text-2xl md:text-3xl tracking-widest uppercase text-black">
                {invitationData.date || "06 MARZO 2026"}
              </p>
              <p className="text-3xl md:text-4xl text-[#FF1493] tracking-widest">
                {invitationData.time || "7:00 p.m."}
              </p>
              <p className="text-sm md:text-base mt-4 text-black max-w-[250px] leading-relaxed">
                {invitationData.location ||
                  "Av. Colombia # 2 - 72, La pizzería estelar"}
              </p>
            </div>
          </PopIn>
        </div>
      </section>

      {/* Rough Edge Divider */}
      <div className="w-full h-4 bg-transparent border-t-2 border-dashed border-black/20 my-8" />

      {/* Timeline Section - Scrapbook Layout */}
      <section className="py-16 px-6 relative">
        <div className="max-w-2xl mx-auto">
          <PopIn>
            <h2
              className="text-4xl text-center mb-16 transform rotate-1"
              style={{ fontFamily: "'Permanent Marker', 'Caveat', cursive" }}
            >
              El Plan
            </h2>
          </PopIn>

          <div className="space-y-8">
            {invitationData.timelineItems?.map(
              (item: TimelineItem, index: number) => (
                <PopIn delay={index * 0.15} key={index}>
                  <div
                    className={`relative flex items-center p-4 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${index % 2 === 0 ? "rotate-1" : "-rotate-1"} hover:rotate-0 transition-transform`}
                  >
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-white/40 backdrop-blur-md border border-white/60 shadow-sm rotate-2" />

                    <div className="flex-1 font-mono">
                      <span className="inline-block bg-[#FF1493] text-white px-2 py-1 text-xs font-bold mb-2">
                        {item.time}
                      </span>
                      <h3 className="text-xl font-bold uppercase tracking-tight mb-1">
                        {item.title}
                      </h3>
                      <p className="text-black/70 text-sm">{item.location}</p>
                    </div>
                  </div>
                </PopIn>
              ),
            )}
          </div>
          <FloatingSticker
            className="top-10 left-[-5%] md:left-[70%] w-32 h-32 opacity-90 z-10"
            duration={5}
          >
            <Image
              src={
                invitationData.discoBallImage ||
                "https://ykgyfxtzjedgastsuuaj.supabase.co/storage/v1/object/public/invitation-images/public/Graduation/discoball.png"
              }
              alt="Disco Ball"
              layout="fill"
              objectFit="contain"
            />
          </FloatingSticker>
        </div>
      </section>

      {/* Guestbook / RSVP - Polaroid Style */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="max-w-md mx-auto relative z-10">
          <PopIn>
            <div className="bg-white p-4 pb-16 border border-gray-200 shadow-2xl transform rotate-2">
              <div className="bg-black/5 w-full h-48 mb-6 border border-black/10 relative overflow-hidden">
                <Image
                  src={
                    invitationData.guestbookPolaroidImage ||
                    invitationData.mainImage ||
                    "https://ykgyfxtzjedgastsuuaj.supabase.co/storage/v1/object/public/invitation-images/public/Graduation/graduation-cover.jpg"
                  }
                  alt="Guestbook polaroid"
                  fill
                  className="object-cover"
                />
              </div>

              <h2
                className="text-3xl text-center mb-6"
                style={{ fontFamily: "'Permanent Marker', 'Caveat', cursive" }}
              >
                ¡Deja un mensaje!
              </h2>
              <FloatingSticker className="bottom-100 right-[112%] w-24 h-24 z-20" delay={0.5} yOffset={-20} duration={5}>
                <Image src={invitationData.starBalloonImage || "https://ykgyfxtzjedgastsuuaj.supabase.co/storage/v1/object/public/invitation-images/public/Graduation/star.png"} alt="Star Balloon" layout="fill" objectFit="contain" />
              </FloatingSticker>
              <div className="space-y-4 font-mono">
                <textarea
                  className="w-full p-3 bg-transparent border-b-2 border-dashed border-black/30 focus:border-[#FF1493] outline-none transition-all min-h-[100px] resize-none"
                  placeholder="Escribe un deseo para el graduado..."
                  value={guestMessage}
                  onChange={(e) => setGuestMessage(e.target.value)}
                />
                <button
                  className="w-full py-4 bg-black text-white font-bold uppercase tracking-widest hover:bg-[#FF1493] transition-colors"
                  onClick={() => alert("¡Gracias por tu mensaje!")}
                >
                  Enviar
                </button>
              </div>
            </div>
          </PopIn>
        </div>
      </section>

      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Permanent+Marker&family=Caveat:wght@400;700&display=swap");
      `}</style>
    </div>
  );
}