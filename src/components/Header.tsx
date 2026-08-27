"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase-client';
import { User } from '@supabase/supabase-js';
import { Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const NavLinks = ({ onLinkClick }: { onLinkClick?: () => void }) => (
  <>
    <Link href="/templates" onClick={onLinkClick} className="block md:inline-block py-2 md:py-1 text-lg md:text-sm font-semibold text-gray-700 dark:text-gray-200 transition-colors hover:text-indigo-600 dark:hover:text-indigo-400">
      Plantillas
    </Link>
    <Link href="/how-it-works" onClick={onLinkClick} className="block md:inline-block py-2 md:py-1 text-lg md:text-sm font-semibold text-gray-700 dark:text-gray-200 transition-colors hover:text-indigo-600 dark:hover:text-indigo-400">
      Como funciona
    </Link>
    <Link href="/pricing" onClick={onLinkClick} className="block md:inline-block py-2 md:py-1 text-lg md:text-sm font-semibold text-gray-700 dark:text-gray-200 transition-colors hover:text-indigo-600 dark:hover:text-indigo-400">
      Precios
    </Link>
    <Link href="/contact" onClick={onLinkClick} className="block md:inline-block py-2 md:py-1 text-lg md:text-sm font-semibold text-gray-700 dark:text-gray-200 transition-colors hover:text-indigo-600 dark:hover:text-indigo-400">
      Contacto
    </Link>
  </>
);

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      
      if (currentUser) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', currentUser.id)
          .single();
        setIsAdmin(!!profile?.is_admin);
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        
        if (currentUser) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('is_admin')
            .eq('id', currentUser.id)
            .single();
          setIsAdmin(!!profile?.is_admin);
        } else {
          setIsAdmin(false);
        }
        setLoading(false);
        router.refresh();
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase, router]);
  
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isMenuOpen]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setIsMenuOpen(false);
    router.push('/auth/login');
  };
  
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <header className="sticky top-0 backdrop-blur-md bg-white/80 dark:bg-gray-950/80 h-20 flex items-center border-b border-gray-100 dark:border-gray-900 w-full z-50 transition-all">
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between w-full px-4 lg:px-8">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-500">
                Tap 2 Invite<span className="text-pink-500 group-hover:animate-pulse">.</span>
              </span>
            </Link>
          </div>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-8">
            <NavLinks />
          </nav>

          {/* Right Side Controls */}
          <div className="flex items-center justify-end gap-4">
            <div className="hidden md:flex items-center gap-4">
              {loading ? (
                <div className="h-10 w-24 animate-pulse bg-gray-100 dark:bg-gray-800 rounded-full"></div>
              ) : user ? (
                <>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      className="hidden sm:inline-flex h-11 items-center justify-center rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-950 px-6 text-sm font-semibold shadow-lg shadow-slate-900/10 dark:shadow-white/10 transition-all hover:-translate-y-0.5"
                    >
                      Administrador
                    </Link>
                  )}
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
                    className="text-sm font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
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

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: '-100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '-100%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed inset-0 bg-white dark:bg-gray-950 z-40 h-screen w-screen flex flex-col items-center justify-center"
          >
            <nav className="flex flex-col items-center gap-8 mb-12 text-center">
              <NavLinks onLinkClick={closeMenu} />
            </nav>
            <div className="flex flex-col items-center gap-6 w-full px-8">
              {loading ? (
                <div className="h-14 w-full animate-pulse bg-gray-100 dark:bg-gray-800 rounded-full"></div>
              ) : user ? (
                <>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={closeMenu}
                      className="w-full inline-flex h-14 items-center justify-center rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-950 px-6 text-lg font-semibold shadow-lg transition-all"
                    >
                      Panel de Administrador
                    </Link>
                  )}
                  <Link
                    href="/dashboard"
                    onClick={closeMenu}
                    className="w-full inline-flex h-14 items-center justify-center rounded-full bg-indigo-600 px-6 text-lg font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all"
                  >
                    Panel de Control
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="text-lg font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                  >
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    href="/auth/login"
                    onClick={closeMenu}
                    className="text-lg font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                  >
                    Iniciar Sesión
                  </Link>
                  <Link
                    href="/auth/signup"
                    onClick={closeMenu}
                    className="w-full inline-flex h-14 items-center justify-center rounded-full bg-indigo-600 px-6 text-lg font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all"
                  >
                    Registrarse
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}