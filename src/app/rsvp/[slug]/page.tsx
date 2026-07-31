'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useState, useMemo, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import TemplateRenderer from '@/components/TemplateRenderer';
import { templateConfig } from '@/lib/templateConfig';
import { EditorData } from '@/lib/custom_types';
import Modal from '@/components/editor/shared/Modal';
import { CheckCircle, Loader, AlertTriangle, Users, Edit3, Send } from 'lucide-react';
import CustomSelect from '@/components/rsvp/shared/CustomSelect';


// --- Type Definitions ---
type RsvpData = {
    attending_count: number;
    guest_names: string[];
    notes: string | null;
}

type PartyDetails = {
  party_name: string;
  allocated_seats: number;
  invitation_id: string;
  rsvp: RsvpData | null;
};

type InvitationDetails = {
    id: string;
    template: string;
    data: EditorData;
};

type RsvpSubmission = {
    attending_count: number;
    guest_names?: string[];
    notes?: string;
}

// --- Data Fetching Functions ---

async function fetchPartyDetails(slug: string): Promise<PartyDetails> {
  const res = await fetch(`/api/rsvps/${slug}`);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || 'Failed to load invitation details.');
  }
  return res.json();
}

async function fetchInvitationDetails(invitationId: string): Promise<InvitationDetails> {
    const res = await fetch(`/api/invitations/${invitationId}`);
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to load invitation.');
    }
    return res.json();
}

async function submitRsvp(slug: string, submission: RsvpSubmission): Promise<RsvpData> {
    const res = await fetch(`/api/rsvps/${slug}`, {
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

// --- RsvpForm Component ---

const RsvpForm = ({ slug, party, setIsModalOpen }: { slug: string, party: PartyDetails, setIsModalOpen: (isOpen: boolean) => void }) => {
  const queryClient = useQueryClient();
  const [attendingCount, setAttendingCount] = useState(0);
  const [guestNames, setGuestNames] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
      if (party?.rsvp && !isEditing) {
          setTimeout(() => {
            setAttendingCount(party.rsvp!.attending_count);
            setGuestNames(party.rsvp!.guest_names || []);
            setNotes(party.rsvp!.notes || '');
          }, 0);
      }
  }, [party, isEditing]);

  const rsvpMutation = useMutation({
      mutationFn: (submission: RsvpSubmission) => submitRsvp(slug, submission),
      onSuccess: (data) => {
          setIsSubmitted(true);
          toast.success("RSVP Submitted Successfully!");
          
          queryClient.setQueryData(['partyDetails', slug], (oldData: PartyDetails | undefined) => {
              if (!oldData) return;
              return {
                  ...oldData,
                  rsvp: data
              }
          });

          if (party?.invitation_id) {
              queryClient.invalidateQueries({ queryKey: ['guestParties', party.invitation_id] });
          }
      },
      onError: (err: Error) => {
          toast.error(err.message);
      }
  });

  const handleNameChange = useCallback((index: number, value: string) => {
    const newNames = [...guestNames];
    newNames[index] = value;
    setGuestNames(newNames);
  }, [guestNames]);

  const nameInputs = useMemo(() => {
    return Array.from({ length: attendingCount }, (_, i) => (
      <div key={i} className="mb-4">
        <label htmlFor={`guest_name_${i}`} className="block text-sm font-semibold text-gray-600 mb-1">
          Nombre del Invitado #{i + 1}
        </label>
        <input
          id={`guest_name_${i}`}
          type="text"
          value={guestNames[i] || ''}
          onChange={(e) => handleNameChange(i, e.target.value)}
          placeholder="Nombre Completo"
          required
          className="w-full px-4 py-2 text-base bg-gray-50 rounded-lg border border-gray-300 shadow-inner focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
        />
      </div>
    ));
  }, [attendingCount, guestNames, handleNameChange]);

  const attendingOptions = useMemo(() => {
      return Array.from({ length: (party?.allocated_seats ?? 0) + 1 }, (_, i) => ({
          value: i,
          label: `${i} ${i === 1 ? 'Invitado' : 'Invitados'}`
      }));
  }, [party?.allocated_seats]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    rsvpMutation.mutate({
        attending_count: attendingCount,
        guest_names: guestNames.slice(0, attendingCount),
        notes,
    });
  };

  if (isSubmitted || (party?.rsvp && !isEditing)) {
      const finalAttendingCount = isSubmitted ? attendingCount : party?.rsvp?.attending_count ?? 0;
      return (
          <div className="text-center p-8 bg-green-50 rounded-xl">
              <CheckCircle className="mx-auto text-green-500 mb-4" size={56} />
              <h2 className="text-3xl font-bold text-gray-800 mb-2">¡Gracias!</h2>
              <p className="text-gray-600">Tu respuesta para <span className="font-bold">{finalAttendingCount} invitado(s)</span> ha sido registrada.</p>
              {!isSubmitted && (
                  <button 
                      onClick={() => setIsEditing(true)}
                      className="mt-6 inline-block px-6 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg shadow-sm hover:bg-gray-300 transition-all"
                  >
                      Editar RSVP
                  </button>
              )}
              <button 
                  onClick={() => setIsModalOpen(false)}
                  className="mt-6 ml-4 inline-block px-8 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-all"
              >
                  Cerrar
              </button>
          </div>
      );
  }

  return (
      <div className="p-6">
          <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900">
                  {party?.rsvp ? 'Actualizar tu asistencia' : 'Confirma tu asistencia'}
              </h1>
              <p className="text-base text-gray-600 mt-2">Hola, <span className="font-bold">{party?.party_name}</span>! Tienes <span className="font-bold text-indigo-600">{party?.allocated_seats}</span> asiento(s) reservados.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                  <label htmlFor="attending_count" className="flex items-center text-sm font-semibold text-gray-600 mb-2"><Users size={16} className="mr-2"/> ¿Cuántos invitados asistirán?</label>
                  <CustomSelect
                      options={attendingOptions}
                      value={attendingCount}
                      onChange={(value) => setAttendingCount(value as number)}
                  />
              </div>

              {attendingCount > 0 && (
                  <div className="space-y-4 pt-4 border-t border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-800">Información del Invitado</h3>
                      {nameInputs}
                  </div>
              )}
              
              <div>
                  <label htmlFor="notes" className="flex items-center text-sm font-semibold text-gray-600 mb-2">
                      <Edit3 size={16} className="mr-2"/> Deja una nota (opcional)
                  </label>
                  <textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 text-base bg-gray-50 rounded-lg border border-gray-300 shadow-inner focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                      placeholder="p.ej., restricciones alimentarias, buenos deseos..."
                  ></textarea>
              </div>

              <div className="flex items-center gap-4">
                  {party?.rsvp && isEditing && (
                      <button type="button" onClick={() => setIsEditing(false)} className="w-full flex items-center justify-center px-6 py-4 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all text-lg shadow-md">
                          Cancelar
                      </button>
                  )}
                  <button type="submit" disabled={rsvpMutation.isPending} className="w-full flex items-center justify-center px-6 py-4 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-indigo-400 transition-all text-lg shadow-md">
                      {rsvpMutation.isPending ? <><Loader className="animate-spin mr-2"/> Enviando...</> : <><Send className="mr-2"/> {party?.rsvp ? 'Actualizar RSVP' : 'Enviar RSVP'}</>}
                  </button>
              </div>
          </form>
      </div>
    );
}


// --- Main Page Component ---

export default function RsvpPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Query 1: Fetch the guest party details
  const { data: party, isLoading: isLoadingParty, error: partyError } = useQuery({
    queryKey: ['partyDetails', slug],
    queryFn: () => fetchPartyDetails(slug),
    enabled: !!slug,
  });

  // Query 2: Fetch the full invitation details, enabled only after party info is loaded
  const { data: invitation, isLoading: isLoadingInvitation, error: invitationError } = useQuery({
    queryKey: ['invitationDetails', party?.invitation_id],
    queryFn: () => fetchInvitationDetails(party!.invitation_id),
    enabled: !!party?.invitation_id,
  });

  const isLoading = isLoadingParty || isLoadingInvitation;
  const error = partyError || invitationError;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="flex flex-col items-center">
            <Loader className="h-12 w-12 text-indigo-500 animate-spin" />
            <p className="mt-4 text-lg text-gray-600 font-medium">Cargando invitación...</p>
          </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center border-t-4 border-red-500">
            <AlertTriangle className="mx-auto text-red-500 mb-4" size={48} />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Algo salió mal</h2>
            <p className="text-red-600">{(error as Error).message}</p>
            <p className="mt-4 text-sm text-gray-500">Por favor, verifica el enlace e inténtalo de nuevo. Si el problema persiste, contacta al anfitrión.</p>
        </div>
      </div>
    );
  }

  const templateConf = invitation ? templateConfig[invitation.template] : null;

  if (!invitation || !templateConf || !party) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center border-t-4 border-yellow-400">
            <AlertTriangle className="mx-auto text-yellow-500 mb-4" size={48} />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Error de Configuración</h2>
            <p>No se pudo cargar el diseño de la invitación. Por favor, contacta al soporte.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <TemplateRenderer
        templateId={invitation.template}
        template={templateConf}
        data={invitation.data}
        invitationId={invitation.id}
        onRsvpClick={() => setIsModalOpen(true)}
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title=" ">
        <RsvpForm slug={slug} party={party} setIsModalOpen={setIsModalOpen} />
      </Modal>
    </div>
  );
}
