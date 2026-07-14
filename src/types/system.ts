export type SystemCategory =
  | 'Akademik'
  | 'Pengurusan'
  | 'Kemudahan'
  | 'Sokongan Digital'

export type SystemFilterCategory = SystemCategory | 'Semua'

export interface SystemEntry {
  id: string
  name: string
  description: string
  category: SystemCategory
  url: `https://${string}`
  icon: 'book-open' | 'calendar-days' | 'file-text' | 'life-buoy'
  accent: string
  featured: boolean
  order: number
}
