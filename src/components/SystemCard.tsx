import {
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  FileText,
  LifeBuoy,
  type LucideIcon,
} from 'lucide-react'
import type { CSSProperties } from 'react'

import type { SystemEntry } from '../types/system'

interface SystemCardProps {
  system: SystemEntry
  active?: boolean
  onActivate?: () => void
}

const icons: Record<SystemEntry['icon'], LucideIcon> = {
  'book-open': BookOpen,
  'calendar-days': CalendarDays,
  'file-text': FileText,
  'life-buoy': LifeBuoy,
}

export function SystemCard({
  system,
  active = false,
  onActivate,
}: SystemCardProps) {
  const Icon = icons[system.icon]
  const cardStyle = {
    '--card-accent': system.accent,
  } as CSSProperties

  return (
    <a
      aria-label={`Buka ${system.name}`}
      className="system-card"
      data-active={active || undefined}
      href={system.url}
      onFocus={onActivate}
      rel="noopener noreferrer"
      style={cardStyle}
      target="_blank"
    >
      <span className="system-card__icon" aria-hidden="true">
        <Icon />
      </span>
      <span className="system-card__content">
        <span className="system-card__category">{system.category}</span>
        <strong className="system-card__name">{system.name}</strong>
        <span className="system-card__description">{system.description}</span>
      </span>
      <span className="system-card__cue" aria-hidden="true">
        Buka Sistem
        <ArrowUpRight />
      </span>
    </a>
  )
}
