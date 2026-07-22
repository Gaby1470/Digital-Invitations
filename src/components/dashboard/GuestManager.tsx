'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import * as XLSX from 'xlsx';
import { Users, Plus, Copy, Trash2, FileDown, Clock, BarChart2, CheckCircle, MessageSquare } from 'lucide-react';

type GuestParty = {
  id: string;
  party_name: string;
  allocated_seats: number;
  rsvp_slug: string;
  attending_count: number;
  is_edited: boolean;
  notes: string | null;
};

async function fetchGuestParties(invitationId: string): Promise<GuestParty[]> {
    const res = await fetch(`/api/invitations/${invitationId}/guest-parties`);
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Error al obtener la lista de invitados');
    }
    return res.json();
}

async function addGuestParty(invitationId: string, newData: { party_name: string, allocated_seats: number }): Promise<GuestParty> {
    const res = await fetch(`/api/invitations/${invitationId}/guest-parties`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newData),
    });
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Error al agregar el invitado');
    }
    return res.json();
}

async function deleteGuestParty(invitationId: string, partyId: string): Promise<void> {
    const res = await fetch(`/api/invitations/${invitationId}/guest-parties/${partyId}`, {
        method: 'DELETE',
    });
    if (!res.ok && res.status !== 204) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Error al eliminar el invitado');
    }
}

export default function GuestManager({ invitationId }: { invitationId: string }) {
    const queryClient = useQueryClient();
    const [newPartyName, setNewPartyName] = useState('');
    const [newAllocatedSeats, setNewAllocatedSeats] = useState(1);
    const [expandedRow, setExpandedRow] = useState<string | null>(null);

    const { data: guestParties, isLoading, error } = useQuery({
        queryKey: ['guestParties', invitationId],
        queryFn: () => fetchGuestParties(invitationId),
    });

    const addMutation = useMutation({
        mutationFn: (newData: { party_name: string, allocated_seats: number }) => addGuestParty(invitationId, newData),
        onSuccess: () => {
            toast.success('Grupo de invitados agregado.');
            queryClient.invalidateQueries({ queryKey: ['guestParties', invitationId] });
            setNewPartyName('');
            setNewAllocatedSeats(1);
        },
        onError: (err: Error) => {
            toast.error(err.message);
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (partyId: string) => deleteGuestParty(invitationId, partyId),
        onSuccess: () => {
            toast.success('Grupo de invitados eliminado.');
            queryClient.invalidateQueries({ queryKey: ['guestParties', invitationId] });
        },
        onError: (err: Error) => {
            toast.error(err.message);
        }
    });

    const handleAddGuest = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPartyName.trim() || newAllocatedSeats < 1) {
            toast.error('Por favor proporciona un nombre válido y al menos 1 asiento.');
            return;
        }
        addMutation.mutate({ party_name: newPartyName, allocated_seats: newAllocatedSeats });
    };

    const copyToClipboard = (slug: string) => {
        const url = `${window.location.origin}/rsvp/${slug}`;
        navigator.clipboard.writeText(url);
        toast.success('RSVP link copied to clipboard!');
    };

    const handleExport = () => {
        if (!guestParties) {
            toast.error("No hay datos de invitados para exportar.");
            return;
        }
        const dataToExport = guestParties.map(p => ({
            'Party Name': p.party_name,
            'Allocated Seats': p.allocated_seats,
            'Guests Attending': p.attending_count,
            'RSVP Link': `${window.location.origin}/rsvp/${p.rsvp_slug}`,
        }));

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'GuestList');
        XLSX.writeFile(workbook, `guest_list_${invitationId}.xlsx`);
        toast.success("Lista de invitados exportada a Excel!");
    };


    if (isLoading) return (
        <div className="flex items-center justify-center p-10 bg-gray-50 rounded-lg">
            <Clock className="animate-spin text-indigo-500 mr-3" size={24} />
            <span className="text-lg font-medium text-gray-600">Cargando la lista de Invitados...</span>
        </div>
    );

    if (error) return <div className="p-8 bg-red-50 text-red-700 rounded-lg">Error: {(error as Error).message}</div>;

    const totalAllocated = guestParties?.reduce((sum, p) => sum + p.allocated_seats, 0) || 0;
    const totalAttending = guestParties?.reduce((sum, p) => sum + p.attending_count, 0) || 0;

    return (
        <div className="p-6 bg-gray-50 rounded-2xl shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800 flex items-center"><Users size={28} className="mr-3 text-indigo-500"/> Gestor de Lista de Invitados</h2>
                <button onClick={handleExport} className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg shadow-sm hover:bg-green-700 transition-colors disabled:bg-gray-300">
                    <FileDown size={18} className="mr-2"/>
                    Exportar a Excel
                </button>
            </div>
            
            <form onSubmit={handleAddGuest} className="mb-8 p-6 bg-white border border-gray-200 rounded-xl flex items-end gap-4 shadow-sm">
                <div className="flex-grow">
                    <label htmlFor="party_name" className="block text-sm font-semibold text-gray-600 mb-1">Nombre del Invitado / Grupo</label>
                    <input
                        id="party_name"
                        type="text"
                        value={newPartyName}
                        onChange={(e) => setNewPartyName(e.target.value)}
                        placeholder="p.ej., La Familia Hernandez"
                        className="w-full px-4 py-2 text-base bg-gray-50 rounded-lg border border-gray-300 shadow-inner focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    />
                </div>
                <div>
                    <label htmlFor="allocated_seats" className="block text-sm font-semibold text-gray-600 mb-1">Asientos</label>
                    <input
                        id="allocated_seats"
                        type="number"
                        min="1"
                        value={newAllocatedSeats}
                        onChange={(e) => setNewAllocatedSeats(parseInt(e.target.value, 10))}
                        className="w-28 px-4 py-2 text-base bg-gray-50 rounded-lg border border-gray-300 shadow-inner focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    />
                </div>
                <button type="submit" disabled={addMutation.isPending} className="flex items-center justify-center h-11 px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg shadow-md hover:bg-indigo-700 transition-all disabled:bg-indigo-400 disabled:cursor-not-allowed">
                    <Plus size={20} className="mr-2"/>
                    {addMutation.isPending ? 'Agregando...' : 'Agregar Invitado'}
                </button>
            </form>

            <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-white rounded-xl border border-gray-200 flex items-center">
                    <div className="p-3 bg-blue-100 rounded-lg mr-4"><Users className="text-blue-500"/></div>
                    <div>
                        <div className="text-sm font-medium text-gray-500">Grupos Invitados</div>
                        <div className="text-2xl font-bold text-gray-800">{guestParties?.length || 0}</div>
                    </div>
                </div>
                <div className="p-4 bg-white rounded-xl border border-gray-200 flex items-center">
                    <div className="p-3 bg-yellow-100 rounded-lg mr-4"><BarChart2 className="text-yellow-500"/></div>
                    <div>
                        <div className="text-sm font-medium text-gray-500">Asientos Asignados</div>
                        <div className="text-2xl font-bold text-gray-800">{totalAllocated}</div>
                    </div>
                </div>
                <div className="p-4 bg-white rounded-xl border border-gray-200 flex items-center">
                    <div className="p-3 bg-green-100 rounded-lg mr-4"><CheckCircle className="text-green-500"/></div>
                    <div>
                        <div className="text-sm font-medium text-gray-500">Invitados Asistiendo</div>
                        <div className="text-2xl font-bold text-gray-800">{totalAttending}</div>
                    </div>
                </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm bg-white">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nombre del Grupo</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Notas</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Enlace RSVP</th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {guestParties?.flatMap((party) => {
                            const rows = [
                                <tr key={party.id} className={`transition-colors ${party.is_edited ? 'bg-yellow-50 hover:bg-yellow-100' : 'hover:bg-gray-50'}`}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{party.party_name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        <span className="font-bold">{party.attending_count}</span> / {party.allocated_seats} asistiendo
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {party.notes && (
                                            <button onClick={() => setExpandedRow(expandedRow === party.id ? null : party.id)}>
                                                <MessageSquare className="text-gray-400 hover:text-indigo-600" />
                                            </button>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <button onClick={() => copyToClipboard(party.rsvp_slug)} className="flex items-center text-indigo-600 hover:text-indigo-800 font-semibold transition-colors">
                                            <Copy size={16} className="mr-2"/> Copiar Link
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => deleteMutation.mutate(party.id)} disabled={deleteMutation.isPending} className="flex items-center ml-auto text-red-600 hover:text-red-800 disabled:text-gray-400 font-semibold transition-colors">
                                            <Trash2 size={16} className="mr-2"/> Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ];

                            if (expandedRow === party.id) {
                                rows.push(
                                    <tr key={`${party.id}-notes`} className={party.is_edited ? 'bg-yellow-50' : ''}>
                                        <td colSpan={5} className="px-6 py-4 text-sm text-gray-800 bg-gray-50">
                                            <div className="font-semibold mb-1">Nota del Invitado:</div>
                                            <p className="whitespace-pre-wrap">{party.notes}</p>
                                        </td>
                                    </tr>
                                );
                            }

                            return rows;
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

