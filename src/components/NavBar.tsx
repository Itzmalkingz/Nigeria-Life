import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../lib/auth'

const navSections = [
  {
    label: 'World',
    items: [
      { path: '/game', label: 'Dashboard', icon: '🏠' },
      { path: '/map', label: 'Map', icon: '🗺️' },
      { path: '/locations', label: 'Locations', icon: '📍' },
    ],
  },
  {
    label: 'Life',
    items: [
      { path: '/phone', label: 'Phone', icon: '📱' },
      { path: '/skills', label: 'Skills', icon: '🧠' },
      { path: '/goals', label: 'Goals', icon: '🎯' },
      { path: '/relationships', label: 'Relationships', icon: '👥' },
    ],
  },
  {
    label: 'Progress',
    items: [
      { path: '/stats', label: 'Statistics', icon: '📊' },
      { path: '/achievements', label: 'Achievements', icon: '🏆' },
      { path: '/history', label: 'History', icon: '📜' },
    ],
  },
]

export default function NavBar() {
  const { user, loading } = useAuth()
  const location = useLocation()
  const [openSection, setOpenSection] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  if (loading || !user) {
    return (
      <nav className="h-12 bg-navy/30 border-b border-navy/20" aria-hidden="true">
        <div className="container-game h-full flex items-center justify-between">
          <div className="flex-1" />
          <div className="flex items-center gap-4 px-4">
            <div className="w-24 h-8 bg-dark-bg rounded-brand animate-pulse" />
            <div className="w-24 h-8 bg-dark-bg rounded-brand animate-pulse" />
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="bg-navy/30 border-b border-navy/20" aria-label="Game navigation">
      <div className="container-game">
        <div className="flex h-12 items-center justify-between gap-4">
          <div className="flex-1 flex items-center gap-1 overflow-x-auto pb-1 scrollbar-hide" role="tablist">
            {navSections.map((section) => (
              <div key={section.label} className="relative">
                <button
                  role="tab"
                  aria-selected={openSection === section.label}
                  aria-controls={`${section.label}-panel`}
                  id={`${section.label}-tab`}
                  onClick={() => setOpenSection(openSection === section.label ? null : section.label)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-brand text-body-sm font-medium whitespace-nowrap transition-all duration-brand ${
                    openSection === section.label
                      ? 'bg-life-red/10 text-life-red'
                      : 'text-muted-text hover:text-warm-ivory hover:bg-navy/30'
                  }`}
                >
                  <span>{section.label}</span>
                  <span className="text-xs transition-transform duration-brand" style={{ transform: openSection === section.label ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                    ▼
                  </span>
                </button>

                {openSection === section.label && (
                  <div
                    id={`${section.label}-panel`}
                    role="tabpanel"
                    aria-labelledby={`${section.label}-tab`}
                    className="absolute left-0 top-full z-50 mt-1 min-w-[180px] bg-navy border border-navy/30 rounded-brand-lg shadow-brand-lg overflow-hidden animate-slide-up"
                  >
                    {section.items.map(item => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center gap-2 px-3 py-2 text-body-sm transition-colors ${
                          location.pathname === item.path
                            ? 'bg-life-red/10 text-life-red'
                            : 'text-warm-ivory hover:bg-life-red/5 hover:text-life-red'
                        }`}
                        onClick={() => setOpenSection(null)}
                      >
                        <span aria-hidden="true">{item.icon}</span>
                        <span>{item.label}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              className="md:hidden btn-ghost p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label="Toggle menu"
            >
              <span className="text-xl" aria-hidden="true">{mobileMenuOpen ? '✕' : '☰'}</span>
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div id="mobile-menu" className="md:hidden py-4 border-t border-navy/20 animate-slide-up">
            <div className="space-y-3">
              {navSections.map(section => (
                <div key={section.label} className="space-y-1">
                  <h3 className="px-2 text-caption font-semibold text-muted-text uppercase tracking-wider">{section.label}</h3>
                  {section.items.map(item => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-3 px-3 py-2 rounded-brand text-body transition-colors ${
                        location.pathname === item.path
                          ? 'bg-life-red/10 text-life-red'
                          : 'text-warm-ivory hover:bg-life-red/5 hover:text-life-red'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span aria-hidden="true" className="text-lg">{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}