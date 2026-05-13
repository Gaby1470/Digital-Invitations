"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { templateConfig } from '@/lib/templateConfig';
import TemplateRenderer from '@/components/TemplateRenderer';
import Link from 'next/link';
import { createClient } from '@/lib/supabase-client';
import { User } from '@supabase/supabase-js';

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
  const [hasMounted, setHasMounted] = useState(false); // NEW: To track hydration

  useEffect(() => {
    setHasMounted(true); // NEW: Confirm client-side mounting
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
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
        throw new Error(errorData?.error || 'Could not create invitation.');
      }

      const newInvitation = await safeJsonParse(createResponse);
      if (newInvitation && newInvitation.invitation.id) {
        router.push(`/editor/${newInvitation.invitation.id}`);
      } else {
        throw new Error('Failed to get the ID of the new invitation.');
      }

    } catch (e: any) {
      alert(`An error occurred: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Prevent rendering interactive elements until mounted to fix Hydration Mismatch
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
      
      {/* Ensure templateId is passed to help TemplateRenderer find the component */}
      <TemplateRenderer 
        templateId={templateName} 
        template={template} 
        data={template.defaultData} 
      />
    </div>
  );
}