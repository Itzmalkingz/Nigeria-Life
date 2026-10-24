import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth'
import { Button, PasswordInput } from '../components/ui'
import AuthShell from '../components/AuthShell'

type Status = 'checking' | 'ready' | 'invalid'

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()
  const [status, setStatus] = useState<Status>('checking')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitError, setSubmitError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (authLoading) return
    let active = true

    const check = async () => {
      const { data } = await supabase.auth.getSession()
      if (!active) return
      setStatus(data.session ? 'ready' : 'invalid')
    }

    check()
    return () => {
      active = false
    }
  }, [authLoading, user])

  const validate = (): boolean => {
    const next: Record<string, string> = {}
    if (!password) next.password = 'Password is required'
    else if (password.length < 8) next.password = 'Password must be at least 8 characters'
    if (!confirmPassword) next.confirmPassword = 'Confirm your password'
    else if (confirmPassword !== password) next.confirmPassword = 'Passwords do not match'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (submitting) return
    setSubmitError('')
    if (!validate()) return

    setSubmitting(true)
    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) {
        setSubmitError(error.message)
        return
      }
      setDone(true)
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : 'Could not update your password. Please try again.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthShell
      title="Choose a new password"
      tagline={done ? 'You are all set.' : 'Make it something you have not used before.'}
    >
      {status === 'checking' ? (
        <div className="flex items-center justify-center py-10" role="status" aria-label="Verifying reset link">
          <div className="h-9 w-9 animate-spin rounded-full border-2 border-choice-blue border-t-transparent" />
        </div>
      ) : status === 'invalid' ? (
        <div className="space-y-4 text-center py-2" role="alert">
          <div
            className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-life-red/30 bg-life-red/10 text-life-red"
            aria-hidden="true"
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 8v5m0 3.5h.01M10.3 3.9 2.6 17.2A1.8 1.8 0 0 0 4.2 20h15.6a1.8 1.8 0 0 0 1.6-2.8L13.7 3.9a2 2 0 0 0-3.4 0Z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h2 className="font-display text-lg font-semibold text-warm-ivory">Reset link invalid or expired</h2>
          <p className="text-body-sm text-text-dim">
            This password reset link is no longer valid. Request a new one to continue.
          </p>
          <Link
            to="/forgot-password"
            className="auth-btn-primary"
          >
            Request a new link
          </Link>
        </div>
      ) : done ? (
        <div className="space-y-4 text-center py-2" role="status">
          <div
            className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-success/30 bg-success/10 text-success"
            aria-hidden="true"
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m5 12.5 4.5 4.5L19 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h2 className="font-display text-lg font-semibold text-warm-ivory">Password updated</h2>
          <p className="text-body-sm text-text-dim">
            Your password has been changed. Continue into your life.
          </p>
          <Button
            variant="secondary"
            size="lg"
            className="w-full rounded-control"
            onClick={() => navigate('/game', { replace: true })}
          >
            Continue to the game
          </Button>
        </div>
      ) : (
        <>
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <PasswordInput
              variant="auth"
              label="New password"
              value={password}
              onChange={e => {
                setPassword(e.target.value)
                if (errors.password) setErrors(prev => ({ ...prev, password: '' }))
              }}
              placeholder="At least 8 characters"
              autoComplete="new-password"
              required
              disabled={submitting}
              error={errors.password || undefined}
            />

            <PasswordInput
              variant="auth"
              label="Confirm new password"
              value={confirmPassword}
              onChange={e => {
                setConfirmPassword(e.target.value)
                if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: '' }))
              }}
              placeholder="Repeat your password"
              autoComplete="new-password"
              required
              disabled={submitting}
              error={errors.confirmPassword || undefined}
            />

            {submitError && (
              <div className="auth-alert-error" role="alert">
                {submitError}
              </div>
            )}

            <Button
              type="submit"
              variant="secondary"
              size="lg"
              className="w-full rounded-control"
              loading={submitting}
            >
              Update password
            </Button>
          </form>

          <p className="mt-6 text-center text-body-sm text-text-dim">
            <Link to="/login" className="font-medium text-choice-blue hover:text-choice-blue/80">
              Back to log in
            </Link>
          </p>
        </>
      )}
    </AuthShell>
  )
}
