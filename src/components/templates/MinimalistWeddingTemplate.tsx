"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
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
        y: direction === "none" ? 0 : direction === "up" ? 20 : -20,
      }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

type MinimalistWeddingTemplateProps = {
  template: TemplateConfig;
  data: any;
};

export default function MinimalistWeddingTemplate({
  template,
  data,
}: MinimalistWeddingTemplateProps) {
  const { defaultData, features } = template;
  const invitationData = { ...defaultData, ...data };
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const grayscaleValue = useTransform(
    scrollYProgress,
    [0, 0.4],
    ["grayscale(100%)", "grayscale(15%)"],
  );
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  const mapSrc = invitationData.mainVenueAddress
    ? `https://maps.google.com/maps?q=${encodeURIComponent(invitationData.mainVenueAddress)}&t=&z=13&ie=UTF8&iwloc=&output=embed`
    : "";

  const dressCode: DressCode | undefined = invitationData.dressCode;

  return (
    <div
      className="w-full font-sans antialiased selection:bg-neutral-900 selection:text-white overflow-x-hidden"
      style={{
        backgroundColor: invitationData.backgroundColor || "#ffffff",
        color: invitationData.textColor || "#171717",
      }}
    >
      <Lightbox 
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        imageUrl={selectedImage}
      />

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative h-[100dvh] min-h-[580px] w-full flex flex-col justify-between items-center overflow-hidden px-6 py-12"
      >
        <motion.div
          className="absolute inset-0 z-0"
          style={{
            filter: grayscaleValue,
            scale: imageScale,
          }}
        >
          <img
            src={
              invitationData.hero_image_url ||
              "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=2070&auto=format&fit=crop"
            }
            className="w-full h-full object-cover"
            alt="Wedding Background"
          />
          <div className="absolute inset-0 bg-black/35" />
        </motion.div>

        {/* Top Header Label */}
        <div className="z-10 text-center mt-4">
          <FadeIn delay={0.2}>
            <p className="text-[10px] tracking-[0.5em] uppercase font-semibold text-white/60">
              {invitationData.heroTitle || "The Wedding of"}
            </p>
          </FadeIn>
        </div>

        {/* Typography Balance for Names */}
        <div className="z-10 text-center text-white w-full max-w-lg my-auto px-4">
          <FadeIn delay={0.5} direction="none">
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-light tracking-tight leading-[1.15] lowercase">
              {invitationData.heroNames
                ?.split(" & ")
                .map((name: string, i: number, arr: string[]) => (
                  <span key={i} className="block">
                    {name}
                    {i < arr.length - 1 && (
                      <span className="block text-2xl my-2 text-white/40 font-serif font-light">&</span>
                    )}
                  </span>
                ))}
            </h1>
          </FadeIn>

          <FadeIn delay={0.7}>
            <div className="mt-8">
              <Countdown
                targetDate={invitationData.event_date}
                className="flex justify-center gap-6"
                numberClassName="text-2xl sm:text-3xl font-light tracking-tight text-white"
                labelClassName="text-[8px] uppercase tracking-[0.2em] text-white/50 block mt-1"
              />
            </div>
          </FadeIn>
        </div>

        {/* Bottom Date Anchor */}
        <div className="z-10 text-center w-full">
          <FadeIn delay={0.9}>
            <div className="flex items-center justify-center gap-4 text-white">
              <div className="h-[1px] w-8 bg-white/30" />
              <p className="text-sm tracking-widest uppercase font-light">
                {invitationData.event_date &&
                  new Date(invitationData.event_date).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    },
                  )}
              </p>
              <div className="h-[1px] w-8 bg-white/30" />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Timeline Section */}
      {features.multiEventSchedule && (
        <section className="py-16 md:py-28 px-6 border-b border-neutral-100">
          <div className="max-w-4xl mx-auto">
            <FadeIn>
              <p className="text-[10px] tracking-[0.4em] uppercase font-bold text-neutral-400 mb-12 text-center">
                Itinerario
              </p>
            </FadeIn>
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-12">
              {invitationData.timelineItems?.map(
                (item: TimelineItem, index: number) => (
                  <FadeIn key={index} delay={index * 0.05}>
                    <div className="relative pb-2 md:pb-0">
                      <p
                        className="text-2xl font-light mb-2 font-mono tracking-tight"
                        style={{ color: invitationData.primaryColor || "#737373" }}
                      >
                        {item.time}
                      </p>
                      <div className="h-[1px] w-12 bg-neutral-200 mb-3" />
                      <h3 className="text-base font-medium mb-1 tracking-tight">
                        {item.title}
                      </h3>
                      <p className="text-sm text-neutral-500 tracking-wide">
                        {item.location}
                      </p>
                    </div>
                  </FadeIn>
                ),
              )}
            </div>
          </div>
        </section>
      )}

      {/* GALLERY: Clean Horizontal Filmstrip */}
      {invitationData.galleryImages?.length > 0 && (
        <section className="py-20 md:py-32 bg-neutral-50 border-b border-neutral-100">
          <FadeIn>
            <p className="text-[10px] tracking-[0.4em] uppercase font-bold text-neutral-400 mb-10 text-center">
              Moments
            </p>
          </FadeIn>

          {/* Fixed mobile horizontal presentation with mask gradient */}
          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory px-6 md:px-[25vw] no-scrollbar pb-6 [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
            {invitationData.galleryImages.map((src: string, index: number) => (
              <div
                key={index}
                className="flex-none w-[80vw] max-w-[320px] md:max-w-[420px] snap-center cursor-pointer"
                onClick={() => setSelectedImage(src)}
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-white p-2.5 border border-neutral-200/60 shadow-sm rounded-md">
                  <img
                    src={src}
                    alt="Gallery split"
                    className="w-full h-full object-cover filter grayscale contrast-[102%] hover:grayscale-0 transition-all duration-700 ease-out"
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-[9px] uppercase tracking-widest text-neutral-400 mt-2">
            Swipe to view
          </p>
        </section>
      )}

      {/* Map Section */}
      {mapSrc && (
        <section className="py-20 md:py-36 px-6">
          <div className="max-w-xl mx-auto space-y-6">
            <FadeIn direction="none">
              <div className="text-center">
                <p className="text-[10px] tracking-[0.4em] uppercase font-bold text-neutral-400 mb-3">
                  Ubicación
                </p>
                <h2 className="text-3xl font-light tracking-tight mb-2">
                  {invitationData.locationName}
                </h2>
                <p className="text-sm tracking-wider text-neutral-500 max-w-xs mx-auto leading-relaxed">
                  {invitationData.mainVenueAddress}
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="w-full aspect-[4/3] sm:aspect-[16/9] bg-neutral-100 filter grayscale border border-neutral-200 p-1 rounded-lg">
                <iframe
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  src={mapSrc}
                />
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      {/* Dress Code Section */}
      {dressCode && (
        <section className="py-24 px-6 bg-white">
          <div className="max-w-md mx-auto flex flex-col items-center text-center">
            <FadeIn>
              <span className="block w-[1px] h-16 bg-neutral-200 mx-auto mb-8" /> 

              <p className="text-[10px] tracking-[0.4em] uppercase font-bold text-neutral-400 mb-6">
                Dress Code
              </p>

              <div className="w-full px-4">
                <DressCodePreview
                  dressCode={dressCode}
                  primaryColor={invitationData.primaryColor}
                  textColor={invitationData.textColor}
                />
              </div>

              <span className="block w-[1px] h-16 bg-neutral-200 mx-auto mt-12" />
            </FadeIn>
          </div>
        </section>
      )}

      {/* Recommendations Section */}
      {features.recommendations &&
        invitationData.recommendations?.length > 0 && (
          <section className="py-20 px-6">
            <div className="max-w-md mx-auto">
              <FadeIn>
                <p className="text-[10px] tracking-[0.4em] uppercase font-bold text-neutral-400 mb-10 text-center">
                  Accommodations
                </p>
              </FadeIn>

              <div className="space-y-4">
                {invitationData.recommendations.map(
                  (item: RecommendationItem, index: number) => (
                    <FadeIn key={index}>
                      <div className="p-6 rounded-lg bg-white border border-neutral-200/80 shadow-sm flex flex-col justify-between">
                        <div>
                          <h3 className="text-base font-semibold mb-1 tracking-tight">
                            {item.name}
                          </h3>
                          <p className="text-lg text-neutral-500 leading-relaxed mb-4">
                            {item.description}
                          </p>
                        </div>
                        {item.link && (
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] font-bold tracking-widest uppercase border-b w-fit pb-0.5 py-2 inline-block"
                            style={{
                              color: invitationData.primaryColor || "#171717",
                              borderColor: `${invitationData.primaryColor || "#171717"}40`,
                            }}
                          >
                            Explore Website
                          </a>
                        )}
                      </div>
                    </FadeIn>
                  ),
                )}
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
      <section className="py-20 px-6 bg-neutral-50 border-t border-neutral-100">
        <div className="max-w-md mx-auto">
          <FadeIn>
            <h2 className="text-2xl font-light tracking-tight text-center mb-8">
              Will you be joining us?
            </h2>
            <div className="bg-white p-6 border border-neutral-200/60 rounded-lg shadow-sm">
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