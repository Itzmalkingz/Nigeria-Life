import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { formatKoboCompact } from '../utils/format'
import { useState, useEffect } from 'react'
import Logo from './Logo'

export default function Header({ isLanding = false }: { isLanding?: boolean }) {
  const { user, loading, signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [signingOut, setSigningOut] = useState(false)

  const handleSignOut = async () => {
    if (signingOut) return
    setSigningOut(true)
    try {
      await signOut()
      navigate('/login', { replace: true })
    } finally {
      setSigningOut(false)
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { path: '/game', label: 'Play', icon: '🎮' },
    { path: '/map', label: 'Map', icon: '🗺️' },
    { path: '/phone', label: 'Phone', icon: '📱' },
    { path: '/stats', label: 'Stats', icon: '📊' },
  ]

  const isTransparent = isLanding && !scrolled

  return (
    <header className={`sticky top-0 z-40 transition-all duration-300 ${
      isTransparent
        ? 'bg-transparent'
        : 'bg-dark-bg/95 backdrop-blur-sm border-b border-navy/30'
    }`}>
      <div className="container-game">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 text-warm-ivory hover:text-life-red transition-colors" aria-label="Life in Africa Home">
            <Logo className="w-8 h-8" />
            <span className="font-display font-bold text-display-sm hidden sm:block">Life in Africa</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-brand text-body-sm font-medium transition-all duration-brand ${
                  location.pathname === item.path
                    ? 'bg-life-red/10 text-life-red'
                    : 'text-muted-text hover:text-warm-ivory hover:bg-navy/30'
                }`}
              >
                <span aria-hidden="true">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {loading ? (
              <div className="w-32 h-8 bg-navy/30 rounded-brand animate-pulse" aria-hidden="true" />
            ) : user ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-navy/30 rounded-brand text-body-sm">
                  <span className="text-life-red" aria-hidden="true">💰</span>
                  <span className="font-display font-medium tabular-nums">{formatKoboCompact(1250000)}</span>
                </div>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-navy/30 rounded-brand text-body-sm">
                  <span className="text-choice-blue" aria-hidden="true">🏦</span>
                  <span className="font-display font-medium tabular-nums">{formatKoboCompact(3400000)}</span>
                </div>
                <button className="btn-ghost text-body-sm" onClick={() => void 0}>Profile</button>
                <button
                  className="btn-outline text-body-sm"
                  onClick={handleSignOut}
                  disabled={signingOut}
                >
                  {signingOut ? 'Signing out…' : 'Sign Out'}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-ghost text-body-sm hidden sm:block">Sign In</Link>
                <Link to="/signup" className="btn-primary text-body-sm">Start Your Story</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}