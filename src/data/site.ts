export interface HeroImageSlots {
  /** Laluan imej latar penuh untuk tema subuh, contohnya '/hero/sekolah-subuh.jpg'. */
  dawn?: string
  /** Laluan imej latar penuh untuk tema siang, contohnya '/hero/sekolah-siang.jpg'. */
  day?: string
  /** Laluan imej latar penuh untuk tema senja, contohnya '/hero/sekolah-senja.jpg'. */
  dusk?: string
  /** Laluan imej latar penuh untuk tema malam, contohnya '/hero/sekolah-malam.jpg'. */
  night?: string
}

export interface SiteInfo {
  shortName: string
  name: string
  location: string
  motto: string
  eyebrow: string
  tagline: string
  copyright: string
  crest: string
  heroImage: HeroImageSlots
}

export const site: SiteInfo = {
  shortName: 'SERASHA',
  name: 'SMK Raja Shahriman',
  location: '32700 Beruas, Perak',
  motto: 'Pengetahuan Punca Kejayaan',
  eyebrow: 'Portal Digital',
  tagline: 'Satu portal, semua eSistem sekolah.',
  copyright: '© Unit ICT SMK Raja Shahriman 2026',
  crest: '/brand/smkrs-crest.jpg',
  // Letakkan imej sekolah dalam public/hero/ dan isi laluan di sini;
  // kosongkan untuk kekal dengan langit animasi penuh kod.
  heroImage: {},
}
