import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useEffect } from 'react'
import type { PointerEvent } from 'react'

const MAX_TRANSLATION = 12
const TABLET_TRANSLATION = 6

interface RobotSceneProps {
  reducedMotion: boolean
  onMascotLoadError?: () => void
}

export function RobotScene({
  reducedMotion,
  onMascotLoadError,
}: RobotSceneProps) {
  const targetX = useMotionValue(0)
  const targetY = useMotionValue(0)
  const x = useSpring(targetX, { stiffness: 95, damping: 20, mass: 0.5 })
  const y = useSpring(targetY, { stiffness: 95, damping: 20, mass: 0.5 })

  useEffect(() => {
    if (reducedMotion) {
      targetX.set(0)
      targetY.set(0)
    }
  }, [reducedMotion, targetX, targetY])

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    const relativeX = (event.clientX - bounds.left) / bounds.width - 0.5
    const relativeY = (event.clientY - bounds.top) / bounds.height - 0.5
    const maxTranslation = bounds.width <= 768 ? TABLET_TRANSLATION : MAX_TRANSLATION

    targetX.set(relativeX * maxTranslation * 2)
    targetY.set(relativeY * maxTranslation * 2)
  }

  const resetPointer = () => {
    targetX.set(0)
    targetY.set(0)
  }

  return (
    <div
      className="robot-scene"
      aria-hidden="true"
      onPointerMove={reducedMotion ? undefined : handlePointerMove}
      onPointerLeave={reducedMotion ? undefined : resetPointer}
    >
      <div className="robot-scene__grid" />
      <div className="robot-scene__noise" />
      <motion.div
        className="robot-scene__orb robot-scene__orb--blue"
        style={{ x, y }}
      />
      <motion.div
        className="robot-scene__orb robot-scene__orb--red"
        style={{ x: targetX, y: targetY }}
      />
      <motion.div
        className="robot-scene__robot"
        style={{ x, y }}
        animate={reducedMotion ? undefined : { translateY: [0, -5, 0] }}
        transition={{ duration: 5.5, ease: 'easeInOut', repeat: Infinity }}
      >
        <img
          src="/mascot/smkrs-robot.png"
          alt=""
          draggable="false"
          onError={(event) => {
            event.currentTarget.hidden = true
            onMascotLoadError?.()
          }}
        />
      </motion.div>
      <div className="robot-scene__light-sweep" />
      <div className="robot-scene__foreground" />
    </div>
  )
}
