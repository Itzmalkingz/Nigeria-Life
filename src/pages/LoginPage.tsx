import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { Button, Input } from '../components/ui'
import OAuthButtons from '../components/OAuthButtons'

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
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-dark-bg">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-warm-ivory hover:text-life-red transition-colors mb-6" aria-label="Nigeria Life Home">
            <span className="text-3xl" aria-hidden="true">🌿</span>
            <span className="font-display font-bold text-display-lg">Nigeria Life</span>
          </Link>
          <h1 className="heading-display text-display-lg mb-2">Welcome Back</h1>
          <p className="text-body text-muted-text">Sign in to continue your life</p>
        </div>

        <div className="card space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <Input
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
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
                disabled={loading || submitted}
                error={error && !password ? 'Password is required' : undefined}
              />
              <div className="mt-2 text-right">
                <Link to="/forgot-password" className="link text-body-sm">
                  Forgot password?
                </Link>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-brand bg-life-red/10 border border-life-red/20 text-life-red text-body-sm" role="alert">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" size="lg" loading={loading || submitted}>
              Sign In
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-navy/30" />
            </div>
            <div className="relative flex justify-center text-body-sm">
              <span className="bg-navy/50 px-4 text-muted-text">Or continue with</span>
            </div>
          </div>

          <OAuthButtons disabled={loading || submitted} />
        </div>

        <p className="mt-6 text-center text-body-sm text-muted-text">
          New here? <Link to="/signup" className="link">Create an account</Link>
        </p>
      </div>
    </div>
  )
}