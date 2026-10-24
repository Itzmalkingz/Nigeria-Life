import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  /** Visual style: 'default' for in-game screens, 'auth' for the auth experience. */
  variant?: 'default' | 'auth'
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, variant = 'default', className = '', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
    const controlClass = variant === 'auth' ? 'auth-input' : 'input'
    const labelClass = variant === 'auth' ? 'auth-label' : 'label'

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className={labelClass}>
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`${controlClass} ${error ? 'border-life-red focus:border-life-red focus:ring-life-red/20' : ''} ${className}`}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          {...props}
        />
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

Input.displayName = 'Input'
