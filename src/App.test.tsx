import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('App', () => {
  it('introduces the SMKRS digital portal in Malay', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /SMK Raja Shahriman Digital/i })).toBeInTheDocument()
    expect(screen.getByText('Satu Pusat, Semua Sistem')).toBeInTheDocument()
  })
})
