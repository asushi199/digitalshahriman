import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('App', () => {
  it('introduces the SMKRS digital portal in Malay', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /SMK Raja Shahriman Digital/i })).toBeInTheDocument()
    expect(screen.getByText('Satu Pusat, Semua Sistem')).toBeInTheDocument()
  })

  it('connects the hero navigation to both discovery sections', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: 'eSistem Pilihan' }).closest('section')).toHaveAttribute(
      'id',
      'featured-systems',
    )
    expect(screen.getByRole('heading', { name: 'Semua eSistem' }).closest('section')).toHaveAttribute(
      'id',
      'all-systems',
    )
  })
})
