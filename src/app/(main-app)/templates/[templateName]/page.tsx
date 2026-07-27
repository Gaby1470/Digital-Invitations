"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { templateConfig } from '@/lib/templateConfig';
import TemplateRenderer from '@/components/TemplateRenderer';
import Link from 'next/link';
import { createClient } from '@/lib/supabase-client';
import { User, Session } from '@supabase/supabase-js';
import Modal from '@/components/editor/shared/Modal'; // Using the existing modal

async function safeJsonParse(response: Response) {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch (e) {
    return null;
  }
}

export default function TemplatePreviewPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();
  const templateName = params.templateName as string;

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasMounted, setHasMounted] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setHasMounted(true);
    const getSession = async () => {
      const { data: { session } }: { data: { session: Session | null } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };
    getSession();
  }, [supabase]);

  const template = templateConfig[templateName];

  const handlePersonalize = async () => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    setLoading(true);
    try {
      const createResponse = await fetch('/api/invitations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ template: templateName }),
      });

      if (!createResponse.ok) {
        const errorData = await safeJsonParse(createResponse);
        const message = errorData?.error || 'Could not create invitation.';
        
        if (createResponse.status === 403) {
          setErrorMessage(message);
          setIsErrorModalOpen(true);
          setLoading(false);
          return;
        } else {
          throw new Error(message);
        }
      }

      const newInvitation = await safeJsonParse(createResponse);
      if (newInvitation && newInvitation.invitation.id) {
        router.push(`/editor/${newInvitation.invitation.id}`);
      } else {
        throw new Error('Failed to get the ID of the new invitation.');
      }

    } catch (e: unknown) {
      if (e instanceof Error) {
        alert(`An error occurred: ${e.message}`);
      } else {
        alert('An unknown error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!hasMounted) {
    return <div className="min-h-screen bg-white" />; 
  }

  if (!template) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-4xl font-bold">Template Not Found</h1>
        <Link href="/templates" className="mt-4 text-blue-600 underline">Back to Templates</Link>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="fixed bottom-8 right-8 z-50">
        <button 
          onClick={handlePersonalize}
          disabled={loading}
          className="px-8 py-4 bg-blue-600 text-white font-bold rounded-full shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105 disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Personalize this Template'}
        </button>
      </div>
      
      <TemplateRenderer 
        templateId={templateName} 
        template={template} 
        data={template.defaultData} 
      />

      <Modal
        isOpen={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        title="Cannot Create New Invitation"
      >
        <div className="p-4">
          <p className="text-gray-700">{errorMessage}</p>
          <div className="mt-6 flex justify-end gap-4">
              <button 
                  onClick={() => setIsErrorModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                  Close
              </button>
              <Link href="/dashboard" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                  Go to Dashboard
              </Link>
          </div>
        </div>
      </Modal>
    </div>
  );
}
