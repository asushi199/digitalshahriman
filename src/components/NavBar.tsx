import { Clock, Moon, Sun, Sunrise, Sunset } from 'lucide-react'

import { site } from '../data/site'
import type { ThemePreference } from '../lib/theme'

const PREFERENCE_LABELS: Record<ThemePreference, string> = {
  auto: 'Automatik (ikut waktu)',
  dawn: 'Subuh',
  day: 'Siang',
  dusk: 'Senja',
  night: 'Malam',
}

const PREFERENCE_ICONS: Record<ThemePreference, typeof Sun> = {
  auto: Clock,
  dawn: Sunrise,
  day: Sun,
  dusk: Sunset,
  night: Moon,
}

interface NavBarProps {
  preference: ThemePreference
  onCycleTheme: () => void
}

export function NavBar({ preference, onCycleTheme }: NavBarProps) {
  const label = `Tema: ${PREFERENCE_LABELS[preference]}. Tukar tema seterusnya.`
  const Icon = PREFERENCE_ICONS[preference]

  return (
    <header className="navbar">
      <div className="navbar__brand">
        <img
          src={site.crest}
          alt={`Lencana ${site.name}`}
          onError={(event) => {
            event.currentTarget.hidden = true
          }}
        />
        <span>{site.shortName}</span>
      </div>
      <p className="navbar__school">
        {site.name} · {site.location}
      </p>
      <button
        type="button"
        className="navbar__toggle"
        aria-label={label}
        title={label}
        onClick={onCycleTheme}
      >
        <Icon aria-hidden="true" />
      </button>
    </header>
  )
}
