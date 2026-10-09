import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'
import Logo from '../components/Logo'
import './landing.css'

type VarStyle = CSSProperties & { [key: `--${string}`]: string }

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
      <Link to="/" className="landing-nav-logo" aria-label="Nigeria Life Home">
        <Logo className="w-8 h-8" />
        <span className="nav-logo-text">Nigeria Life</span>
      </Link>
      <div className="landing-nav-links">
        <button className="landing-nav-btn" onClick={() => scrollToId('world')}>The World</button>
        <button className="landing-nav-btn" onClick={() => scrollToId('paths')}>Your Path</button>
        <button className="landing-nav-btn" onClick={() => scrollToId('systems')}>How It Works</button>
        <button className="landing-nav-btn" onClick={() => scrollToId('day')}>A Day</button>
        <button className="landing-nav-btn" onClick={() => scrollToId('vision')}>Long Game</button>
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
          <span>Built for Nigeria. By Nigerians.</span>
        </div>
        <h1 className="hero-title reveal-fade">
          One beginning.{' '}
          <span className="hero-title-red">Many choices.</span>{' '}
          <span className="hero-title-blue">One life.</span>
        </h1>
        <p className="hero-subtitle reveal-fade">
          Build your story in a living Nigerian world. Work, hustle, invest, love, scheme — every choice echoes.
          No two lives unfold the same way.
        </p>
        <div className="hero-cta reveal-fade">
          <Link to="/signup" className="hero-btn-primary">
            Start Your Life Free
            <span className="hero-btn-arrow" aria-hidden="true">→</span>
          </Link>
          <Link to="/demo" className="hero-btn-secondary">
            Try Demo
          </Link>
        </div>
        <div className="hero-meta reveal-fade">
          <span className="hero-metric">
            <span className="hero-metric-num">18+</span>
            <span className="hero-metric-label">Rated • Not for kids</span>
          </span>
          <span className="hero-metric">
            <span className="hero-metric-num">No download</span>
            <span className="hero-metric-label">Play in your browser</span>
          </span>
        </div>
      </div>
      <div className="hero-divider" />
      <div className="hero-scroll">
        <span className="hero-scroll-text">Scroll to begin</span>
        <div className="hero-wheel" />
      </div>
    </section>
  )
}

function WorldSection() {
  const { ref, visible } = useReveal()
  const cards = [
    {
      tag: 'A city that breathes',
      title: 'Lagos',
      desc: 'From the quiet of Lekki to the energy of Ikeja. Danfos rumble past, rooftop goats nap in the rain, and someone is always frying akara at dawn.',
    },
    {
      tag: 'Characters with memories',
      title: 'NPCs that remember',
      desc: 'Mama Nkechi who sold you your first office shirt will remember if you paid on time. Your neighbour recalls the fight from two months ago.',
    },
    {
      tag: 'Your words linger',
      title: 'Consequences are real',
      desc: 'Rent is due Saturday. Loans compound at informal rates. Crime leaves evidence. The world keeps a ledger and eventually it calls in.',
    },
  ]

  return (
    <section id="world" ref={ref} className="landing-section landing-section--world">
      <div className="landing-section-inner">
        <div className="reveal-fade">
          <span className="section-tag">The World</span>
          <h2 className="section-title">A Nigerian city that lives while you don't.</h2>
          <p className="section-subtitle">
            Nigeria Life isn't a checklist of landmarks. It is the daily texture — the heat, the noise, the
            pressure, the small kindnesses — and how it shapes what you can become.
          </p>
        </div>
        <div className="cards-3">
          {cards.map((c, i) => (
            <article
              key={i}
              className={`card-reveal card-3 ${visible ? 'is-visible' : ''}`}
              style={{ '--card-delay': `${i * 120}ms` } as any}
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
      desc: 'Climb into a Murtala Mohammed Airport terminal company. Office politics, promotion fights, boardrooms and broken promises.',
      accent: 'choice-blue',
      stat: 'Office politics',
      statDesc: 'Navigated skill grows',
    },
    {
      title: 'The Hustler',
      desc: 'Data is expensive but ideas are free. Start a side hustle from your room — reselling, design, transport coordination.',
      accent: 'earth',
      stat: 'Side hustles',
      statDesc: 'Unlocks opportunities',
    },
    {
      title: 'The Investor',
      desc: 'Buy land before the road gets there. Land banking, rental income, and knowing which district the next metro line will touch.',
      accent: 'earth',
      stat: 'Assets',
      statDesc: 'Passive income compounds',
    },
    {
      title: 'The Risky Path',
      desc: 'FOMO is real. Scams, quick deals, and dangerous shortcuts offer fast money — at a price you will pay back with interest.',
      accent: 'life-red',
      stat: 'Reputation',
      statDesc: 'Watch your name',
    },
  ]

  return (
    <section id="paths" ref={ref} className="landing-section landing-section--paths">
      <div className="landing-section-inner">
        <div className="reveal-fade">
          <span className="section-tag">Choose Your Path</span>
          <h2 className="section-title">There is no meta game. Only your life.</h2>
          <p className="section-subtitle">
            Do you want status, or freedom? Stability, or a story you tell at your child's wedding? The game does not
            grade you — it only records what you chose.
          </p>
        </div>
        <div className="paths-grid">
          {paths.map((p, i) => (
            <article
              key={i}
              className={`path-card ${p.accent} ${visible ? 'is-visible' : ''}`}
              style={{ '--card-delay': `${i * 100}ms` } as VarStyle}
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
          <span className="section-tag">How It Works</span>
          <h2 className="section-title">Life is a connected system.</h2>
          <p className="section-subtitle">
            Nothing happens in isolation. Spend money you do not have and rent compounds. Lie to a contact and the next
            opportunity arrives cold. The city is one web, and you are a node in it.
          </p>
        </div>

        <div className="systems-visual">
          <div className="systems-core">
            <span className="systems-core-dot" aria-hidden="true" />
            <span className="systems-core-label">You</span>
          </div>

          <div className="systems-rings">
            <div className="systems-ring systems-ring-1">
              {['Money', 'Rent', 'Energy'].map((label, i) => (
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
              {['Hustles', 'Investments', 'Health'].map((label, i) => (
                <div key={label} className={`system-node system-node-${i}`} title={label}>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="systems-weave">
            {visible && (
              <>
                <span className="system-line" style={{ '--line-delay': '0ms' } as VarStyle} />
                <span className="system-line" style={{ '--line-delay': '80ms' } as VarStyle} />
                <span className="system-line" style={{ '--line-delay': '160ms' } as VarStyle} />
                <span className="system-line" style={{ '--line-delay': '240ms' } as VarStyle} />
                <span className="system-line" style={{ '--line-delay': '320ms' } as VarStyle} />
                <span className="system-line" style={{ '--line-delay': '400ms' } as VarStyle} />
              </>
            )}
          </div>
        </div>

        <div className="systems-cards">
          <div className={`systems-card ${visible ? 'is-visible' : ''}`} style={{ '--card-delay': '0ms' }}>
            <div className="systems-card-num">01</div>
            <h4>Choices, not points</h4>
            <p>Every decision changes what is available to you next.</p>
          </div>
          <div className={`systems-card ${visible ? 'is-visible' : ''}`} style={{ '--card-delay': '140ms' }}>
            <div className="systems-card-num">02</div>
            <h4>Time is money</h4>
            <p>One real minute passes as one game hour. Opportunities arrive and leave on schedule.</p>
          </div>
          <div className={`systems-card ${visible ? 'is-visible' : ''}`} style={{ '--card-delay': '280ms' }}>
            <div className="systems-card-num">03</div>
            <h4>The world remembers</h4>
            <p>NPCs track your name, your debts, and your reputation across contexts.</p>
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
      title: 'Dawn',
      desc: 'The alarm beats your head. There is no choice about being late — being late is being unemployed. First bus fare: negotiate or walk.',
    },
    {
      time: '10:30',
      title: 'Mid-morning',
      desc: 'A contact asks a favour. Say yes and you lose hours; say no and you owe a favour later. Either way you pay.',
    },
    {
      time: '14:00',
      title: 'Afternoon',
      desc: 'Rent reminder pops up. Pay now, or remember why you lent that money to a friend in the first place.',
    },
    {
      time: '19:30',
      title: 'Evening',
      desc: 'The sun goes down hard. This is when you fix what broke, or plan what will break tomorrow.',
    },
  ]

  return (
    <section id="day" ref={ref} className="landing-section landing-section--day">
      <div className="landing-section-inner">
        <div className="reveal-fade">
          <span className="section-tag">A Day In Your World</span>
          <h2 className="section-title">You will learn Lagos by the clock.</h2>
          <p className="section-subtitle">
            No cutscenes. The day plays out as you live it — and the game never tells you what to do next.
          </p>
        </div>

        <div className="day-track">
          <div className={`day-track-bg ${visible ? 'is-visible' : ''}`} />
          {moments.map((m, i) => (
            <div
              key={m.time}
              className={`day-item ${visible ? 'is-visible' : ''}`}
              style={{ '--day-delay': `${i * 130}ms` } as VarStyle}
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
      title: 'Short-term goals',
      desc: 'This week, pay rent and buy your first suit.',
    },
    {
      title: 'Life goals',
      desc: 'Get married. Buy a house. Start the business you have been talking about for years.',
    },
    {
      title: 'Legacy',
      desc: 'Long after you die, your family carries what you built — and what you burned.',
    },
  ]

  return (
    <section id="vision" ref={ref} className="landing-section landing-section--vision">
      <div className="landing-section-inner">
        <div className="reveal-fade">
          <span className="section-tag">Long Game</span>
          <h2 className="section-title">Think beyond today.</h2>
          <p className="section-subtitle">
            The game rewards patience the way Lagos does — by punishing short-sightedness. Build a life you can hand
            down, or spend it all in a single season of good luck.
          </p>
        </div>
        <div className="vision-cards">
          {items.map((v, i) => (
            <div
              key={v.title}
              className={`vision-card ${visible ? 'is-visible' : ''}`}
              style={{ '--card-delay': `${i * 140}ms` } as VarStyle}
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
            A living Nigerian simulation where your choices create a story no two players share. Built in Lagos, for
            everyone who knows what it means to start from nothing and build your own way.
          </p>
          <div className="brand-meta">
            <div className="brand-meta-item">
              <span className="brand-meta-label">Audience</span>
              <span className="brand-meta-value">18+</span>
            </div>
            <div className="brand-meta-item">
              <span className="brand-meta-label">Platform</span>
              <span className="brand-meta-value">Browser</span>
            </div>
            <div className="brand-meta-item">
              <span className="brand-meta-label">Setting</span>
              <span className="brand-meta-value">Lagos</span>
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
            Create your life today. Play for free — real progress, real consequences, no pay-to-win.
          </p>
          <div className="cta-actions">
            <Link to="/signup" className="cta-btn-primary">
              Create Your Life
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