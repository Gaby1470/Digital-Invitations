"use client";

import { motion, Variants } from 'framer-motion';

type Invitation = {
  id: string;
  template: string;
  title: string;
  event_date: string;
  primary_color: string;
  font: string;
};

type AnimatedInvitationProps = {
  invitation: Invitation;
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.8,
      delayChildren: 0.5,
    },
  },
};

const titleVariants: Variants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 10,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 1.2,
      ease: 'easeInOut',
    },
  },
};

const birthdayTitleVariants: Variants = {
  hidden: { scale: 0.5, opacity: 0, rotate: -10 },
  visible: {
    scale: 1,
    opacity: 1,
    rotate: 0,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 8,
    },
  },
};

const birthdayItemVariants: Variants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 120,
    },
  },
};

const minimalistContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
    },
  },
};

const minimalistItemVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: 'linear',
    },
  },
};


const backgroundImage = "https://picsum.photos/seed/wedding/800/1200";
const birthdayBackgroundImage = "https://picsum.photos/seed/birthday/800/1200";

export default function AnimatedInvitation({ invitation }: AnimatedInvitationProps) {
  if (invitation.template === 'classic-wedding') {
    return (
      <motion.div
        className="w-full max-w-md h-[90vh] rounded-lg shadow-2xl flex flex-col items-center justify-between text-center p-8 overflow-hidden relative"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundImage})` }}
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 15, ease: 'linear' }}
        />
        <div className="absolute inset-0 bg-black/50" />
        
        <div className="z-10 text-white">
          <motion.p className="text-lg mt-8" variants={itemVariants}>
            Save the Date
          </motion.p>
        </div>

        <div className="z-10 text-white">
          <motion.h1
            className="text-5xl md:text-6xl font-serif mb-4"
            variants={titleVariants}
          >
            {invitation.title}
          </motion.h1>
          
          <motion.p className="text-xl" variants={itemVariants}>
            You are invited to celebrate their wedding
          </motion.p>
        </div>

        <div className="z-10 text-white">
          {invitation.event_date && (
            <motion.p className="text-2xl mb-8" variants={itemVariants}>
              {new Date(invitation.event_date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </motion.p>
          )}
        </div>
      </motion.div>
    );
  } else if (invitation.template === 'modern-birthday') {
    return (
      <motion.div
        className="w-full max-w-md h-[90vh] rounded-2xl shadow-2xl flex flex-col items-center justify-around text-center p-8 overflow-hidden relative"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${birthdayBackgroundImage})` }}
          initial={{ scale: 1.2, rotate: 10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 20, ease: 'easeOut' }}
        />
        <div className="absolute inset-0 bg-fuchsia-600/50 mix-blend-multiply" />
        
        <div className="z-10 text-white">
          <motion.h1
            className="text-6xl md:text-7xl font-sans font-extrabold tracking-tighter mb-4"
            style={{ textShadow: '3px 3px 0px rgba(0,0,0,0.2)' }}
            variants={birthdayTitleVariants}
          >
            {invitation.title}
          </motion.h1>
        </div>

        <div className="z-10 text-white">
          <motion.p className="text-2xl font-bold" variants={birthdayItemVariants}>
            It's a Party!
          </motion.p>
          {invitation.event_date && (
            <motion.p className="text-3xl font-extrabold mt-4" variants={birthdayItemVariants}>
              {new Date(invitation.event_date).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
              })}
            </motion.p>
          )}
        </div>
      </motion.div>
    );
  } else {
    // Fallback / Minimalist Event
    return (
      <motion.div
        className="w-full max-w-md h-[90vh] rounded-lg shadow-2xl flex flex-col items-start justify-center text-left p-12"
        style={{ backgroundColor: invitation.primary_color || '#111827' }}
        variants={minimalistContainerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.p variants={minimalistItemVariants} className="text-lg text-white/70">You're invited to</motion.p>
        <motion.h1
          variants={minimalistItemVariants}
          className="text-5xl md:text-6xl font-sans font-bold tracking-tight text-white my-4"
        >
          {invitation.title}
        </motion.h1>
        
        {invitation.event_date && (
          <motion.div variants={minimalistItemVariants} className="mt-8 pt-8 border-t border-white/20 w-full">
            <p className="text-lg text-white/70">Date</p>
            <p className="text-2xl text-white">
              {new Date(invitation.event_date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </motion.div>
        )}
      </motion.div>
    );
  }
}
