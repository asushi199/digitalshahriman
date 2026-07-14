import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import type { SystemEntry } from '../types/system'
import { SystemDirectory } from './SystemDirectory'

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
    accent: '#e3262e',
    featured: false,
    order: 3,
  },
  {
    id: 'rekod-kehadiran',
    name: 'Rekod Kehadiran',
    description: 'Urus rekod kehadiran warga sekolah.',
    category: 'Pengurusan',
    url: 'https://example.com/kehadiran',
    icon: 'file-text',
    accent: '#e3262e',
    featured: false,
    order: 4,
  },
  {
    id: 'takwim-sekolah',
    name: 'Takwim Sekolah',
    description: 'Rujuk jadual aktiviti sekolah.',
    category: 'Pengurusan',
    url: 'https://example.com/takwim',
    icon: 'calendar-days',
    accent: '#ffd900',
    featured: false,
    order: 5,
  },
  {
    id: 'pusat-sumber',
    name: 'Pusat Sumber',
    description: 'Akses koleksi sumber pembelajaran.',
    category: 'Akademik',
    url: 'https://example.com/pusat-sumber',
    icon: 'book-open',
    accent: '#1857d8',
    featured: true,
    order: 6,
  },
  {
    id: 'tempahan-bilik',
    name: 'Tempahan Bilik',
    description: 'Tempah bilik khas sekolah.',
    category: 'Kemudahan',
    url: 'https://example.com/bilik',
    icon: 'calendar-days',
    accent: '#e3262e',
    featured: false,
    order: 7,
  },
  {
    id: 'meja-bantuan-ict',
    name: 'Meja Bantuan ICT',
    description: 'Mohon bantuan teknikal ICT.',
    category: 'Sokongan Digital',
    url: 'https://example.com/meja-bantuan',
    icon: 'life-buoy',
    accent: '#ffd900',
    featured: false,
    order: 8,
  },
  {
    id: 'dokumen-rasmi',
    name: 'Dokumen Rasmi',
    description: 'Capai borang dan dokumen pengurusan.',
    category: 'Pengurusan',
    url: 'https://example.com/dokumen',
    icon: 'file-text',
    accent: '#1857d8',
    featured: false,
    order: 9,
  },
  {
    id: 'bahan-pdp',
    name: 'Bahan PdP',
    description: 'Terokai bahan pengajaran dan pembelajaran.',
    category: 'Akademik',
    url: 'https://example.com/bahan-pdp',
    icon: 'book-open',
    accent: '#e3262e',
    featured: false,
    order: 10,
  },
  {
    id: 'aduan-kemudahan',
    name: 'Aduan Kemudahan',
    description: 'Laporkan isu kemudahan sekolah.',
    category: 'Kemudahan',
    url: 'https://example.com/aduan',
    icon: 'file-text',
    accent: '#ffd900',
    featured: false,
    order: 11,
  },
  {
    id: 'sokongan-peranti',
    name: 'Sokongan Peranti',
    description: 'Dapatkan panduan penggunaan peranti.',
    category: 'Sokongan Digital',
    url: 'https://example.com/peranti',
    icon: 'life-buoy',
    accent: '#1857d8',
    featured: false,
    order: 12,
  },
]

describe('SystemDirectory', () => {
  it('renders all 12 fixture cards as safe external links', () => {
    render(<SystemDirectory systems={fixture} />)

    const links = screen.getAllByRole('link')

    expect(links).toHaveLength(12)
    links.forEach((link) => {
      expect(link.getAttribute('href')).toMatch(/^https:\/\/example\.com\//)
      expect(link).toHaveAttribute('target', '_blank')
      expect(link.getAttribute('rel')).toContain('noopener')
    })
  })

  it('filters the directory by search query', async () => {
    const user = userEvent.setup()
    render(<SystemDirectory systems={fixture} />)

    await user.type(screen.getByRole('searchbox', { name: 'Cari eSistem' }), 'makmal')

    expect(screen.getByRole('link', { name: 'Buka Tempahan Makmal' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Buka Modul Digital' })).not.toBeInTheDocument()
  })

  it('filters the directory by category', async () => {
    const user = userEvent.setup()
    render(<SystemDirectory systems={fixture} />)

    await user.click(screen.getByRole('button', { name: 'Akademik' }))

    expect(screen.getByRole('link', { name: 'Buka Modul Digital' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Buka Tempahan Makmal' })).not.toBeInTheDocument()
  })

  it('shows an empty state and resets both filters', async () => {
    const user = userEvent.setup()
    render(<SystemDirectory systems={fixture} />)

    const search = screen.getByRole('searchbox', { name: 'Cari eSistem' })
    await user.click(screen.getByRole('button', { name: 'Akademik' }))
    await user.type(search, 'tidak wujud')

    expect(screen.getByText('Tiada eSistem ditemui')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Tetapkan Semula' }))

    expect(search).toHaveValue('')
    expect(screen.getByRole('button', { name: 'Semua' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(screen.getAllByRole('link')).toHaveLength(fixture.length)
  })
})
