// src/app/invite/[id]/page.tsx
import { createClient } from '@/lib/supabase-server';
import { templateConfig } from '@/lib/templateConfig';
import TemplateRenderer from '@/components/TemplateRenderer';
import Link from 'next/link';

type InvitePageProps = {
  params: {
    id: string;
  };
};

export default async function InvitePage({ params }: InvitePageProps) {
  const { id } = params;
  const supabase = createClient();

  // Fetch the invitation data from Supabase
  const { data: invitation, error } = await supabase
    .from('invitations')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !invitation) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-4xl font-bold mb-4">Invitation Not Found</h1>
        <p className="text-gray-600 mb-8">The invitation link is either invalid or has been removed.</p>
        <Link href="/" className="inline-flex h-10 items-center justify-center rounded-md bg-gray-900 px-8 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90">
          Go to Homepage
        </Link>
      </div>
    );
  }

  // Get the corresponding template configuration
  const template = templateConfig[invitation.template];

  if (!template) {
     return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-4xl font-bold mb-4">Error</h1>
        <p className="text-gray-600">Could not load the invitation template.</p>
      </div>
    );
  }

  // The 'data' field from Supabase contains all the personalized content
  return <TemplateRenderer template={template} data={invitation.data} />;
}
