export const THEME_KEY = 'serasha-theme'

export const THEMES = ['night', 'dawn', 'day', 'dusk'] as const
export type Theme = (typeof THEMES)[number]

/** 'auto' mengikut jam tempatan; nilai lain mengunci tema secara manual. */
export type ThemePreference = Theme | 'auto'

export const PREFERENCE_CYCLE: ThemePreference[] = [
  'auto',
  'dawn',
  'day',
  'dusk',
  'night',
]

export function isTheme(value: unknown): value is Theme {
  return (THEMES as readonly unknown[]).includes(value)
}

export function isPreference(value: unknown): value is ThemePreference {
  return value === 'auto' || isTheme(value)
}

/** Subuh 6:00–9:00, siang 9:00–17:00, senja 17:00–19:30, selebihnya malam. */
export function themeForTime(now = new Date()): Theme {
  const minutes = now.getHours() * 60 + now.getMinutes()
  if (minutes >= 6 * 60 && minutes < 9 * 60) return 'dawn'
  if (minutes >= 9 * 60 && minutes < 17 * 60) return 'day'
  if (minutes >= 17 * 60 && minutes < 19 * 60 + 30) return 'dusk'
  return 'night'
}

export function nextPreference(current: ThemePreference): ThemePreference {
  const index = PREFERENCE_CYCLE.indexOf(current)
  return PREFERENCE_CYCLE[(index + 1) % PREFERENCE_CYCLE.length]
}

export function initialPreference(): ThemePreference {
  try {
    const param = new URLSearchParams(window.location.search).get('theme')
    if (isPreference(param)) return param
  } catch {
    // URL tidak boleh dibaca; teruskan ke pilihan berikutnya.
  }

  try {
    const stored = localStorage.getItem(THEME_KEY)
    if (isPreference(stored)) return stored
  } catch {
    // Storan boleh gagal tanpa menyekat portal.
  }

  return 'auto'
}
