import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Okene Reference Hospital',
    short_name: 'Okene Hospital',
    description: 'Premium medical care for the Kogi Central community.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#008B8B',
    orientation: 'portrait',
    icons: [
      { src: '/orh-logo.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/orh-logo.png', sizes: '512x512', type: 'image/png', purpose: 'any' }
    ]
  };
}
