import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import type { SystemEntry } from '../types/system'
import { SystemMarquee } from './SystemMarquee'

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

describe('SystemMarquee', () => {
  it('renders every configured system as a safe external link', () => {
    render(<SystemMarquee systems={sampleSystems} reducedMotion={false} />)

    const links = screen.getAllByRole('link')
    expect(links.length).toBeGreaterThan(0)

    for (const link of links) {
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    }

    expect(
      screen.getAllByRole('link', { name: /Modul Digital/i }).length,
    ).toBeGreaterThan(0)
    expect(
      screen.getAllByRole('link', { name: /Tempahan Makmal/i }).length,
    ).toBeGreaterThan(0)
  })

  it('keeps the duplicated loop copy out of the accessibility tree', () => {
    const { container } = render(
      <SystemMarquee systems={sampleSystems} reducedMotion={false} />,
    )

    const groups = container.querySelectorAll('.marquee__group')
    expect(groups).toHaveLength(2)
    expect(groups[1]).toHaveAttribute('aria-hidden', 'true')

    for (const link of groups[1].querySelectorAll('a')) {
      expect(link).toHaveAttribute('tabindex', '-1')
    }
  })

  it('drops the duplicate copy in reduced motion and allows manual scrolling', () => {
    const { container } = render(
      <SystemMarquee systems={sampleSystems} reducedMotion />,
    )

    expect(container.querySelectorAll('.marquee__group')).toHaveLength(1)
    expect(container.querySelector('.marquee--static')).not.toBeNull()
  })

  it('renders nothing when no systems are configured', () => {
    const { container } = render(
      <SystemMarquee systems={[]} reducedMotion={false} />,
    )

    expect(container).toBeEmptyDOMElement()
  })
})
