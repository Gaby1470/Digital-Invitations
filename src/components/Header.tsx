"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase-client';
import { User } from '@supabase/supabase-js';

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
        router.refresh();
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase, router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  return (
    <header className="px-4 lg:px-6 h-16 flex items-center justify-between border-b bg-white w-full z-20">
      <Link href="/" className="flex items-center justify-center">
        <span className="text-2xl font-bold">Digital Invitations</span>
      </Link>
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
        <Link href="/templates" className="hover:underline underline-offset-4">
          Templates
        </Link>
        <Link href="/pricing" className="hover:underline underline-offset-4">
          Pricing
        </Link>
      </nav>
      <div className="flex items-center gap-4">
        {loading ? (
          <div className="h-9 w-20 animate-pulse bg-gray-200 rounded-md"></div>
        ) : user ? (
          <>
            <Link
              href="/dashboard"
              className="hidden sm:inline-flex h-9 items-center justify-center rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-200"
            >
              Dashboard
            </Link>
            <button
              onClick={handleSignOut}
              className="text-sm font-medium hover:underline underline-offset-4"
            >
              Sign Out
            </button>
          </>
        ) : (
          <>
            <Link href="/auth/login" className="hidden sm:inline-flex text-sm font-medium hover:underline underline-offset-4">
              Log In
            </Link>
            <Link
              href="/auth/signup"
              className="inline-flex h-9 items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
