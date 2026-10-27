export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://tap2invite.com';

export const DEFAULT_SHARE_IMAGE = '/branding/og/general.jpg';

// Hosts allowed by next.config images.remotePatterns
const OPTIMIZABLE_HOSTS = new Set([
  'ykgyfxtzjedgastsuuaj.supabase.co',
  'images.unsplash.com',
  'i.pravatar.cc',
  'picsum.photos',
]);

// Maps a template cover (/branding/portadas/x.png) to its pre-generated 1200x630 JPG
export function templateShareImage(thumbnail?: string): string {
  if (!thumbnail) return DEFAULT_SHARE_IMAGE;
  const base = thumbnail.split('/').pop()?.replace(/\.[^.]+$/, '');
  return base ? `/branding/og/${base}.jpg` : DEFAULT_SHARE_IMAGE;
}

// Resizes user-uploaded images through the Next optimizer so link previews stay small
export function resizedShareImage(url: string): string {
  const optimizable = url.startsWith('/') || (() => {
    try {
      return OPTIMIZABLE_HOSTS.has(new URL(url).hostname);
    } catch {
      return false;
    }
  })();

  return optimizable ? `/_next/image?url=${encodeURIComponent(url)}&w=1200&q=75` : url;
}

export function absoluteUrl(pathOrUrl: string): string {
  return pathOrUrl.startsWith('/') ? `${APP_URL}${pathOrUrl}` : pathOrUrl;
}
