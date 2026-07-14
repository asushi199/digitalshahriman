import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

const LOADER_DURATION = 1_200
const LOADER_STEP = 20
const SESSION_KEY = 'smkrs-loader-seen'

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
    sessionStorage.getItem(SESSION_KEY) === 'true'
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(!shouldSkip)
  const completed = useRef(false)

  useEffect(() => {
    const finish = () => {
      if (completed.current) return

      completed.current = true
      sessionStorage.setItem(SESSION_KEY, 'true')
      setProgress(100)
      setVisible(false)
      onComplete()
    }

    if (
      criticalArtworkFailed ||
      reducedMotion ||
      sessionStorage.getItem(SESSION_KEY) === 'true'
    ) {
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
  }, [criticalArtworkFailed, onComplete, reducedMotion])

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
