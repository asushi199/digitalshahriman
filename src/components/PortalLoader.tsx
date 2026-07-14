import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

const LOADER_DURATION = 1_200
const LOADER_STEP = 20
const SESSION_KEY = 'smkrs-loader-seen'

function shouldSkipForSession() {
  try {
    return sessionStorage.getItem(SESSION_KEY) === 'true'
  } catch {
    return true
  }
}

function rememberLoaderForSession() {
  try {
    sessionStorage.setItem(SESSION_KEY, 'true')
  } catch {
    // Storage can be unavailable without blocking access to the portal.
  }
}

interface PortalLoaderProps {
  criticalArtworkFailed?: boolean
  reducedMotion: boolean
  onComplete: () => void
}

export function PortalLoader({
  criticalArtworkFailed = false,
  reducedMotion,
  onComplete,
}: PortalLoaderProps) {
  const shouldSkip =
    criticalArtworkFailed ||
    reducedMotion ||
    shouldSkipForSession()
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(!shouldSkip)
  const completed = useRef(false)

  useEffect(() => {
    const finish = () => {
      if (completed.current) return

      completed.current = true
      rememberLoaderForSession()
      setProgress(100)
      setVisible(false)
      onComplete()
    }

    if (shouldSkip) {
      finish()
      return
    }

    let elapsed = 0
    const timer = window.setInterval(() => {
      elapsed += LOADER_STEP
      const nextProgress = Math.min(
        100,
        Math.round((elapsed / LOADER_DURATION) * 100),
      )
      setProgress(nextProgress)

      if (elapsed >= LOADER_DURATION) {
        window.clearInterval(timer)
        finish()
      }
    }, LOADER_STEP)

    return () => window.clearInterval(timer)
  }, [onComplete, shouldSkip])

  if (!visible) return null

  return (
    <motion.div
      className="portal-loader"
      role="status"
      aria-label="Portal sedang dimuatkan"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="portal-loader__mark" aria-hidden="true">
        <span>SMKRS</span>
        <i />
      </div>
      <div className="portal-loader__progress">
        <span
          role="progressbar"
          aria-label="Kemajuan pemuatan"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
        >
          {progress.toString().padStart(3, '0')}
        </span>
        <div className="portal-loader__track" aria-hidden="true">
          <i style={{ transform: `scaleX(${progress / 100})` }} />
        </div>
      </div>
    </motion.div>
  )
}
