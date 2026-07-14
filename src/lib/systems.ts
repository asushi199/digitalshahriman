import type { SystemEntry, SystemFilterCategory } from '../types/system'

export const SYSTEM_CATEGORIES: SystemFilterCategory[] = [
  'Semua',
  'Akademik',
  'Pengurusan',
  'Kemudahan',
  'Sokongan Digital',
]

export function filterSystems(
  entries: SystemEntry[],
  query: string,
  category: SystemFilterCategory,
) {
  const normalized = query.trim().toLocaleLowerCase('ms-MY')

  return entries.filter((entry) => {
    const matchesCategory = category === 'Semua' || entry.category === category
    const searchable = `${entry.name} ${entry.description} ${entry.category}`.toLocaleLowerCase(
      'ms-MY',
    )
    return matchesCategory && (!normalized || searchable.includes(normalized))
  })
}
