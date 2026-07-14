import { Search, X } from 'lucide-react'
import { useState } from 'react'

import { filterSystems, SYSTEM_CATEGORIES } from '../lib/systems'
import type { SystemEntry, SystemFilterCategory } from '../types/system'
import { SystemCard } from './SystemCard'

interface SystemDirectoryProps {
  systems: SystemEntry[]
}

export function SystemDirectory({ systems }: SystemDirectoryProps) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<SystemFilterCategory>('Semua')
  const filteredSystems = filterSystems(systems, query, category)

  function resetFilters() {
    setQuery('')
    setCategory('Semua')
  }

  return (
    <div className="system-directory">
      <div className="system-directory__tools">
        <label className="system-directory__search">
          <span>Cari eSistem</span>
          <Search aria-hidden="true" />
          <input
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari nama atau perkhidmatan"
            type="search"
            value={query}
          />
        </label>

        <div aria-label="Tapis mengikut kategori" className="system-directory__filters">
          {SYSTEM_CATEGORIES.map((option) => (
            <button
              aria-pressed={category === option}
              key={option}
              onClick={() => setCategory(option)}
              type="button"
            >
              {option}
            </button>
          ))}
        </div>

        <p aria-live="polite" className="system-directory__count">
          {filteredSystems.length} eSistem ditemui
        </p>
      </div>

      {filteredSystems.length > 0 ? (
        <div aria-label="Direktori eSistem" className="system-directory__grid" role="list">
          {filteredSystems.map((system) => (
            <div key={system.id} role="listitem">
              <SystemCard system={system} />
            </div>
          ))}
        </div>
      ) : (
        <div className="system-directory__empty">
          <X aria-hidden="true" />
          <strong>Tiada eSistem ditemui</strong>
          <p>Cuba kata carian atau kategori yang berbeza.</p>
          <button onClick={resetFilters} type="button">
            Tetapkan Semula
          </button>
        </div>
      )}
    </div>
  )
}
