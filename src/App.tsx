import { useReducedMotion } from 'framer-motion'
import { useCallback, useState } from 'react'

import { HeroSection } from './components/HeroSection'
import { PortalLoader } from './components/PortalLoader'

export default function App() {
  const prefersReducedMotion = useReducedMotion() ?? false
  const [loaderComplete, setLoaderComplete] = useState(false)
  const finishLoader = useCallback(() => setLoaderComplete(true), [])

  return (
    <>
      <PortalLoader
        reducedMotion={prefersReducedMotion}
        onComplete={finishLoader}
      />
      <main data-loader-complete={loaderComplete}>
        <HeroSection reducedMotion={prefersReducedMotion} />
      </main>
    </>
  )
}
