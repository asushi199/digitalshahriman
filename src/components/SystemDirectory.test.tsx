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
]

describe('SystemDirectory', () => {
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
