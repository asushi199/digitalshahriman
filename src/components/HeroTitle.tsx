import { motion } from 'framer-motion'

import { site } from '../data/site'

interface HeroTitleProps {
  active: boolean
  reducedMotion: boolean
}

const lineVariants = {
  hidden: { opacity: 0, y: 34 },
  show: { opacity: 1, y: 0 },
}

export function HeroTitle({ active, reducedMotion }: HeroTitleProps) {
  const container = reducedMotion
    ? { hidden: {}, show: {} }
    : {
        hidden: {},
        show: { transition: { staggerChildren: 0.14, delayChildren: 0.1 } },
      }
  const line = reducedMotion ? { hidden: {}, show: {} } : lineVariants

  return (
    <motion.section
      className="hero"
      aria-labelledby="portal-title"
      variants={container}
      initial={reducedMotion ? false : 'hidden'}
      animate={active ? 'show' : 'hidden'}
    >
      <motion.p
        className="hero__eyebrow"
        variants={line}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        {site.eyebrow}
      </motion.p>
      <motion.h1
        id="portal-title"
        className="hero__name"
        aria-label={`${site.eyebrow} ${site.shortName} — ${site.name}`}
        variants={line}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <span aria-hidden="true" className="hero__sparkle hero__sparkle--big">
          ✦
        </span>
        <span aria-hidden="true" className="hero__sparkle hero__sparkle--small">
          ✦
        </span>
        {site.shortName}
      </motion.h1>
      <motion.p
        className="hero__school"
        aria-hidden="true"
        variants={line}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        {site.name}
        <span className="hero__motto">{site.motto}</span>
      </motion.p>
      <motion.p
        className="hero__tagline"
        variants={line}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        {site.tagline}
      </motion.p>
    </motion.section>
  )
}
