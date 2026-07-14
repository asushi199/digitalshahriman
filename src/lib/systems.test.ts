import { describe, expect, it } from 'vitest'

import type { SystemEntry } from '../types/system'
import { filterSystems } from './systems'

const fixture: SystemEntry[] = [
  {
    id: 'modul-digital',
    name: 'Modul Digital',
    description: 'Akses bahan akademik.',
    category: 'Akademik',
    url: 'https://example.com/modul',
    icon: 'book-open',
    accent: '#ffd900',
    featured: true,
    order: 1,
  },
  {
    id: 'tempahan-makmal',
    name: 'Tempahan Makmal',
    description: 'Tempah kemudahan sekolah.',
    category: 'Kemudahan',
    url: 'https://example.com/makmal',
    icon: 'calendar-days',
    accent: '#1857d8',
    featured: true,
    order: 2,
  },
  {
    id: 'bantuan-digital',
    name: 'Bantuan Digital',
    description: 'Sokongan untuk warga sekolah.',
    category: 'Sokongan Digital',
    url: 'https://example.com/bantuan',
    icon: 'life-buoy',
    accent: '#ffffff',
    featured: false,
    order: 3,
  },
]

describe('filterSystems', () => {
  it('menapis sistem melalui kata carian', () => {
    expect(filterSystems(fixture, 'makmal', 'Semua').map((item) => item.id)).toEqual([
      'tempahan-makmal',
    ])
  })

  it('menapis sistem melalui kategori', () => {
    expect(filterSystems(fixture, '', 'Akademik').map((item) => item.id)).toEqual([
      'modul-digital',
    ])
  })

  it('mengembalikan senarai kosong apabila carian tidak sepadan', () => {
    expect(filterSystems(fixture, 'tidak wujud', 'Semua')).toEqual([])
  })
})
