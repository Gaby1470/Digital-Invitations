import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          async get(name: string) {
            // The `cookieStore` object may be a promise-like object, so we need to await it.
            const resolvedCookieStore = await cookieStore;
            return resolvedCookieStore.get(name)?.value
          },
          async set(name: string, value: string, options: CookieOptions) {
            const resolvedCookieStore = await cookieStore;
            resolvedCookieStore.set({ name, value, ...options });
          },
          async remove(name: string, options: CookieOptions) {
            const resolvedCookieStore = await cookieStore;
            resolvedCookieStore.set({ name, value: '', ...options });
          },
        },
      }
    )
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
