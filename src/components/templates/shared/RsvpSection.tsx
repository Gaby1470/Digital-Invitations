// src/components/templates/shared/RsvpSection.tsx
"use client";

import { useState } from 'react';

export function RsvpSection({ invitationId, primaryColor, textColor }: { invitationId: string, primaryColor: string, textColor: string }) {
  const [name, setName] = useState('');
  const [status, setStatus] = useState<'ATTENDING' | 'DECLINED' | null>(null);
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'submitted' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !status) {
      setErrorMessage('Please provide your name and a response.');
      return;
    }
    setFormState('submitting');
    setErrorMessage('');

    try {
      const response = await fetch(`/api/invitations/${invitationId}/rsvp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, status }),
      });

      if (!response.ok) {
        throw new Error('Something went wrong. Please try again.');
      }
      setFormState('submitted');
    } catch (error: any) {
      setFormState('error');
      setErrorMessage(error.message);
    }
  };

  if (formState === 'submitted') {
    return (
      <div className="text-center p-8">
        <h3 className="text-3xl font-serif italic mb-4" style={{ color: primaryColor }}>Thank You!</h3>
        <p style={{ color: textColor }}>Your response has been recorded.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium" style={{ color: textColor }}>Full Name</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2"
          style={{ '--focus-ring-color': primaryColor } as any}
        />
      </div>
      <div>
        <span className="block text-sm font-medium" style={{ color: textColor }}>Will you attend?</span>
        <div className="mt-2 flex gap-4">
          <button
            type="button"
            onClick={() => setStatus('ATTENDING')}
            className={`w-full py-3 text-sm font-bold uppercase tracking-widest rounded-md transition-all ${status === 'ATTENDING' ? 'ring-2 ring-offset-2' : ''}`}
            style={{ 
              backgroundColor: status === 'ATTENDING' ? primaryColor : '#f3f4f6', 
              color: status === 'ATTENDING' ? 'white' : textColor,
              '--ring-color': primaryColor
            } as any}
          >
            Accept
          </button>
          <button
            type="button"
            onClick={() => setStatus('DECLINED')}
            className={`w-full py-3 text-sm font-bold uppercase tracking-widest rounded-md transition-all ${status === 'DECLINED' ? 'ring-2 ring-offset-2' : ''}`}
            style={{ 
              backgroundColor: status === 'DECLINED' ? primaryColor : '#f3f4f6', 
              color: status === 'DECLINED' ? 'white' : textColor,
              '--ring-color': primaryColor
            } as any}
          >
            Decline
          </button>
        </div>
      </div>
      {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}
      <button
        type="submit"
        disabled={formState === 'submitting'}
        className="w-full py-4 text-white font-bold uppercase tracking-widest rounded-md transition-opacity disabled:opacity-50"
        style={{ backgroundColor: primaryColor }}
      >
        {formState === 'submitting' ? 'Submitting...' : 'RSVP'}
      </button>
    </form>
  );
}
