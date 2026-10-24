import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { Button, Input, PasswordInput } from '../components/ui'
import OAuthButtons from '../components/OAuthButtons'
import AuthShell from '../components/AuthShell'

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
    <AuthShell
      mode="signup"
      title="Start your life"
      tagline="One beginning. Many choices. One life."
    >
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <Input
          variant="auth"
          label="Display name"
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
          variant="auth"
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
          variant="auth"
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

        <PasswordInput
          variant="auth"
          label="Password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="At least 8 characters"
          autoComplete="new-password"
          required
          disabled={loading || submitted}
          error={errors.password}
        />

        <PasswordInput
          variant="auth"
          label="Confirm password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Repeat your password"
          autoComplete="new-password"
          required
          disabled={loading || submitted}
          error={errors.confirmPassword}
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
          loading={loading || submitted}
        >
          Create account
        </Button>
      </form>

      <div className="auth-divider">
        <span>or sign up with</span>
      </div>

      <OAuthButtons disabled={loading || submitted} />

      <p className="mt-6 text-center text-caption text-text-dim">
        By creating an account, you agree to our{' '}
        <Link to="/terms" className="text-warm-ivory/80 underline-offset-2 hover:underline">
          Terms of Use
        </Link>{' '}
        and{' '}
        <Link to="/privacy" className="text-warm-ivory/80 underline-offset-2 hover:underline">
          Privacy Policy
        </Link>
        . You confirm you are 18 or older.
      </p>
    </AuthShell>
  )
}
