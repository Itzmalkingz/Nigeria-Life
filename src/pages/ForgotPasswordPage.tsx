import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { Button, Input } from '../components/ui'
import AuthShell from '../components/AuthShell'

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
    <AuthShell
      title="Reset your password"
      tagline="We'll email you a secure link to choose a new one."
    >
      {sent ? (
        <div className="space-y-4 text-center py-2" role="status">
          <div
            className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-success/30 bg-success/10 text-success"
            aria-hidden="true"
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="m4 7 8 6 8-6M4 6h16v12H4z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h2 className="font-display text-lg font-semibold text-warm-ivory">Check your inbox</h2>
          <p className="text-body-sm text-text-dim">
            If an account exists for <span className="text-warm-ivory">{email.trim()}</span>, a password reset
            link is on its way. It may take a few minutes to arrive.
          </p>
          <Link
            to="/login"
            className="inline-block text-body-sm font-medium text-choice-blue hover:text-choice-blue/80"
          >
            Back to log in
          </Link>
        </div>
      ) : (
        <>
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <Input
              variant="auth"
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

            <Button
              type="submit"
              variant="secondary"
              size="lg"
              className="w-full rounded-control"
              loading={submitting}
            >
              Send reset link
            </Button>
          </form>

          <p className="mt-6 text-center text-body-sm text-text-dim">
            Remembered it?{' '}
            <Link to="/login" className="font-medium text-choice-blue hover:text-choice-blue/80">
              Back to log in
            </Link>
          </p>
        </>
      )}
    </AuthShell>
  )
}
