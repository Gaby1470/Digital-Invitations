// src/lib/supabase-server.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const createClient = (cookieStore: ReturnType<typeof cookies>) => {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          // The `cookieStore` object may be a promise-like object, so we need
          // to await it before accessing its properties.
          const resolvedCookieStore = await cookieStore;
          if (typeof resolvedCookieStore.get === 'function') {
            return resolvedCookieStore.get(name)?.value
          }
          const cookie = (resolvedCookieStore as any)[name];
          if (typeof cookie === 'object' && cookie !== null && 'value' in cookie) {
            return cookie.value;
          }
          return cookie;
        },
        async set(name: string, value: string, options: CookieOptions) {
          try {
            const resolvedCookieStore = await cookieStore as any;
            if (typeof resolvedCookieStore.set === 'function') {
              resolvedCookieStore.set({ name, value, ...options })
            }
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        async remove(name: string, options: CookieOptions) {
          try {
            const resolvedCookieStore = await cookieStore as any;
            if (typeof resolvedCookieStore.set === 'function') {
              resolvedCookieStore.set({ name, value: '', ...options })
            }
          } catch (error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}
