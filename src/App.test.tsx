import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import App from './App'
import { initialPreference, nextPreference, themeForTime } from './lib/theme'

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

  it('follows the clock in automatic mode', () => {
    render(<App />)

    expect(document.documentElement.dataset.theme).toBe(themeForTime())
  })

  it('cycles manual themes and persists the choice', async () => {
    const user = userEvent.setup()
    localStorage.setItem('serasha-theme', 'dawn')
    render(<App />)

    expect(document.documentElement.dataset.theme).toBe('dawn')

    await user.click(screen.getByRole('button', { name: /Tukar tema/i }))

    expect(document.documentElement.dataset.theme).toBe('day')
    expect(localStorage.getItem('serasha-theme')).toBe('day')
  })

  it('returns to automatic mode after the night theme', async () => {
    const user = userEvent.setup()
    localStorage.setItem('serasha-theme', 'night')
    render(<App />)

    await user.click(screen.getByRole('button', { name: /Tukar tema/i }))

    expect(localStorage.getItem('serasha-theme')).toBe('auto')
    expect(document.documentElement.dataset.theme).toBe(themeForTime())
  })
})

describe('theme helpers', () => {
  afterEach(() => {
    localStorage.clear()
  })

  it('maps the clock to dawn, day, dusk, and night windows', () => {
    expect(themeForTime(new Date('2026-07-14T07:00:00'))).toBe('dawn')
    expect(themeForTime(new Date('2026-07-14T12:00:00'))).toBe('day')
    expect(themeForTime(new Date('2026-07-14T18:00:00'))).toBe('dusk')
    expect(themeForTime(new Date('2026-07-14T22:00:00'))).toBe('night')
    expect(themeForTime(new Date('2026-07-14T05:00:00'))).toBe('night')
  })

  it('cycles preferences through auto and the four themes', () => {
    expect(nextPreference('auto')).toBe('dawn')
    expect(nextPreference('dawn')).toBe('day')
    expect(nextPreference('day')).toBe('dusk')
    expect(nextPreference('dusk')).toBe('night')
    expect(nextPreference('night')).toBe('auto')
  })

  it('prefers a stored choice and defaults to automatic', () => {
    localStorage.setItem('serasha-theme', 'dusk')
    expect(initialPreference()).toBe('dusk')

    localStorage.clear()
    expect(initialPreference()).toBe('auto')
  })
})
