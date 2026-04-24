import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'CUSTECH Teaching Hospital, Okene',
    short_name: 'CUSTECH-TH',
    description:
      'Confluence University of Science and Technology Teaching Hospital, Okene — premium medical care for Kogi Central.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#008B8B',
    orientation: 'portrait',
    icons: [
      { src: '/custechth-logo.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/custechth-logo.png', sizes: '512x512', type: 'image/png', purpose: 'any' }
    ]
  };
}
