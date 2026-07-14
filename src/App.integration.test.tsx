import { fireEvent, render, screen } from '@testing-library/react'
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
    sessionStorage.clear()
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

  it('completes the loader immediately when the mascot artwork fails', () => {
    vi.mocked(useReducedMotion).mockReturnValue(false)

    render(<App />)

    expect(screen.getByRole('status', { name: 'Portal sedang dimuatkan' })).toBeInTheDocument()

    const mascot = document.querySelector<HTMLImageElement>(
      'img[src="/mascot/smkrs-robot.png"]',
    )

    expect(mascot).not.toBeNull()
    fireEvent.error(mascot as HTMLImageElement)

    expect(screen.queryByRole('status', { name: 'Portal sedang dimuatkan' })).not.toBeInTheDocument()
    expect(screen.getByRole('main')).toHaveAttribute('data-loader-complete', 'true')
  })
})
