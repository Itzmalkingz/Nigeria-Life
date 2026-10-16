import { describe, it, expect } from 'vitest'
import { withTimeout, AUTH_REQUEST_TIMEOUT_MS } from './async'

describe('withTimeout', () => {
  it('resolves with the original value when it settles in time', async () => {
    await expect(withTimeout(Promise.resolve('ok'), 1000, 'Test')).resolves.toBe('ok')
  })

  it('rejects with a timeout error when the promise never settles', async () => {
    const neverSettles = new Promise<string>(() => {
      // Intentionally never resolves or rejects.
    })
    await expect(withTimeout(neverSettles, 20, 'Session check')).rejects.toThrow(
      'Session check timed out after 0 seconds'
    )
  })

  it('propagates the original rejection instead of masking it', async () => {
    await expect(withTimeout(Promise.reject(new Error('boom')), 1000, 'Test')).rejects.toThrow('boom')
  })

  it('uses a 15 second default budget for auth requests', () => {
    expect(AUTH_REQUEST_TIMEOUT_MS).toBe(15000)
  })
})
