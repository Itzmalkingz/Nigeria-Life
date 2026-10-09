import { ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, disabled, children, className = '', ...props }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center gap-2 rounded-brand font-body font-medium transition-all duration-brand ease-brand focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-bg disabled:opacity-50 disabled:cursor-not-allowed'

    const variantClasses = {
      primary: 'bg-life-red text-warm-ivory hover:bg-life-red/90 active:bg-life-red/100 focus:ring-life-red',
      secondary: 'bg-choice-blue text-warm-ivory hover:bg-choice-blue/90 active:bg-choice-blue/100 focus:ring-choice-blue',
      ghost: 'bg-transparent text-warm-ivory hover:bg-navy/50 active:bg-navy/70 focus:ring-navy',
      outline: 'border-2 border-navy text-navy hover:bg-navy/10 active:bg-navy/20 focus:ring-navy dark:border-choice-blue dark:text-choice-blue dark:hover:bg-choice-blue/10',
    }

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-body-sm',
      md: 'px-5 py-3 text-body',
      lg: 'px-7 py-4 text-body-lg',
    }

    return (
      <button
        ref={ref}
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'