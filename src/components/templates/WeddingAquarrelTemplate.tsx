"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
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

// Extended TimelineItem to support our watercolor images
interface ExtendedTimelineItem extends TimelineItem {
  imageSrc?: string;
  imageAlt?: string;
}

type WeddingAquarrelTemplateProps = {
  template?: TemplateConfig;
  data?: EditorData;
  invitationId?: string;
};

export default function WeddingAquarrelTemplate({
  template,
  data,
  invitationId,
}: WeddingAquarrelTemplateProps) {
  // Hardcoded defaults to showcase the specific design request
  const invitationData = {
    backgroundColor: "#FDFBF7",
    textColor: "#333333",
    primaryColor: "#A39171",
    heroTitle: "SAVE THE DATE",
    heroNames: "Mark & Lindsay",
    event_date: "2025-07-21T15:00:00.000Z",
    mainVenueAddress: "Willow Chapel, 93 Street, Toronto, ON",
    locationName: "Willow Chapel",
    timelineTitle: "Wedding Details",
    guestCount: "2",
    galleryImages: [
        'https://images.unsplash.com/photo-1515934751635-481eff048a19?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1523438885224-827e4c141d45?q=80&w=1974&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1500964757637-c85e8a162699?q=80&w=2103&auto=format&fit=crop'
    ],
    timelineItems: [
      {
        title: "The Ceremony",
        time: "3:00 PM",
        location: "Willow Chapel, 93 Street, Toronto, ON",
        imageSrc: "/acuarela1.jpg",
        imageAlt: "Watercolor Church Ceremony",
      },
      {
        title: "The Reception",
        time: "5:00 PM (Cocktails) | 6:30 PM (Dinner)",
        location: "The Great Hall, 95 Street, Toronto, ON",
        imageSrc: "/acuarela2.jpg",
        imageAlt: "Watercolor Dinner Reception",
      },
    ] as ExtendedTimelineItem[],
    ...data,
  };

  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(invitationData.mainVenueAddress)}&t=&z=13&ie=UTF8&iwloc=&output=embed`;

  return (
    <div
      className="w-full antialiased overflow-x-hidden selection:bg-stone-200"
      style={{
        backgroundColor: invitationData.backgroundColor,
        color: invitationData.textColor,
      }}
    >
      {/* Hero Section - Adapted for light sketch without dark overlay */}
      <section className="relative min-h-[100dvh] w-full flex flex-col justify-center items-center overflow-hidden py-20">
        <div className="z-10 text-center px-6 w-full max-w-2xl flex flex-col items-center">
          
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2 }}
            className="relative w-full max-w-md aspect-[3/4] mb-8"
          >
            <img
              src="/save-date-acuarela.jpg"
              className="w-full h-full object-contain mix-blend-multiply"
              alt="Save the Date Sketch"
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, letterSpacing: "0.1em" }}
            animate={{ opacity: 1, letterSpacing: "0.25em" }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="uppercase text-sm mb-5 font-medium tracking-[0.25em] text-stone-500"
          >
            {invitationData.heroTitle}
          </motion.p>
          
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.6 }}
            className="text-4xl sm:text-5xl md:text-6xl font-serif tracking-widest px-2 uppercase"
          >
            {invitationData.heroNames}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.8 }}
            className="mt-8 text-sm tracking-[0.2em] uppercase leading-loose text-stone-600"
          >
            <p>21st July, 2025</p>
            <p>Willow Chapel, 93 Street</p>
            <p>Toronto, ON</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="mt-12 h-16 w-[1px] bg-stone-300 mx-auto"
          />
        </div>
      </section>

      {/* Timeline Section - Adapted to showcase watercolor images alongside text */}
      <section className="py-24 px-6 bg-transparent overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <AnimatedSection>
            <h2
              className="text-3xl md:text-4xl font-serif text-center mb-20 tracking-wide uppercase"
              style={{ color: invitationData.textColor }}
            >
              {invitationData.timelineTitle}
            </h2>
          </AnimatedSection>

          <div className="relative pl-6 md:pl-0 space-y-20 md:space-y-32">
            <div
              className="absolute left-1.5 md:left-1/2 top-2 bottom-2 w-[1px] -translate-x-1/2"
              style={{ backgroundColor: `${invitationData.primaryColor}40` }}
            />

            {invitationData.timelineItems?.map(
              (item: ExtendedTimelineItem, index: number) => (
                <div
                  key={index}
                  className={`flex flex-col md:flex-row items-center gap-8 md:gap-16 ${
                    index % 2 === 0 ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* Event Details Text Box */}
                  <div className="flex-1 w-full text-left">
                    <AnimatedSection delay={index * 0.05}>
                      <div
                        className={`p-8 rounded-sm bg-[#FDFBF7] shadow-sm border transition-transform duration-300 md:text-left ${
                          index % 2 === 0 ? "md:text-left" : "md:text-right"
                        }`}
                        style={{
                          borderColor: `${invitationData.primaryColor}20`,
                        }}
                      >
                        <h3
                          className="text-2xl sm:text-3xl font-serif mb-4 italic"
                          style={{ color: invitationData.textColor }}
                        >
                          {item.title}
                        </h3>
                        <div className="space-y-2">
                          <span
                            className="font-sans text-xs tracking-widest uppercase block font-medium"
                            style={{ color: invitationData.primaryColor }}
                          >
                            {item.time}
                          </span>
                          <p
                            className="font-light text-sm tracking-wide leading-relaxed"
                            style={{ color: `${invitationData.textColor}90` }}
                          >
                            {item.location}
                          </p>
                        </div>
                      </div>
                    </AnimatedSection>
                  </div>

                  {/* Timeline Dot */}
                  <div
                    className="absolute left-0 md:static z-10 w-3 h-3 md:w-4 md:h-4 rounded-full border-[3px] md:border-4 border-[#FDFBF7] shadow-sm mt-7 md:mt-0 -translate-x-1/2 md:translate-x-0"
                    style={{ backgroundColor: invitationData.primaryColor }}
                  />

                  {/* Event Watercolor Image */}
                  <div className="flex-1 w-full relative aspect-[4/3] rounded-sm overflow-hidden shadow-md">
                     <AnimatedSection delay={index * 0.1}>
                        {item.imageSrc && (
                          <img
                            src={item.imageSrc}
                            alt={item.imageAlt}
                            className="w-full h-full object-cover"
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

      {/* Map Section */}
      {mapSrc && (
        <section className="w-full bg-white border-y border-stone-200 flex flex-col">
          <div className="h-[45vh] w-full min-h-[320px] relative grayscale opacity-80 mix-blend-multiply">
            <iframe
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              src={mapSrc}
            />
          </div>
          <div className="p-12 bg-[#FDFBF7] text-center">
            <p className="text-xs tracking-[0.3em] uppercase font-bold text-stone-400 mb-3 font-sans">
              Location
            </p>
            {invitationData.locationName && (
              <p className="text-2xl font-serif italic mb-3 text-stone-800">
                {invitationData.locationName}
              </p>
            )}
            <p className="text-sm tracking-wide text-stone-600 font-sans max-w-sm mx-auto leading-relaxed">
              {invitationData.mainVenueAddress}
            </p>
          </div>
        </section>
      )}

{/* Gallery Section - Enhanced */}
      {invitationData.galleryImages && invitationData.galleryImages.length > 0 && (
        <section className="py-24 px-4 sm:px-6 bg-[#FDFBF7]">
          <div className="max-w-5xl mx-auto">
            <AnimatedSection>
              <h2
                className="text-3xl md:text-4xl font-serif text-center mb-12 tracking-wide uppercase"
                style={{ color: invitationData.textColor }}
              >
                Our Moments
              </h2>
            </AnimatedSection>
            
            {/* Enhanced Asymmetric Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              {invitationData.galleryImages.map((src: string, index: number) => (
                <AnimatedSection 
                  key={index} 
                  delay={index * 0.1}
                >
                  <div className={index === 0 ? "col-span-2 md:col-span-1" : "col-span-1"}>
                    <div 
                      className={`relative overflow-hidden rounded-md shadow-sm border border-stone-200/50 transition-all duration-500 hover:shadow-lg hover:-translate-y-1 ${
                        // Taller aspect ratio for the mobile hero image, square for the rest
                        index === 0 ? "aspect-[4/5] md:aspect-[4/5]" : "aspect-square md:aspect-[4/5]"
                      }`}
                    >
                      <img
                        src={src}
                        alt={`Gallery image ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-700 ease-in-out hover:scale-105"
                      />
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Guest Count Section */}
      <section className="py-16 px-6 text-center bg-[#FDFBF7]">
        <div className="max-w-md mx-auto">
          <AnimatedSection>
              <div className="inline-block border-y py-6 px-16 border-stone-200">
                  <p className="text-sm uppercase tracking-[0.3em] font-medium text-stone-600">
                      We have reserved {invitationData.guestCount} seats in your honor
                  </p>
              </div>
          </AnimatedSection>
        </div>
      </section>

      {/* RSVP Section */} 
      <section className="py-24 px-6 bg-white border-t border-stone-100">
        <div className="max-w-lg mx-auto">
          <AnimatedSection>
            <h2 
              className="text-4xl font-serif text-center mb-4 tracking-widest uppercase" 
              style={{ color: invitationData.textColor }}
            >
              RSVP
            </h2>
            <p className="text-center text-stone-500 mb-10 text-sm tracking-wide italic">
              Kindly reply by June 1st, 2025
            </p>
            <div className="bg-[#FDFBF7] p-8 sm:p-10 rounded-sm border border-stone-200 shadow-sm">
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
