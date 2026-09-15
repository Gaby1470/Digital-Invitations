'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import TemplateRenderer from '@/components/TemplateRenderer';
import { templateConfig } from '@/lib/templateConfig';
import { EditorData } from '@/lib/custom_types';
import Modal from '@/components/editor/shared/Modal';
import { CheckCircle, Loader, Send } from 'lucide-react';

interface Invitation {
  id: string;
  user_id: string;
  created_at: string;
  template: string;
  data: EditorData;
  is_published: boolean;
  is_expired: boolean;
  slug: string | null;
}

type RsvpSubmission = {
    attending_count: number;
    guest_names?: string[];
    notes?: string;
}

type RsvpResponse = {
    id: string;
    guest_party_id: string;
    attending_count: number;
    guest_names: string[];
    notes: string | null;
    submitted_at: string;
}

async function submitGeneralRsvp(submission: RsvpSubmission & { invitationId: string }): Promise<RsvpResponse> {
    const res = await fetch(`/api/general-rsvp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submission),
    });
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to submit RSVP.');
    }
    return res.json();
}

function GeneralRsvpForm({ invitationId, onClose }: { invitationId: string, onClose: () => void }) {
    const queryClient = useQueryClient();
    const [willAttend, setWillAttend] = useState<boolean | null>(null);
    const [guestName, setGuestName] = useState('');
    const [notes, setNotes] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const rsvpMutation = useMutation({
        mutationFn: (submission: RsvpSubmission & { invitationId: string }) => submitGeneralRsvp(submission),
        onSuccess: () => {
            setIsSubmitted(true);
            toast.success("Thank you for your response!");
            queryClient.invalidateQueries({ queryKey: ['guestParties', invitationId] });
        },
        onError: (err: Error) => {
            toast.error(err.message);
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const attending_count = willAttend ? 1 : 0;
        const guest_names = willAttend && guestName ? [guestName] : [];
        rsvpMutation.mutate({ invitationId, attending_count, guest_names, notes });
    };

    if (isSubmitted) {
        return (
            <div className="text-center p-8 bg-green-50 rounded-xl">
                <CheckCircle className="mx-auto text-green-500 mb-4" size={56} />
                <h2 className="text-3xl font-bold text-gray-800 mb-2">RSVP Recibido!</h2>
                <p className="text-gray-600">Se ha guardado tu respuesta</p>
                <button onClick={onClose} className="mt-8 inline-block px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-all">
                    Cerrar
                </button>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">¿Asistirás?</h1>
                <p className="text-base text-gray-600 mt-2">Por favor, háznoslo saber si puedes asistir.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <button type="button" onClick={() => setWillAttend(true)} className={`py-4 rounded-lg font-semibold border-2 transition-all ${willAttend === true ? 'bg-green-600 text-white border-green-700 scale-105' : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'}`}>
                        ¡Sí, asistiré!
                    </button>
                    <button type="button" onClick={() => setWillAttend(false)} className={`py-4 rounded-lg font-semibold border-2 transition-all ${willAttend === false ? 'bg-red-600 text-white border-red-700 scale-105' : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'}`}>
                        Lo siento, no puedo asistir
                    </button>
                </div>

                {willAttend && (
                    <div className="pt-4 border-t">
                        <label htmlFor="guest_name" className="block text-sm font-semibold text-gray-600 mb-1">Tu Nombre</label>
                        <input
                            id="guest_name"
                            type="text"
                            value={guestName}
                            onChange={(e) => setGuestName(e.target.value)}
                            placeholder="Nombre Completo"
                            required
                            className="w-full px-4 py-2 text-base bg-gray-50 rounded-lg border border-gray-300 shadow-inner focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        />
                    </div>
                )}
                
                <div>
                    <label htmlFor="notes" className="block text-sm font-semibold text-gray-600 mb-2">Deja una nota (opcional)</label>
                    <textarea
                        id="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 text-base bg-gray-50 rounded-lg border border-gray-300 shadow-inner focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        placeholder="p. ej., buenos deseos..."
                    ></textarea>
                </div>

                <button type="submit" disabled={rsvpMutation.isPending || willAttend === null} className="w-full flex items-center justify-center px-6 py-4 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-indigo-400 transition-all text-lg shadow-md">
                    {rsvpMutation.isPending ? <><Loader className="animate-spin mr-2"/> Submitting...</> : <><Send className="mr-2"/> Submit RSVP</>}
                </button>
            </form>
        </div>
    );
}

export default function InviteClientPage({ invitation }: { invitation: Invitation }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add('forced-light');
    document.body.classList.add('forced-light');
    return () => {
      document.documentElement.classList.remove('forced-light');
      document.body.classList.remove('forced-light');
    };
  }, []);

  const template = templateConfig[invitation.template];

  if (!template) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-4xl font-bold mb-4">Error</h1>
        <p className="text-gray-600">Could not load the invitation template.</p>
      </div>
    );
  }

  return (
    <>
      <TemplateRenderer 
        templateId={invitation.template} 
        template={template} 
        data={invitation.data} 
        invitationId={invitation.id}
        onRsvpClick={() => setIsModalOpen(true)}
      />
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title=" ">
        <GeneralRsvpForm invitationId={invitation.id} onClose={() => setIsModalOpen(false)} />
      </Modal>
    </>
  );
}
