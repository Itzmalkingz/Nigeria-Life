import { InputHTMLAttributes, forwardRef, useState } from 'react'

interface PasswordInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  variant?: 'default' | 'auth'
}

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d="M3 3l18 18" strokeLinecap="round" />
      <path d="M10.6 6.1A10.7 10.7 0 0 1 12 6c6 0 9.5 6 9.5 6a17.6 17.6 0 0 1-3.1 3.8M6.3 7.8A17.5 17.5 0 0 0 2.5 12S6 18 12 18a10.7 10.7 0 0 0 4-.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" strokeLinecap="round" />
    </svg>
  )
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label, error, helperText, variant = 'default', className = '', id, ...props }, ref) => {
    const [visible, setVisible] = useState(false)
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
    const controlClass =
      variant === 'auth' ? 'auth-input pr-12' : 'input pr-12'
    const labelClass = variant === 'auth' ? 'auth-label' : 'label'

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className={labelClass}>
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type={visible ? 'text' : 'password'}
            className={`${controlClass} ${error ? 'border-life-red focus:border-life-red focus:ring-life-red/20' : ''} ${className}`}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
            {...props}
          />
          <button
            type="button"
            onClick={() => setVisible(v => !v)}
            className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-control text-text-dim transition-colors hover:text-warm-ivory focus:outline-none focus-visible:text-choice-blue"
            aria-label={visible ? 'Hide password' : 'Show password'}
            aria-pressed={visible}
            tabIndex={0}
          >
            <EyeIcon open={visible} />
          </button>
        </div>
        {error && (
          <p id={`${inputId}-error`} className="mt-1.5 text-body-sm text-life-red" role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${inputId}-helper`} className="mt-1.5 text-body-sm text-text-dim">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

PasswordInput.displayName = 'PasswordInput'
