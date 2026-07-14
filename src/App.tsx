import { useReducedMotion } from 'framer-motion'
import { useCallback, useEffect, useState } from 'react'

import { HeroTitle } from './components/HeroTitle'
import { Loader } from './components/Loader'
import { NavBar } from './components/NavBar'
import { SkyScene, type Theme } from './components/SkyScene'
import { SystemMarquee } from './components/SystemMarquee'
import { site } from './data/site'
import { systems } from './data/systems'
import { initialTheme, THEME_KEY } from './lib/theme'

export default function App() {
  const prefersReducedMotion = useReducedMotion() ?? false
  const [theme, setTheme] = useState<Theme>(initialTheme)
  const [loaderComplete, setLoaderComplete] = useState(false)
  const finishLoader = useCallback(() => setLoaderComplete(true), [])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme((current) => {
      const next: Theme = current === 'day' ? 'night' : 'day'
      try {
        localStorage.setItem(THEME_KEY, next)
      } catch {
        // Pilihan tema hanya keutamaan; kegagalan storan tidak kritikal.
      }
      return next
    })
  }, [])

  return (
    <>
      <Loader reducedMotion={prefersReducedMotion} onComplete={finishLoader} />
      <div className="stage" data-loader-complete={loaderComplete}>
        <SkyScene theme={theme} reducedMotion={prefersReducedMotion} />
        <NavBar theme={theme} onToggleTheme={toggleTheme} />
        <main>
          <HeroTitle active={loaderComplete} reducedMotion={prefersReducedMotion} />
          <SystemMarquee systems={systems} reducedMotion={prefersReducedMotion} />
        </main>
        <p className="stage__copyright">{site.copyright}</p>
      </div>
    </>
  )
}
