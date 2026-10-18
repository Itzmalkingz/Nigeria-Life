import { useState } from 'react'
import { useAuth } from '../lib/auth'

type Provider = 'google' | 'facebook'

export default function OAuthButtons({ disabled = false }: { disabled?: boolean }) {
  const { signInWithOAuth } = useAuth()
  const [pending, setPending] = useState<Provider | null>(null)
  const [error, setError] = useState('')

  const handleClick = async (provider: Provider) => {
    if (pending || disabled) return
    setError('')
    setPending(provider)
    const { error: oauthError } = await signInWithOAuth(provider)
    // On success the browser is redirected to the provider; only a failure
    // resolves back here, so re-enable the buttons and show the reason.
    if (oauthError) {
      setError(oauthError.message)
      setPending(null)
    }
  }

  const busy = disabled || pending !== null

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          className="btn-outline flex items-center justify-center gap-2"
          disabled={busy}
          aria-label="Continue with Google"
          onClick={() => handleClick('google')}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          {pending === 'google' ? 'Connecting…' : 'Google'}
        </button>

        <button
          type="button"
          className="btn-outline flex items-center justify-center gap-2"
          disabled={busy}
          aria-label="Continue with Facebook"
          onClick={() => handleClick('facebook')}
        >
          <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          {pending === 'facebook' ? 'Connecting…' : 'Facebook'}
        </button>
      </div>

      {error && (
        <div className="p-3 rounded-brand bg-life-red/10 border border-life-red/20 text-life-red text-body-sm" role="alert">
          {error}
        </div>
      )}
    </div>
  )
}
