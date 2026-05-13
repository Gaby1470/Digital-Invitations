// src/app/editor/[id]/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { templateConfig } from '@/lib/templateConfig';
import TemplateRenderer from '@/components/TemplateRenderer';
import { TemplateConfig } from '@/lib/types';
import EditorForm from '@/components/editor/EditorForm';

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
  const id = params.id as string;

  const [invitationData, setInvitationData] = useState<any>(null);
  const [template, setTemplate] = useState<TemplateConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        
        setInvitationData(inv.data);
        setTemplate(templateConf);
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
        body: JSON.stringify({ data: invitationData }),
      });

      if (!response.ok) {
        const errorData = await safeJsonParse(response);
        throw new Error(errorData?.details || 'Failed to save invitation.');
      }
      alert('Saved successfully!');
    } catch (e: any) {
      alert(`Error saving: ${e.message}`);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-screen">Loading Editor...</div>;
  if (error) return <div className="flex items-center justify-center h-screen">Error: {error}</div>;
  if (!invitationData || !template) return <div className="flex items-center justify-center h-screen">Could not load invitation data.</div>;

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-screen-2xl mx-auto md:grid md:grid-cols-3 lg:grid-cols-2 gap-8">
        <div className="md:col-span-1 lg:col-span-1 md:sticky md:top-0 h-screen">
          <div className="h-full overflow-y-auto bg-white shadow-lg">
            <EditorForm 
              data={invitationData}
              onDataChange={setInvitationData}
              onSave={handleSave}
              template={template}
            />
          </div>
        </div>
        <div className="md:col-span-2 lg:col-span-1 py-12 flex justify-center">
          <div className="w-full max-w-md">
            <div className="aspect-[9/19.5] bg-white rounded-[40px] shadow-2xl p-2 overflow-hidden ring-4 ring-gray-300">
              <div className="h-full w-full overflow-y-auto rounded-[30px]">
                <TemplateRenderer template={template} data={invitationData} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
