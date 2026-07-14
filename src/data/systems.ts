import type { SystemEntry } from '../types/system'

export const systems: SystemEntry[] = ([
  {
    id: 'modul-digital',
    name: 'Modul Digital',
    description: 'Akses modul dan sumber pembelajaran digital.',
    category: 'Akademik',
    url: 'https://manjung-moduldigital.netlify.app/',
    icon: 'book-open',
    accent: '#ffd900',
    featured: true,
    order: 1,
  },
  {
    id: 'tempahan-makmal',
    name: 'Tempahan Makmal',
    description: 'Semak dan tempah kemudahan makmal sekolah.',
    category: 'Kemudahan',
    url: 'https://tempahan-makmal-smkrs.g-24205213.chatgpt.site/',
    icon: 'calendar-days',
    accent: '#1857d8',
    featured: true,
    order: 2,
  },
  {
    id: 'semakan-id-delima',
    name: 'Semakan ID DELIMa',
    description: 'Semak ID DELIMa murid dan guru SERASHA.',
    category: 'Sokongan Digital',
    url: 'https://e-delimaserasha.netlify.app/',
    icon: 'file-text',
    accent: '#22b573',
    featured: true,
    order: 3,
  },
] satisfies SystemEntry[]).sort((a, b) => a.order - b.order)
