// src/components/templates/shared/Lightbox.tsx
"use client";

import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

type LightboxProps = {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null;
};

export default function Lightbox({ isOpen, onClose, imageUrl }: LightboxProps) {
  return (
    <AnimatePresence>
      {isOpen && imageUrl && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black bg-opacity-80 z-50 flex justify-center items-center p-4 cursor-pointer"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on the image
            className="relative w-full h-full max-w-4xl max-h-[90vh]"
          >
            <img 
              src={imageUrl} 
              alt="Enlarged view"
              className="w-full h-full object-contain"
            />
          </motion.div>
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1, transition: { delay: 0.2 } }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={onClose}
            className="absolute top-4 right-4 text-white bg-black bg-opacity-40 rounded-full p-2 hover:bg-opacity-60 transition-colors"
            aria-label="Close image view"
          >
            <X size={24} />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
