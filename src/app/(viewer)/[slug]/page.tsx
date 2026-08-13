'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import TemplateRenderer from '@/components/TemplateRenderer';
import { templateConfig } from '@/lib/templateConfig';
import { EditorData } from '@/lib/custom_types';
import Modal from '@/components/editor/shared/Modal';
import { CheckCircle, Loader, AlertTriangle, Send } from 'lucide-react';
import Link from 'next/link';

// --- Data Fetching ---

class HttpError extends Error {
    status: number;
    constructor(message: string, status: number) {
        super(message);
        this.status = status;
    }
}

async function getInvitation(slug: string) {
  const res = await fetch(`/api/invitations/by-slug/${slug}`);
  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new HttpError(errorBody.error || `Error: ${res.status}`, res.status);
  }
  return res.json();
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

// --- Components ---

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

export default function InvitePage() {
  const params = useParams();
  const slug = params.slug as string;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: invitation, isLoading, error } = useQuery({
    queryKey: ['invitation', slug],
    queryFn: () => getInvitation(slug),
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="flex flex-col items-center">
          <Loader className="h-12 w-12 text-indigo-500 animate-spin" />
          <p className="mt-4 text-lg text-gray-600 font-medium">Cargando Invitación...</p>
        </div>
      </div>
    );
  }

  if (error) {
    const status = (error as HttpError).status;
    let title = "Invitation Not Found";
    let message = "The invitation link is either invalid or has been removed.";
    if (status === 403) {
      title = "Invitation Not Published";
      message = "This invitation is not yet available to the public.";
    } else if (status === 410) {
      title = "Invitation Expired";
      message = "We're sorry, but this invitation is no longer active.";
    }
    
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center px-4">
        <div className="bg-white p-8 rounded-2xl shadow-md max-w-md w-full">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-8 h-8"/>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{title}</h1>
          <p className="text-gray-600 mb-8">{message}</p>
          <Link href="/" className="inline-flex h-10 items-center justify-center rounded-md bg-gray-900 px-8 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-800">
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }
  
  const template = invitation ? templateConfig[invitation.template] : null;

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
