"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import {
  TemplateConfig,
  TimelineItem,
  DressCode,
  RecommendationItem,
} from "@/lib/types";
import { DressCodePreview } from "./shared/DressCodePreview";
import { RsvpSection } from "./shared/RsvpSection";
import GiftSection from "./shared/GiftSection";
import Countdown from "./shared/Countdown";
import Lightbox from "./shared/Lightbox";

function FadeIn({
  children,
  delay = 0,
  direction = "up",
}: {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "down" | "none";
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{
        opacity: 0,
        y: direction === "none" ? 0 : direction === "up" ? 25 : -25,
      }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

type RomanticWeddingTemplateProps = {
  template: TemplateConfig;
  data: any;
};

export default function RomanticWeddingTemplate({
  template,
  data,
}: RomanticWeddingTemplateProps) {
  const { defaultData, features } = template;
  const invitationData = { ...defaultData, ...data };
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  // Mobile Lookbook State
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const mapSrc = invitationData.mainVenueAddress
    ? `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(invitationData.mainVenueAddress)}`
    : "";

  const dressCode: DressCode | undefined = invitationData.dressCode;
  const gallery = invitationData.galleryImages || [];

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation(); // Don't trigger lightbox on stack tap
    setCurrentImgIndex((prev) => (prev + 1) % gallery.length);
  };

  return (
    <div
      className="w-full font-serif selection:bg-rose-100 selection:text-stone-800 antialiased overflow-x-hidden"
      style={{
        backgroundColor: invitationData.backgroundColor || "#fffaf9",
        color: invitationData.textColor || "#44403c",
      }}
    >
      <Lightbox 
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        imageUrl={selectedImage}
      />

      {/* Hero Section: Mobile Optimized Height */}
      <section className="relative h-[90vh] min-h-[600px] w-full flex flex-col justify-between items-center overflow-hidden px-4 py-12">
        <div className="absolute inset-0 z-0">
          <img
            src={
              invitationData.hero_image_url ||
              "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2069&auto=format&fit=crop"
            }
            className="w-full h-full object-cover"
            alt="Wedding Portrait"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-900/20 via-white/40 to-[#fffaf9]" />
        </div>

        {/* Top welcome */}
        <div className="z-10 text-center mt-6">
          <FadeIn delay={0.2}>
            <p className="text-[10px] tracking-[0.3em] uppercase font-sans font-medium opacity-80">
              {invitationData.heroTitle || "Together with their families"}
            </p>
          </FadeIn>
        </div>

        {/* Core details glass card */}
        <div className="z-10 text-center w-full max-w-sm backdrop-blur-md bg-white/60 p-6 rounded-[2rem] border border-white/60 shadow-xl shadow-stone-900/5 my-auto">
          <FadeIn delay={0.4} direction="none">
            <h1 className="text-4xl sm:text-5xl font-['Great_Vibes'] leading-tight" style={{ color: invitationData.primaryColor }}>
              {invitationData.heroNames}
            </h1>
          </FadeIn>
          
          <FadeIn delay={0.6}>
            <div className="my-4">
              <Countdown 
                targetDate={invitationData.event_date}
                className="flex justify-center gap-4"
                numberClassName="text-2xl font-sans font-light tracking-tight text-stone-800"
                labelClassName="text-[9px] tracking-widest uppercase font-sans text-stone-500 block mt-0.5"
              />
            </div>
          </FadeIn>
        </div>

        {/* Bottom Date indicator */}
        <div className="z-10 text-center">
          <FadeIn delay={0.8}>
            <p className="text-lg font-light tracking-wide italic">
              {invitationData.event_date &&
                new Date(invitationData.event_date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* GALLERY: The Mobile-First Story Stack */}
      {gallery.length > 0 && (
        <section className="py-20 px-6 overflow-hidden flex flex-col items-center justify-center" style={{ backgroundColor: "#F5F3F2" }}>
          <FadeIn>
            <h2 className="text-4xl font-['Great_Vibes'] text-center mb-2" style={{ color: invitationData.primaryColor }}>
              {invitationData.galleryTitle || "Our Story in Frames"}
            </h2>
            <p className="text-center font-sans text-[10px] tracking-[0.2em] uppercase text-stone-400 mb-10">
              Tap photo to shuffle • Double tap to expand
            </p>
          </FadeIn>

          {/* Interactive Card Deck Stack */}
          <div className="relative w-full max-w-[300px] aspect-[3/4] flex items-center justify-center min-h-[400px]">
            <AnimatePresence mode="popLayout">
              {gallery.map((src: string, index: number) => {
                // Only render the top 3 cards for DOM performance on mobile
                const isVisible = (index >= currentImgIndex && index < currentImgIndex + 3) || 
                                  (index + gallery.length >= currentImgIndex && index + gallery.length < currentImgIndex + 3);
                
                if (!isVisible) return null;

                // Calculate relative position in the active visible stack
                let position = index - currentImgIndex;
                if (position < 0) position += gallery.length;

                const isTopCard = position === 0;

                return (
                  <motion.div
                    key={src}
                    style={{ zIndex: gallery.length - position, transformOrigin: "bottom center" }}
                    className="absolute w-full h-full cursor-pointer"
                    initial={{ opacity: 0, scale: 0.9, y: 15 }}
                    animate={{
                      opacity: 1 - position * 0.25,
                      scale: 1 - position * 0.05,
                      y: position * -12, // Cascade upwards gracefully
                    }}
                    exit={{ opacity: 0, x: -200, rotate: -15, transition: { duration: 0.4 } }}
                    onClick={isTopCard ? handleNextImage : undefined}
                    onDoubleClick={() => setSelectedImage(src)}
                  >
                    {/* Editorial Photo Frame matting */}
                    <div className="w-full h-full p-3 bg-white border border-stone-100 rounded-2xl shadow-xl shadow-stone-300/50 flex flex-col justify-between">
                      <div className="w-full h-[88%] overflow-hidden rounded-xl border border-stone-100">
                        <img
                          src={src}
                          alt="Our memories"
                          className="w-full h-full object-cover filter contrast-[96%] sepia-[3%]"
                        />
                      </div>
                      <div className="h-[8%] flex items-center justify-between px-1 font-sans text-[9px] tracking-widest text-stone-400 uppercase italic">
                        <span>{index + 1} / {gallery.length}</span>
                        <span>Love Story</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </section>
      )}

      {/* Narrative Section: Vertical Clean Mobile Timeline */}
      {features.multiEventSchedule && (
        <section className="py-20 px-6 bg-white relative">
          <FadeIn>
            <h2 className="text-4xl font-['Great_Vibes'] text-center mb-12" style={{ color: invitationData.primaryColor }}>
              {invitationData.timelineTitle || "The Celebration"}
            </h2>
          </FadeIn>

          <div className="max-w-md mx-auto space-y-8 relative pl-6">
            {/* Elegant Side Anchor Line */}
            <div
              className="absolute left-1.5 top-2 bottom-2 w-[1px]"
              style={{
                background: `linear-gradient(to bottom, transparent, ${invitationData.primaryColor}40, transparent)`,
              }}
            />

            {invitationData.timelineItems?.map((item: TimelineItem, index: number) => (
              <FadeIn key={index} delay={index * 0.05}>
                <div className="relative group text-left">
                  {/* Custom Left Node Bullet */}
                  <div 
                    className="absolute -left-[22px] top-1.5 w-2.5 h-2.5 rounded-full bg-white border shadow-sm" 
                    style={{ borderColor: invitationData.primaryColor }}
                  />
                  <span className="text-[10px] tracking-widest uppercase text-stone-400 font-sans block mb-0.5">
                    {item.time}
                  </span>
                  <h3 className="text-xl font-light" style={{ color: invitationData.textColor }}>
                    {item.title}
                  </h3>
                  <p className="text-sm italic font-light opacity-75" style={{ color: invitationData.textColor }}>
                    {item.location}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>
      )}

      {/* Venue Section: Single Column Mobile Stack */}
      {mapSrc && (
        <section className="py-20 px-6 bg-white">
          <div className="max-w-md mx-auto text-center space-y-6">
            <FadeIn>
              <h2 className="text-4xl font-['Great_Vibes']" style={{ color: invitationData.primaryColor }}>
                The Venue
              </h2>
              <p className="text-base italic opacity-80">"Where our new chapter begins..."</p>
              <p className="text-sm font-sans tracking-wide opacity-70 px-4 leading-relaxed">
                {invitationData.mainVenueAddress}
              </p>
              <button
                className="mt-2 px-8 py-3 rounded-full font-sans text-xs tracking-widest uppercase border active:bg-stone-50 transition-colors shadow-sm"
                style={{ borderColor: invitationData.primaryColor, color: invitationData.primaryColor }}
              >
                Open in Maps
              </button>
            </FadeIn>
            
            <FadeIn>
              <div className="p-2 bg-white rounded-2xl shadow-xl shadow-stone-200 border border-stone-100 max-w-sm mx-auto">
                <div className="aspect-square rounded-xl overflow-hidden border border-stone-100">
                  <iframe
                    width="100%"
                    height="100%"
                    style={{ border: 0, filter: "sepia(12%) contrast(94%)" }}
                    loading="lazy"
                    src={mapSrc}
                  />
                </div>
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      {/* Dress Code Section */}
      {dressCode && (
        <section className="py-20 px-6" style={{ backgroundColor: "#F5F3F2" }}>
          <div className="max-w-md mx-auto text-center">
            <FadeIn>
              <h2 className="text-4xl font-['Great_Vibes'] mb-8" style={{ color: invitationData.primaryColor }}>
                Dress Code
              </h2>
              <div className="bg-white/70 p-6 rounded-2xl border border-white shadow-lg shadow-stone-100">
                <DressCodePreview
                  dressCode={dressCode}
                  primaryColor={invitationData.primaryColor}
                  textColor={invitationData.textColor}
                />
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      {/* Accommodations Mobile List */}
      {features.recommendations && invitationData.recommendations?.length > 0 && (
        <section className="py-20 bg-white px-6">
          <div className="max-w-md mx-auto">
            <FadeIn>
              <h2 className="text-4xl font-['Great_Vibes'] text-center mb-10" style={{ color: invitationData.primaryColor }}>
                Accommodations
              </h2>
            </FadeIn>
            <div className="space-y-4">
              {invitationData.recommendations.map((item: RecommendationItem, index: number) => (
                <FadeIn key={index}>
                  <div className="p-6 rounded-2xl bg-stone-50/60 border border-stone-100 flex flex-col justify-between text-center">
                    <h3 className="text-lg font-medium mb-1" style={{ color: invitationData.primaryColor }}>
                      {item.name}
                    </h3>
                    <p className="text-xs leading-relaxed mb-4 opacity-80" style={{ color: invitationData.textColor }}>
                      {item.description}
                    </p>
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-sans text-[10px] tracking-widest uppercase border-b pb-0.5 mx-auto text-stone-500"
                      style={{ borderColor: invitationData.primaryColor }}
                    >
                      View Details
                    </a>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Gift Section */}
      <GiftSection 
        giftRegistryUrl={invitationData.giftRegistryUrl}
        primaryColor={invitationData.primaryColor}
        textColor={invitationData.textColor}
      />

      {/* RSVP Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-md mx-auto">
          <FadeIn>
            <h2 className="text-4xl font-['Great_Vibes'] text-center mb-8" style={{ color: invitationData.primaryColor }}>
              RSVP
            </h2>
            <div className="bg-stone-50/80 p-6 rounded-2xl border border-stone-100">
              <RsvpSection
                invitationId={invitationData.id}
                primaryColor={invitationData.primaryColor}
                textColor={invitationData.textColor}
              />
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}