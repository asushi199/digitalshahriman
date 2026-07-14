import { render, screen } from '@testing-library/react'
import { useReducedMotion } from 'framer-motion'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import App from './App'

vi.mock('framer-motion', async (importOriginal) => {
  const actual = await importOriginal<typeof import('framer-motion')>()

  return {
    ...actual,
    useReducedMotion: vi.fn(),
  }
})

describe('completed portal composition', () => {
  beforeEach(() => {
    vi.mocked(useReducedMotion).mockReturnValue(true)
  })

  it('keeps every core destination available without motion', () => {
    render(<App />)

    expect(screen.getAllByRole('main')).toHaveLength(1)
    expect(
      screen.getByRole('heading', { name: 'SMK Raja Shahriman Digital' }),
    ).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: 'Buka Modul Digital' })).not.toHaveLength(0)
    expect(screen.getAllByRole('link', { name: 'Buka Tempahan Makmal' })).not.toHaveLength(0)
    expect(screen.getByRole('searchbox', { name: 'Cari eSistem' })).toBeInTheDocument()

    for (const category of [
      'Akademik',
      'Pengurusan',
      'Kemudahan',
      'Sokongan Digital',
    ]) {
      expect(screen.getByRole('button', { name: category })).toBeInTheDocument()
    }

    expect(
      screen.getByText(/eSistem yang dipautkan beroperasi di destinasi masing-masing/i),
    ).toBeInTheDocument()
  })
})
