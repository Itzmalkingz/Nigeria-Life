import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth'
import { Button, Input } from '../components/ui'

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
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-dark-bg">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-warm-ivory hover:text-life-red transition-colors mb-6" aria-label="Nigeria Life Home">
            <span className="text-3xl" aria-hidden="true">🌿</span>
            <span className="font-display font-bold text-display-lg">Nigeria Life</span>
          </Link>
          <h1 className="heading-display text-display-lg mb-2">Choose a New Password</h1>
          <p className="text-body text-muted-text">Set a new password for your account.</p>
        </div>

        <div className="card space-y-6">
          {status === 'checking' ? (
            <div className="flex items-center justify-center py-8" role="status" aria-label="Verifying reset link">
              <div className="w-10 h-10 border-4 border-life-red border-t-transparent rounded-full animate-spin" />
            </div>
          ) : status === 'invalid' ? (
            <div className="space-y-4 text-center py-4" role="alert">
              <div className="text-4xl" aria-hidden="true">⚠️</div>
              <h2 className="font-display font-bold text-lg text-warm-ivory">Reset link invalid or expired</h2>
              <p className="text-body-sm text-muted-text">
                This password reset link is no longer valid. Please request a new one.
              </p>
              <Link to="/forgot-password" className="btn-primary inline-block">Request New Link</Link>
            </div>
          ) : done ? (
            <div className="space-y-4 text-center py-4" role="status">
              <div className="text-4xl" aria-hidden="true">✅</div>
              <h2 className="font-display font-bold text-lg text-warm-ivory">Password updated</h2>
              <p className="text-body-sm text-muted-text">
                Your password has been changed successfully.
              </p>
              <Button className="w-full" onClick={() => navigate('/game', { replace: true })}>
                Continue to Game
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <Input
                label="New Password"
                type="password"
                value={password}
                onChange={e => {
                  setPassword(e.target.value)
                  if (errors.password) setErrors(prev => ({ ...prev, password: '' }))
                }}
                placeholder="••••••••"
                autoComplete="new-password"
                required
                disabled={submitting}
                error={errors.password || undefined}
                helperText="At least 8 characters"
              />

              <Input
                label="Confirm New Password"
                type="password"
                value={confirmPassword}
                onChange={e => {
                  setConfirmPassword(e.target.value)
                  if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: '' }))
                }}
                placeholder="••••••••"
                autoComplete="new-password"
                required
                disabled={submitting}
                error={errors.confirmPassword || undefined}
              />

              {submitError && (
                <div className="p-3 rounded-brand bg-life-red/10 border border-life-red/20 text-life-red text-body-sm" role="alert">
                  {submitError}
                </div>
              )}

              <Button type="submit" className="w-full" size="lg" loading={submitting}>
                Update Password
              </Button>
            </form>
          )}
        </div>

        <p className="mt-6 text-center text-body-sm text-muted-text">
          <Link to="/login" className="link">Back to sign in</Link>
        </p>
      </div>
    </div>
  )
}
