"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, useInView } from "framer-motion";
import { TemplateConfig } from "@/lib/custom_types";
import { EditorData } from "@/lib/custom_types";
import Lightbox from "./shared/Lightbox";
import { RsvpTrigger } from './shared/RsvpTrigger';

// A utility for animations, similar to other templates
function AnimatedSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number; }) {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px 0px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.21, 0.45, 0.32, 0.9] }}
    >
      {children}
    </motion.div>
  );
}

type GardenWeddingTemplateProps = {
  template: TemplateConfig;
  data: EditorData;
  invitationId?: string;
  onRsvpClick?: () => void;
};

const TIMELINE_ICONS: { keywords: string[]; src: string }[] = [
  { keywords: ['ceremonia', 'ceremony', 'church', 'iglesia', 'misa', 'civil'], src: '/ceremonia-acuarela.png' },
  { keywords: ['recepción', 'recepcion', 'reception', 'cocktail', 'cóctel', 'coctel'], src: '/recepcion-acuarela.png' },
  { keywords: ['cena', 'dinner', 'baile', 'dance', 'banquete', 'banquet'], src: '/cena-acuarela.png' },
  { keywords: ['pastel', 'cake', 'tarta', 'torte'], src: '/cake-icon.png' },
  { keywords: ['tornaboda', 'afterparty', 'after', 'fiesta', 'party'], src: '/torna-acuarela.png' },
];

function getTimelineIcon(title: string, index: number): string {
  const lower = title.toLowerCase();
  const match = TIMELINE_ICONS.find(({ keywords }) => keywords.some((kw) => lower.includes(kw)));
  if (match) return match.src;
  // fallback: cycle through icons by index
  return TIMELINE_ICONS[index % TIMELINE_ICONS.length].src;
}

function normalizeExternalUrl(value?: string): string {
  if (!value) return '#';
  const trimmed = value.trim();
  if (!trimmed) return '#';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (/^www\./i.test(trimmed)) return `https://${trimmed}`;
  return `https://maps.google.com/maps?q=${encodeURIComponent(trimmed)}`;
}

export default function GardenWeddingTemplate({ template, data, invitationId, onRsvpClick }: GardenWeddingTemplateProps) {
  const { defaultData, features } = template;
  const invitationData = { ...defaultData, ...data };

  const coupleNames = invitationData.heroNames || `${invitationData.partner1Name || "Alicia"} & ${invitationData.partner2Name || "Oliver"}`;
  
  // Parse date for stylized display
  const dateObj = invitationData.event_date ? new Date(invitationData.event_date) : new Date(2026, 10, 7); // Nov 7, 2026 fallback
  const weddingDay = dateObj.toLocaleDateString('es-MX', { day: '2-digit' });
  const weddingMonth = dateObj.toLocaleDateString('es-MX', { month: 'long' });
  const weddingYear = dateObj.toLocaleDateString('es-MX', { year: 'numeric' });

  const primaryText = invitationData.textColor || '#292524';
  const accentColor = invitationData.primaryColor || '#646f58';
  const cardBgColor = invitationData.secondaryColor || '#8c8470';
  const bgColor = invitationData.backgroundColor || '#Fdfbf5';

  // Venue image controls
  const venueImageHeight = 144; // px
  const venueImageOffsetX = 0; // px
  const venueImageOffsetY = 0; // px

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setLightboxOpen(true);
  };

  const galleryImages = invitationData.galleryImages && invitationData.galleryImages.length > 0
    ? invitationData.galleryImages
    : ['/acuarela1.jpg', '/acuarela2.jpg', '/save-date-acuarela.jpg', '/garden-background.png'];

  const normalizeLink = (value?: string) => {
    if (!value?.trim()) return '#';
    const trimmed = value.trim();
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return `https://${trimmed}`;
  }

  const giftRegistryLink = normalizeLink(invitationData.giftRegistryUrl);
  const mapsLink = normalizeExternalUrl(invitationData.mainVenueAddress);
  const dressCodeWomenLink = normalizeExternalUrl(invitationData.dressCode?.pinterestUrlWoman);
  const dressCodeMenLink = normalizeExternalUrl(invitationData.dressCode?.pinterestUrlMan);

  return (
    <div className="max-w-md mx-auto bg-[#Fdfbf5] min-h-screen shadow-2xl overflow-hidden font-sans" style={{ color: primaryText, backgroundColor: bgColor }}>
      
      {/* 1. HERO / COVER SECTION */}
      <section className="relative w-full h-[800px] flex flex-col items-center justify-center p-6">
        {/* Full-section background image */}
        <div className="absolute inset-0 z-0">
          <Image src="/garden-background.png" alt="Garden background" fill className="object-cover" />
        </div>

        <div className="absolute top-0 left-80 w-58 h-58">
          <Image src="/flores-blancas.png" alt="White flowers" layout="fill" objectFit="contain" />
        </div>

        {/* Main Invitation Card */}
        <div className="relative z-10 w-full h-[550px] p-8 text-center shadow-lg flex flex-col justify-center items-center rounded-sm" style={{backgroundColor: cardBgColor, color: invitationData.buttonTextColor || '#f0eee4'}}>

          
          <p className="text-xs tracking-widest uppercase mb-8 z-10" dangerouslySetInnerHTML={{ __html: invitationData.heroTitle || "Join us for the<br />wedding of" }} />
          
          <h1 className="text-6xl font-serif italic mb-4 z-10 leading-tight">
            {coupleNames}
          </h1>
          
          <div className="mt-12 text-sm tracking-widest uppercase z-10 space-y-1">
            <p>{invitationData.locationName || "Villa Cantacuzino"}</p>
            <p>{invitationData.venue_city || "Tuscany, Italy"}</p>
          </div>
          
          {/* Outstanding Date Display (Animated) */}
          <motion.div 
            className="mt-10 z-10 flex flex-col items-center"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { 
                  staggerChildren: 0.4, 
                  delayChildren: 0.6 
                }
              }
            }}
          >
            {/* Month fades in and slides down slightly */}
            <motion.span 
              variants={{ 
                hidden: { opacity: 0, y: -10 }, 
                visible: { opacity: 0.9, y: 0 } 
              }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-xs uppercase tracking-[0.4em] mb-3"
            >
              {weddingMonth}
            </motion.span>
            
            {/* Day and lines fade and scale in */}
            <motion.div 
              variants={{ 
                hidden: { opacity: 0, scale: 0.95 }, 
                visible: { opacity: 1, scale: 1 } 
              }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="flex items-center justify-center gap-6"
            >
              <div className="w-12 h-[1px] bg-current opacity-40"></div>
              <span className="text-6xl font-serif italic leading-none drop-shadow-sm">
                {weddingDay}
              </span>
              <div className="w-12 h-[1px] bg-current opacity-40"></div>
            </motion.div>
            
            {/* Year fades in and slides up slightly */}
            <motion.span 
              variants={{ 
                hidden: { opacity: 0, y: 10 }, 
                visible: { opacity: 0.9, y: 0 } 
              }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-xs uppercase tracking-[0.4em] mt-4"
            >
              {weddingYear}
            </motion.span>
          </motion.div>
        </div>

        <div className="absolute bottom-16 left-4 w-32 h-32 z-20">
          <Image src="/wax-seal.png" alt="Wax seal" layout="fill" objectFit="contain" />
        </div>
      </section>

      {/* 2. PROGRAM OF THE DAY */}
      {features.multiEventSchedule && invitationData.timelineItems && (
        <section className="bg-[#fcfaf2] py-16 px-6">
          <h2 className="text-4xl font-serif italic text-center mb-12" style={{ color: accentColor }}>
            {invitationData.timelineTitle || "Programa del Día"}
          </h2>
          
          <div className="relative">
            {/* Vertical Timeline Line */}
            <div className="absolute left-1/4 top-0 bottom-0 w-px bg-gray-300"></div>
            {/* Top Heart on Timeline */}
            <div className="absolute left-1/4 top-0 -translate-x-1/2 -translate-y-1/2" style={{ color: accentColor }}>
              ♥
            </div>

            <div className="space-y-12">
              {invitationData.timelineItems.map((item: any, index: number) => (
                <div className="flex items-center" key={index}>
                  <div className="w-1/4 flex justify-center z-10 bg-[#fcfaf2] py-2">
                    <div className="relative w-12 h-12">
                      <Image
                        src={getTimelineIcon(item.title, index)}
                        alt={item.title}
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                  <div className="w-3/4 pl-6 text-center">
                    <h3 className="text-2xl font-serif italic" style={{ color: accentColor }}>{item.title}</h3>
                    <p className="text-xl mt-1">{item.time}</p>
                    <p className="text-[15px] font-serif font-light text-gray-500 mt-1 leading-relaxed tracking-[0.04em]" dangerouslySetInnerHTML={{ __html: item.location.replace(/\n/g, '<br />') }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 2.5. OUR STORY / GALLERY */}
      {features.gallery && galleryImages && (
        <section className="bg-[#Fdfbf5] py-16 px-6">
          <AnimatedSection>
            <h2 className="text-4xl font-serif italic text-center mb-12" style={{ color: accentColor }}>
              {invitationData.galleryTitle || "Our Story"}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {galleryImages.map((src: any, index: number) => (
                <motion.div
                  key={index}
                  className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-lg cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => handleImageClick(src)}
                >
                  <Image
                    src={src}
                    alt={`Gallery image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        </section>
      )}

      {/* 3. VENUE SECTION */}
      <section className="text-center pt-12 pb-0 flex flex-col items-center relative overflow-hidden" style={{backgroundColor: accentColor, color: invitationData.buttonTextColor || '#fcfaf2'}}>
        <h2 className="text-5xl font-serif italic mb-6">{invitationData.locationName || "Ubicación"}</h2>
        <p className="px-8 text-sm leading-relaxed mb-8" dangerouslySetInnerHTML={{ __html: invitationData.receptionText || "Nuestra boda se llevará a cabo en:<br />Villa Cantacuzino,<br />Valle de Guadalupe, Baja California, México.<br />¡Esperamos verlos allí para celebrar juntos!" }} />
        <a
          href={mapsLink}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#fcfaf2] text-[#646f58] px-8 py-3 rounded-full text-xs font-semibold tracking-widest shadow-md hover:bg-gray-100 transition"
        >
          Mapa
        </a>
        
        {/* Venue image */}
        <div
          className="w-full mt-8 relative overflow-hidden"
          style={{ height: `${venueImageHeight}px` }}
        >
          <Image
            src="/wedding-venue2.png"
            alt="Wedding venue"
            fill
            className="object-cover"
            style={{ transform: `translate(${venueImageOffsetX}px, ${venueImageOffsetY}px)` }}
          />
        </div>
      </section>

      {/* 4. DRESS CODE */}
      {features.dressCode && (
        <section className="bg-[#fcfaf2] pb-16">
          <div className="px-6 pt-10 text-center">
            <h2 className="text-4xl font-serif italic mb-6" style={{color: accentColor}}>
              {invitationData.dressCodeTitle || "Дресс-код"}
            </h2>
            
            <p 
              className="text-[15px] font-serif font-light text-gray-600 mb-8 leading-8 tracking-[0.045em]" 
              dangerouslySetInnerHTML={{ __html: invitationData.dressCodeDetails || "Мы будем рады видеть вас в образах<br />в пастельных, мягких оттенках — это поможет<br />создать лёгкую и гармоничную атмосферу<br />праздника."}} 
            />

            {/* Redesigned Attire Buttons */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 sm:gap-10 mt-8">
              <div className="flex flex-col items-center">
                <p className="font-serif italic text-xl mb-3" style={{color: accentColor}}>Mujeres</p>
                <a
                  href={dressCodeWomenLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-6 py-2.5 rounded-full text-xs font-semibold tracking-widest uppercase shadow-md hover:opacity-85 transition-opacity duration-300"
                  style={{ backgroundColor: accentColor, color: invitationData.buttonTextColor || '#fcfaf2' }}
                >
                  Ver inspiración
                </a>
              </div>
              
              <div className="flex flex-col items-center">
                <p className="font-serif italic text-xl mb-3" style={{color: accentColor}}>Hombres</p>
                <a
                  href={dressCodeMenLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-6 py-2.5 rounded-full text-xs font-semibold tracking-widest uppercase shadow-md hover:opacity-85 transition-opacity duration-300"
                  style={{ backgroundColor: accentColor, color: invitationData.buttonTextColor || '#fcfaf2' }}
                >
                  Ver inspiración
                </a>
              </div>
            </div>
            
          </div>
        </section>
      )}

      {/* 5. WISHES & GIFTS */}
      <section className="bg-[#f3f0e6] py-16 px-4 relative">
         <div className="absolute inset-0 opacity-30 pointer-events-none flex items-center justify-center border border-dashed border-gray-400">
            [Background Floral/Lilies Placeholder]
         </div>

        {/* Gift Card */}
        <div className="bg-[#fcfaf2] rounded-lg p-8 shadow-md relative max-w-sm mx-auto mb-8 z-10 rotate-1">
          <div className="absolute -top-6 left-1/2 -translate-x-1/2">
            <Image
              src="/green-gift.png"
              alt="Green gift icon"
              width={48}
              height={48}
              className="object-contain"
            />
          </div>

          <h3 className="text-3xl font-serif italic text-center mb-4 mt-2" style={{color: accentColor}}>{invitationData.giftTitle || 'Mesa de Regalos'}</h3>
          
          <div className="text-center text-[15px] font-serif font-light text-gray-600 space-y-6 leading-8 tracking-[0.04em]">
            <p dangerouslySetInnerHTML={{ __html: invitationData.giftMessage || ''}} />
          </div>

          <a
            href={giftRegistryLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 w-full inline-flex items-center justify-center bg-[#646f58] text-[#fcfaf2] px-6 py-3 rounded-full text-xs font-semibold tracking-widest shadow-md hover:opacity-90 transition"
          >
            IR A LA MESA DE REGALOS
          </a>
        </div>
      </section>



      <Lightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        imageUrl={selectedImage}
      />

      {onRsvpClick && (
        <section className="bg-[#fcfaf2] py-16 px-6 text-center">
          <AnimatedSection>
            <div className="max-w-md mx-auto">
                <RsvpTrigger onClick={onRsvpClick} primaryColor={accentColor} textColor={primaryText} />
            </div>
          </AnimatedSection>
        </section>
      )}
    </div>
  );
}