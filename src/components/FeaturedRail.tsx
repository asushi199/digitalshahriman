import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'

import type { SystemEntry } from '../types/system'
import { SystemCard } from './SystemCard'

interface FeaturedRailProps {
  systems: SystemEntry[]
}

export function FeaturedRail({ systems }: FeaturedRailProps) {
  const featuredSystems = useMemo(
    () => systems.filter((system) => system.featured),
    [systems],
  )
  const [activeIndex, setActiveIndex] = useState(0)
  const railRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const rail = railRef.current
    if (!rail || typeof IntersectionObserver === 'undefined') return

    const observer = new IntersectionObserver(
      (entries) => {
        const mostVisible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]

        if (mostVisible) {
          setActiveIndex(Number((mostVisible.target as HTMLElement).dataset.index))
        }
      },
      { root: rail, threshold: [0.55, 0.75] },
    )

    cardRefs.current.forEach((card) => {
      if (card) observer.observe(card)
    })

    return () => observer.disconnect()
  }, [featuredSystems])

  function showCard(index: number) {
    const nextIndex = Math.max(0, Math.min(index, featuredSystems.length - 1))
    const card = cardRefs.current[nextIndex]
    const reducedMotion = window.matchMedia?.(
      '(prefers-reduced-motion: reduce)',
    ).matches

    setActiveIndex(nextIndex)
    card?.scrollIntoView?.({
      behavior: reducedMotion ? 'auto' : 'smooth',
      block: 'nearest',
      inline: 'center',
    })
  }

  return (
    <div
      aria-label="Senarai eSistem pilihan"
      className="featured-rail"
      role="region"
    >
      <div className="featured-rail__controls">
        <button
          aria-label="eSistem pilihan sebelumnya"
          disabled={activeIndex === 0}
          onClick={() => showCard(activeIndex - 1)}
          type="button"
        >
          <ChevronLeft aria-hidden="true" />
        </button>
        <span aria-hidden="true">
          {String(activeIndex + 1).padStart(2, '0')} /{' '}
          {String(featuredSystems.length).padStart(2, '0')}
        </span>
        <button
          aria-label="eSistem pilihan seterusnya"
          disabled={activeIndex >= featuredSystems.length - 1}
          onClick={() => showCard(activeIndex + 1)}
          type="button"
        >
          <ChevronRight aria-hidden="true" />
        </button>
      </div>

      <div
        aria-label="Kad eSistem pilihan"
        className="featured-rail__track"
        ref={railRef}
        role="list"
      >
        {featuredSystems.map((system, index) => (
          <div
            className="featured-rail__item"
            data-index={index}
            key={system.id}
            ref={(node) => {
              cardRefs.current[index] = node
            }}
            role="listitem"
          >
            <SystemCard
              active={activeIndex === index}
              onActivate={() => setActiveIndex(index)}
              system={system}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
