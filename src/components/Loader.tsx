import { useEffect, useRef, useState } from 'react'

const LOADER_DURATION = 1_800
const LOADER_STEP = 20
const LOADER_EXIT = 700
const SESSION_KEY = 'serasha-loader-seen'

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
    // Storan boleh gagal tanpa menyekat akses ke portal.
  }
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3)
}

interface LoaderProps {
  reducedMotion: boolean
  onComplete: () => void
}

export function Loader({ reducedMotion, onComplete }: LoaderProps) {
  // Dinilai sekali sahaja semasa lekapan; penulisan storan ketika selesai
  // tidak boleh mengubah keputusan ini dan memotong animasi keluar.
  const [shouldSkip] = useState(() => reducedMotion || shouldSkipForSession())
  const [progress, setProgress] = useState(0)
  const [leaving, setLeaving] = useState(false)
  const [visible, setVisible] = useState(!shouldSkip)
  const completed = useRef(false)

  useEffect(() => {
    if (shouldSkip) {
      // `visible` sudah dimulakan sebagai false; cukup laporkan selesai.
      if (!completed.current) {
        completed.current = true
        rememberLoaderForSession()
        onComplete()
      }
      return
    }

    const finish = () => {
      if (completed.current) return

      completed.current = true
      rememberLoaderForSession()
      setProgress(100)
      onComplete()
    }

    let elapsed = 0
    let exitTimer: number | undefined
    const timer = window.setInterval(() => {
      elapsed += LOADER_STEP
      const eased = easeOutCubic(Math.min(1, elapsed / LOADER_DURATION))
      setProgress(Math.min(100, Math.round(eased * 100)))

      if (elapsed >= LOADER_DURATION) {
        window.clearInterval(timer)
        finish()
        setLeaving(true)
        exitTimer = window.setTimeout(() => setVisible(false), LOADER_EXIT)
      }
    }, LOADER_STEP)

    return () => {
      window.clearInterval(timer)
      if (exitTimer !== undefined) window.clearTimeout(exitTimer)
    }
  }, [onComplete, shouldSkip])

  if (!visible) return null

  return (
    <div
      className={`loader${leaving ? ' loader--leaving' : ''}`}
      role="status"
      aria-label="Portal sedang dimuatkan"
    >
      <div className="loader__glow" aria-hidden="true" />
      <p className="loader__label">Memuatkan Portal</p>
      <span
        className="loader__count"
        role="progressbar"
        aria-label="Kemajuan pemuatan"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
      >
        {progress}%
      </span>
    </div>
  )
}
