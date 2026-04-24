import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';
import { ScrollProgress } from '@/components/motion/scroll-progress';
import { Splash } from '@/components/layout/splash';
import { PublicChrome } from '@/components/layout/public-chrome';

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
    default: 'CUSTECH Teaching Hospital, Okene — Premium Medical Care for Kogi Central',
    template: '%s · CUSTECH-TH Okene'
  },
  description:
    'Confluence University of Science and Technology Teaching Hospital, Okene (CUSTECH-TH). Book appointments, consult top specialists online or by SMS, and access 24/7 emergency care. Serving Okene, Adavi, Okehi, Ajaokuta, Ihima, Ogori-Magongo and all of Kogi State.',
  keywords: [
    'CUSTECH Teaching Hospital',
    'CUSTECH-TH',
    'Confluence University of Science and Technology Teaching Hospital',
    'Okene hospital',
    'Ebira health',
    'Kogi Central hospital',
    'Kogi State healthcare',
    'Adavi',
    'Ihima',
    'Ajaokuta',
    'Nigeria telehealth',
    'Nigerian doctors',
    'appointment booking Nigeria',
    'emergency Kogi'
  ],
  metadataBase: new URL('https://custechth.org'),
  openGraph: {
    title: 'CUSTECH Teaching Hospital, Okene (CUSTECH-TH)',
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
        <Splash />
        <ScrollProgress />
        <PublicChrome>{children}</PublicChrome>
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
