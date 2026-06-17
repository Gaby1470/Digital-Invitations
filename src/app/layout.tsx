import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Inter, Dancing_Script, Playfair_Display, Montserrat } from "next/font/google";
import QueryProvider from "@/components/QueryProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const dancingScript = Dancing_Script({
  variable: "--font-dancing-script",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-playfair-display",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "Tap to Invite",
  description: "Crea y comparte invitaciones digitales animadas para cualquier ocasión.",
  icons: {
    icon: "/branding/share-image.jpg",
    shortcut: "/branding/share-image.jpg",
    apple: "/branding/share-image.jpg",
  },
  openGraph: {
    title: "Tap to Invite",
    description: "Crea y comparte invitaciones digitales animadas para cualquier ocasión.",
    images: [
      {
        url: "/branding/share-image.jpg",
        width: 1200,
        height: 630,
        alt: "Tap to Invite",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tap to Invite",
    description: "Crea y comparte invitaciones digitales animadas para cualquier ocasión.",
    images: ["/branding/share-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${dancingScript.variable} ${playfairDisplay.variable} ${montserrat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gray-50">
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
