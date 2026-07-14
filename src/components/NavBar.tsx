import { Moon, Sun } from 'lucide-react'

import { site } from '../data/site'
import type { Theme } from './SkyScene'

interface NavBarProps {
  theme: Theme
  onToggleTheme: () => void
}

export function NavBar({ theme, onToggleTheme }: NavBarProps) {
  const nextLabel =
    theme === 'day' ? 'Tukar ke tema malam' : 'Tukar ke tema siang'

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
        aria-label={nextLabel}
        title={nextLabel}
        onClick={onToggleTheme}
      >
        <Sun className="navbar__toggle-sun" aria-hidden="true" />
        <Moon className="navbar__toggle-moon" aria-hidden="true" />
      </button>
    </header>
  )
}
