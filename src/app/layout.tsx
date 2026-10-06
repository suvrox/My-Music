import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppProviders } from '@/components/providers/AppProviders';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'My Music - Web Player',
  description: 'Music for everyone. Discover, stream and organize your favorite songs with no login required.',
  icons: {
    icon: [
      { url: '/logo.webp', type: 'image/webp' },
      { url: '/favicon.ico' },
    ],
    shortcut: '/logo.webp',
    apple: '/logo.webp',
  },
  openGraph: {
    title: 'My Music - Web Player',
    description: 'Music for everyone. Free, responsive legal music streaming web app.',
    siteName: 'My Music Web Player',
    images: [{ url: '/logo.webp' }],
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
        <link rel="icon" type="image/webp" href="/logo.webp" />
        <link rel="shortcut icon" href="/logo.webp" />
        <link rel="apple-touch-icon" href="/logo.webp" />
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
