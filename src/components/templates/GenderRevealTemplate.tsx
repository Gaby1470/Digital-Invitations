"use client";

import { motion } from 'framer-motion';
import { useState } from 'react';
import { TemplateConfig } from '@/lib/types';
import { CheckCircle } from 'lucide-react';

type GenderRevealTemplateProps = {
  template: TemplateConfig;
  data: any;
};

export default function GenderRevealTemplate({ template, data }: GenderRevealTemplateProps) {
  const { defaultData } = template;
  const invitationData = { ...defaultData, ...data };
  const [vote, setVote] = useState<'boy' | 'girl' | null>(null);

  const {
    heroTitle,
    heroNames,
    event_date,
    mainVenueAddress,
    primaryColor,
    textColor,
    backgroundColor,
  } = invitationData;

  const date = event_date ? new Date(event_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '';
  const time = event_date ? new Date(event_date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) : '';

  return (
    <div className="w-full min-h-screen" style={{ backgroundColor }}>
      {/* Hero Section */}
      <section className="text-center py-20 px-4">
        <motion.h1 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-5xl md:text-7xl font-bold" style={{ color: textColor }}
        >
          {heroTitle}
        </motion.h1>
        <motion.h2 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-3xl md:text-5xl font-semibold mt-4" style={{ color: primaryColor }}
        >
          {heroNames}
        </motion.h2>
      </section>

      {/* Details Section */}
      <section className="py-10 px-4">
        <div className="max-w-md mx-auto bg-white/10 backdrop-blur-md rounded-xl p-6 text-center" style={{ color: textColor }}>
          <h3 className="text-2xl font-bold mb-4">Join us for the big reveal!</h3>
          <p className="text-lg">{date} at {time}</p>
          <p className="text-lg mt-2">{mainVenueAddress}</p>
        </div>
      </section>

      {/* Gender Voting Section */}
      <section className="py-10 px-4">
        <div className="max-w-md mx-auto text-center">
          <h3 className="text-2xl font-bold mb-4" style={{ color: textColor }}>What's your guess?</h3>
          <div className="grid grid-cols-2 gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setVote('boy')}
              className={`p-6 rounded-xl text-2xl font-bold transition-colors ${
                vote === 'boy' ? 'bg-blue-500 text-white' : 'bg-white/20'
              }`}
            >
              <CheckCircle className={`inline-block mr-2 ${vote === 'boy' ? 'opacity-100' : 'opacity-0'}`} />
              Boy
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setVote('girl')}
              className={`p-6 rounded-xl text-2xl font-bold transition-colors ${
                vote === 'girl' ? 'bg-pink-500 text-white' : 'bg-white/20'
              }`}
            >
              <CheckCircle className={`inline-block mr-2 ${vote === 'girl' ? 'opacity-100' : 'opacity-0'}`} />
              Girl
            </motion.button>
          </div>
        </div>
      </section>
    </div>
  );
}
