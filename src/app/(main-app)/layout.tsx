import Header from "@/components/Header";
import Link from "next/link";

export default function MainAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex-1 w-full">
        {children}
      </main>
      <footer className="bg-slate-50 dark:bg-gray-950 border-t border-slate-200 dark:border-gray-800">
        <div className="container mx-auto py-8 px-4 md:px-6 text-center text-gray-500 dark:text-gray-400">
          <div className="flex justify-center space-x-6">
            <Link href="/terms" className="text-sm hover:text-gray-900 dark:hover:text-white transition-colors">
              Terms & Conditions
            </Link>
            <Link href="/privacy" className="text-sm hover:text-gray-900 dark:hover:text-white transition-colors">
              Privacy Policy
            </Link>
          </div>
          <p className="text-xs mt-6">
            © {new Date().getFullYear()} Digital Invitations. All Rights Reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
