// src/app/(invite-viewer)/invite/[slug]/page.tsx
import { templateConfig } from '@/lib/templateConfig';
import TemplateRenderer from '@/components/TemplateRenderer';
import Link from 'next/link';

type InvitePageProps = {
  params: {
    slug: string;
  };
};

async function getInvitation(slugOrId: string) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  try {
    // First, try to fetch by slug
    const slugUrl = `${appUrl}/api/invitations/by-slug/${slugOrId}`;
    let res = await fetch(slugUrl, {
      next: { revalidate: 3600 } // Revalidate data every hour
    });

    // If that fails (e.g. 404), try fetching by ID
    if (!res.ok) {
      const idUrl = `${appUrl}/api/invitations/${slugOrId}`;
      res = await fetch(idUrl, {
        next: { revalidate: 3600 }
      });
    }

    if (!res.ok) {
      return null;
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(`[getInvitation] Failed to fetch invitation ${slugOrId}:`, error);
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
      message = invitation.message || "This invitation is not yet available to the public.";
    }
    
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-4xl font-bold mb-4">{title}</h1>
        <p className="text-gray-600 mb-8">{message}</p>
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
  // We also pass the top-level ID down so the RSVP section can use it.
  const rendererData = { ...invitation.data, id: invitation.id };
  
  return <TemplateRenderer templateId={invitation.template} template={template} data={rendererData} />;
}
