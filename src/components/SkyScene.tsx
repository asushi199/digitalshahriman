import { useEffect, useMemo, useRef } from 'react'

import { site } from '../data/site'
import { THEMES, type Theme } from '../lib/theme'

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
      width = canvas.clientWidth
      height = canvas.clientHeight
      // Skrin sempit dilukis pada resolusi lebih rendah dan zarah lebih
      // sedikit supaya peranti mudah alih kekal lancar.
      const isNarrow = width < 768
      const ratio = Math.min(window.devicePixelRatio || 1, isNarrow ? 1.25 : 2)
      canvas.width = Math.round(width * ratio)
      canvas.height = Math.round(height * ratio)
      context.setTransform(ratio, 0, 0, ratio, 0, 0)

      stars = Array.from({ length: Math.round(width / (isNarrow ? 14 : 9)) }, () => ({
        x: Math.random() * width,
        y: Math.random() * height * 0.72,
        radius: 0.4 + Math.random() * 1.1,
        phase: Math.random() * Math.PI * 2,
        speed: 0.008 + Math.random() * 0.02,
      }))

      const target = isNarrow ? 10 : 28
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

interface HudNode {
  x: number
  y: number
  vx: number
  vy: number
  pulse: number
  speed: number
}

function HudCanvas({ reducedMotion }: { reducedMotion: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d')
    if (!context) return

    let width = 0
    let height = 0
    let nodes: HudNode[] = []
    let frame = 0
    let animationId = 0
    let nodeColor = '#ffd24a'
    let lineColor = 'rgba(255, 210, 74, 0.38)'

    const readColors = () => {
      const styles = getComputedStyle(document.documentElement)
      nodeColor = styles.getPropertyValue('--hud-node').trim() || '#ffd24a'
      lineColor = styles.getPropertyValue('--hud-line').trim() || 'rgba(255, 210, 74, 0.38)'
    }

    const spawnNodes = (count: number) =>
      Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height * 0.82,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.28,
        pulse: Math.random() * Math.PI * 2,
        speed: 0.02 + Math.random() * 0.03,
      }))

    const resize = () => {
      width = canvas.clientWidth
      height = canvas.clientHeight
      const isNarrow = width < 768
      const ratio = Math.min(window.devicePixelRatio || 1, isNarrow ? 1 : 1.5)
      canvas.width = Math.round(width * ratio)
      canvas.height = Math.round(height * ratio)
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      nodes = spawnNodes(isNarrow ? 14 : 24)
      readColors()
    }

    const drawFrame = (animate: boolean) => {
      context.clearRect(0, 0, width, height)
      const linkDistance = Math.min(width, height) * 0.18

      for (let i = 0; i < nodes.length; i += 1) {
        for (let j = i + 1; j < nodes.length; j += 1) {
          const a = nodes[i]
          const b = nodes[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dist = Math.hypot(dx, dy)
          if (dist > linkDistance) continue
          context.globalAlpha = (1 - dist / linkDistance) * 0.55
          context.strokeStyle = lineColor
          context.lineWidth = 1
          context.beginPath()
          context.moveTo(a.x, a.y)
          context.lineTo(b.x, b.y)
          context.stroke()
        }
      }

      for (const node of nodes) {
        if (animate) {
          node.x += node.vx
          node.y += node.vy
          node.pulse += node.speed
          if (node.x < 0 || node.x > width) node.vx *= -1
          if (node.y < 0 || node.y > height * 0.88) node.vy *= -1
        }
        const radius = 1.6 + (0.5 + Math.sin(node.pulse) / 2) * 1.4
        context.globalAlpha = 0.75 + Math.sin(node.pulse) * 0.2
        context.fillStyle = nodeColor
        context.beginPath()
        context.arc(node.x, node.y, radius, 0, Math.PI * 2)
        context.fill()
      }
      context.globalAlpha = 1
    }

    const step = () => {
      frame += 1
      if (frame % 90 === 0) readColors()
      drawFrame(true)
      animationId = window.requestAnimationFrame(step)
    }

    resize()
    window.addEventListener('resize', resize)

    const onThemeChange = () => readColors()
    const observer = new MutationObserver(onThemeChange)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })

    if (reducedMotion) {
      drawFrame(false)
    } else {
      animationId = window.requestAnimationFrame(step)
    }

    return () => {
      window.removeEventListener('resize', resize)
      window.cancelAnimationFrame(animationId)
      observer.disconnect()
    }
  }, [reducedMotion])

  return <canvas ref={canvasRef} className="sky__hud-canvas" />
}

export function SkyScene({ theme, reducedMotion }: SkySceneProps) {
  const sceneRef = useRef<HTMLDivElement>(null)
  const farPuffs = useMemo(() => makePuffs(11, 6), [])
  const midPuffs = useMemo(() => makePuffs(29, 6), [])
  const nearPuffs = useMemo(() => makePuffs(47, 5), [])
  const hasPhoto = THEMES.some((name) => Boolean(site.heroImage[name]))

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
      {THEMES.map((name) =>
        site.heroImage[name] ? (
          <img
            key={name}
            className={`sky__photo sky__photo--${name}`}
            src={site.heroImage[name]}
            alt=""
          />
        ) : null,
      )}
      {THEMES.map((name) => (
        <div key={name} className={`sky__gradient sky__gradient--${name}`} />
      ))}
      <div className="sky__orb" />
      {renderLayer('far', farPuffs)}
      {renderLayer('mid', midPuffs)}
      <SkyCanvas theme={theme} reducedMotion={reducedMotion} />
      {renderLayer('near', nearPuffs)}
      <div className="sky__hud">
        <div className="sky__hud-mesh" />
        <div className="sky__hud-floor" />
        <div className="sky__hud-scan" />
        <HudCanvas reducedMotion={reducedMotion} />
      </div>
      <div className="sky__scrim" />
    </div>
  )
}
