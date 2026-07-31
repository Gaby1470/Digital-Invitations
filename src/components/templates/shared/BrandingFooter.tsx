'use client';

import Link from 'next/link';

export function BrandingFooter() {
  return (
    <footer className="text-center py-6 bg-gray-50 dark:bg-gray-900">
      <Link 
        href="/" 
        className="inline-block bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs px-4 py-2 rounded-full hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
      >
        Invite created by Tap 2 Invite
      </Link>
    </footer>
  );
}
