// src/app/editor/[id]/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { templateConfig } from '@/lib/templateConfig';
import TemplateRenderer from '@/components/TemplateRenderer';
import { TemplateConfig, EditorData } from '@/lib/types';
import EditorForm from '@/components/editor/EditorForm';
import { EyeIcon, PencilSquareIcon, CheckCircleIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

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
  const [templateId, setTemplateId] = useState<string>(''); // State for the template ID
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'editor' | 'preview'>('editor');
  const [isShareModalOpen, setShareModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);


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
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInvitation();
  }, [id]);

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/invitations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: invitationData, slug: invitationData?.slug }),
      });

      if (!response.ok) {
        const errorData = await safeJsonParse(response);
        throw new Error(errorData?.details || 'Failed to save and publish invitation.');
      }
      
      const updatedInvitation = await safeJsonParse(response);
      
      // Update local state and open modal
      setInvitationData({ ...invitationData, ...updatedInvitation });
      setShareModalOpen(true);
    } catch (e: any) {
      alert(`Error: ${e.message}`);
    }
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/invite/${invitationData?.slug || id}`;
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    });

    // Mark as published on first share
    if (!invitationData?.is_published) {
      fetch(`/api/invitations/${id}/publish`, { method: 'POST' })
        .then(res => {
          if (res.ok) {
            setInvitationData(prevData => {
              if (!prevData) return prevData; // Should not happen, but good for type safety
              return { ...prevData, is_published: true };
            });
            console.log('Invitation marked as published');
          }
        });
    }
  };

  if (loading) return <div className="flex items-center justify-center h-screen">Loading Editor...</div>;
  if (error) return <div className="flex items-center justify-center h-screen">Error: {error}</div>;
  if (!invitationData || !template) return <div className="flex items-center justify-center h-screen">Could not load invitation data.</div>;

  const rendererKey = `${templateId}-${JSON.stringify(invitationData)}`;

  return (
    <>
      <div className="bg-gray-100 h-[100dvh] overflow-hidden">
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
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isShareModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full text-center">
            <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Saved Successfully!</h2>
            <p className="text-gray-500 mb-6">Your invitation is ready to be shared.</p>
            
            <div className="flex items-center bg-gray-100 border border-gray-200 rounded-lg p-2 mb-6">
              <input 
                type="text" 
                readOnly 
                value={`${window.location.origin}/invite/${invitationData?.slug || id}`}
                className="bg-transparent flex-grow text-gray-700 focus:outline-none"
              />
              <button 
                onClick={handleCopyLink}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md font-semibold text-sm hover:bg-indigo-700 transition-colors flex items-center gap-2"
              >
                <ClipboardDocumentIcon className="w-5 h-5" />
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            
            <button 
              onClick={() => router.push('/dashboard')}
              className="w-full bg-gray-800 text-white py-3 rounded-lg font-semibold hover:bg-gray-900 transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      )}
    </>
  );
}
