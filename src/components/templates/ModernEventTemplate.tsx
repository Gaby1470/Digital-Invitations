"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { TimelineItem, TemplateConfig, EditorData } from "@/lib/custom_types";
import Countdown from "./shared/Countdown";
import { MapPinIcon, CalendarIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { RsvpTrigger } from './shared/RsvpTrigger';

// A reusable fade-in component for modern animations
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
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

type ModernEventTemplateProps = {
  template: TemplateConfig;
  data: EditorData;
  invitationId?: string;
  onRsvpClick?: () => void;
};

export default function ModernEventTemplate({
  template,
  data,
  invitationId,
  onRsvpClick,
}: ModernEventTemplateProps) {
  const { defaultData, features } = template;
  const invitationData = { ...defaultData, ...data };

  // Use platform colors as fallback
  const primaryColor = invitationData.primaryColor || '#4f46e5'; // indigo-600
  const secondaryColor = invitationData.secondaryColor || '#ec4899'; // pink-500
  const backgroundColor = invitationData.backgroundColor || '#f8fafc'; // slate-50
  const textColor = invitationData.textColor || '#1e293b'; // slate-800

  const mapSrc = invitationData.mainVenueAddress
    ? `https://maps.google.com/maps?q=${encodeURIComponent(invitationData.mainVenueAddress)}&t=&z=13&ie=UTF8&iwloc=&output=embed`
    : "";

  return (
    <div
      className="w-full font-sans antialiased"
      style={{
        backgroundColor: backgroundColor,
        color: textColor,
      }}
    >
      {/* Hero Section */}
      <section
        className="relative min-h-[90vh] w-full flex flex-col justify-center items-center text-center overflow-hidden px-6 py-20"
      >
        <div 
          className="absolute inset-0 bg-gradient-to-br from-indigo-100 via-pink-50 to-white"
          style={{
            background: `radial-gradient(circle at top left, ${primaryColor}10, transparent 40%), radial-gradient(circle at bottom right, ${secondaryColor}10, transparent 50%)`,
            backgroundColor: backgroundColor,
          }}
        />

        <div className="relative z-10 max-w-3xl mx-auto">
          <FadeIn>
            <h2 className="text-lg font-semibold tracking-widest uppercase" style={{ color: primaryColor }}>
              {invitationData.mainTitle || "You're Invited"}
            </h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight my-6 text-slate-900">
              {invitationData.eventName || "Modern Event Celebration"}
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="text-lg md:text-xl max-w-2xl mx-auto text-slate-600">
              {invitationData.eventDescription || "Join us for a special celebration filled with joy, laughter, and unforgettable moments."}
            </p>
          </FadeIn>
          {invitationData.eventDate && (
             <FadeIn delay={0.3}>
                <div className="mt-12">
                    <Countdown
                        targetDate={invitationData.eventDate}
                        className="flex justify-center gap-8"
                        numberClassName="text-4xl sm:text-5xl font-bold text-slate-900"
                        labelClassName="text-xs uppercase tracking-wider text-slate-500 block mt-2"
                    />
                </div>
            </FadeIn>
          )}
        </div>
      </section>

      {/* Details Section */}
      <section className="py-20 md:py-28 px-6">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <FadeIn>
                <div className="space-y-8">
                    <div className="flex gap-6">
                        <div className="w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center" style={{backgroundColor: `${primaryColor}15`}}>
                            <CalendarIcon className="w-6 h-6" style={{color: primaryColor}}/>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 mb-1">When</h3>
                            <p className="text-slate-600 text-lg">
                                {invitationData.eventDate ? new Date(invitationData.eventDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : 'TBD'}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-6">
                        <div className="w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center" style={{backgroundColor: `${primaryColor}15`}}>
                            <MapPinIcon className="w-6 h-6" style={{color: primaryColor}}/>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 mb-1">Where</h3>
                            <p className="text-slate-600 text-lg">{invitationData.venueName || 'Venue TBD'}</p>
                            <p className="text-slate-500">{invitationData.mainVenueAddress}</p>
                        </div>
                    </div>
                </div>
            </FadeIn>
            {mapSrc && (
                <FadeIn delay={0.1}>
                    <div className="w-full aspect-[4/3] bg-slate-200 rounded-2xl overflow-hidden border-4 border-white shadow-lg">
                        <iframe
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        loading="lazy"
                        src={mapSrc}
                        />
                    </div>
                </FadeIn>
            )}
        </div>
      </section>

      {/* Timeline Section */}
      {features.multiEventSchedule && invitationData.timelineItems?.length > 0 && (
        <section className="py-20 md:py-28 px-6 bg-slate-100">
          <div className="max-w-4xl mx-auto">
            <FadeIn>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 text-center mb-12">Event Schedule</h2>
            </FadeIn>
            <div className="space-y-8 relative border-l-2 border-indigo-200 ml-4">
              {invitationData.timelineItems.map(
                (item: TimelineItem, index: number) => (
                  <FadeIn key={index} delay={index * 0.1}>
                    <div className="pl-8 relative">
                        <div className="absolute -left-[11px] top-1 w-5 h-5 rounded-full" style={{backgroundColor: primaryColor, border: `4px solid ${backgroundColor}`}}></div>
                        <p className="text-md font-semibold" style={{ color: primaryColor }}>
                            {item.time}
                        </p>
                        <h3 className="text-xl font-bold text-slate-800 mt-1 mb-2">
                            {item.title}
                        </h3>
                        <p className="text-slate-600">
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

      {onRsvpClick && (
        <section className="py-20 md:py-32 px-6" id="rsvp">
            <div className="relative max-w-lg mx-auto bg-white rounded-2xl shadow-xl p-8 md:p-12 border">
            <FadeIn>
                <RsvpTrigger
                    onClick={onRsvpClick}
                    primaryColor={primaryColor}
                    textColor={textColor}
                />
            </FadeIn>
            </div>
        </section>
      )}

      {/* Footer */}
      <footer className="text-center py-10 px-6">
        <p className="text-sm text-slate-500">
            Created with ❤️ by {invitationData.hostNames || 'The Host'}
        </p>
      </footer>
    </div>
  );
}
