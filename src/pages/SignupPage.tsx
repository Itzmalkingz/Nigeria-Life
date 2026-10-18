import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { Button, Input } from '../components/ui'
import OAuthButtons from '../components/OAuthButtons'

export default function SignupPage() {
  const navigate = useNavigate()
  const { signUp, loading } = useAuth()
  const [formData, setFormData] = useState({
    displayName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitError, setSubmitError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'displayName':
        if (!value.trim()) return 'Display name is required'
        if (value.trim().length < 2) return 'Display name must be at least 2 characters'
        return ''
      case 'username':
        if (!value.trim()) return 'Username is required'
        if (!/^[a-zA-Z0-9_]{3,20}$/.test(value)) return '3-20 characters: letters, numbers, underscore only'
        return ''
      case 'email':
        if (!value.trim()) return 'Email is required'
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Enter a valid email address'
        return ''
      case 'password':
        if (!value) return 'Password is required'
        if (value.length < 8) return 'Password must be at least 8 characters'
        return ''
      case 'confirmPassword':
        if (!value) return 'Confirm your password'
        if (value !== formData.password) return 'Passwords do not match'
        return ''
      default:
        return ''
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }))
    if (submitError) setSubmitError('')
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: Record<string, string> = {}
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key as keyof typeof formData])
      if (error) newErrors[key] = error
    })

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setSubmitError('')
    setSubmitted(true)

    try {
      const { error } = await signUp(formData.email, formData.password, formData.username, formData.displayName)
      if (error) {
        setSubmitError(error.message)
        setSubmitted(false)
      } else {
        navigate('/game', { replace: true })
      }
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : 'Something went wrong creating your account. Please try again.'
      )
      setSubmitted(false)
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
          <h1 className="heading-display text-display-lg mb-2">Start Your Life</h1>
          <p className="text-body text-muted-text">Free to play. 18+ only. No download required.</p>
        </div>

        <div className="card space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <Input
              label="Display Name"
              name="displayName"
              type="text"
              value={formData.displayName}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Chinedu"
              autoComplete="name"
              required
              disabled={loading || submitted}
              error={errors.displayName}
            />

            <Input
              label="Username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="chinedu_99"
              autoComplete="username"
              required
              disabled={loading || submitted}
              error={errors.username}
              helperText="3-20 characters: letters, numbers, underscore"
            />

            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="chinedu@example.com"
              autoComplete="email"
              required
              disabled={loading || submitted}
              error={errors.email}
            />

            <Input
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="••••••••"
              autoComplete="new-password"
              required
              disabled={loading || submitted}
              error={errors.password}
              helperText="At least 8 characters"
            />

            <Input
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="••••••••"
              autoComplete="new-password"
              required
              disabled={loading || submitted}
              error={errors.confirmPassword}
            />

            {submitError && (
              <div className="p-3 rounded-brand bg-life-red/10 border border-life-red/20 text-life-red text-body-sm" role="alert">
                {submitError}
              </div>
            )}

            <Button type="submit" className="w-full" size="lg" loading={loading || submitted}>
              Create Account
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-navy/30" />
            </div>
            <div className="relative flex justify-center text-body-sm">
              <span className="bg-navy/50 px-4 text-muted-text">Or sign up with</span>
            </div>
          </div>

          <OAuthButtons disabled={loading || submitted} />

          <p className="text-center text-caption text-muted-text">
            By creating an account, you agree to our{' '}
            <Link to="/terms" className="link">Terms of Use</Link>{' '}
            and{' '}
            <Link to="/privacy" className="link">Privacy Policy</Link>
            . You confirm you are 18 or older.
          </p>
        </div>

        <p className="mt-6 text-center text-body-sm text-muted-text">
          Already have an account? <Link to="/login" className="link">Sign in</Link>
        </p>
      </div>
    </div>
  )
}