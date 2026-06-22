"use client";

import CollapsibleSection from '../shared/CollapsibleSection';
import TextInput from '../shared/TextInput';

type GuestCountSectionProps = {
  guestCount: number;
  onUpdate: (data: { guestCount: number }) => void;
};

export function GuestCountSection({
  guestCount,
  onUpdate,
}: GuestCountSectionProps) {
  const handleGuestCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const count = parseInt(e.target.value, 10);
    // Allow empty input to clear, but don't send NaN
    if (e.target.value === '') {
      onUpdate({ guestCount: 0 });
      return;
    }
    if (!isNaN(count) && count >= 0) {
      onUpdate({ guestCount: count });
    }
  };

  return (
    <CollapsibleSection title="Reserved Seats">
      <div className="space-y-4 pt-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Number of Guests</label>
          <input
            type="number"
            value={guestCount?.toString() || '0'}
            onChange={handleGuestCountChange}
            placeholder="e.g., 2"
            min={0}
            className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow text-slate-900"
          />
        </div>
      </div>
    </CollapsibleSection>
  );
}
