import { useState, FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent, Button, Input } from '../components/ui'
import Logo from '../components/Logo'
import Footer from '../components/Footer'

export function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-dark-bg text-warm-ivory">
      <header className="sticky top-0 z-40 bg-dark-bg/95 backdrop-blur-sm border-b border-navy/30">
        <div className="container-game flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-warm-ivory hover:text-life-red transition-colors" aria-label="Life in Africa Home">
            <Logo className="w-8 h-8" />
            <span className="font-display font-bold text-display-sm">Life in Africa</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/about" className="btn-ghost text-body-sm hidden sm:inline-flex">About</Link>
            <Link to="/world" className="btn-ghost text-body-sm hidden sm:inline-flex">World</Link>
            <Link to="/features" className="btn-ghost text-body-sm hidden sm:inline-flex">Features</Link>
            <Link to="/roadmap" className="btn-ghost text-body-sm hidden sm:inline-flex">Roadmap</Link>
            <Link to="/login" className="btn-ghost text-body-sm">Sign In</Link>
            <Link to="/signup" className="btn-primary text-body-sm">Get Started</Link>
          </div>
        </div>
      </header>
      <main className="flex-1 container-game py-12 max-w-4xl">
        {children}
      </main>
      <Footer />
    </div>
  )
}

export function AboutPage() {
  return (
    <PublicLayout>
      <div className="space-y-8 animate-fade-in">
        <div className="text-center space-y-4">
          <span className="section-tag">About The Game</span>
          <h1 className="heading-display text-display-xl">One beginning. Many choices. One life.</h1>
          <p className="text-body-lg text-muted-text max-w-2xl mx-auto">
            Life in Africa is an original browser-based life simulation where player choices create living personal stories across diverse communities and cities.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Authentic Systems</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-text">
              We model realistic daily pressures—from weekly rent cycles and informal economies to career progression, family obligations, and shifting relationships. Every action has consequences in a world that remembers.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Player Agency</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-text">
              No single prescribed storyline forces your path. Choose to climb the corporate ladder, hustle as an independent entrepreneur, invest in property, or navigate higher-risk paths.
            </CardContent>
          </Card>
        </div>
      </div>
    </PublicLayout>
  )
}

export function WorldPage() {
  return (
    <PublicLayout>
      <div className="space-y-8 animate-fade-in">
        <div className="text-center space-y-4">
          <span className="section-tag">Continental World</span>
          <h1 className="heading-display text-display-xl">A living socio-economic world.</h1>
          <p className="text-body-lg text-muted-text max-w-2xl mx-auto">
            Built from the ground up to represent the vibrant diversity of African life, starting in Lagos and expanding across the continent.
          </p>
        </div>

        <div className="space-y-4">
          {[
            { city: 'Lagos, Nigeria', status: 'Playable in MVP', desc: 'Commercial powerhouse. Bustling markets, tech hubs, vibrant nightlife, intense traffic, and fast-paced economic hustle.' },
            { city: 'Nairobi, Kenya', status: 'Planned Expansion', desc: 'Regional tech and innovation hub. Dynamic startup ecosystem, rich cultural landscape, and energetic urban dynamics.' },
            { city: 'Johannesburg, South Africa', status: 'Planned Expansion', desc: 'Financial capital of the south. Diverse commerce, mining legacy, sprawling suburbs, and complex cultural intersections.' },
            { city: 'Cairo, Egypt', status: 'Planned Expansion', desc: 'Historic crossroads of trade, diplomacy, and ancient heritage meeting modern enterprise.' },
          ].map((loc, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="flex justify-between items-center flex-wrap gap-2">
                  <CardTitle>{loc.city}</CardTitle>
                  <span className={`px-2.5 py-1 rounded-full text-caption font-semibold ${loc.status.includes('Playable') ? 'bg-life-red/10 text-life-red' : 'bg-choice-blue/10 text-choice-blue'}`}>
                    {loc.status}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-text">{loc.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PublicLayout>
  )
}

export function FeaturesPage() {
  return (
    <PublicLayout>
      <div className="space-y-8 animate-fade-in">
        <div className="text-center space-y-4">
          <span className="section-tag">Game Systems</span>
          <h1 className="heading-display text-display-xl">Interlocking simulation mechanics.</h1>
          <p className="text-body-lg text-muted-text max-w-2xl mx-auto">
            Discover the core pillars that make every playthrough of Life in Africa unique and memorable.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            { title: 'Needs & Time', desc: 'Manage hunger, energy, hygiene, and social needs against an active game clock and weekly rent cycles.' },
            { title: 'Careers & Hustles', desc: 'Shift-based employment, skill-gated promotions, side hustles, and business ownership.' },
            { title: 'In-World Phone', desc: 'A fully functional digital hub for messaging, banking, mobile money, job hunting, and photography.' },
            { title: 'NPC Memory', desc: 'Characters remember past interactions, trust levels, debts, and commitments.' },
            { title: 'Crime & Risk', desc: 'Fictionalized risk systems with evidence trails, investigations, court, and prison consequences.' },
            { title: 'Generational Legacy', desc: 'Retire and play as your child or protege, inheriting assets, reputation, and family history.' },
          ].map((f, i) => (
            <Card key={i}>
              <CardHeader>
                <CardTitle className="text-base">{f.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-body-sm text-muted-text">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PublicLayout>
  )
}

export function RoadmapPage() {
  return (
    <PublicLayout>
      <div className="space-y-8 animate-fade-in">
        <div className="text-center space-y-4">
          <span className="section-tag">Development Roadmap</span>
          <h1 className="heading-display text-display-xl">Our path forward.</h1>
          <p className="text-body-lg text-muted-text max-w-2xl mx-auto">
            Transparent milestones for building Life in Africa with uncompromising quality.
          </p>
        </div>

        <div className="space-y-6">
          {[
            { phase: 'Phase 0 & P0', title: 'Technical Foundation & Architecture', status: 'Completed', desc: 'Brand identity, design tokens, responsive shell, routing, Supabase auth, and test harness hardening.' },
            { phase: 'Phase 1 (P1)', title: 'Playable Single-Player Vertical Slice', status: 'In Progress', desc: 'Core life loop: server-validated transactions, needs decay, housing rent, shift work, and dynamic events.' },
            { phase: 'Phase 2 (P2)', title: 'Phone Ecosystem & Entertainment', status: 'Planned', desc: 'Fully functional phone apps, messaging, camera/gallery, and playable browser mini-games.' },
            { phase: 'Phase 3 (P3)', title: 'Expanded World & Relationships', status: 'Planned', desc: 'Advanced NPC relationships, deeper career branching, multi-city travel, and photo albums.' },
            { phase: 'Phase 4+', title: 'Multiplayer & Shared Economies', status: 'Future', desc: 'Async multiplayer hooks, leaderboards, player businesses, and regional elections.' },
          ].map((r, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="flex justify-between items-center flex-wrap gap-2">
                  <div>
                    <span className="text-caption font-semibold text-life-red uppercase tracking-wider">{r.phase}</span>
                    <CardTitle className="text-lg mt-1">{r.title}</CardTitle>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-caption font-semibold ${r.status === 'Completed' ? 'bg-green-500/10 text-green-400' : r.status === 'In Progress' ? 'bg-life-red/10 text-life-red' : 'bg-navy/50 text-muted-text'}`}>
                    {r.status}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-text">{r.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PublicLayout>
  )
}

export function JournalPage() {
  return (
    <PublicLayout>
      <div className="space-y-8 animate-fade-in">
        <div className="text-center space-y-4">
          <span className="section-tag">Development Journal</span>
          <h1 className="heading-display text-display-xl">Stories from the build.</h1>
          <p className="text-body-lg text-muted-text max-w-2xl mx-auto">
            Insights from the design and engineering of Life in Africa.
          </p>
        </div>

        <div className="space-y-6">
          {[
            {
              date: 'October 12, 2026',
              tag: 'Architecture',
              title: 'Why Server-Authoritative Simulation Matters for Life Sims',
              excerpt: 'In browser-based persistent games, client-side trust leads to exploits. Here is how we designed our Supabase transaction ledger and RPC validation layers from day one.',
            },
            {
              date: 'October 8, 2026',
              tag: 'World Design',
              title: 'Capturing Daily Life Through Interlocking Systems',
              excerpt: 'Reflections on modeling economic pressure, transport friction, and community relationships without reducing vibrant communities to stereotypes.',
            },
          ].map((post, i) => (
            <Card key={i} variant="hover" className="space-y-3 cursor-pointer">
              <div className="flex items-center gap-3 text-caption text-muted-text">
                <span>{post.date}</span>
                <span>•</span>
                <span className="text-choice-blue font-medium">{post.tag}</span>
              </div>
              <h3 className="font-display font-bold text-display-sm text-warm-ivory">{post.title}</h3>
              <p className="text-muted-text">{post.excerpt}</p>
            </Card>
          ))}
        </div>
      </div>
    </PublicLayout>
  )
}

export function FAQPage() {
  return (
    <PublicLayout>
      <div className="space-y-8 animate-fade-in">
        <div className="text-center space-y-4">
          <span className="section-tag">Help & FAQ</span>
          <h1 className="heading-display text-display-xl">Frequently Asked Questions</h1>
          <p className="text-body-lg text-muted-text max-w-2xl mx-auto">
            Everything you need to know about Life in Africa.
          </p>
        </div>

        <div className="space-y-4">
          {[
            { q: 'Is Life in Africa free to play?', a: 'Yes! Life in Africa is 100% free to play in your browser with zero pay-to-win advantages or mandatory subscriptions.' },
            { q: 'Do I need to download an app?', a: 'No. Life in Africa is a responsive web application designed for smooth gameplay across desktop and mobile browsers.' },
            { q: 'What is the age rating?', a: 'The game is intended for adults aged 18+ due to mature simulation themes including financial pressure, nightlife, relationships, and consequence-driven choices.' },
            { q: 'Is multiplayer available?', a: 'We are focusing on a robust single-player experience with async features first. Shared world multiplayer will be introduced in later phases after rigorous load testing.' },
          ].map((item, i) => (
            <Card key={i}>
              <CardHeader>
                <CardTitle className="text-base">{item.q}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-text">{item.a}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PublicLayout>
  )
}

export function TermsPage() {
  return (
    <PublicLayout>
      <div className="space-y-8 animate-fade-in">
        <div className="space-y-2">
          <h1 className="heading-display text-display-lg">Terms of Service</h1>
          <p className="text-body-sm text-muted-text">Last updated: October 12, 2026</p>
        </div>
        <div className="prose prose-invert max-w-none space-y-4 text-muted-text">
          <p>Welcome to Life in Africa. By accessing or playing our browser-based simulation game, you agree to these Terms of Service.</p>
          <h3 className="text-warm-ivory font-display font-semibold text-lg mt-6">1. Age Requirement</h3>
          <p>You must be at least 18 years of age to create an account and play Life in Africa.</p>
          <h3 className="text-warm-ivory font-display font-semibold text-lg mt-6">2. Virtual Economy</h3>
          <p>In-game currency (Game Naira) has no real-world monetary value, cannot be redeemed for cash, and is strictly for entertainment within the simulation.</p>
          <h3 className="text-warm-ivory font-display font-semibold text-lg mt-6">3. Acceptable Conduct</h3>
          <p>Players must not attempt to exploit, hack, or disrupt server-authoritative game services or abuse community features.</p>
        </div>
      </div>
    </PublicLayout>
  )
}

export function PrivacyPage() {
  return (
    <PublicLayout>
      <div className="space-y-8 animate-fade-in">
        <div className="space-y-2">
          <h1 className="heading-display text-display-lg">Privacy Policy</h1>
          <p className="text-body-sm text-muted-text">Last updated: October 12, 2026</p>
        </div>
        <div className="prose prose-invert max-w-none space-y-4 text-muted-text">
          <p>Life in Africa respects your privacy. This policy outlines how we handle data when you use our browser game.</p>
          <h3 className="text-warm-ivory font-display font-semibold text-lg mt-6">1. Information We Collect</h3>
          <p>We collect account credentials (email and username) provided during registration and encrypted session tokens managed securely via Supabase.</p>
          <h3 className="text-warm-ivory font-display font-semibold text-lg mt-6">2. Data Security</h3>
          <p>All player state, inventory, and financial ledgers are stored securely with Row Level Security (RLS) ensuring strict player isolation.</p>
        </div>
      </div>
    </PublicLayout>
  )
}

export function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!email || !message) return
    setSubmitted(true)
  }

  return (
    <PublicLayout>
      <div className="space-y-8 animate-fade-in max-w-xl mx-auto">
        <div className="text-center space-y-3">
          <span className="section-tag">Contact Us</span>
          <h1 className="heading-display text-display-lg">Get in Touch</h1>
          <p className="text-body text-muted-text">Have feedback, bug reports, or partnership inquiries? Send us a message.</p>
        </div>

        <Card>
          {submitted ? (
            <div className="text-center py-8 space-y-3">
              <div className="text-4xl" aria-hidden="true">✅</div>
              <h3 className="font-display font-bold text-lg text-warm-ivory">Message Received</h3>
              <p className="text-body-sm text-muted-text">Thank you for reaching out. Our team will review your message shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
              <div>
                <label className="label" htmlFor="message-input">Message</label>
                <textarea
                  id="message-input"
                  className="input min-h-[120px] resize-y"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="How can we help you?"
                  required
                />
              </div>
              <Button type="submit" className="w-full">Send Message</Button>
            </form>
          )}
        </Card>
      </div>
    </PublicLayout>
  )
}
