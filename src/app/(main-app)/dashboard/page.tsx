"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase-client';
import { EditorData } from '@/lib/custom_types';
import { templateConfig } from '@/lib/templateConfig';
import { TrashIcon, DocumentDuplicateIcon, UserGroupIcon, PencilIcon, PlusIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import GuestManager from '@/components/dashboard/GuestManager';

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

export default function DashboardPage() {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvitationId, setSelectedInvitationId] = useState<string | null>(null);
  const [isGuestManagerOpen, setIsGuestManagerOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: invitations, error } = await supabase
          .from('invitations')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching invitations:', error);
        } else if (invitations) {
          setInvitations(invitations);
        }
      } else {
        router.push('/auth/login');
      }
      setLoading(false);
    };

    fetchUserData();
  }, [router, supabase]);

  const handleOpenGuestManager = (invitationId: string) => {
    setSelectedInvitationId(invitationId);
    setIsGuestManagerOpen(true);
  };

  const handleCopyLink = (invitationId: string, slug?: string) => {
    const link = `${window.location.origin}/invite/${slug || invitationId}`;
    navigator.clipboard.writeText(link).then(() => {
      setCopiedId(invitationId);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const handleDelete = async (invitationId: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta invitación? Esta acción no se puede deshacer.')) {
      try {
        const response = await fetch(`/api/invitations/${invitationId}`, { method: 'DELETE' });
        if (!response.ok) {
          const errorData = await response.json() as { error: string };
          throw new Error(errorData.error || 'No se pudo eliminar la invitación.');
        }
        setInvitations(invitations.filter(inv => inv.id !== invitationId));
      } catch (error: unknown) {
        if (error instanceof Error) {
          alert(`Error: ${error.message}`);
        } else {
          alert('An unknown error occurred');
        }
      }
    }
  };

  const getInvitationStatus = (inv: Invitation) => {
    const isPastEvent = inv.data?.eventDate && new Date(inv.data.eventDate) < new Date();
    
    if (inv.is_expired || isPastEvent) {
      return 'Expired';
    }
    return inv.is_published ? 'Published' : 'Draft';
  };

  const getTemplateDisplayName = (templateKey: string) => {
    return templateConfig[templateKey]?.name ?? templateKey.replace(/-/g, ' ');
  };

  const selectedInvitation = invitations.find(inv => inv.id === selectedInvitationId);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-gray-950">
        <div className="h-10 w-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-gray-950 transition-colors duration-500 relative overflow-hidden">
      
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-indigo-100/50 dark:bg-indigo-900/10 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-pink-100/50 dark:bg-pink-900/10 rounded-full blur-3xl pointer-events-none translate-x-1/2 translate-y-1/2"></div>

      <main className="flex-1 relative z-10">
        <div className="container mx-auto px-4 md:px-6 py-12 lg:py-16">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                Mis <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-500">Invitaciones</span>
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">Gestiona tus eventos, realiza un seguimiento de los RSVPs y actualiza los detalles.</p>
            </div>
            <Link
              href="/templates"
              className="inline-flex h-12 items-center justify-center rounded-full bg-indigo-600 px-6 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:bg-indigo-700 hover:shadow-indigo-500/50 hover:-translate-y-0.5"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Nueva Invitación
            </Link>
          </div>

          {invitations.length > 0 ? (
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {invitations.map((inv, idx) => {
                  const status = getInvitationStatus(inv);

                  return (
                    <motion.div
                      key={inv.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                      className={`group bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border transition-all duration-300 flex flex-col h-full ${
                        status === 'Expired' 
                          ? 'border-gray-100 dark:border-gray-800 opacity-80 hover:opacity-100' 
                          : 'border-gray-100 dark:border-gray-800 hover:shadow-xl hover:border-indigo-100 dark:hover:border-indigo-900/50'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="space-y-1">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-1">
                            {inv.data?.heroNames || 'Untitled Event'}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                            {getTemplateDisplayName(inv.template)}
                          </p>
                        </div>
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${
                          status === 'Published' 
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
                            : status === 'Expired'
                            ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                        }`}>
                          {status}
                        </span>
                      </div>

                      <div className="mt-auto pt-6">
                        <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
                          Creado {new Date(inv.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                        
                        <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-4">
                          <div className="flex gap-2">
                            <Link 
                              href={`/editor/${inv.id}`} 
                              className="p-2 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-400 dark:hover:bg-indigo-900/40 transition-colors tooltip-trigger relative group/btn"
                            >
                              <PencilIcon className="w-5 h-5" />
                              <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">Edit Design</span>
                            </Link>
                            
                            <button 
                              onClick={() => handleOpenGuestManager(inv.id)} 
                              className="p-2 rounded-full bg-pink-50 text-pink-600 hover:bg-pink-100 dark:bg-pink-900/20 dark:text-pink-400 dark:hover:bg-pink-900/40 transition-colors tooltip-trigger relative group/btn"
                            >
                              <UserGroupIcon className="w-5 h-5" />
                              <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">Manage Guests</span>
                            </button>
                          </div>

                          <div className="flex gap-1">
                            <button
                              onClick={() => handleCopyLink(inv.id, inv.slug ?? undefined)}
                              className="p-2 rounded-full text-gray-400 hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white transition-colors relative group/btn"
                            >
                              <DocumentDuplicateIcon className={`w-5 h-5 ${copiedId === inv.id ? 'text-green-500' : ''}`} />
                              <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                {copiedId === inv.id ? 'Copied!' : 'Copy Link'}
                              </span>
                            </button>

                            <div className="relative group/delete">
                              <button
                                onClick={() => handleDelete(inv.id)}
                                disabled={inv.is_published}
                                className="p-2 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-gray-400"
                              >
                                <TrashIcon className="w-5 h-5" />
                              </button>
                              {inv.is_published && (
                                <span className="absolute -top-10 right-0 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover/delete:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                                  No se puede eliminar una invitación publicada. Despublica primero.
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-12 text-center shadow-sm border border-gray-100 dark:border-gray-800 max-w-2xl mx-auto mt-12">
              <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <UserGroupIcon className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">No hay invitaciones todavía</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
                No has creado ninguna invitación todavía. Haz clic en el botón de abajo para comenzar a crear tu primera invitación digital personalizada.
              </p>
              <Link
                href="/templates"
                className="inline-flex h-12 items-center justify-center rounded-full bg-indigo-600 px-8 text-base font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:bg-indigo-700 hover:shadow-indigo-500/50 hover:-translate-y-0.5"
              >
                Explora Plantillas
              </Link>
            </div>
          )}
        </div>
      </main>
      
      <AnimatePresence>
        {isGuestManagerOpen && selectedInvitationId && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setIsGuestManagerOpen(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border border-gray-100 dark:border-gray-800"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6 border-b border-gray-100 dark:border-gray-800 pb-6 p-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Guest Manager
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    For <span className="font-medium text-indigo-600 dark:text-indigo-400">{selectedInvitation?.data?.heroNames || 'Invitation'}</span>
                  </p>
                </div>
                <button 
                  onClick={() => setIsGuestManagerOpen(false)} 
                  className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <span className="text-2xl leading-none">&times;</span>
                </button>
              </div>
              <div className="overflow-y-auto pr-2 custom-scrollbar p-6 pt-0">
                <GuestManager invitationId={selectedInvitationId} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
