"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import {
  EditorData,
  TemplateConfig,
  TimelineItem,
  DressCode,
  RecommendationItem,
} from "@/lib/types";
import { DressCodePreview } from "./shared/DressCodePreview";
import { RsvpSection } from "./shared/RsvpSection";
import GiftSection from "./shared/GiftSection";
import Countdown from "./shared/Countdown";

interface ExtendedTimelineItem extends TimelineItem {
  imageSrc?: string;
}

function AnimatedSection({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px 0px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, delay, ease: [0.21, 0.45, 0.32, 0.9] }}
    >
      {children}
    </motion.div>
  );
}

type TimelineTemplateProps = {
  template: TemplateConfig;
  data: EditorData;
  invitationId?: string;
};

export default function TimelineTemplate({
  template,
  data,
  invitationId,
}: TimelineTemplateProps) {
  const { features, defaultData } = template;
  const invitationData = { ...defaultData, ...data };

  const mapSrc = invitationData.mainVenueAddress
    ? `https://maps.google.com/maps?q=${encodeURIComponent(invitationData.mainVenueAddress)}&t=&z=13&ie=UTF8&iwloc=&output=embed`
    : "";

  const dressCode: DressCode | undefined = invitationData.dressCode;

  const imageMap: { [key: string]: string } = {
    "Ceremonia": "/ceremonia-acuarela.png",
    "Recepción": "/recepcion-acuarela.png",
    "Cena y Baile": "/cena-acuarela.png",
    "Tornaboda": "/torna-acuarela.png",
  };

  const timelineItemsWithImages = invitationData.timelineItems?.map((item: TimelineItem) => ({
      ...item,
      imageSrc: imageMap[item.title] || '',
  })) as ExtendedTimelineItem[];

  return (
    <div
      className="w-full antialiased overflow-x-hidden selection:bg-stone-100"
      style={{
        backgroundColor: invitationData.backgroundColor || "#fdfdfc",
        color: invitationData.textColor || "#171717",
      }}
    >
      {/* Hero Section */}
      <section className="relative h-[100dvh] min-h-[560px] w-full flex flex-col justify-center items-center overflow-hidden">
        <motion.div
          initial={{ scale: 1.05, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0 z-0"
        >
          <Image
            src={
              invitationData.hero_image_url ||
              "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80"
            }
            fill
            className="object-cover"
            alt="Wedding Hero"
          />
          <div className="absolute inset-0 bg-black/35 backdrop-blur-[1px]" />
        </motion.div>

        <div className="z-10 text-center text-white px-6 w-full max-w-xl">
          <motion.p
            initial={{ opacity: 0, letterSpacing: "0.1em" }}
            animate={{ opacity: 1, letterSpacing: "0.25em" }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="uppercase text-xs mb-5 font-medium tracking-[0.25em] opacity-90"
          >
            {invitationData.heroTitle || "Save the Date"}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.6 }}
            className="text-4xl sm:text-6xl md:text-8xl font-serif italic tracking-tight px-2 leading-tight"
          >
            {invitationData.heroNames}
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.8 }}
            className="mt-6"
          >
            {invitationData.event_date && (
              <Countdown 
                targetDate={invitationData.event_date}
                className="flex justify-center gap-4 sm:gap-6"
                numberClassName="text-3xl sm:text-4xl font-serif text-white"
                labelClassName="text-[10px] uppercase tracking-widest text-white/70 block mt-0.5"
              />
            )}
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="mt-8 h-10 w-[1px] bg-white/60 mx-auto"
          />
        </div>
      </section>

      {/* Timeline Section */}
      {features.multiEventSchedule && (
        <section className="py-20 px-6 bg-white overflow-hidden">
          <div className="max-w-xl mx-auto">
            <AnimatedSection>
              <h2
                className="text-3xl md:text-5xl font-serif text-center mb-16 italic"
                style={{ color: invitationData.textColor }}
              >
                {invitationData.timelineTitle || "The Celebration"}
              </h2>
            </AnimatedSection>

            <div className="relative space-y-12 md:space-y-24">
              {/* Perfectly centered timeline dot track */}
              <div
                className="absolute left-1/2 top-2 bottom-2 w-[1px] -translate-x-1/2"
                style={{ backgroundColor: `${invitationData.textColor}1A` }}
              />

              {timelineItemsWithImages?.map(
                (item: ExtendedTimelineItem, index: number) => (
                  <div
                    key={index}
                    // Enforce flex-row layout on all screen sizes to keep the images side-by-side
                    className={`flex flex-row items-center gap-4 sm:gap-8 ${index % 2 === 0 ? "flex-row-reverse" : ""}`}
                  >
                    {/* min-w-0 prevents flex items from overflowing when content is too long */}
                    <div className="flex-1 w-full min-w-0">
                      <AnimatedSection delay={index * 0.05}>
                        <div
                          // break-words ensures long unspaced strings wrap instead of breaking the layout
                          className={`p-4 sm:p-8 rounded-2xl border bg-white shadow-sm transition-transform duration-300 break-words ${
                            index % 2 === 0 ? "text-left" : "text-right"
                          }`}
                          style={{
                            borderColor: `${invitationData.textColor}12`,
                          }}
                        >
                          <span
                            className="font-mono text-[9px] sm:text-[11px] tracking-widest uppercase mb-1.5 block font-medium"
                            style={{ color: invitationData.primaryColor }}
                          >
                            {item.time}
                          </span>
                          <h3
                            className="text-lg sm:text-2xl font-serif mb-1.5"
                            style={{ color: invitationData.textColor }}
                          >
                            {item.title}
                          </h3>
                          <p
                            className="font-light text-[10px] sm:text-sm"
                            style={{ color: `${invitationData.textColor}80` }}
                          >
                            {item.location}
                          </p>
                        </div>
                      </AnimatedSection>
                    </div>

                    {/* shrink-0 keeps the dot perfectly sized regardless of text length */}
                    <div
                      className="z-10 w-3 h-3 sm:w-4 sm:h-4 rounded-full border-[3px] sm:border-4 border-white shadow-sm shrink-0"
                      style={{ backgroundColor: invitationData.primaryColor }}
                    />
                    
                    {/* Images are now visible on all sizes (hidden class removed) */}
                    <div className="flex-1 min-w-0">
                      <AnimatedSection delay={index * 0.1}>
                        {item.imageSrc && (
                            <Image
                              src={item.imageSrc}
                              alt={item.title}
                              width={192}
                              height={192}
                              className="object-contain mx-auto w-20 sm:w-48"
                            />
                        )}
                      </AnimatedSection>
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        </section>
      )}

      {/* GALLERY */}
      {(invitationData.galleryImages?.length || 0) > 0 && (
        <section
          className="py-20 overflow-hidden"
          style={{ backgroundColor: `${invitationData.backgroundColor}60` }}
        >
          <AnimatedSection>
            <h2
              className="text-3xl font-serif text-center mb-12 italic"
              style={{ color: invitationData.textColor }}
            >
              {invitationData.galleryTitle || "Captured Moments"}
            </h2>
          </AnimatedSection>

          <div className="flex gap-5 overflow-x-auto snap-x snap-mandatory px-6 md:px-[20vw] no-scrollbar pb-6 items-center">
            {invitationData.galleryImages?.map((src: string, index: number) => (
              <motion.div
                key={index}
                className="flex-none w-[80vw] max-w-[310px] md:w-[380px] snap-center"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20px" }}
              >
                <div className="bg-white p-2.5 pb-8 shadow-md shadow-stone-900/5 border border-stone-200/50 rounded-sm">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-xs bg-stone-50">
                    <Image
                      src={src}
                      alt="Gallery presentation"
                      fill
                      className="object-cover filter contrast-[98%] transition-all duration-500"
                    />
                  </div>
                  <div className="mt-3.5 flex justify-center items-center gap-1 opacity-40">
                    <div className="h-[1px] w-4 bg-stone-400" />
                    <span className="font-serif italic text-[10px] text-stone-600 tracking-wide">{index + 1}</span>
                    <div className="h-[1px] w-4 bg-stone-400" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Dress Code Section - Redesigned as an editorial block */}
      {dressCode && (
        <section className="pt-16 pb-8 px-6" style={{ backgroundColor: invitationData.backgroundColor || "#fdfdfc" }}>
          <div className="max-w-md mx-auto text-center border-y py-10" style={{ borderColor: `${invitationData.textColor}15` }}>
            <AnimatedSection>
              <p className="text-[10px] tracking-[0.3em] uppercase font-bold text-stone-400 mb-3 font-sans">
                Dress Code
              </p>
              <h2 className="text-3xl font-serif text-center mb-6 italic" style={{ color: invitationData.textColor }}>
                Vestimenta
              </h2>
              <div className="w-full px-4">
                <DressCodePreview
                  dressCode={dressCode}
                  primaryColor={invitationData.primaryColor}
                  textColor={invitationData.textColor}
                />
              </div>
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* Accommodations Block - Tightened spacing */}
      {features.recommendations &&
        (invitationData.recommendations?.length || 0) > 0 && (
          <section className="py-10 px-6">
            <div className="max-w-md mx-auto">
              <AnimatedSection>
                <h2 className="text-2xl font-serif text-center mb-8 italic" style={{ color: invitationData.textColor }}>
                  Hospedaje y Recomendaciones
                </h2>
              </AnimatedSection>
              <motion.div
                className="space-y-4"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={{
                  visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.1 },
                  },
                  hidden: { opacity: 0 },
                }}
              >
                {invitationData.recommendations?.map(
                  (item: RecommendationItem, index: number) => (
                    <motion.div
                      key={index}
                      variants={{
                        visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.21, 0.45, 0.32, 0.9] } },
                        hidden: { opacity: 0, y: 20 },
                      }}
                      className="p-6 rounded-2xl bg-white shadow-sm flex flex-col justify-between border w-full text-center sm:text-left"
                      style={{ borderColor: `${invitationData.textColor}0A` }}
                    >
                      <div>
                        <h3 className="text-xl font-serif mb-2" style={{ color: invitationData.primaryColor }}>
                          {item.name}
                        </h3>
                        <p className="text-xs font-light leading-relaxed mb-4 opacity-80" style={{ color: invitationData.textColor }}>
                          {item.description}
                        </p>
                      </div>
                      {item.link && (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] uppercase tracking-widest font-bold border-b pb-0.5 w-fit mx-auto sm:mx-0 transition-opacity hover:opacity-60 py-2 inline-block"
                          style={{ color: invitationData.primaryColor, borderColor: `${invitationData.primaryColor}30` }}
                        >
                          Visit Website
                        </a>
                      )}
                    </motion.div>
                  ),
                )}
              </motion.div>
            </div>
          </section>
        )}

      {/* Map Section */}
      {mapSrc && (
        <section className="w-full bg-white border-t border-stone-100 flex flex-col">
          <div className="h-[45vh] w-full min-h-[320px] relative grayscale">
            <iframe
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              src={mapSrc}
            />
          </div>
          <div className="p-8 bg-stone-50 border-b border-stone-100 text-center">
            <p className="text-[10px] tracking-[0.2em] uppercase font-bold text-stone-400 mb-2 font-sans">Ubicación</p>
            {invitationData.locationName && <p className="text-xl font-serif italic mb-2">{invitationData.locationName}</p>}
            <p className="text-xs tracking-wide text-stone-600 font-sans max-w-xs mx-auto leading-relaxed">
              {invitationData.mainVenueAddress}
            </p>
          </div>
        </section>
      )}

      {/* Gift Section */}
      <GiftSection 
        giftRegistryUrl={invitationData.giftRegistryUrl}
        primaryColor={invitationData.primaryColor}
        textColor={invitationData.textColor}
      />

      {/* Guest Count Section */}
      <section className="pb-16 px-6 text-center">
        <div className="max-w-md mx-auto">
          <AnimatedSection>
              <h2 className="text-3xl font-serif text-center mb-8 italic" style={{ color: invitationData.textColor }}>
                Pases de Acceso
              </h2>
              <div className="inline-block border-y py-4 px-12" style={{ borderColor: `${invitationData.textColor}1A` }}>
                  <p className="text-sm uppercase tracking-[0.3em] font-medium">
                      {invitationData.guestCount || "2"} Lugares
                  </p>
              </div>
          </AnimatedSection>
        </div>
      </section>

      {/* RSVP Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-md mx-auto">
          <AnimatedSection>
            <h2 className="text-3xl font-serif text-center mb-8 italic" style={{ color: invitationData.textColor }}>
              Confirmación de Asistencia
            </h2>
            <div className="bg-stone-50/50 p-6 rounded-2xl border border-stone-100 shadow-xs">
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
        </div>
      </section>
    </div>
  );
}