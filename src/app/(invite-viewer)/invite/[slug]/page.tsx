// src/app/(invite-viewer)/invite/[slug]/page.tsx
import { templateConfig } from '@/lib/templateConfig';
import TemplateRenderer from '@/components/TemplateRenderer';
import Link from 'next/link';

type InvitePageProps = {
  params: {
    slug: string;
  };
};

async function getInvitation(slug: string) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const url = `${appUrl}/api/invitations/by-slug/${slug}`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 3600 } // Revalidate data every hour
    });

    if (!res.ok) {
       const errorBody = await res.json().catch(() => ({}));
       return { error: true, status: res.status, message: errorBody.error || res.statusText };
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error(`[getInvitation] Failed to fetch invitation ${slug}:`, error);
    return null;
  }
}

export default async function InvitePage({ params }: InvitePageProps) {
  const { slug } = await params;
  const invitation = await getInvitation(slug);

  if (!invitation || invitation.error) {
    let title = "Invitation Not Found";
    let message = "The invitation link is either invalid or has been removed.";

    if (invitation?.status === 403) {
      title = "Invitation Not Published";
      message = "This invitation is not yet available to the public.";
    }
    
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center px-4">
        <div className="bg-white p-8 rounded-2xl shadow-md max-w-md w-full">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{title}</h1>
          <p className="text-gray-600 mb-8">{message}</p>
          <Link href="/" className="inline-flex h-10 items-center justify-center rounded-md bg-gray-900 px-8 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-800">
            Go to Homepage
          </Link>
        </div>
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
  // We also pass the top-level ID down so the RSVP section can use it.
  const rendererData = { ...invitation.data, id: invitation.id };
  
  return <TemplateRenderer templateId={invitation.template} template={template} data={rendererData} />;
}
