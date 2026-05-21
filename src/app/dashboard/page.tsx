"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase-client';
import { User } from '@supabase/supabase-js';
import { Rsvp } from '@/lib/types';
import RsvpList from '@/components/dashboard/RsvpList';

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [invitations, setInvitations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [rsvps, setRsvps] = useState<Rsvp[]>([]);
  const [selectedInvitationId, setSelectedInvitationId] = useState<string | null>(null);
  const [isRsvpModalOpen, setIsRsvpModalOpen] = useState(false);
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const [rsvpError, setRsvpError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        const { data: invitations, error } = await supabase
          .from('invitations')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching invitations:', error);
        } else if (invitations) {
          setInvitations(invitations);
        }
      } else {
        // No user, redirect to login
        router.push('/auth/login');
      }
      setLoading(false);
    };

    fetchUserData();
  }, [router, supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const handleViewRsvps = async (invitationId: string) => {
    setSelectedInvitationId(invitationId);
    setIsRsvpModalOpen(true);
    setRsvpLoading(true);
    setRsvpError(null);
    setRsvps([]);
    try {
      const response = await fetch(`/api/invitations/${invitationId}/rsvps`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch RSVPs');
      }
      const data = await response.json();
      setRsvps(data);
    } catch (error: any) {
      console.error('Error fetching RSVPs:', error.message);
      setRsvpError(error.message);
    } finally {
      setRsvpLoading(false);
    }
  };

  const handleCopyLink = (invitationId: string) => {
    const link = `${window.location.origin}/invite/${invitationId}`;
    navigator.clipboard.writeText(link).then(() => {
      setCopiedId(invitationId);
      setTimeout(() => setCopiedId(null), 2000); // Reset after 2 seconds
    });
  };

  const selectedInvitation = invitations.find(inv => inv.id === selectedInvitationId);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading dashboard...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">

      <main className="flex-1">
        <div className="container px-4 md:px-6 py-12">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">My Invitations</h1>
            <Link
              href="/templates"
              className="inline-flex h-10 items-center justify-center rounded-md bg-gray-900 px-8 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90"
            >
              + New Invitation
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-md">
            {invitations.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {invitations.map((inv) => (
                  <li key={inv.id} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div className="mb-4 sm:mb-0">
                      <p className="text-lg font-bold" style={{ color: inv.data?.primaryColor || '#111' }}>
                        {inv.data?.heroNames || 'Untitled Invitation'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {inv.template} &middot; Created on {new Date(inv.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleCopyLink(inv.id)}
                        className="text-sm font-medium text-purple-600 hover:underline disabled:text-gray-400"
                        disabled={copiedId === inv.id}
                      >
                        {copiedId === inv.id ? 'Copied!' : 'Copy Link'}
                      </button>
                      <Link href={`/invite/${inv.id}`} target="_blank" className="text-sm font-medium text-blue-600 hover:underline">
                        View
                      </Link>
                      <Link href={`/editor/${inv.id}`} className="text-sm font-medium text-indigo-600 hover:underline">
                        Edit
                      </Link>
                      <button onClick={() => handleViewRsvps(inv.id)} className="text-sm font-medium text-green-600 hover:underline">
                        View RSVPs
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center p-12">
                <h3 className="text-xl font-medium">No invitations yet!</h3>
                <p className="text-gray-500 mt-2">Get started by creating your first one.</p>
              </div>
            )}
          </div>
        </div>
      </main>
      
      {isRsvpModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center mb-4 border-b pb-4">
              <h2 className="text-2xl font-bold">
                Responses for <span className="text-indigo-600">{selectedInvitation?.data?.heroNames || 'Invitation'}</span>
              </h2>
              <button onClick={() => setIsRsvpModalOpen(false)} className="text-gray-500 hover:text-gray-800 text-3xl leading-none">&times;</button>
            </div>
            <div className="overflow-y-auto">
              {rsvpError ? (
                <div className="text-center py-10 text-red-500">
                  <p>Could not load responses.</p>
                  <p className="text-sm text-gray-500 mt-2">{rsvpError}</p>
                </div>
              ) : (
                <RsvpList rsvps={rsvps} isLoading={rsvpLoading} />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
