import { Suspense, lazy } from 'react'
import { Link } from 'react-router-dom'
import Logo from '../components/Logo'
import { useAuth } from '../lib/auth'
import './landing.css'

const LandingWorld = lazy(() => import('../components/LandingWorld'))

export default function LandingPage() {
  const { user } = useAuth()
  const primaryHref = user ? '/game' : '/signup'
  const primaryLabel = user ? 'Continue your life' : 'Play Life in Africa'

  return (
    <main className="landing-life">
      <a href="#hero" className="landing-skip">
        Skip to content
      </a>

      <div className="landing-world-layer" aria-hidden="true">
        <Suspense fallback={<div className="landing-world-skeleton" />}>
          <LandingWorld />
        </Suspense>
      </div>
      <div className="landing-veil" aria-hidden="true" />

      <div className="relative z-10 flex min-h-[100dvh] flex-col">
        <header className="landing-header">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
            <Link
              to="/"
              className="landing-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-choice-blue/50"
              aria-label="Life in Africa home"
            >
              <Logo className="h-8 w-8" />
              <span className="landing-brand-text">Life in Africa</span>
            </Link>

            <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
              <Link to="/world" className="landing-nav-link">The world</Link>
              <Link to="/features" className="landing-nav-link">Features</Link>
              <Link to="/roadmap" className="landing-nav-link">Roadmap</Link>
              <Link to="/demo" className="landing-nav-link">Prototype</Link>
            </nav>

            <div className="flex items-center gap-2">
              {user ? (
                <span className="landing-signed-in" title="Signed in">
                  <span className="landing-signed-in-dot" aria-hidden="true" />
                  <span className="hidden sm:inline">Signed in</span>
                </span>
              ) : (
                <Link to="/login" className="landing-nav-link landing-nav-link--button">
                  Log in
                </Link>
              )}
              <Link to={primaryHref} className="landing-header-play">
                Play
              </Link>
            </div>
          </div>
        </header>

        <section id="hero" className="landing-hero">
          <div className="landing-hero-badge">
            <span className="landing-hero-badge-dot" aria-hidden="true" />
            An original African life simulation &middot; 18+
          </div>

          <h1 className="landing-hero-title">
            One beginning.{' '}
            <span className="text-life-red">Many choices.</span>{' '}
            <span className="text-choice-blue">One life.</span>
          </h1>

          <p className="landing-hero-sub">
            Start with a home in Mushin, Lagos. Work, hustle, build relationships, and live
            with every consequence in a persistent world that remembers.
          </p>
        </section>

        <div className="landing-hero-spacer" aria-hidden="true" />

        <section className="landing-panel-wrap" aria-label="Get started">
          <div className="landing-panel">
            <h2 className="landing-panel-title">
              {user ? 'Welcome back' : 'Your story starts here'}
            </h2>
            <p className="landing-panel-copy">
              {user
                ? 'Your life is exactly where you left it.'
                : 'Free to play. No download. One persistent life per account.'}
            </p>

            <Link to={primaryHref} className="landing-btn landing-btn--primary">
              {primaryLabel}
              <span aria-hidden="true">&rarr;</span>
            </Link>

            {!user && (
              <Link to="/login" className="landing-btn landing-btn--secondary">
                I already have an account
              </Link>
            )}

            <Link to="/demo" className="landing-btn landing-btn--ghost">
              Try the prototype
            </Link>

            <p className="landing-panel-meta">
              Adults 18+ &middot; Browser based &middot; Progress saved securely
            </p>
          </div>
        </section>

        <footer className="landing-footer">
          <p>&copy; {new Date().getFullYear()} Life in Africa</p>
          <nav className="flex flex-wrap items-center gap-x-4 gap-y-1" aria-label="Footer">
            <Link to="/about" className="landing-footer-link">About</Link>
            <Link to="/faq" className="landing-footer-link">FAQ</Link>
            <Link to="/terms" className="landing-footer-link">Terms</Link>
            <Link to="/privacy" className="landing-footer-link">Privacy</Link>
          </nav>
        </footer>
      </div>
    </main>
  )
}
