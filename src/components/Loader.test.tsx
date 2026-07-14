import { act, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { Loader } from './Loader'

describe('Loader', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    sessionStorage.clear()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('counts to 100 and reveals the portal exactly once', () => {
    const onComplete = vi.fn()
    render(<Loader reducedMotion={false} onComplete={onComplete} />)

    expect(screen.getByRole('status')).toBeInTheDocument()
    expect(onComplete).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(2_000)
    })

    expect(onComplete).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100')

    act(() => {
      vi.advanceTimersByTime(1_000)
    })

    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    expect(onComplete).toHaveBeenCalledTimes(1)
  })

  it('skips entirely under reduced motion', () => {
    const onComplete = vi.fn()
    render(<Loader reducedMotion onComplete={onComplete} />)

    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    expect(onComplete).toHaveBeenCalledTimes(1)
  })

  it('fails open when session storage cannot be read', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('storage blocked')
    })

    const onComplete = vi.fn()
    render(<Loader reducedMotion={false} onComplete={onComplete} />)

    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    expect(onComplete).toHaveBeenCalledTimes(1)
  })

  it('still reveals the portal when session storage cannot be written', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('storage blocked')
    })

    const onComplete = vi.fn()
    render(<Loader reducedMotion={false} onComplete={onComplete} />)

    act(() => {
      vi.advanceTimersByTime(3_000)
    })

    expect(onComplete).toHaveBeenCalledTimes(1)
  })
})
