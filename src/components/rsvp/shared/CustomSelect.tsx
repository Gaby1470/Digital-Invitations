'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

type Option = {
  value: string | number;
  label: string;
};

type CustomSelectProps = {
  options: Option[];
  value: string | number;
  onChange: (value: string | number) => void;
  placeholder?: string;
};

export default function CustomSelect({ options, value, onChange, placeholder = "Select an option" }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find(option => option.value === value);

  const handleSelect = (option: Option) => {
    onChange(option.value);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full">
      <button
        type="button"
        className="w-full px-4 py-3 text-base text-left bg-gray-50 rounded-lg border border-gray-300 shadow-inner flex justify-between items-center focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{selectedOption ? selectedOption.label : placeholder}</span>
        <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
        >
            <ChevronDown size={20} className="text-gray-500" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-10 w-full mt-1 bg-white rounded-lg border border-gray-200 shadow-lg"
          >
            <ul className="py-1 max-h-60 overflow-y-auto">
              {options.map(option => (
                <li
                  key={option.value}
                  className={`px-4 py-2 text-base cursor-pointer hover:bg-indigo-50 ${selectedOption?.value === option.value ? 'bg-indigo-100 font-semibold' : ''}`}
                  onClick={() => handleSelect(option)}
                >
                  {option.label}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
