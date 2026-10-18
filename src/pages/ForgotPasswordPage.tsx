import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { Button, Input } from '../components/ui'

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [fieldError, setFieldError] = useState('')
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (submitting || sent) return

    const trimmed = email.trim()
    if (!trimmed) {
      setFieldError('Email is required')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setFieldError('Enter a valid email address')
      return
    }

    setFieldError('')
    setSubmitting(true)

    const { error } = await resetPassword(trimmed)
    setSubmitting(false)

    if (error) {
      setFieldError(error.message)
      return
    }

    setSent(true)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-dark-bg">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-warm-ivory hover:text-life-red transition-colors mb-6" aria-label="Nigeria Life Home">
            <span className="text-3xl" aria-hidden="true">🌿</span>
            <span className="font-display font-bold text-display-lg">Nigeria Life</span>
          </Link>
          <h1 className="heading-display text-display-lg mb-2">Reset Your Password</h1>
          <p className="text-body text-muted-text">
            Enter the email address for your account and we'll send a reset link.
          </p>
        </div>

        <div className="card space-y-6">
          {sent ? (
            <div className="space-y-4 text-center py-4" role="status">
              <div className="text-4xl" aria-hidden="true">📧</div>
              <h2 className="font-display font-bold text-lg text-warm-ivory">Check your inbox</h2>
              <p className="text-body-sm text-muted-text">
                If an account exists for <span className="text-warm-ivory">{email.trim()}</span>, a password reset
                link has been sent. It may take a few minutes to arrive.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={e => {
                  setEmail(e.target.value)
                  if (fieldError) setFieldError('')
                }}
                placeholder="you@example.com"
                autoComplete="email"
                required
                disabled={submitting}
                error={fieldError || undefined}
              />

              <Button type="submit" className="w-full" size="lg" loading={submitting}>
                Send Reset Link
              </Button>
            </form>
          )}
        </div>

        <p className="mt-6 text-center text-body-sm text-muted-text">
          Remembered it? <Link to="/login" className="link">Back to sign in</Link>
        </p>
      </div>
    </div>
  )
}
