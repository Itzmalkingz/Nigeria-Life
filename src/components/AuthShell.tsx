import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import Logo from './Logo'

interface AuthShellProps {
  /** Highlights the matching tab. Omit to hide the Log in / Create account switch. */
  mode?: 'login' | 'signup'
  title: string
  tagline: string
  children: ReactNode
}

/**
 * Shared dark-navy authentication layout: back link, centred brand, heading,
 * segmented Log in / Create account control, and a compact glass panel.
 */
export default function AuthShell({ mode, title, tagline, children }: AuthShellProps) {
  return (
    <main className="auth-shell">
      <div className="relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-md flex-col px-4 py-6 sm:py-8">
        <div className="flex items-center">
          <Link to="/" className="auth-link inline-flex items-center gap-1.5">
            <span aria-hidden="true">&larr;</span>
            Back to Life in Africa
          </Link>
        </div>

        <div className="flex flex-1 flex-col justify-center py-8">
          <div className="mb-8 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2.5 rounded-control focus:outline-none focus-visible:ring-2 focus-visible:ring-choice-blue/50"
              aria-label="Life in Africa home"
            >
              <Logo className="h-10 w-10" />
              <span className="font-display text-[1.35rem] font-semibold tracking-tight text-warm-ivory">
                Life in Africa
              </span>
            </Link>
            <h1 className="mt-6 font-display text-[1.75rem] font-semibold tracking-tight text-warm-ivory">
              {title}
            </h1>
            <p className="mt-2 text-body-sm text-text-dim">{tagline}</p>
          </div>

          <div className="auth-panel">
            {mode && (
              <nav
                className="mb-6 flex gap-1 rounded-control border border-edge bg-abyss/60 p-1"
                aria-label="Authentication"
              >
                <Link
                  to="/login"
                  aria-current={mode === 'login' ? 'page' : undefined}
                  className={`auth-tab ${mode === 'login' ? 'auth-tab-active' : 'auth-tab-idle'}`}
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  aria-current={mode === 'signup' ? 'page' : undefined}
                  className={`auth-tab ${mode === 'signup' ? 'auth-tab-active' : 'auth-tab-idle'}`}
                >
                  Create account
                </Link>
              </nav>
            )}

            {children}
          </div>

          <p className="mt-6 text-center text-caption text-text-dim">
            Adults 18+ &middot; Fictional simulation &middot; Progress saved securely
          </p>
        </div>
      </div>
    </main>
  )
}
