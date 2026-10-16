import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { supabase } from '../lib/supabase'
import { Button, Input } from '../components/ui'

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

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              className="btn-outline flex items-center justify-center gap-2"
              disabled={loading}
              onClick={async () => {
                await supabase.auth.signInWithOAuth({
                  provider: 'facebook',
                  options: { redirectTo: `${window.location.origin}/game` }
                })
              }}
            >
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              Facebook
            </button>
            <button
              type="button"
              className="btn-outline flex items-center justify-center gap-2"
              disabled={loading}
              onClick={async () => {
                await supabase.auth.signInWithOAuth({
                  provider: 'google',
                  options: { redirectTo: `${window.location.origin}/game` }
                })
              }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Google
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-body-sm text-muted-text">
          New here? <Link to="/signup" className="link">Create an account</Link>
        </p>
      </div>
    </div>
  )
}