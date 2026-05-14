"use client";

import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { TemplateConfig, TimelineItem } from '@/lib/types'; //

/**
 * Sophisticated animation for academic milestones.
 */
function FadeIn({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px 0px" }); //

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}} //
      transition={{ duration: 0.8, delay, ease: [0.21, 0.45, 0.32, 0.9] }}
    >
      {children}
    </motion.div>
  );
}

type GraduationTemplateProps = {
  template: TemplateConfig; //
  data: any;
};

export default function GraduationTemplate({ template, data }: GraduationTemplateProps) {
  const { defaultData, features } = template; //
  const invitationData = { ...defaultData, ...data }; //
  const [guestMessage, setGuestMessage] = useState("");

  return (
    <div 
      className="w-full font-sans"
      style={{
        backgroundColor: invitationData.backgroundColor || '#0a0a0a',
        color: invitationData.textColor || '#ffffff'
      }}
    >
      {/* Hero Section: The Achievement */}
      <section 
        className="h-screen w-full flex flex-col justify-center items-center text-center relative overflow-hidden"
      >
        <motion.div 
          className="absolute inset-0 z-0"
          initial={{ scale: 1.2, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 1 }} //
          transition={{ duration: 2.5 }}
        >
          <img 
            src={invitationData.hero_image_url || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop'} 
            className="w-full h-full object-cover"
            alt={`${invitationData.heroNames} Graduation`} // Fixed: Dynamic alt text instead of "Graduation Hero"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/40 to-transparent" />
        </motion.div>

        <div className="z-10 px-6">
          <FadeIn delay={0.5}>
            <p className="text-sm tracking-[0.4em] uppercase font-bold mb-4" style={{ color: invitationData.primaryColor }}>
              {invitationData.heroTitle || "Class of 2026"}
            </p>
          </FadeIn>
          <FadeIn delay={0.8} direction="none">
            <h1 className="text-6xl md:text-9xl font-extrabold tracking-tighter mb-4 italic">
              {invitationData.heroNames}
            </h1>
          </FadeIn>
          
          <FadeIn delay={1.1}>
            <div className="inline-block py-4 px-12" style={{ borderTop: `1px solid ${invitationData.primaryColor}4D`, borderBottom: `1px solid ${invitationData.primaryColor}4D`}}>
              <h2 className="text-2xl md:text-3xl font-light tracking-wide uppercase">
                {invitationData.degreeType || "Bachelor of Science in Engineering"}
              </h2>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Modern Academic Timeline */}
      <section className="py-32 px-6" style={{ backgroundColor: invitationData.backgroundColor || '#0a0a0a' }}>
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <h2 className="text-3xl md:text-5xl font-bold text-center mb-24 italic">
              {invitationData.timelineTitle || "Commencement Details"}
            </h2>
          </FadeIn>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {invitationData.timelineItems?.map((item: TimelineItem, index: number) => (
              <FadeIn key={index} delay={index * 0.1}>
                <div 
                  className="group p-8 rounded-2xl transition-colors duration-500"
                  style={{
                    backgroundColor: `${invitationData.textColor}0D`,
                    border: `1px solid ${invitationData.textColor}1A`,
                  }}
                >
                  <p className="font-mono text-lg mb-2" style={{ color: invitationData.primaryColor }}>{item.time}</p>
                  <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                  <p className="font-light italic" style={{ color: `${invitationData.textColor}66` }}>{item.location}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Guest Wishes Section */}
      <section className="py-32 px-6 bg-neutral-50 text-neutral-900">
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <div className="bg-white p-10 md:p-16 shadow-2xl rounded-lg border border-neutral-100">
              <h2 className="text-3xl font-bold mb-6 text-center italic">Wishes for the Graduate</h2>
              <p className="text-center text-neutral-500 mb-8">Leave a message of encouragement or a favorite memory for {invitationData.heroNames?.split(' ')[0]}.</p>
              
              <div className="space-y-4">
                <textarea 
                  className="w-full p-4 border border-neutral-200 rounded-md focus:ring-2 focus:border-transparent outline-none transition-all min-h-[150px] text-neutral-700 font-serif italic"
                  style={{ '--focus-ring-color': invitationData.primaryColor } as any}
                  placeholder="Write your message here..."
                  value={guestMessage}
                  onChange={(e) => setGuestMessage(e.target.value)}
                />
                <button 
                  className="w-full py-4 text-white font-bold uppercase tracking-widest rounded-md hover:opacity-90 transition-opacity shadow-lg"
                  style={{ backgroundColor: invitationData.primaryColor }}
                  onClick={() => alert("Thank you for your message!")}
                >
                  Send Message
                </button>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Future Plans: "The Next Chapter" */}
      {features.futurePlans && invitationData.futurePlans && (
        <section className="text-black" style={{ backgroundColor: invitationData.primaryColor }}>
          <div className="max-w-4xl mx-auto px-6 py-32 text-center">
            <FadeIn>
              <span className="text-xs uppercase font-bold tracking-[0.3em] mb-4 block">The Next Chapter</span>
              <h2 className="text-4xl md:text-6xl font-black italic mb-8 uppercase tracking-tighter">
                What's Next?
              </h2>
              <p className="text-xl md:text-3xl font-medium max-w-2xl mx-auto leading-tight">
                {invitationData.futurePlans}
              </p>
            </FadeIn>
          </div>
        </section>
      )}
    </div>
  );
}
