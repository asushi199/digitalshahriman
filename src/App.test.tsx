import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import App from './App'
import { initialTheme } from './lib/theme'

describe('App', () => {
  beforeEach(() => {
    sessionStorage.setItem('serasha-loader-seen', 'true')
    localStorage.clear()
    delete document.documentElement.dataset.theme
  })

  afterEach(() => {
    sessionStorage.clear()
    localStorage.clear()
  })

  it('renders the SERASHA hero and school identity', () => {
    render(<App />)

    expect(
      screen.getByRole('heading', { level: 1, name: /SERASHA/i }),
    ).toBeInTheDocument()
    expect(screen.getByText(/Satu portal, semua eSistem/i)).toBeInTheDocument()
  })

  it('toggles the day and night theme on the root element', async () => {
    const user = userEvent.setup()
    localStorage.setItem('serasha-theme', 'night')
    render(<App />)

    expect(document.documentElement.dataset.theme).toBe('night')

    await user.click(screen.getByRole('button', { name: /Tukar ke tema siang/i }))

    expect(document.documentElement.dataset.theme).toBe('day')
    expect(localStorage.getItem('serasha-theme')).toBe('day')
  })
})

describe('initialTheme', () => {
  afterEach(() => {
    localStorage.clear()
  })

  it('prefers a stored choice over the clock', () => {
    localStorage.setItem('serasha-theme', 'day')
    expect(initialTheme(new Date('2026-07-14T22:00:00'))).toBe('day')
  })

  it('falls back to daytime hours when nothing is stored', () => {
    expect(initialTheme(new Date('2026-07-14T10:00:00'))).toBe('day')
    expect(initialTheme(new Date('2026-07-14T22:00:00'))).toBe('night')
  })
})
