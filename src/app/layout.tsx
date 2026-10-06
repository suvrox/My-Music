import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppProviders } from '@/components/providers/AppProviders';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Spotify - Web Player',
  description: 'Music for everyone. Discover, stream and organize your favorite songs with no login required.',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'Spotify - Web Player',
    description: 'Music for everyone. Free, responsive legal music streaming web app.',
    siteName: 'Spotify Web Player',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          rel="stylesheet"
        />
      </head>
      <body className="bg-black text-white font-sans antialiased select-none h-screen flex flex-col overflow-hidden">
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
