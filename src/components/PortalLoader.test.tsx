import { act, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { PortalLoader } from './PortalLoader'

describe('PortalLoader', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('skips immediately without a progress counter for reduced motion', () => {
    const onComplete = vi.fn()

    render(<PortalLoader reducedMotion onComplete={onComplete} />)

    expect(onComplete).toHaveBeenCalledTimes(1)
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
  })

  it('completes after 1,200 ms and remembers the loader for the session', () => {
    vi.useFakeTimers()
    const onComplete = vi.fn()

    render(<PortalLoader reducedMotion={false} onComplete={onComplete} />)

    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0')

    act(() => {
      vi.advanceTimersByTime(1_200)
    })

    expect(onComplete).toHaveBeenCalledTimes(1)
    expect(sessionStorage.getItem('smkrs-loader-seen')).toBe('true')
  })
})
