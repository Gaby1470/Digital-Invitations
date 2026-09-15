// src/app/(viewer)/[slug]/page.tsx
import { cookies } from 'next/headers';
import Link from 'next/link';
import { createClient } from '@/lib/supabase-server';
import { templateConfig } from '@/lib/templateConfig';
import InviteClientPage from './client-page';
import { AlertTriangle } from 'lucide-react';
import type { Metadata } from 'next';

type Props = {
  params: Promise<{ slug: string }>;
};

// --- Server-Side Data Fetcher Helper (cached or deduplicated) ---
async function getInvitationDataServer(slug: string) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  // Get current user if logged in
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch the invitation by slug
  const { data, error } = await supabase
    .from('invitations')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !data) {
    return { error: 'Invitation not found.', status: 404, invitation: null };
  }

  // Check if the invitation is expired
  const now = new Date();
  const expiresAt = data.expires_at ? new Date(data.expires_at) : null;
  
  if (expiresAt && expiresAt < now) {
    // Optionally update the is_expired flag in the database
    if (!data.is_expired) {
      // Async background update, no await to speed up rendering
      supabase.from('invitations').update({ is_expired: true }).eq('id', data.id).then(({ error: updateError }) => {
        if (updateError) {
          console.error(`Failed to update is_expired flag for invitation ${data.id}:`, updateError);
        }
      });
    }
    return { error: 'This invitation has expired.', status: 410, invitation: null };
  }

  // If the invitation isn't published, only the owner can see it
  if (!data.is_published) {
    if (!user || user.id !== data.user_id) {
      console.error(`Unauthorized access attempt for unpublished invitation with slug ${slug}`);
      return { error: 'This invitation has not been published yet.', status: 403, invitation: null };
    }
  }

  return { invitation: data, status: 200, error: null };
}

// --- Dynamic Metadata Generation (OpenGraph Cards) ---
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { invitation } = await getInvitationDataServer(slug);

  if (!invitation) {
    return {
      title: 'Invitación | Tap 2 Invite',
      description: 'Crea y comparte invitaciones digitales animadas para cualquier ocasión.',
    };
  }

  const invitationData = invitation.data || {};
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://tap2invite.com';

  const title = invitationData.heroNames || 'Nuestra Invitación';
  const description = invitationData.heroSubtitle || invitationData.heroTitle || 'Acompáñanos a celebrar este día tan especial.';
  const imageUrl = invitationData.hero_image_url || '/branding/share-image.jpg';

  return {
    title: `${title} | Tap 2 Invite`,
    description,
    openGraph: {
      title,
      description,
      url: `${appUrl}/invitation/${slug}`,
      siteName: 'Tap 2 Invite',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `Invitación de ${title}`,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}

// --- Server-Rendered Page ---
export default async function InvitePage({ params }: Props) {
  const { slug } = await params;
  const { invitation, status } = await getInvitationDataServer(slug);

  if (!invitation) {
    let title = "Invitation Not Found";
    let message = "The invitation link is either invalid or has been removed.";
    if (status === 403) {
      title = "Invitation Not Published";
      message = "This invitation is not yet available to the public.";
    } else if (status === 410) {
      title = "Invitation Expired";
      message = "We're sorry, but this invitation is no longer active.";
    }
    
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center px-4">
        <div className="bg-white p-8 rounded-2xl shadow-md max-w-md w-full">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-8 h-8"/>
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
  
  const template = templateConfig[invitation.template];

  if (!template) {
     return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-4xl font-bold mb-4">Error</h1>
        <p className="text-gray-600">Could not load the invitation template.</p>
      </div>
    );
  }

  return <InviteClientPage invitation={invitation} />;
}
