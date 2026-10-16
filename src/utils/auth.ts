/**
 * Supabase returns a successful signup with `session: null` when the project
 * requires email confirmation. Such an account must NOT be treated as signed
 * in — there is no session, no persisted token, and no SIGNED_IN event.
 */
export const SIGNUP_CONFIRMATION_MESSAGE =
  'Account created. Check your email to confirm your account, then sign in.'

/**
 * Returns true when a signup response carries no usable session, i.e. the
 * account exists but the user still needs to confirm (or sign in) before the
 * app may treat them as authenticated.
 */
export function needsEmailConfirmation(
  data: { user: unknown; session: unknown } | null | undefined
): boolean {
  return !data || !data.user || !data.session
}
