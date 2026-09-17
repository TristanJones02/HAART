import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'HAART: Homeless and Abused Animal Rescue Team',
    short_name: 'HAART',
    description: 'Perth foster-based, no-kill animal rescue.',
    start_url: '/',
    display: 'browser',
    background_color: '#ffffff',
    theme_color: '#b50806',
    icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' }],
  };
}
