import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'
import Logo from '../components/Logo'
import './landing.css'
import './landing-globe.css'

// Reveal-on-scroll hook with reduced-motion respect
function useReveal<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true)
      return
    }
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.unobserve(node)
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return { ref, visible }
}

// Smooth scroll helper
const scrollToId = (id: string) => {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

// ---------- Section components ----------

function NavSection() {
  return (
    <nav className="landing-nav" aria-label="Primary">
      <Link to="/" className="landing-nav-logo" aria-label="Life in Africa Home">
        <Logo className="w-8 h-8" />
        <span className="nav-logo-text">Life in Africa</span>
      </Link>
      <div className="landing-nav-links">
        <button className="landing-nav-btn" onClick={() => scrollToId('world')}>Continental World</button>
        <button className="landing-nav-btn" onClick={() => scrollToId('paths')}>Life Paths</button>
        <button className="landing-nav-btn" onClick={() => scrollToId('systems')}>Interlocking Systems</button>
        <button className="landing-nav-btn" onClick={() => scrollToId('day')}>Daily Life</button>
        <button className="landing-nav-btn" onClick={() => scrollToId('vision')}>Legacy & Future</button>
      </div>
      <div className="landing-nav-actions">
        <Link to="/login" className="nav-btn-ghost">Sign In</Link>
        <Link to="/signup" className="nav-btn-primary">Start Your Life</Link>
      </div>
    </nav>
  )
}

function HeroSection() {
  return (
    <section id="hero" className="landing-hero">
      <div className="landing-hero-overlay">
        <div className="hero-globe-container" aria-hidden="true">
          <div className="hero-globe">
            <div className="globe-sphere" />
            <div className="globe-continents">
              <div className="africa-continent-shape" />
              <div className="globe-grid-lat" />
              <div className="globe-grid-lon" />
            </div>
            <div className="globe-atmosphere" />
            <div className="globe-orbit-ring" />
            <div className="globe-pulse-dot" style={{ top: '42%', left: '48%' }} title="Lagos" />
            <div className="globe-pulse-dot" style={{ top: '50%', left: '58%' }} title="Nairobi" />
            <div className="globe-pulse-dot" style={{ top: '75%', left: '54%' }} title="Johannesburg" />
            <div className="globe-pulse-dot" style={{ top: '30%', left: '55%' }} title="Cairo" />
          </div>
        </div>
        <div className="hero-heat-glow" />
        <div className="hero-dust" />
      </div>
      <div className="hero-grid">
        <div className="hero-cell" />
        <div className="hero-cell" />
        <div className="hero-cell" />
        <div className="hero-cell" />
      </div>
      <div className="landing-hero-content">
        <div className="hero-badge reveal-fade">
          <span className="hero-badge-dot" aria-hidden="true" />
          <span>An Original Continental Life Simulation • 18+</span>
        </div>
        <h1 className="hero-title reveal-fade">
          One beginning.{' '}
          <span className="hero-title-red">Many choices.</span>{' '}
          <span className="hero-title-blue">One life.</span>
        </h1>
        <p className="hero-subtitle reveal-fade">
          Build your story in a living, systemic African world. Navigate work, commerce, relationships, informal economies, and unexpected turning points where every decision echoes.
        </p>
        <div className="hero-cta reveal-fade">
          <Link to="/signup" className="hero-btn-primary">
            Create Your Character
            <span className="hero-btn-arrow" aria-hidden="true">→</span>
          </Link>
          <Link to="/demo" className="hero-btn-secondary">
            Explore Prototype
          </Link>
        </div>
        <div className="hero-meta reveal-fade">
          <span className="hero-metric">
            <span className="hero-metric-num">Adults 18+</span>
            <span className="hero-metric-label">Consequences & Depth</span>
          </span>
          <span className="hero-metric">
            <span className="hero-metric-num">Browser First</span>
            <span className="hero-metric-label">No download required</span>
          </span>
        </div>
      </div>
      <div className="hero-divider" />
      <div className="hero-scroll">
        <span className="hero-scroll-text">Scroll to explore</span>
        <div className="hero-wheel" />
      </div>
    </section>
  )
}

function WorldSection() {
  const { ref, visible } = useReveal()
  const cards = [
  {
      tag: 'Living Environments',
      title: 'Vibrant African Cities',
      desc: 'Starting in Lagos and expanding across continental hubs. From bustling commercial markets to tech districts and quiet neighborhoods, every destination pulses with local atmosphere.',
    },
    {
      tag: 'NPCs with Memory',
      title: 'Characters Who Remember',
      desc: 'Relationships have weight. Shopkeepers, landlords, colleagues, and family members track your reputation, debts, and past kindnesses across time.',
    },
    {
      tag: 'Real Consequences',
      title: 'A World That Keeps a Ledger',
      desc: 'Rent is due weekly. Informal loans compound. Shortcuts carry legal and social risks. The simulation remembers your choices long after you make them.',
    },
  ]

  return (
    <section id="world" ref={ref} className="landing-section landing-section--world">
      <div className="landing-section-inner">
        <div className="reveal-fade">
          <span className="section-tag">Continental World</span>
          <h2 className="section-title">An authentic African simulation that lives and breathes.</h2>
          <p className="section-subtitle">
            Life in Africa isn't a static map or a series of disconnected minigames. It is an interconnected socio-economic ecosystem where culture, commerce, transport, and community dynamics shape your trajectory.
          </p>
        </div>
        <div className="cards-3">
          {cards.map((c, i) => (
            <article
              key={i}
              className={`card-reveal card-3 ${visible ? 'is-visible' : ''}`}
              style={{ '--card-delay': `${i * 120}ms` } as React.CSSProperties}
            >
              <span className="card-tag">{c.tag}</span>
              <h3>{c.title}</h3>
              <p>{c.desc}</p>
              <div className="card-bg-glow" aria-hidden="true" />
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function PathsSection() {
  const { ref, visible } = useReveal()
  const paths = [
    {
      title: 'The Corporate Ladder',
      desc: 'Climb through office politics, rigorous shift schedules, performance reviews, boardrooms, and professional promotions.',
      accent: 'choice-blue',
      stat: 'Professional track',
      statDesc: 'Skill-gated career growth',
    },
    {
      title: 'The Hustler & Entrepreneur',
      desc: 'Start small from your room. Side gigs, freelance gigs, trading in bustling markets, or registering your own business.',
      accent: 'earth',
      stat: 'Independent hustle',
      statDesc: 'Flexible schedules & scale',
    },
    {
      title: 'The Property Investor',
      desc: 'Build passive income through real estate, land banking in developing corridors, and managing rental properties.',
      accent: 'earth',
      stat: 'Asset accumulation',
      statDesc: 'Long-term wealth building',
    },
    {
      title: 'The Risky Shortcut',
      desc: 'Pursue high-risk opportunities for fast cash. Beware of investigations, evidence trails, and severe legal consequences.',
      accent: 'life-red',
      stat: 'Reputation & risk',
      statDesc: 'Consequences catch up',
    },
  ]

  return (
    <section id="paths" ref={ref} className="landing-section landing-section--paths">
      <div className="landing-section-inner">
        <div className="reveal-fade">
          <span className="section-tag">Choose Your Path</span>
          <h2 className="section-title">There is no single script. Only your life.</h2>
          <p className="section-subtitle">
            Pursue stability, status, creative freedom, or dangerous shortcuts. The game does not grade your choices — it simply records what you built and how you lived.
          </p>
        </div>
        <div className="paths-grid">
          {paths.map((p, i) => (
            <article
              key={i}
              className={`path-card ${p.accent} ${visible ? 'is-visible' : ''}`}
              style={{ '--card-delay': `${i * 100}ms` } as React.CSSProperties}
            >
              <div className="path-header">
                <span className="path-dot" aria-hidden="true" />
                <h3>{p.title}</h3>
              </div>
              <p>{p.desc}</p>
              <div className="path-meta">
                <span className="path-stat">{p.stat}</span>
                <span className="path-stdesc">{p.statDesc}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function SystemsSection() {
  const { ref, visible } = useReveal()

  return (
    <section id="systems" ref={ref} className="landing-section landing-section--systems">
      <div className="landing-section-inner">
        <div className="reveal-fade">
          <span className="section-tag">Interlocking Systems</span>
          <h2 className="section-title">Every subsystem connects to your daily survival.</h2>
          <p className="section-subtitle">
            Needs drive energy; energy governs work performance; money covers rent and food; relationships unlock opportunities. Nothing happens in isolation.
          </p>
        </div>

        <div className="systems-visual">
          <div className="systems-core">
            <span className="systems-core-dot" aria-hidden="true" />
            <span className="systems-core-label">You</span>
          </div>

          <div className="systems-rings">
            <div className="systems-ring systems-ring-1">
              {['Cash & Bank', 'Rent & Bills', 'Energy'].map((label, i) => (
                <div key={label} className={`system-node system-node-${i}`} title={label}>
                  <span>{label}</span>
                </div>
              ))}
            </div>
            <div className="systems-ring systems-ring-2">
              {['Relationships', 'Reputation', 'Skills'].map((label, i) => (
                <div key={label} className={`system-node system-node-${i}`} title={label}>
                  <span>{label}</span>
                </div>
              ))}
            </div>
            <div className="systems-ring systems-ring-3">
              {['Side Hustles', 'Housing', 'Health'].map((label, i) => (
                <div key={label} className={`system-node system-node-${i}`} title={label}>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="systems-weave">
            {visible && (
              <>
                <span className="system-line" style={{ '--line-delay': '0ms' } as React.CSSProperties} />
                <span className="system-line" style={{ '--line-delay': '80ms' } as React.CSSProperties} />
                <span className="system-line" style={{ '--line-delay': '160ms' } as React.CSSProperties} />
                <span className="system-line" style={{ '--line-delay': '240ms' } as React.CSSProperties} />
                <span className="system-line" style={{ '--line-delay': '320ms' } as React.CSSProperties} />
                <span className="system-line" style={{ '--line-delay': '400ms' } as React.CSSProperties} />
              </>
            )}
          </div>
        </div>

        <div className="systems-cards">
          <div className={`systems-card ${visible ? 'is-visible' : ''}`} style={{ '--card-delay': '0ms' } as React.CSSProperties}>
            <div className="systems-card-num">01</div>
            <h4>Player Agency</h4>
            <p>Meaningful decisions with multiple viable routes to success or failure.</p>
          </div>
          <div className={`systems-card ${visible ? 'is-visible' : ''}`} style={{ '--card-delay': '140ms' } as React.CSSProperties}>
            <div className="systems-card-num">02</div>
            <h4>Persistent Simulation</h4>
            <p>Time advances logically, respecting schedules, shift hours, and weekly rent cycles.</p>
          </div>
          <div className={`systems-card ${visible ? 'is-visible' : ''}`} style={{ '--card-delay': '280ms' } as React.CSSProperties}>
            <div className="systems-card-num">03</div>
            <h4>Server-Authoritative</h4>
            <p>Financial transactions, balance changes, and core rules are validated securely server-side.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

function DaySection() {
  const { ref, visible } = useReveal()
  const moments = [
    {
      time: '06:00',
      title: 'Morning Routine',
      desc: 'Wake up, check energy and hunger needs. Plan transport and transit costs before the morning rush begins.',
    },
    {
      time: '10:30',
      title: 'Work & Hustle',
      desc: 'Attend your shift or take on freelance gigs. Balance professional duties with unexpected social requests.',
    },
    {
      time: '14:00',
      title: 'Afternoon Pressures',
      desc: 'Manage bills, respond to phone messages from family or contacts, and evaluate investment opportunities.',
    },
    {
      time: '19:30',
      title: 'Evening & Recovery',
      desc: 'Return home to rest, socialize at local venues, or plan tomorrow’s strategy.',
    },
  ]

  return (
    <section id="day" ref={ref} className="landing-section landing-section--day">
      <div className="landing-section-inner">
        <div className="reveal-fade">
          <span className="section-tag">A Day In Your Life</span>
          <h2 className="section-title">Navigate time with purpose.</h2>
          <p className="section-subtitle">
            Every action consumes time and energy. Plan your schedule wisely to avoid burnout and financial shortfalls.
          </p>
        </div>

        <div className="day-track">
          <div className={`day-track-bg ${visible ? 'is-visible' : ''}`} />
          {moments.map((m, i) => (
            <div
              key={m.time}
              className={`day-item ${visible ? 'is-visible' : ''}`}
              style={{ '--day-delay': `${i * 130}ms` } as React.CSSProperties}
            >
              <div className="day-time">{m.time}</div>
              <div className="day-marker" aria-hidden="true" />
              <div className="day-content">
                <div className="day-title">{m.title}</div>
                <p className="day-desc">{m.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function VisionSection() {
  const { ref, visible } = useReveal()
  const items = [
    {
      title: 'Short-Term Goals',
      desc: 'Pay this week’s rent, upgrade your phone, and maintain your daily needs.',
    },
    {
      title: 'Life Ambitions',
      desc: 'Advance your career, build lasting relationships, acquire property, and establish a thriving business.',
    },
    {
      title: 'Generational Legacy',
      desc: 'Build assets and reputation that outlast your character, opening doors for future family progression.',
    },
  ]

  return (
    <section id="vision" ref={ref} className="landing-section landing-section--vision">
      <div className="landing-section-inner">
        <div className="reveal-fade">
          <span className="section-tag">Legacy & Future</span>
          <h2 className="section-title">Think beyond today.</h2>
          <p className="section-subtitle">
            Short-term expediency creates long-term consequences. Build a sustainable foundation or risk losing everything you worked for.
          </p>
        </div>
        <div className="vision-cards">
          {items.map((v, i) => (
            <div
              key={v.title}
              className={`vision-card ${visible ? 'is-visible' : ''}`}
              style={{ '--card-delay': `${i * 140}ms` } as React.CSSProperties}
            >
              <span className="vision-ring" aria-hidden="true" />
              <h3>{v.title}</h3>
              <p>{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function BrandSection() {
  const { ref } = useReveal<HTMLElement>()

  return (
    <section id="brand" ref={ref} className="landing-section landing-section--brand">
      <div className="landing-section-inner">
        <div className="brand-branch-bg" aria-hidden="true">
          <div className="brand-branch-root" />
          <div className="brand-branch-1" />
          <div className="brand-branch-2" />
          <div className="brand-branch-3" />
          <div className="brand-branch-4" />
          <div className="brand-branch-5" />
        </div>
        <div className="brand-content reveal-fade">
          <svg
            className="brand-logo-svg"
            viewBox="0 0 200 120"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="branchGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F0443E" />
                <stop offset="100%" stopColor="#8A6048" />
              </linearGradient>
            </defs>
            <path
              d="M30 100 C 30 60, 70 60, 90 60 C 110 60, 130 40, 150 40 C 170 40, 190 10, 190 10"
              fill="none"
              stroke="url(#branchGrad)"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <circle cx="30" cy="100" r="5" fill="#F0443E" />
            <circle cx="90" cy="60" r="5" fill="#F0443E" />
            <circle cx="150" cy="40" r="5" fill="#F0443E" />
            <circle cx="190" cy="10" r="6" fill="#2764D8" />
          </svg>
          <h2 className="brand-title">
            One beginning.{' '}
            <span className="brand-title-red">Many choices.</span>{' '}
            <span className="brand-title-blue">One life.</span>
          </h2>
          <p className="brand-subtitle">
            An original, immersive life simulation designed for players who appreciate depth, systemic consequence, and authentic storytelling.
          </p>
          <div className="brand-meta">
            <div className="brand-meta-item">
              <span className="brand-meta-label">Audience</span>
              <span className="brand-meta-value">Adults 18+</span>
            </div>
            <div className="brand-meta-item">
              <span className="brand-meta-label">Platform</span>
              <span className="brand-meta-value">Browser Game</span>
            </div>
            <div className="brand-meta-item">
              <span className="brand-meta-label">Model</span>
              <span className="brand-meta-value">Free-to-Play</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function CTASection() {
  return (
    <section id="cta" className="landing-section landing-section--cta">
      <div className="landing-section-inner">
        <div className="cta-content reveal-fade">
          <span className="section-tag">Your Next Chapter</span>
          <h2 className="section-title">Your story starts with a single decision.</h2>
          <p className="section-subtitle">
            Create your life today. Free to play, secure persistence, and zero pay-to-win mechanics.
          </p>
          <div className="cta-actions">
            <Link to="/signup" className="cta-btn-primary">
              Create Your Character
              <span className="cta-btn-arrow" aria-hidden="true">→</span>
            </Link>
            <Link to="/demo" className="cta-btn-secondary">
              Try Demo Mode
            </Link>
          </div>
        </div>
        <div className="cta-visual" aria-hidden="true">
          <div className="cta-ring" />
          <div className="cta-ring cta-ring-2" />
          <div className="cta-ring cta-ring-3" />
        </div>
      </div>
    </section>
  )
}

// ---------- Main ----------

export default function LandingPage() {
  return (
    <article className="landing-page">
      <a
        href="#hero"
        className="skip-link"
        onClick={e => {
          e.preventDefault()
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }}
      >
        Skip to content
      </a>
      <div className="landing-page-inner">
        <NavSection />
        <HeroSection />
        <WorldSection />
        <PathsSection />
        <SystemsSection />
        <DaySection />
        <VisionSection />
        <BrandSection />
        <CTASection />
      </div>
      <Footer />
    </article>
  )
}
