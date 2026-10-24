import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { Button, Input, PasswordInput } from '../components/ui'
import OAuthButtons from '../components/OAuthButtons'
import AuthShell from '../components/AuthShell'

export default function LoginPage() {
  const navigate = useNavigate()
  const { signIn, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitted(true)

    const { error: authError } = await signIn(email, password)
    if (authError) {
      setError(authError.message)
      setSubmitted(false)
    } else {
      navigate('/game', { replace: true })
    }
  }

  return (
    <AuthShell mode="login" title="Welcome back" tagline="Pick up the life you left behind.">
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <Input
          variant="auth"
          label="Email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          required
          disabled={loading || submitted}
          error={error && !email ? 'Email is required' : undefined}
        />

        <div>
          <PasswordInput
            variant="auth"
            label="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Your password"
            autoComplete="current-password"
            required
            disabled={loading || submitted}
            error={error && !password ? 'Password is required' : undefined}
          />
          <div className="mt-2 text-right">
            <Link to="/forgot-password" className="auth-link">
              Forgot password?
            </Link>
          </div>
        </div>

        {error && (
          <div className="auth-alert-error" role="alert">
            {error}
          </div>
        )}

        <Button
          type="submit"
          variant="secondary"
          size="lg"
          className="w-full rounded-control"
          loading={loading || submitted}
        >
          Log in
        </Button>
      </form>

      <div className="auth-divider">
        <span>or continue with</span>
      </div>

      <OAuthButtons disabled={loading || submitted} />

      <p className="mt-6 text-center text-body-sm text-text-dim">
        New here?{' '}
        <Link to="/signup" className="font-medium text-choice-blue hover:text-choice-blue/80">
          Create an account
        </Link>
      </p>
    </AuthShell>
  )
}
