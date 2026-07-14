import { ArrowUpRight, BookOpen, CalendarDays, FileText, LifeBuoy } from 'lucide-react'
import type { CSSProperties } from 'react'

import type { SystemEntry } from '../types/system'

const ICONS = {
  'book-open': BookOpen,
  'calendar-days': CalendarDays,
  'file-text': FileText,
  'life-buoy': LifeBuoy,
} as const

const TILTS = [-2.6, 1.8, -1.4, 2.4, -2, 1.2]
const MIN_CARDS = 8
const SECONDS_PER_CARD = 3.5

interface SystemMarqueeProps {
  systems: SystemEntry[]
  reducedMotion: boolean
}

interface MarqueeCardProps {
  entry: SystemEntry
  tilt: number
  hidden?: boolean
}

function MarqueeCard({ entry, tilt, hidden = false }: MarqueeCardProps) {
  const Icon = ICONS[entry.icon]

  return (
    <a
      className="marquee__card"
      href={entry.url}
      target="_blank"
      rel="noopener noreferrer"
      tabIndex={hidden ? -1 : undefined}
      style={{ '--tilt': `${tilt}deg`, '--accent': entry.accent } as CSSProperties}
    >
      <span className="marquee__icon" aria-hidden="true">
        <Icon />
      </span>
      <span className="marquee__body">
        <strong>{entry.name}</strong>
        <small>{entry.description}</small>
      </span>
      <span className="marquee__open" aria-hidden="true">
        Buka
        <ArrowUpRight />
      </span>
    </a>
  )
}

export function SystemMarquee({ systems, reducedMotion }: SystemMarqueeProps) {
  if (systems.length === 0) return null

  const cards: SystemEntry[] = []
  while (cards.length < MIN_CARDS) cards.push(...systems)

  const duration = `${cards.length * SECONDS_PER_CARD}s`

  return (
    <section
      className={`marquee${reducedMotion ? ' marquee--static' : ''}`}
      aria-label="Pautan eSistem sekolah"
    >
      <div className="marquee__track" style={{ '--marquee-duration': duration } as CSSProperties}>
        <div className="marquee__group">
          {cards.map((entry, index) => (
            <MarqueeCard
              key={`${entry.id}-${index}`}
              entry={entry}
              tilt={TILTS[index % TILTS.length]}
            />
          ))}
        </div>
        {reducedMotion ? null : (
          <div className="marquee__group" aria-hidden="true">
            {cards.map((entry, index) => (
              <MarqueeCard
                key={`dup-${entry.id}-${index}`}
                entry={entry}
                tilt={TILTS[index % TILTS.length]}
                hidden
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
