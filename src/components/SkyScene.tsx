import { useEffect, useMemo, useRef } from 'react'

import { site } from '../data/site'

export type Theme = 'day' | 'night'

interface SkySceneProps {
  theme: Theme
  reducedMotion: boolean
}

interface Puff {
  left: number
  top: number
  width: number
  height: number
  drift: number
}

// Pseudo-rawak deterministik supaya susunan awan kekal sama antara render.
function seededRandom(seed: number) {
  let state = seed
  return () => {
    state = (state * 1103515245 + 12345) % 2147483648
    return state / 2147483648
  }
}

function makePuffs(seed: number, count: number): Puff[] {
  const random = seededRandom(seed)
  return Array.from({ length: count }, () => ({
    left: random() * 110 - 10,
    top: 30 + random() * 60,
    width: 24 + random() * 34,
    height: 8 + random() * 10,
    drift: 60 + random() * 80,
  }))
}

interface Star {
  x: number
  y: number
  radius: number
  phase: number
  speed: number
}

interface Particle {
  kind: 'leaf' | 'snow'
  x: number
  y: number
  size: number
  fall: number
  sway: number
  swayPhase: number
  spin: number
  angle: number
}

function spawnParticle(kind: Particle['kind'], width: number, height: number, atTop: boolean): Particle {
  return {
    kind,
    x: Math.random() * width,
    y: atTop ? -12 : Math.random() * height,
    size: kind === 'leaf' ? 5 + Math.random() * 5 : 1 + Math.random() * 2.2,
    fall: kind === 'leaf' ? 0.5 + Math.random() * 0.7 : 0.25 + Math.random() * 0.45,
    sway: 0.4 + Math.random() * 0.8,
    swayPhase: Math.random() * Math.PI * 2,
    spin: (Math.random() - 0.5) * 0.06,
    angle: Math.random() * Math.PI * 2,
  }
}

function SkyCanvas({ theme, reducedMotion }: SkySceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const themeRef = useRef(theme)
  const redrawRef = useRef<() => void>(() => {})

  useEffect(() => {
    themeRef.current = theme
    redrawRef.current()
  }, [theme])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d')
    if (!context) return

    let width = 0
    let height = 0
    let stars: Star[] = []
    let particles: Particle[] = []
    let nightAlpha = themeRef.current === 'night' ? 1 : 0
    let frame = 0
    let animationId = 0

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      width = canvas.clientWidth
      height = canvas.clientHeight
      canvas.width = Math.round(width * ratio)
      canvas.height = Math.round(height * ratio)
      context.setTransform(ratio, 0, 0, ratio, 0, 0)

      stars = Array.from({ length: Math.round(width / 9) }, () => ({
        x: Math.random() * width,
        y: Math.random() * height * 0.72,
        radius: 0.4 + Math.random() * 1.1,
        phase: Math.random() * Math.PI * 2,
        speed: 0.008 + Math.random() * 0.02,
      }))

      const target = width < 768 ? 14 : 28
      particles = Array.from({ length: target }, () =>
        spawnParticle(themeRef.current === 'night' ? 'snow' : 'leaf', width, height, false),
      )
    }

    const drawStars = () => {
      if (nightAlpha <= 0.01) return
      for (const star of stars) {
        const twinkle = 0.35 + 0.65 * (0.5 + Math.sin(frame * star.speed + star.phase) / 2)
        context.globalAlpha = nightAlpha * twinkle
        context.fillStyle = '#e9edff'
        context.beginPath()
        context.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
        context.fill()
      }
      context.globalAlpha = 1
    }

    const drawParticle = (particle: Particle) => {
      if (particle.kind === 'leaf') {
        context.save()
        context.translate(particle.x, particle.y)
        context.rotate(particle.angle)
        context.globalAlpha = 0.7
        context.fillStyle = '#f4b942'
        context.beginPath()
        context.ellipse(0, 0, particle.size, particle.size * 0.45, 0, 0, Math.PI * 2)
        context.fill()
        context.restore()
        context.globalAlpha = 1
      } else {
        context.globalAlpha = 0.8
        context.fillStyle = '#f4f7ff'
        context.beginPath()
        context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        context.fill()
        context.globalAlpha = 1
      }
    }

    const step = () => {
      frame += 1
      nightAlpha += themeRef.current === 'night' ? 0.015 : -0.015
      nightAlpha = Math.min(1, Math.max(0, nightAlpha))

      context.clearRect(0, 0, width, height)
      drawStars()

      const spawnKind: Particle['kind'] = themeRef.current === 'night' ? 'snow' : 'leaf'
      for (let index = 0; index < particles.length; index += 1) {
        const particle = particles[index]
        particle.y += particle.fall
        particle.x += Math.sin(frame * 0.01 + particle.swayPhase) * particle.sway * 0.4
        particle.angle += particle.spin

        if (particle.y > height + 14) {
          // Zarah baharu mengikut tema semasa; peralihan daun ke salji berlaku secara organik.
          particles[index] = spawnParticle(spawnKind, width, height, true)
        } else {
          drawParticle(particle)
        }
      }

      animationId = window.requestAnimationFrame(step)
    }

    const drawStatic = () => {
      nightAlpha = themeRef.current === 'night' ? 1 : 0
      context.clearRect(0, 0, width, height)
      if (nightAlpha > 0) {
        for (const star of stars) {
          context.globalAlpha = 0.7
          context.fillStyle = '#e9edff'
          context.beginPath()
          context.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
          context.fill()
        }
        context.globalAlpha = 1
      }
    }

    resize()
    window.addEventListener('resize', resize)

    if (reducedMotion) {
      redrawRef.current = drawStatic
      drawStatic()
    } else {
      redrawRef.current = () => {}
      animationId = window.requestAnimationFrame(step)
    }

    return () => {
      window.removeEventListener('resize', resize)
      window.cancelAnimationFrame(animationId)
      redrawRef.current = () => {}
    }
  }, [reducedMotion])

  return <canvas ref={canvasRef} className="sky__canvas" />
}

export function SkyScene({ theme, reducedMotion }: SkySceneProps) {
  const sceneRef = useRef<HTMLDivElement>(null)
  const farPuffs = useMemo(() => makePuffs(11, 6), [])
  const midPuffs = useMemo(() => makePuffs(29, 6), [])
  const nearPuffs = useMemo(() => makePuffs(47, 5), [])
  const hasPhoto = Boolean(site.heroImage.day || site.heroImage.night)

  useEffect(() => {
    if (reducedMotion) return
    if (typeof window.matchMedia !== 'function') return
    if (!window.matchMedia('(pointer: fine)').matches) return

    const scene = sceneRef.current
    if (!scene) return

    const handlePointer = (event: PointerEvent) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1
      const y = (event.clientY / window.innerHeight) * 2 - 1
      scene.style.setProperty('--par-x', x.toFixed(3))
      scene.style.setProperty('--par-y', y.toFixed(3))
    }

    window.addEventListener('pointermove', handlePointer)
    return () => window.removeEventListener('pointermove', handlePointer)
  }, [reducedMotion])

  const renderLayer = (name: string, puffs: Puff[]) => (
    <div className={`sky__clouds sky__clouds--${name}`}>
      {puffs.map((puff, index) => (
        <span
          key={index}
          style={{
            left: `${puff.left}%`,
            top: `${puff.top}%`,
            width: `${puff.width}vw`,
            height: `${puff.height}vh`,
            animationDuration: `${puff.drift}s`,
            animationDelay: `${-puff.drift * (index / puffs.length)}s`,
          }}
        />
      ))}
    </div>
  )

  return (
    <div
      ref={sceneRef}
      className={`sky${hasPhoto ? ' sky--photo' : ''}`}
      aria-hidden="true"
    >
      {site.heroImage.day ? (
        <img className="sky__photo sky__photo--day" src={site.heroImage.day} alt="" />
      ) : null}
      {site.heroImage.night ? (
        <img className="sky__photo sky__photo--night" src={site.heroImage.night} alt="" />
      ) : null}
      <div className="sky__gradient sky__gradient--day" />
      <div className="sky__gradient sky__gradient--night" />
      <div className="sky__orb" />
      {renderLayer('far', farPuffs)}
      {renderLayer('mid', midPuffs)}
      <SkyCanvas theme={theme} reducedMotion={reducedMotion} />
      {renderLayer('near', nearPuffs)}
      <div className="sky__scrim" />
    </div>
  )
}
