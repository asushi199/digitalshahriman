import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { systems } from '../data/systems'
import { SystemCard } from './SystemCard'

describe('SystemCard', () => {
  it('opens Modul Digital safely in a new tab', () => {
    render(<SystemCard system={systems[0]} />)

    const link = screen.getByRole('link', { name: /Buka Modul Digital/i })

    expect(link).toHaveAttribute(
      'href',
      'https://manjung-moduldigital.netlify.app/',
    )
    expect(link).toHaveAttribute('target', '_blank')
    expect(link.getAttribute('rel')).toContain('noopener')
    expect(screen.getByText('Akademik')).toBeInTheDocument()
  })
})
