// src/app/editor/[id]/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { templateConfig } from '@/lib/templateConfig';
import TemplateRenderer from '@/components/TemplateRenderer';
import { TemplateConfig } from '@/lib/custom_types';
import { EditorData } from '@/lib/custom_types';
import EditorForm from '@/components/editor/EditorForm';
import { EyeIcon, PencilSquareIcon } from '@heroicons/react/24/outline';

// Helper to safely parse JSON responses
async function safeJsonParse(response: Response) {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch (e) {
    console.error("Failed to parse JSON", text);
    return null;
  }
}

export default function EditorPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [invitationData, setInvitationData] = useState<EditorData | null>(null);
  const [template, setTemplate] = useState<TemplateConfig | null>(null);
  const [templateId, setTemplateId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'editor' | 'preview'>('editor');

  useEffect(() => {
    if (!id) return;

    const fetchInvitation = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/invitations/${id}`);
        if (!response.ok) { throw new Error('Invitation not found.'); }
        
        const inv = await safeJsonParse(response);
        if (!inv) { throw new Error('Failed to read invitation data.'); }
        
        const templateConf = templateConfig[inv.template];
        if (!templateConf) { throw new Error('Template configuration not found.'); }
        
        const data = inv.data || {};
        
        setInvitationData({ ...data, slug: inv.slug });
        setTemplate(templateConf);
        setTemplateId(inv.template);
      } catch (e: unknown) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError('An unknown error occurred.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchInvitation();
  }, [id]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/invitations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: invitationData, slug: invitationData?.slug }),
      });

      if (!response.ok) {
        const errorData = await safeJsonParse(response);
        throw new Error(errorData?.details || 'Failed to save invitation.');
      }
      
      // Optionally show a toast message here
      
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);

    } catch (e: unknown) {
      if (e instanceof Error) {
        alert(`Error: ${e.message}`);
      } else {
        alert('An unknown error occurred');
      }
      setIsSaving(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-screen">Loading Editor...</div>;
  if (error) return <div className="flex items-center justify-center h-screen">Error: {error}</div>;
  if (!invitationData || !template) return <div className="flex items-center justify-center h-screen">Could not load invitation data.</div>;

  const rendererKey = `${templateId}-${JSON.stringify(invitationData)}`;

  return (
    <>
      <div className="bg-gray-100 h-[calc(100dvh-5rem)] overflow-hidden">
        {/* Mobile view toggle */}
        <div className="md:hidden fixed bottom-4 right-4 z-20 flex gap-2">
          <button
            onClick={() => setViewMode('editor')}
            className={`p-4 rounded-full shadow-lg ${viewMode === 'editor' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700'}`}
          >
            <PencilSquareIcon className="w-6 h-6" />
          </button>
          <button
            onClick={() => setViewMode('preview')}
            className={`p-4 rounded-full shadow-lg ${viewMode === 'preview' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700'}`}
          >
            <EyeIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="max-w-screen-2xl mx-auto h-full md:grid md:grid-cols-3 lg:grid-cols-2 gap-6 md:p-4">
          <div className={`md:col-span-1 lg:col-span-1 h-full min-h-0 ${viewMode !== 'editor' && 'hidden md:block'}`}>
            <div className="h-full bg-white shadow-lg md:rounded-2xl overflow-hidden">
              <EditorForm 
                data={invitationData}
                onDataChange={setInvitationData}
                onSave={handleSave}
                template={template}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                isSaving={isSaving}
              />
            </div>
          </div>
          <div className={`md:col-span-2 lg:col-span-1 h-full min-h-0 flex items-center justify-center ${viewMode !== 'preview' && 'hidden md:flex'}`}>
            <div className="w-full h-full flex items-center justify-center p-4 md:p-0">
              <div className="h-full max-h-[92dvh] aspect-[9/19.5] bg-white rounded-[40px] shadow-2xl p-2 overflow-hidden ring-4 ring-gray-300">
                <div className="h-full w-full overflow-y-auto rounded-[30px]">
                  <TemplateRenderer 
                    key={rendererKey}
                    templateId={templateId} 
                    template={template} 
                    data={invitationData} 
                    invitationId={id}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
