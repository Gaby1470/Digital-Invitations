"use client";

import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { TemplateConfig, TimelineItem } from '@/lib/types';

function AnimatedSection({ children }: { children: React.ReactNode }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px 0px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

type BabyShowerTemplateProps = {
  template: TemplateConfig;
  data: any;
};

export default function BabyShowerTemplate({ template, data }: BabyShowerTemplateProps) {
  const { defaultData, features } = template;
  const invitationData = { ...defaultData, ...data };
  const [team, setTeam] = useState<'boy' | 'girl' | null>(null);

  const handleVote = (selectedTeam: 'boy' | 'girl') => {
    setTeam(selectedTeam);
  };

  const resetVote = () => {
    setTeam(null);
  };

  return (
    <div className={`w-full bg-blue-50`}>
      {/* Hero Section */}
      <section 
        id="hero"
        className="h-screen w-full bg-cover bg-center flex flex-col justify-center items-center text-white relative"
        style={{ backgroundImage: `url(${invitationData.hero_image_url || 'https://picsum.photos/seed/baby-hero/1200/800'})` }}
      >
        <div className="absolute inset-0 h-screen bg-white/50" />
        <motion.div 
          className="z-10 text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.0, delay: 0.5, ease: 'easeOut' }}
        >
          <h1 className="text-6xl font-bold">{invitationData.heroTitle}</h1>
          <p className="text-3xl mt-2">{invitationData.heroNames}</p>
        </motion.div>
      </section>

      {/* Details Section */}
      <section id="timeline" className="py-20 px-4 max-w-4xl mx-auto text-center">
        <AnimatedSection>
          <h2 className="text-4xl font-bold text-blue-800 mb-12">{invitationData.timelineTitle}</h2>
          {invitationData.timelineItems?.map((item: TimelineItem, index: number) => (
            <div key={index} className="mb-8">
              <p className="text-2xl font-bold text-blue-700">{item.time}</p>
              <h3 className="text-3xl font-semibold my-1">{item.title}</h3>
              <p className="text-xl text-gray-600">{item.location}</p>
            </div>
          ))}
        </AnimatedSection>
      </section>

      {/* Gender Betting Section */}
      {features.genderBetting && (
        <section id="gender-betting" className="bg-white py-20 px-4">
          <AnimatedSection>
            <h2 className="text-4xl font-bold text-center text-blue-800 mb-12">Join a Team!</h2>
            
            {!team ? (
              <div className="max-w-2xl mx-auto flex justify-center gap-4">
                <button onClick={() => handleVote('boy')} className="bg-blue-500 text-white px-8 py-4 rounded-lg text-2xl font-bold hover:bg-blue-600 transition-colors">Team Boy</button>
                <button onClick={() => handleVote('girl')} className="bg-pink-500 text-white px-8 py-4 rounded-lg text-2xl font-bold hover:bg-pink-600 transition-colors">Team Girl</button>
              </div>
            ) : (
              <div className="text-center max-w-2xl mx-auto">
                {team === 'boy' && (
                  <div className="p-8 bg-blue-100 rounded-lg">
                    <h3 className="text-3xl font-bold text-blue-800">Welcome to Team Boy!</h3>
                    <p className="text-lg mt-2 text-blue-700">Team Boy is in charge of bringing <span className="font-bold">diapers</span>. Thank you for your contribution!</p>
                  </div>
                )}
                {team === 'girl' && (
                  <div className="p-8 bg-pink-100 rounded-lg">
                    <h3 className="text-3xl font-bold text-pink-800">Welcome to Team Girl!</h3>
                    <p className="text-lg mt-2 text-pink-700">Team Girl is in charge of bringing <span className="font-bold">baby towels</span>. Thank you for your contribution!</p>
                  </div>
                )}
                <button onClick={resetVote} className="mt-6 text-sm text-gray-600 hover:underline">Choose a different team</button>
              </div>
            )}
          </AnimatedSection>
        </section>
      )}
    </div>
  );
}
