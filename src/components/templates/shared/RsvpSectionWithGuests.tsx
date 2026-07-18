"use client";
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface CustomCSS extends React.CSSProperties {
  '--focus-ring-color'?: string;
  '--ring-color'?: string;
}

// Mock Guest Data - Replace with API call
const mockGuests = [
  { id: '1', name: 'John Doe', allowed_plus_ones: 1 },
  { id: '2', name: 'Jane Smith', allowed_plus_ones: 0 },
  { id: '3', name: 'Peter Jones', allowed_plus_ones: 3 },
  { id: '4', name: 'Mary Williams', allowed_plus_ones: 1 },
];

interface Guest {
  id: string;
  name: string;
  allowed_plus_ones: number;
}

export function RsvpSectionWithGuests({ invitationId, primaryColor, textColor }: { invitationId?: string, primaryColor?: string, textColor?: string }) {
  const [guests] = useState<Guest[]>(mockGuests);
  const [selectedGuestId, setSelectedGuestId] = useState<string>('');
  const [status, setStatus] = useState<'ATTENDING' | 'DECLINED' | null>(null);
  const [plusOnes, setPlusOnes] = useState(0);
  const [message, setMessage] = useState('');
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'submitted' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const effectivePrimaryColor = primaryColor || '#000000';
  const effectiveTextColor = textColor || '#000000';

  const selectedGuest = guests.find(g => g.id === selectedGuestId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invitationId) {
      setErrorMessage('RSVP is not available in preview mode.');
      return;
    }
    if (!selectedGuestId || !status) {
      setErrorMessage('Please select your name and a response.');
      return;
    }
    setFormState('submitting');
    setErrorMessage('');

    try {
      const response = await fetch(`/api/invitations/${invitationId}/rsvp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: selectedGuest?.name,
          guest_id: selectedGuestId,
          status,
          plus_ones: status === 'ATTENDING' ? plusOnes : 0,
          message,
        }),
      });

      if (!response.ok) {
        throw new Error('Something went wrong. Please try again.');
      }
      setFormState('submitted');
    } catch (error: unknown) {
      setFormState('error');
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('An unknown error occurred.');
      }
    }
  };

  if (formState === 'submitted') {
    return (
      <div className="text-center p-8">
        <h3 className="text-3xl font-serif italic mb-4" style={{ color: effectivePrimaryColor }}>¡Gracias!</h3>
        <p style={{ color: effectiveTextColor }}>Tu respuesta ha sido registrada.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="guest" className="block text-sm font-medium" style={{ color: effectiveTextColor }}>Selecciona tu nombre</label>
        <select
          id="guest"
          value={selectedGuestId}
          onChange={(e) => setSelectedGuestId(e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2"
          style={{ '--focus-ring-color': effectivePrimaryColor } as CustomCSS}
        >
          <option value="" disabled>-- Por favor selecciona --</option>
          {guests.map((guest) => (
            <option key={guest.id} value={guest.id}>{guest.name}</option>
          ))}
        </select>
      </div>
      
      <div>
        <span className="block text-sm font-medium" style={{ color: effectiveTextColor }}>¿Podrás acompañarnos?</span>
        <div className="mt-2 flex gap-4">
          <button
            type="button"
            onClick={() => setStatus('ATTENDING')}
            disabled={!selectedGuestId}
            className={`w-full py-3 text-sm font-bold uppercase tracking-widest rounded-md transition-all disabled:opacity-50 ${
              status === 'ATTENDING'
                ? 'ring-2 ring-offset-2'
                : 'bg-gray-100'
            }`}
            style={{ 
              backgroundColor: status === 'ATTENDING' ? effectivePrimaryColor : undefined, 
              color: status === 'ATTENDING' ? 'white' : effectiveTextColor,
              '--ring-color': effectivePrimaryColor
            } as CustomCSS}
          >
            Si
          </button>
          <button
            type="button"
            onClick={() => {
              setStatus('DECLINED');
              setPlusOnes(0);
            }}
            disabled={!selectedGuestId}
            className={`w-full py-3 text-sm font-bold uppercase tracking-widest rounded-md transition-all disabled:opacity-50 ${
              status === 'DECLINED'
                ? 'ring-2 ring-offset-2'
                : 'bg-gray-100'
            }`}
            style={{ 
              backgroundColor: status === 'DECLINED' ? effectivePrimaryColor : undefined, 
              color: status === 'DECLINED' ? 'white' : effectiveTextColor,
              '--ring-color': effectivePrimaryColor
            } as CustomCSS}
          >
            No
          </button>
        </div>
      </div>

      <AnimatePresence>
        {status === 'ATTENDING' && selectedGuest && selectedGuest.allowed_plus_ones > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4 overflow-hidden"
          >
            <div>
              <label htmlFor="plusOnes" className="block text-sm font-medium" style={{ color: effectiveTextColor }}>
                Guests: per invite (you can bring up to {selectedGuest.allowed_plus_ones})
              </label>
              <input
                type="number"
                id="plusOnes"
                value={plusOnes}
                onChange={(e) => {
                    const value = parseInt(e.target.value, 10);
                    if (value >= 0 && value <= selectedGuest.allowed_plus_ones) {
                        setPlusOnes(value);
                    }
                }}
                min="0"
                max={selectedGuest.allowed_plus_ones}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2"
                style={{ '--focus-ring-color': effectivePrimaryColor } as CustomCSS}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div>
          <label htmlFor="message" className="block text-sm font-medium" style={{ color: effectiveTextColor }}>Mensaje (opcional)</label>
          <textarea
            id="message"
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2"
            style={{ '--focus-ring-color': effectivePrimaryColor } as CustomCSS}
          />
      </div>

      {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}
      
      <button
        type="submit"
        disabled={formState === 'submitting' || !invitationId || !status || !selectedGuestId}
        className="w-full py-4 text-white font-bold uppercase tracking-widest rounded-md transition-opacity disabled:opacity-50"
        style={{ backgroundColor: effectivePrimaryColor }}
      >
        {formState === 'submitting' ? 'Sending...' : (!invitationId ? 'RSVP Not Available in Preview' : 'Confirm Attendance')}
      </button>
    </form>
  );
}
