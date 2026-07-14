import { useReducedMotion } from 'framer-motion'
import { useCallback, useState } from 'react'

import { FeaturedRail } from './components/FeaturedRail'
import { HeroSection } from './components/HeroSection'
import { PortalLoader } from './components/PortalLoader'
import { SiteFooter } from './components/SiteFooter'
import { SystemDirectory } from './components/SystemDirectory'
import { systems } from './data/systems'

export default function App() {
  const prefersReducedMotion = useReducedMotion() ?? false
  const [loaderComplete, setLoaderComplete] = useState(false)
  const [criticalArtworkFailed, setCriticalArtworkFailed] = useState(false)
  const finishLoader = useCallback(() => setLoaderComplete(true), [])
  const handleMascotLoadError = useCallback(
    () => setCriticalArtworkFailed(true),
    [],
  )

  return (
    <>
      <PortalLoader
        criticalArtworkFailed={criticalArtworkFailed}
        reducedMotion={prefersReducedMotion}
        onComplete={finishLoader}
      />
      <main data-loader-complete={loaderComplete}>
        <HeroSection
          reducedMotion={prefersReducedMotion}
          onMascotLoadError={handleMascotLoadError}
        />
        <section
          aria-labelledby="featured-systems-title"
          className="discovery-section discovery-section--featured"
          id="featured-systems"
        >
          <div className="discovery-section__heading">
            <p>Pilihan utama</p>
            <h2 id="featured-systems-title">eSistem Pilihan</h2>
          </div>
          <FeaturedRail systems={systems} />
        </section>
        <section
          aria-labelledby="all-systems-title"
          className="discovery-section discovery-section--directory"
          id="all-systems"
        >
          <div className="discovery-section__heading">
            <p>Direktori digital</p>
            <h2 id="all-systems-title">Semua eSistem</h2>
          </div>
          <SystemDirectory systems={systems} />
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
