import { ArrowDownRight, Grid2X2 } from 'lucide-react'
import { motion } from 'framer-motion'

import { RobotScene } from './RobotScene'

interface HeroSectionProps {
  reducedMotion: boolean
}

export function HeroSection({ reducedMotion }: HeroSectionProps) {
  const reveal = reducedMotion
    ? { initial: false as const, animate: undefined }
    : { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 } }

  return (
    <section className="hero" aria-labelledby="portal-title">
      <div className="hero__ambient" aria-hidden="true" />
      <div className="hero__inner">
        <motion.div
          className="hero__copy"
          initial={reveal.initial}
          animate={reveal.animate}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="hero__eyebrow">
            <img
              src="/brand/smkrs-crest.jpg"
              alt="Lencana SMK Raja Shahriman"
              onError={(event) => {
                event.currentTarget.hidden = true
              }}
            />
            <span>
              Portal Rasmi
              <strong>SMK Raja Shahriman</strong>
            </span>
          </div>

          <p className="hero__motto">Pengetahuan Punca Kejayaan</p>
          <h1 id="portal-title" aria-label="SMK Raja Shahriman Digital">
            SMK Raja Shahriman
            <span>{' '}Digital</span>
          </h1>
          <p className="hero__lead">
            <strong>Satu Pusat, Semua Sistem</strong>
            Akses pantas ke perkhidmatan digital sekolah dalam satu ruang yang
            teratur.
          </p>

          <div className="hero__actions">
            <a className="hero__action hero__action--primary" href="#featured-systems">
              Terokai eSistem
              <ArrowDownRight aria-hidden="true" />
            </a>
            <a className="hero__action hero__action--secondary" href="#all-systems">
              <Grid2X2 aria-hidden="true" />
              Lihat Semua
            </a>
          </div>
        </motion.div>

        <RobotScene reducedMotion={reducedMotion} />
      </div>

      <div className="hero__scroll-cue" aria-hidden="true">
        <span>Skrol untuk meneroka</span>
        <i />
      </div>
    </section>
  )
}
