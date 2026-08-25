"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { TimelineItem, DressCode, TemplateConfig, EditorData } from "@/lib/custom_types";
import { DressCodePreview } from "./shared/DressCodePreview";
import Countdown from "./shared/Countdown";
import { RsvpTrigger } from "./shared/RsvpTrigger";

function normalizeExternalUrl(value?: string): string {
  if (!value) return '#';
  const trimmed = value.trim();
  if (!trimmed) return '#';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (/^www\./i.test(trimmed)) return `https://${trimmed}`;
  return `https://maps.google.com/maps?q=${encodeURIComponent(trimmed)}`;
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

type MasqueradeXvTemplateProps = {
  template: TemplateConfig;
  data: EditorData;
  invitationId?: string;
  onRsvpClick?: () => void;
};

export default function MasqueradeXvTemplate({
  template,
  data,
  invitationId,
  onRsvpClick,
}: MasqueradeXvTemplateProps) {
  const { features, defaultData } = template;
  const invitationData = { ...defaultData, ...data };

  const mapSrc = invitationData.mainVenueAddress
    ? `https://maps.google.com/maps?q=${encodeURIComponent(invitationData.mainVenueAddress)}&t=&z=13&ie=UTF8&iwloc=&output=embed`
    : "";

  const dressCode: DressCode | undefined = invitationData.dressCode;

  return (
    <div
      className="relative w-full antialiased overflow-x-hidden selection:bg-yellow-900/30 min-h-screen p-4 sm:p-8"
      style={{
        color: invitationData.textColor || "#3a2d23",
        fontFamily: 'var(--font-playfair-display), serif',
        backgroundColor: "#e9c690",
      }}
    >
      {/* Background Textures */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/beige-vintage.jpg')" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 35%, rgba(255,243,214,0.35) 0%, rgba(233,198,144,0) 60%), radial-gradient(circle at 10% 10%, rgba(60,35,18,0.28) 0%, rgba(60,35,18,0) 35%), radial-gradient(circle at 90% 90%, rgba(60,35,18,0.28) 0%, rgba(60,35,18,0) 35%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            boxShadow: "inset 0 0 90px rgba(18, 10, 6, 0.45)",
          }}
        />
      </div>

      {/* Ornate Frame Overlay */}
      <div className="pointer-events-none absolute inset-4 sm:inset-4 z-50">
        {/* Connecting Border Lines */}
        <div className="absolute inset-0 border border-black/80" />
        <div className="absolute inset-[4px] border-2 border-black/90" />

        {/* Corners sit on the inner border line so they stay flush with it */}
        <div className="absolute inset-[4px]">
          {/* Top Left Corner */}
          <div className="absolute top-0 left-0 w-28 h-28 sm:w-50 sm:h-50">
            <Image
              src="/corner-black.png"
              alt=""
              fill
              className="object-contain object-right-top transform scale-x-[-1]"
            />
          </div>

          {/* Top Right Corner */}
          <div className="absolute top-0 right-0 w-28 h-28 sm:w-50 sm:h-50">
            <Image
              src="/corner-black.png"
              alt=""
              fill
              className="object-contain object-right-top"
            />
          </div>

          {/* Bottom Left Corner */}
          <div className="absolute bottom-0 left-0 w-28 h-28 sm:w-50 sm:h-50">
            <Image
              src="/corner-black.png"
              alt=""
              fill
              className="object-contain object-right-bottom transform scale-x-[-1] scale-y-[-1]"
            />
          </div>

          {/* Bottom Right Corner */}
          <div className="absolute bottom-0 right-0 w-28 h-28 sm:w-50 sm:h-50">
            <Image
              src="/corner-black.png"
              alt=""
              fill
              className="object-contain object-right-top transform scale-y-[-1]"
            />
          </div>
        </div>
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="relative w-full flex flex-col justify-center items-center py-20 px-6 sm:py-32 sm:px-12">
          <div className="z-10 text-center w-full max-w-lg">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-8 sm:mt-16 mb-8"
            >
              <Image 
                src="/mascara-logo.png"
                alt="Masquerade Mask" 
                width={250} 
                height={200}
                className="mx-auto"
              />
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-2xl uppercase tracking-widest mb-4"
            >
              {invitationData.heroTitle || "Save the Date"}
            </motion.p>
            
            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
              className="font-bold tracking-tight mb-4 text-center text-balance mx-auto max-w-full whitespace-normal px-2"
              style={{
                color: "#580409",
                fontSize: "clamp(1.6rem, 7.8vw, 4.2rem)",
                lineHeight: 0.95,
                overflowWrap: "normal",
                wordBreak: "normal",
              }}
            >
              {invitationData.heroNames}
            </motion.h1>
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.1 }}
              className="text-3xl sm:text-4xl tracking-wider mb-8"
              style={{ color: "#580409" }}
            >
              XV
            </motion.h2>

            {invitationData.event_date && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.4 }}
                className="text-2xl mb-8"
              >
                <p>{new Date(invitationData.event_date).toLocaleDateString('es-ES', { day: 'numeric' })} de {new Date(invitationData.event_date).toLocaleDateString('es-ES', { month: 'long' })}</p>
                <p>{new Date(invitationData.event_date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}</p>
              </motion.div>
            )}

            {invitationData.event_date && (
              <Countdown 
                targetDate={invitationData.event_date}
                className="flex flex-nowrap justify-center items-start gap-4 sm:gap-8 mt-8 mx-auto px-6 sm:px-12"
                itemClassName="text-center shrink-0"
                numberClassName="block text-3xl sm:text-4xl"
                labelClassName="block text-xs uppercase tracking-widest"
              />
            )}
          </div>
        </section>

        {/* Separator */}
        <div className="w-full flex justify-center px-8 sm:px-16">
          <Image
            src="/black-separator-good.png"
            alt=""
            width={800}
            height={60}
            className="w-full max-w-xl h-auto opacity-80"
          />
        </div>

        {/* Timeline Section */}
        {features.multiEventSchedule && (
          <section className="py-2 px-6">
            <div className="max-w-xl mx-auto">
              <AnimatedSection>
                <h2
                  className="text-4xl sm:text-5xl font-serif text-center mb-12"
                  style={{ color: invitationData.textColor }}
                >
                  {invitationData.timelineTitle || "The Celebration"}
                </h2>
              </AnimatedSection>

              <div className="space-y-6">
                {invitationData.timelineItems?.map((item: TimelineItem, index: number) => (
                  <AnimatedSection key={index} delay={index * 0.1}>
                    <div className="flex flex-col items-center text-center">
                      <span className="text-lg font-bold tracking-widest uppercase mb-3" style={{ color: "#580409" }}>
                        {item.time}
                      </span>
                      <h3
                        className="text-2xl mb-2"
                        style={{ color: invitationData.textColor }}
                      >
                        {item.title}
                      </h3>
                      <p className="text-base tracking-wide leading-relaxed opacity-80 max-w-xs" style={{ color: invitationData.textColor }}>
                        {item.location}
                      </p>
                      {item.mapLink && (
                        <a
                          href={normalizeExternalUrl(item.mapLink)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-4 inline-block px-6 py-2 rounded-full border text-sm font-semibold tracking-wider uppercase transition hover:bg-black/10"
                          style={{
                            borderColor: `${invitationData.primaryColor || invitationData.textColor}80`,
                            color: invitationData.primaryColor || invitationData.textColor,
                          }}
                        >
                          Ver en Mapa
                        </a>
                      )}
                      {index !== invitationData.timelineItems.length - 1 && (
                        <div className="w-px h-8 mt-6 bg-black/20" />
                      )}
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Dress Code Section */}
        {dressCode && (
          <section className="py-1 px-6">
            <div className="max-w-md mx-auto text-center py-12">
              <Image
                src="/black-separator-2.png"
                alt=""
                width={800}
                height={40}
                className="w-full h-auto mb-10 opacity-80"
              />
              <AnimatedSection>
                <p className="text-sm tracking-[0.3em] uppercase font-bold mb-3" style={{color: invitationData.secondaryColor}}>
                  Dress Code
                </p>
                <h2 className="text-4xl font-serif text-center mb-8" style={{ color: invitationData.textColor }}>
                  Código de Vestimenta
                </h2>
                <div className="w-full px-4">
                  <DressCodePreview
                    dressCode={dressCode}
                    primaryColor={invitationData.primaryColor}
                    textColor={invitationData.textColor}
                  />
                </div>
                  <a
                    href={normalizeExternalUrl(invitationData.dressCodeLink || 'https://www.pinterest.com/search/pins/?q=masquerade%20dress%20code')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-block px-6 py-2 rounded-full border text-sm font-semibold tracking-wider uppercase transition hover:bg-black/10"
                    style={{
                      borderColor: '#580409',
                      color: '#580409',
                    }}
                  >
                    Dress Code
                  </a>
              </AnimatedSection>
              <Image
                src="/black-separator-2.png"
                alt=""
                width={800}
                height={40}
                className="w-full h-auto mt-10 opacity-80"
              />
            </div>
          </section>
        )}

        {/* Map Section */}
        {mapSrc && (
          <section className="w-full flex flex-col items-center pt-10 pb-24 sm:pb-28 px-6">
            <AnimatedSection>
                <h2 className="text-4xl font-serif text-center mb-8" style={{ color: '#580409'}}>
                  Ubicación
                </h2>
                {invitationData.locationName && <p className="text-2xl font-serif italic mb-4 text-center">{invitationData.locationName}</p>}
                <p className="text-base tracking-wide text-center max-w-xs mx-auto leading-relaxed mb-8">
                  {invitationData.mainVenueAddress}
                </p>
              </AnimatedSection>
            <div className="h-[30vh] w-full max-w-3xl grayscale">
              <iframe
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                src={mapSrc}
              />
            </div>
          </section>
        )}

          {onRsvpClick && (
            <section className="py-20 px-6 text-center">
              <RsvpTrigger onClick={onRsvpClick} primaryColor={invitationData.primaryColor} />
            </section>
          )}
        </div>
      </div>
  );
}