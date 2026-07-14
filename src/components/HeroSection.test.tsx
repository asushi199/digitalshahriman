import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { HeroSection } from './HeroSection'

describe('HeroSection', () => {
  it('presents the school motto and both eSistem actions', () => {
    render(<HeroSection reducedMotion />)

    expect(screen.getByText('Pengetahuan Punca Kejayaan')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Terokai eSistem' })).toHaveAttribute(
      'href',
      '#featured-systems',
    )
    expect(screen.getByRole('link', { name: 'Lihat Semua' })).toHaveAttribute(
      'href',
      '#all-systems',
    )
  })
})
