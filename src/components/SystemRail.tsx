import { ArrowUpRight, BookOpen, CalendarDays, FileText, LifeBuoy } from 'lucide-react'
import { useRef, useState } from 'react'
import type { CSSProperties, PointerEvent as ReactPointerEvent, MouseEvent as ReactMouseEvent } from 'react'

import type { SystemEntry } from '../types/system'

const ICONS = {
  'book-open': BookOpen,
  'calendar-days': CalendarDays,
  'file-text': FileText,
  'life-buoy': LifeBuoy,
} as const

const TILTS = [-2.6, 1.8, -1.4, 2.4, -2, 1.2]
const DRAG_THRESHOLD = 5

interface SystemRailProps {
  systems: SystemEntry[]
}

export function SystemRail({ systems }: SystemRailProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const drag = useRef({ active: false, startX: 0, scrollStart: 0, moved: false })
  const [dragging, setDragging] = useState(false)

  if (systems.length === 0) return null

  // Sentuhan menggunakan tatalan asli; seretan tetikus dikendalikan sendiri.
  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse') return
    const track = trackRef.current
    if (!track) return

    drag.current = {
      active: true,
      startX: event.clientX,
      scrollStart: track.scrollLeft,
      moved: false,
    }
    track.setPointerCapture?.(event.pointerId)
    setDragging(true)
  }

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!drag.current.active) return
    const track = trackRef.current
    if (!track) return

    const delta = event.clientX - drag.current.startX
    if (Math.abs(delta) > DRAG_THRESHOLD) drag.current.moved = true
    track.scrollLeft = drag.current.scrollStart - delta
  }

  const handlePointerEnd = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!drag.current.active) return
    drag.current.active = false
    trackRef.current?.releasePointerCapture?.(event.pointerId)
    setDragging(false)
  }

  // Selepas seretan sebenar, jangan biarkan lepasan tetikus membuka pautan.
  const suppressClickAfterDrag = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (!drag.current.moved) return
    event.preventDefault()
    event.stopPropagation()
    drag.current.moved = false
  }

  return (
    <section className="rail" aria-label="Pautan eSistem sekolah">
      <div
        ref={trackRef}
        className={`rail__track${dragging ? ' rail__track--dragging' : ''}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        onClickCapture={suppressClickAfterDrag}
      >
        {systems.map((entry, index) => {
          const Icon = ICONS[entry.icon]
          return (
            <a
              key={entry.id}
              className="rail__card"
              href={entry.url}
              target="_blank"
              rel="noopener noreferrer"
              draggable={false}
              style={
                {
                  '--tilt': `${TILTS[index % TILTS.length]}deg`,
                  '--accent': entry.accent,
                } as CSSProperties
              }
            >
              <span className="rail__icon" aria-hidden="true">
                <Icon />
              </span>
              <span className="rail__body">
                <strong>{entry.name}</strong>
                <small>{entry.description}</small>
              </span>
              <span className="rail__open" aria-hidden="true">
                Buka
                <ArrowUpRight />
              </span>
            </a>
          )
        })}
      </div>
    </section>
  )
}
