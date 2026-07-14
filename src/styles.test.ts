import { describe, expect, it } from 'vitest'

import styles from './styles.css?inline'

describe('responsive touch behavior', () => {
  it('keeps native horizontal rail overflow without blocking vertical page panning', () => {
    expect(styles).toMatch(
      /\.featured-rail__track\s*\{[^}]*overflow-x:\s*auto;/s,
    )
    expect(styles).not.toMatch(
      /\.featured-rail__track\s*\{[^}]*touch-action:\s*pan-x;/s,
    )
  })
})
