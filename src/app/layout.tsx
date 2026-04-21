import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { EmergencyDock } from '@/components/layout/emergency-dock';
import { ScrollProgress } from '@/components/motion/scroll-progress';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap'
});

export const metadata: Metadata = {
  title: {
    default: 'Okene Reference Hospital — Premium Medical Care in Kogi Central',
    template: '%s · Okene Reference Hospital'
  },
  description:
    'Book appointments, consult doctors online and offline, access 24/7 emergency care. Trusted. Professional. Accessible.',
  keywords: [
    'hospital',
    'Okene',
    'Kogi',
    'Nigeria',
    'appointment',
    'telehealth',
    'doctor',
    'emergency',
    'medical'
  ],
  metadataBase: new URL('https://okenereferencehospital.web.app'),
  openGraph: {
    title: 'Okene Reference Hospital',
    description: 'Premium medical care for the Kogi Central community.',
    type: 'website'
  }
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0B1220' }
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable}`}>
      <body className="min-h-screen bg-background font-sans text-foreground">
        <ScrollProgress />
        <SiteHeader />
        <main className="relative min-h-[60vh]">{children}</main>
        <SiteFooter />
        <EmergencyDock />
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
