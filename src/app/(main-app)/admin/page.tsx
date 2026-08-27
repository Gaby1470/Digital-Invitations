// src/app/(main-app)/admin/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { templateConfig } from '@/lib/templateConfig';
import { 
  ClipboardDocumentCheckIcon, 
  ClipboardIcon,
  PlusIcon,
  PencilIcon,
  LinkIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

interface Invitation {
  id: string;
  user_id: string;
  created_at: string;
  template: string;
  slug: string | null;
  claim_code: string | null;
  is_custom_design: boolean;
  is_published: boolean;
  is_expired: boolean;
  profiles?: {
    email: string;
    full_name: string | null;
    is_admin: boolean;
  } | null;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New invitation form state
  const [isCreating, setIsCreating] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(Object.keys(templateConfig)[0] || '');
  const [customSlug, setCustomSlug] = useState('');
  const [formError, setFormError] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const fetchInvitations = async () => {
    try {
      const res = await fetch('/api/admin/invitations');
      if (res.ok) {
        const data = await res.json();
        setInvitations(data);
      }
    } catch (err) {
      console.error('Error fetching admin invitations:', err);
    }
  };

  // Check admin access and load invitations
  useEffect(() => {
    async function initAdmin() {
      try {
        const checkRes = await fetch('/api/admin/check');
        if (!checkRes.ok) {
          router.push('/dashboard');
          return;
        }
        
        const { isAdmin } = await checkRes.json();
        if (!isAdmin) {
          router.push('/dashboard');
          return;
        }

        setIsAdmin(true);
        await fetchInvitations();
      } catch (err) {
        console.error('Error initializing admin dashboard:', err);
        router.push('/dashboard');
      } finally {
        setLoading(false);
      }
    }

    initAdmin();
  }, [router]);

  const handleCreateCustom = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setIsCreating(true);

    try {
      const res = await fetch('/api/admin/invitations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template: selectedTemplate,
          slug: customSlug || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create invitation');
      }

      setCustomSlug('');
      await fetchInvitations();
      // Redirect to editor for this newly created invitation
      if (data.invitation && data.invitation.id) {
        router.push(`/editor/${data.invitation.id}`);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setFormError(err.message);
      } else {
        setFormError('Ocurrió un error inesperado.');
      }
      setIsCreating(false);
    }
  };

  const handleGenerateClaimCode = async (id: string) => {
    setActionLoadingId(id);
    try {
      const res = await fetch(`/api/admin/invitations/${id}/generate-claim-code`, {
        method: 'POST',
      });

      if (!res.ok) {
        throw new Error('No se pudo generar el código de reclamo.');
      }

      await fetchInvitations();
    } catch (err) {
      console.error(err);
      alert('Error al generar el código de reclamo.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const getTemplateDisplayName = (templateKey: string) => {
    return templateConfig[templateKey]?.name ?? templateKey.replace(/-/g, ' ');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-gray-950">
        <div className="h-10 w-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-gray-950 transition-colors duration-500 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Panel de Administrador
            </h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Crea invitaciones personalizadas ocultas y gestiona los códigos de reclamo para tus clientes.
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-3">
            <Link 
              href="/dashboard" 
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-full shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-950 hover:bg-gray-50 dark:hover:bg-gray-900 focus:outline-none"
            >
              Ir a mi Dashboard
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Create Custom Invitation Card */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-900 shadow rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <PlusIcon className="w-5 h-5 text-indigo-600" />
                Nueva Invitación Personalizada
              </h2>
              <form onSubmit={handleCreateCustom} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Selecciona Plantilla
                  </label>
                  <select
                    value={selectedTemplate}
                    onChange={(e) => setSelectedTemplate(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {Object.entries(templateConfig).map(([key, config]) => (
                      <option key={key} value={key}>
                        {config.name} ({config.category})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Enlace Personalizado (Opcional)
                  </label>
                  <div className="flex rounded-lg shadow-sm">
                    <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-500 text-xs">
                      /
                    </span>
                    <input
                      type="text"
                      placeholder="boda-maria-y-juan"
                      value={customSlug}
                      onChange={(e) => setCustomSlug(e.target.value)}
                      className="w-full rounded-r-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-400">
                    Si no ingresas ninguno, se generará uno aleatorio.
                  </p>
                </div>

                {formError && (
                  <div className="bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm flex items-start gap-2">
                    <ExclamationTriangleIcon className="w-5 h-5 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isCreating}
                  className="w-full h-11 inline-flex items-center justify-center rounded-full bg-indigo-600 text-white font-semibold text-sm shadow-md hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  {isCreating ? (
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    "Crear y Abrir en Editor"
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Invitation Management List */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-900 shadow rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Invitaciones Creadas
                </h2>
                <button 
                  onClick={fetchInvitations}
                  className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500"
                >
                  <ArrowPathIcon className="w-5 h-5 animate-hover-spin" />
                </button>
              </div>

              {invitations.length === 0 ? (
                <div className="p-12 text-center text-gray-500 dark:text-gray-400">
                  No hay invitaciones registradas en el sistema.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Invitación
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Dueño Actual
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Estado de Reclamo / Código
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                      {invitations.map((inv) => {
                        const invitationLink = `${window.location.origin}/${inv.slug || inv.id}`;
                        const isClaimed = inv.profiles?.email !== undefined && !inv.profiles?.is_admin;

                        return (
                          <tr key={inv.id} className="hover:bg-slate-50 dark:hover:bg-gray-900/50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex flex-col">
                                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                  {getTemplateDisplayName(inv.template)}
                                </span>
                                <span className="text-xs text-gray-400 mt-0.5">
                                  Creado: {new Date(inv.created_at).toLocaleDateString()}
                                </span>
                                <div className="flex items-center gap-1.5 mt-1 text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                                  <LinkIcon className="w-3.5 h-3.5" />
                                  <a href={invitationLink} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                    /{inv.slug || inv.id.substring(0, 8)}
                                  </a>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex flex-col">
                                {isClaimed ? (
                                  <>
                                    <span className="text-sm text-gray-900 dark:text-white font-medium">
                                      {inv.profiles?.full_name || 'Usuario Registrado'}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                      {inv.profiles?.email}
                                    </span>
                                  </>
                                ) : (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-400">
                                    No Reclamada (Admin)
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {inv.claim_code ? (
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-sm font-bold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 px-2 py-1 rounded border border-indigo-100 dark:border-indigo-900">
                                    {inv.claim_code}
                                  </span>
                                  <button
                                    onClick={() => handleCopyText(inv.claim_code || '', inv.id)}
                                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-gray-500"
                                    title="Copiar código de reclamo"
                                  >
                                    {copiedId === inv.id ? (
                                      <ClipboardDocumentCheckIcon className="w-4 h-4 text-green-600" />
                                    ) : (
                                      <ClipboardIcon className="w-4 h-4" />
                                    )}
                                  </button>
                                </div>
                              ) : isClaimed ? (
                                <span className="inline-flex items-center gap-1 text-xs text-green-600 dark:text-green-400 font-medium">
                                  <CheckCircleIcon className="w-4 h-4" />
                                  Reclamada
                                </span>
                              ) : (
                                <button
                                  onClick={() => handleGenerateClaimCode(inv.id)}
                                  disabled={actionLoadingId === inv.id}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400 rounded-full text-xs font-semibold hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-colors disabled:opacity-50"
                                >
                                  {actionLoadingId === inv.id ? (
                                    <div className="h-3 w-3 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                                  ) : (
                                    <>
                                      Generar Código
                                      <ArrowRightIcon className="w-3 h-3" />
                                    </>
                                  )}
                                </button>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end gap-3">
                                <Link
                                  href={`/editor/${inv.id}`}
                                  className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 p-1.5 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-full"
                                  title="Editar Invitación"
                                >
                                  <PencilIcon className="w-4 h-4" />
                                </Link>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}
