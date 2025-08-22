import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
 title: 'Fortivo',
  description: 'AI trainer that adapts to your energy, schedule, and injuries.',
  manifest: '/manifest.json',
  themeColor: '#0B0B0C',
  icons: {
    icon: '/icon-192.png',
    apple: '/icon-192.png' // ideally use a dedicated apple-touch-icon
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* iOS PWA tuning */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        {/* Optional: maskable icon for Android */}
        <link rel="icon" href="/icon-192.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
