import Header from "@/components/Header";
import Link from "next/link";
import { SVGProps } from "react";

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
          <div className="flex justify-center space-x-6 mb-4">
            <Link href="https://www.instagram.com/tap2invite/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
              <InstagramIcon className="h-6 w-6" />
            </Link>
            {/* <Link href="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
              <TwitterIcon className="h-6 w-6" />
            </Link>
            <Link href="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
              <FacebookIcon className="h-6 w-6" />
            </Link> */}
          </div>
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

function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function TwitterIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 4s-.7 2.1-2 3.4c1.6 1.4 3.3 4.4 3.3 4.4s-1.4 1.4-3.3 1.4H6.7c-1.4 0-1.4-1.4-1.4-1.4s.7-2.1 2-3.4c-1.6-1.4-3.3-4.4-3.3-4.4s1.4-1.4 3.3-1.4H22z" />
    </svg>
  );
}

function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/.svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}
