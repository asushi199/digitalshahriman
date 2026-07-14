import { useReducedMotion } from 'framer-motion'
import { useCallback, useEffect, useState } from 'react'

import { HeroTitle } from './components/HeroTitle'
import { Loader } from './components/Loader'
import { NavBar } from './components/NavBar'
import { SkyScene } from './components/SkyScene'
import { SystemRail } from './components/SystemRail'
import { site } from './data/site'
import { systems } from './data/systems'
import {
  initialPreference,
  nextPreference,
  themeForTime,
  type Theme,
  type ThemePreference,
} from './lib/theme'

const CLOCK_CHECK_INTERVAL = 30_000

export default function App() {
  const prefersReducedMotion = useReducedMotion() ?? false
  const [preference, setPreference] = useState<ThemePreference>(initialPreference)
  const [clockTheme, setClockTheme] = useState<Theme>(() => themeForTime())
  const [loaderComplete, setLoaderComplete] = useState(false)
  const finishLoader = useCallback(() => setLoaderComplete(true), [])

  const theme = preference === 'auto' ? clockTheme : preference

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  // Dalam mod automatik, semak jam secara berkala supaya langit
  // bertukar sendiri apabila tiba waktunya.
  useEffect(() => {
    if (preference !== 'auto') return

    const timer = window.setInterval(
      () => setClockTheme(themeForTime()),
      CLOCK_CHECK_INTERVAL,
    )
    return () => window.clearInterval(timer)
  }, [preference])

  const cycleTheme = useCallback(() => {
    setPreference((current) => {
      const next = nextPreference(current)
      if (next === 'auto') setClockTheme(themeForTime())
      return next
    })
  }, [])

  return (
    <>
      <Loader reducedMotion={prefersReducedMotion} onComplete={finishLoader} />
      <div className="stage" data-loader-complete={loaderComplete}>
        <SkyScene theme={theme} reducedMotion={prefersReducedMotion} />
        <NavBar preference={preference} onCycleTheme={cycleTheme} />
        <main>
          <HeroTitle active={loaderComplete} reducedMotion={prefersReducedMotion} />
          <SystemRail systems={systems} />
        </main>
        <p className="stage__copyright">{site.copyright}</p>
      </div>
    </>
  )
}
