import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import type { SystemEntry } from '../types/system'
import { FeaturedRail } from './FeaturedRail'

const names = [
  'Modul Digital',
  'Tempahan Makmal',
  'Pengurusan Fail',
  'Bantuan Digital',
  'Pusat Sumber',
  'Kalendar Sekolah',
  'Rekod Murid',
  'Meja Bantuan',
  'Bahan PdP',
  'Tempahan Bilik',
  'Dokumen Rasmi',
  'Sokongan ICT',
]

const fixture: SystemEntry[] = names.map((name, index) => ({
  id: `system-${index + 1}`,
  name,
  description: `Penerangan untuk ${name}.`,
  category: index % 2 === 0 ? 'Akademik' : 'Kemudahan',
  url: `https://example.com/system-${index + 1}`,
  icon: index % 2 === 0 ? 'book-open' : 'calendar-days',
  accent: index % 2 === 0 ? '#ffd900' : '#1857d8',
  featured: index === 0 || index === 1 || index === 4,
  order: index + 1,
}))

describe('FeaturedRail', () => {
  it('renders only featured systems and starts with the first card active', () => {
    render(<FeaturedRail systems={fixture} />)

    expect(screen.getByRole('link', { name: 'Buka Modul Digital' })).toHaveAttribute(
      'data-active',
      'true',
    )
    expect(screen.getByRole('link', { name: 'Buka Tempahan Makmal' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Buka Pusat Sumber' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Buka Pengurusan Fail' })).not.toBeInTheDocument()
  })

  it('activates a later featured card when it receives focus', () => {
    render(<FeaturedRail systems={fixture} />)

    const firstCard = screen.getByRole('link', { name: 'Buka Modul Digital' })
    const laterCard = screen.getByRole('link', { name: 'Buka Pusat Sumber' })

    fireEvent.focus(laterCard)

    expect(firstCard).not.toHaveAttribute('data-active')
    expect(laterCard).toHaveAttribute('data-active', 'true')
  })
})
