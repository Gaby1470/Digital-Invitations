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
    <header className="sticky top-0 backdrop-blur-md bg-white/80 dark:bg-gray-950/80 h-20 flex items-center border-b border-gray-100 dark:border-gray-900 w-full z-50 transition-all">
      <div className="max-w-screen-2xl mx-auto flex md:grid grid-cols-[1fr_auto_1fr] items-center justify-between w-full px-4 lg:px-8">
        {/* Logo Section */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-500">
              Tap to Invite<span className="text-pink-500 group-hover:animate-pulse">.</span>
            </span>
          </Link>
        </div>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-600 dark:text-gray-300">
          <Link href="/templates" className="transition-colors hover:text-indigo-600 dark:hover:text-indigo-400 relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-indigo-600 after:transition-all hover:after:w-full">
            Plantillas
          </Link>
          <Link href="/how-it-works" className="transition-colors hover:text-indigo-600 dark:hover:text-indigo-400 relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-indigo-600 after:transition-all hover:after:w-full">
            Como funciona
          </Link>
          <Link href="/pricing" className="transition-colors hover:text-indigo-600 dark:hover:text-indigo-400 relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-indigo-600 after:transition-all hover:after:w-full">
            Precios
          </Link>
          <Link href="/contact" className="transition-colors hover:text-indigo-600 dark:hover:text-indigo-400 relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-indigo-600 after:transition-all hover:after:w-full">
            Contacto
          </Link>
        </nav>

        {/* Right Side Controls */}
        <div className="flex items-center justify-end gap-4">
          {loading ? (
            <div className="h-10 w-24 animate-pulse bg-gray-100 dark:bg-gray-800 rounded-full"></div>
          ) : user ? (
            <>
              <Link
                href="/dashboard"
                className="hidden sm:inline-flex h-11 items-center justify-center rounded-full bg-indigo-600 px-6 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all hover:bg-indigo-700 hover:shadow-indigo-500/30 hover:-translate-y-0.5 active:translate-y-0"
              >
                Panel de Control
              </Link>
              <button
                onClick={handleSignOut}
                className="text-sm font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
              >
                Cerrar Sesión
              </button>
            </>
          ) : (
            <>
              <Link 
                href="/auth/login" 
                className="hidden sm:inline-flex text-sm font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
              >
                Iniciar Sesión
              </Link>
              <Link
                href="/auth/signup"
                className="inline-flex h-11 items-center justify-center rounded-full bg-indigo-600 px-6 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all hover:bg-indigo-700 hover:shadow-indigo-500/30 hover:-translate-y-0.5 active:translate-y-0"
              >
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}