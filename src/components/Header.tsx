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
    <header className="px-4 lg:px-6 h-16 flex items-center justify-between border-b border-neutral-100 bg-white w-full z-20">
      <Link href="/" className="flex items-center justify-center">
        {/* Changed to text-neutral-900 for a solid black logo look */}
        <span className="text-2xl font-bold text-neutral-900 tracking-tight">Digital Invitations</span>
      </Link>
      
      <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-neutral-900">
        <Link href="/templates" className="transition-colors hover:text-indigo-600">
          Plantillas
        </Link>
        <Link href="/pricing" className="transition-colors hover:text-indigo-600">
          Precios
        </Link>
      </nav>

      <div className="flex items-center gap-4">
        {loading ? (
          <div className="h-9 w-20 animate-pulse bg-neutral-100 rounded-md"></div>
        ) : user ? (
          <>
            <Link
              href="/dashboard"
              className="hidden sm:inline-flex h-9 items-center justify-center rounded-md bg-neutral-100 px-4 py-2 text-sm font-semibold text-neutral-900 transition-colors hover:bg-neutral-200"
            >
              Panel de Control
            </Link>
            <button
              onClick={handleSignOut}
              className="text-sm font-semibold text-neutral-900 hover:underline underline-offset-4"
            >
              Cerrar Sesión
            </button>
          </>
        ) : (
          <>
            <Link href="/auth/login" className="hidden sm:inline-flex text-sm font-semibold text-neutral-900 hover:underline underline-offset-4">
              Iniciar Sesión
            </Link>
            <Link
              href="/auth/signup"
              className="inline-flex h-9 items-center justify-center rounded-md bg-neutral-900 px-4 py-2 text-sm font-semibold text-white shadow transition-transform hover:scale-105 active:scale-95"
            >
              Registrarse
            </Link>
          </>
        )}
      </div>
    </header>
  );
}