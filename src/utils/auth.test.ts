import { describe, it, expect } from 'vitest'
import { needsEmailConfirmation, SIGNUP_CONFIRMATION_MESSAGE } from './auth'

describe('signup session handling', () => {
  it('requires confirmation when there is no signup response', () => {
    expect(needsEmailConfirmation(null)).toBe(true)
    expect(needsEmailConfirmation(undefined)).toBe(true)
  })

  it('requires confirmation when signup returns no session', () => {
    expect(needsEmailConfirmation({ user: { id: 'user-1' }, session: null })).toBe(true)
  })

  it('requires confirmation when signup returns no user', () => {
    expect(needsEmailConfirmation({ user: null, session: { access_token: 'token' } })).toBe(true)
  })

  it('does not require confirmation when signup returns a session', () => {
    expect(
      needsEmailConfirmation({ user: { id: 'user-1' }, session: { access_token: 'token' } })
    ).toBe(false)
  })

  it('explains that email confirmation may be required', () => {
    expect(SIGNUP_CONFIRMATION_MESSAGE).toMatch(/confirm/i)
  })
})
