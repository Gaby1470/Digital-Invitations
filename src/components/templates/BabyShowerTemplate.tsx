"use client";

import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';
import { TemplateConfig, TimelineItem } from '@/lib/types';

/**
 * Enhanced FadeIn for organic baby-themed entries.
 */
function FadeIn({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px 0px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.8, delay, ease: 'easeOut' }}
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

  return (
    <div 
      className="w-full font-sans overflow-hidden"
      style={{
        backgroundColor: invitationData.backgroundColor || '#fdfbff',
        color: invitationData.textColor || '#1e293b'
      }}
    >
      {/* Hero Section */}
      <section className="h-screen w-full flex flex-col justify-center items-center relative overflow-hidden">
        <motion.div 
          className="absolute inset-0 z-0"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
        >
          <img 
            src={invitationData.hero_image_url || 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80'} 
            className="w-full h-full object-cover"
            alt="Hero Background"
          />
          <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px]" />
        </motion.div>

        <motion.div className="z-10 text-center px-4">
          <span 
            className="bg-white/90 px-6 py-2 rounded-full text-xs font-bold uppercase tracking-[0.2em] shadow-sm mb-6 inline-block"
            style={{ color: invitationData.primaryColor }}
          >
            {invitationData.heroTitle || "A Tiny Miracle is on the Way"}
          </span>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter" style={{ color: invitationData.textColor }}>
            {invitationData.heroNames}
          </h1>
        </motion.div>
      </section>

      {/* Meet the Parents Section - NEW SECTION */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <FadeIn>
              <div className="relative group">
                <div 
                  className="absolute -inset-4 rounded-[3rem] rotate-3 group-hover:rotate-0 transition-transform duration-500" 
                  style={{ backgroundColor: `${invitationData.primaryColor}1A` }} // 10% opacity
                />
                <div className="relative overflow-hidden rounded-[2.5rem] shadow-2xl border-[12px] border-white aspect-[4/5]">
                  <img 
                    src={invitationData.family_image_url || 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80'} 
                    alt="The Happy Family"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="space-y-6">
                <h2 className="text-4xl md:text-5xl font-black italic" style={{ color: invitationData.textColor }}>Meet the Parents</h2>
                <p className="text-xl leading-relaxed font-light" style={{ color: invitationData.textColor, opacity: 0.8 }}>
                  "We can't wait to share this journey with you all! Our hearts are already so full, 
                  and we are counting down the days until our little one arrives."
                </p>
                <div className="flex gap-2">
                  <span className="text-3xl">🧸</span>
                  <span className="text-3xl">🤰</span>
                  <span className="text-3xl">✨</span>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Details with Babyish Elements */}
      <section className="py-32 px-6 rounded-[4rem] relative z-10" style={{ backgroundColor: `${invitationData.primaryColor}1A`}}>
        <div className="max-w-4xl mx-auto text-center">
          <FadeIn>
            <h2 className="text-4xl md:text-5xl font-bold mb-20" style={{ color: invitationData.textColor }}>
              {invitationData.timelineTitle || "The Baby Itinerary"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {invitationData.timelineItems?.map((item: TimelineItem, index: number) => (
                <div key={index} className="bg-white p-10 rounded-[2.5rem] shadow-xl relative overflow-hidden group">
                  {/* Decorative Babyish Icons */}
                  <div className="absolute -top-4 -right-4 text-6xl opacity-10 group-hover:opacity-20 transition-opacity">
                    {index % 2 === 0 ? '🍼' : '🧼'}
                  </div>
                  <p className="font-black text-2xl mb-2" style={{ color: invitationData.primaryColor }}>{item.time}</p>
                  <h3 className="text-2xl font-bold mb-2" style={{ color: invitationData.textColor }}>{item.title}</h3>
                  <p className="italic" style={{ color: invitationData.textColor, opacity: 0.7 }}>{item.location}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Creative Gender Betting Section */}
      {features.genderBetting && (
        <section className="py-32 px-6">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-5xl font-black italic" style={{ color: invitationData.textColor }}>Team Boy or Team Girl?</h2>
              <p className="text-xl" style={{ color: invitationData.textColor, opacity: 0.7 }}>Pick a side to see your special mission!</p>
            </div>
            
            <div className="max-w-5xl mx-auto">
              <AnimatePresence mode="wait">
                {!team ? (
                  <motion.div 
                    key="selector"
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-8"
                  >
                    <button 
                      onClick={() => handleVote('boy')}
                      className="group relative h-72 rounded-[2.5rem] bg-blue-500 overflow-hidden shadow-2xl transition-transform hover:scale-105"
                    >
                      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20" />
                      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
                        <span className="text-6xl mb-2">👶</span>
                        <span className="text-3xl font-black uppercase tracking-tighter">Team Boy</span>
                        <p className="text-xs mt-2 opacity-80">Mission: Diapers!</p>
                      </div>
                    </button>

                    <button 
                      onClick={() => handleVote('girl')}
                      className="group relative h-72 rounded-[2.5rem] bg-pink-500 overflow-hidden shadow-2xl transition-transform hover:scale-105"
                    >
                      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/hearts-of-love.png')] opacity-20" />
                      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
                        <span className="text-6xl mb-2">🌸</span>
                        <span className="text-3xl font-black uppercase tracking-tighter">Team Girl</span>
                        <p className="text-xs mt-2 opacity-80">Mission: Baby Towels!</p>
                      </div>
                    </button>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="result"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-12 rounded-[3rem] text-center shadow-3xl ${team === 'boy' ? 'bg-blue-600' : 'bg-pink-600'} text-white`}
                  >
                    <div className="text-7xl mb-6">{team === 'boy' ? '🎖️' : '👑'}</div>
                    <h3 className="text-4xl font-black mb-4">Welcome to {team === 'boy' ? 'Team Boy' : 'Team Girl'}!</h3>
                    <p className="text-2xl opacity-90 max-w-2xl mx-auto leading-relaxed mb-10">
                      Your goal: Please bring a pack of <span className="font-black underline mx-2">{team === 'boy' ? 'diapers' : 'baby towels'}</span>. 
                      Thank you for your love!
                    </p>
                    <button onClick={() => setTeam(null)} className="text-xs font-bold uppercase tracking-widest bg-black/20 hover:bg-black/30 px-6 py-2 rounded-full">
                      Wait, let me choose again!
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </FadeIn>
        </section>
      )}
    </div>
  );
}
