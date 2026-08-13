import Link from 'next/link';

export default function ViewerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main className="flex-1 w-full">
        {children}
      </main>
      <footer className="text-center py-6">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
          Invite created by Digital Invitations
        </Link>
      </footer>
    </>
  );
}
