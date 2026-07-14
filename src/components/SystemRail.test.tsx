import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import type { SystemEntry } from '../types/system'
import { SystemRail } from './SystemRail'

const sampleSystems: SystemEntry[] = [
  {
    id: 'modul-digital',
    name: 'Modul Digital',
    description: 'Akses modul dan sumber pembelajaran digital.',
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
    description: 'Semak dan tempah kemudahan makmal sekolah.',
    category: 'Kemudahan',
    url: 'https://example.com/makmal',
    icon: 'calendar-days',
    accent: '#1857d8',
    featured: true,
    order: 2,
  },
]

describe('SystemRail', () => {
  it('renders each configured system once as a safe external link', () => {
    render(<SystemRail systems={sampleSystems} />)

    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(sampleSystems.length)

    for (const link of links) {
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    }
  })

  it('suppresses the click that ends a mouse drag', () => {
    const { container } = render(<SystemRail systems={sampleSystems} />)
    const track = container.querySelector('.rail__track')!
    const link = screen.getAllByRole('link')[0]
    const onNavigate = vi.fn()
    link.addEventListener('click', onNavigate)

    fireEvent.pointerDown(track, { pointerType: 'mouse', clientX: 200, pointerId: 1 })
    fireEvent.pointerMove(track, { pointerType: 'mouse', clientX: 120, pointerId: 1 })
    fireEvent.pointerUp(track, { pointerType: 'mouse', clientX: 120, pointerId: 1 })
    fireEvent.click(link)

    expect(onNavigate).not.toHaveBeenCalled()

    // Klik biasa selepas itu masih berfungsi.
    fireEvent.click(link)
    expect(onNavigate).toHaveBeenCalledTimes(1)
  })

  it('renders nothing when no systems are configured', () => {
    const { container } = render(<SystemRail systems={[]} />)

    expect(container).toBeEmptyDOMElement()
  })
})
