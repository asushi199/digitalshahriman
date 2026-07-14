import type { Theme } from '../components/SkyScene'

export const THEME_KEY = 'serasha-theme'

export function isTheme(value: unknown): value is Theme {
  return value === 'day' || value === 'night'
}

export function initialTheme(now = new Date()): Theme {
  try {
    const param = new URLSearchParams(window.location.search).get('theme')
    if (isTheme(param)) return param
  } catch {
    // URL tidak boleh dibaca; teruskan ke pilihan berikutnya.
  }

  try {
    const stored = localStorage.getItem(THEME_KEY)
    if (isTheme(stored)) return stored
  } catch {
    // Storan boleh gagal tanpa menyekat portal.
  }

  const hour = now.getHours()
  return hour >= 7 && hour < 19 ? 'day' : 'night'
}
