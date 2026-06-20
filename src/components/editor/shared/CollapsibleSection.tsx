// src/components/editor/shared/CollapsibleSection.tsx
"use client";

import { useEffect, useState, ReactNode } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';

type CollapsibleSectionProps = {
  title: string;
  children: ReactNode;
  isOpen?: boolean;
  onToggle?: () => void;
};

export default function CollapsibleSection({ title, children, isOpen = true, onToggle }: CollapsibleSectionProps) {
  const [isSectionOpen, setIsSectionOpen] = useState(isOpen);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsSectionOpen(isOpen);
  }, [isOpen]);

  const handleToggle = () => {
    onToggle?.();
    if (!onToggle) {
      setIsSectionOpen(!isSectionOpen);
    }
  };

  return (
    <div className="border-b border-gray-200">
      <button
        onClick={handleToggle}
        className="w-full flex justify-between items-center p-4 sm:p-6 focus:outline-none"
      >
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900">{title}</h3>
        <ChevronDownIcon
          className={`w-6 h-6 text-gray-400 transform transition-transform ${
            isSectionOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      {isSectionOpen && <div className="pb-6">{children}</div>}
    </div>
  );
}
