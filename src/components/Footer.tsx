import { Link } from 'react-router-dom'
import Logo from './Logo'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-navy/30 border-t border-navy/20 mt-auto" role="contentinfo">
      <div className="container-game py-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <Link to="/game" className="flex items-center gap-2 text-warm-ivory hover:text-life-red transition-colors" aria-label="Life in Africa Home">
              <Logo className="w-8 h-8" />
              <span className="font-display font-bold text-display-sm">Life in Africa</span>
            </Link>
            <p className="text-body-sm text-muted-text max-w-xs">
              One beginning. Many choices. One life. Build your story in a living African world.
            </p>
            <div className="flex items-center gap-4">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted-text hover:text-life-red transition-colors" aria-label="Twitter">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>
              </a>
              <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="text-muted-text hover:text-life-red transition-colors" aria-label="Discord">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.38-.444.864-.608 1.25a18.27 18.27 0 0 0-5.482 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.675 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.083.083 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 1 1 .013-.154 10.2 10.2 0 0 0 .372-.167.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.063.246.12.372.167a.077.077 0 1 1 .013.154 13.127 13.127 0 0 1-1.872.892.077.077 0 0 0-.041.107c.36.645.773 1.255 1.225 1.993a.077.077 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.057c.443-4.778-.593-9.43-3.642-13.66a.061.061 0 0 0-.031-.027zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-muted-text hover:text-life-red transition-colors" aria-label="GitHub">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
              </a>
            </div>
          </div>

          <nav className="space-y-3" aria-label="Product links">
            <h4 className="font-display font-semibold text-warm-ivory">Product</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-body-sm text-muted-text hover:text-warm-ivory transition-colors">About</Link></li>
              <li><Link to="/world" className="text-body-sm text-muted-text hover:text-warm-ivory transition-colors">World</Link></li>
              <li><Link to="/features" className="text-body-sm text-muted-text hover:text-warm-ivory transition-colors">Features</Link></li>
              <li><Link to="/roadmap" className="text-body-sm text-muted-text hover:text-warm-ivory transition-colors">Roadmap</Link></li>
              <li><Link to="/journal" className="text-body-sm text-muted-text hover:text-warm-ivory transition-colors">Journal</Link></li>
            </ul>
          </nav>

          <nav className="space-y-3" aria-label="Community links">
            <h4 className="font-display font-semibold text-warm-ivory">Community</h4>
            <ul className="space-y-2">
              <li><Link to="/faq" className="text-body-sm text-muted-text hover:text-warm-ivory transition-colors">FAQ & Help</Link></li>
              <li><Link to="/contact" className="text-body-sm text-muted-text hover:text-warm-ivory transition-colors">Contact Us</Link></li>
              <li><a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="text-body-sm text-muted-text hover:text-warm-ivory transition-colors">Discord</a></li>
              <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-body-sm text-muted-text hover:text-warm-ivory transition-colors">Twitter</a></li>
            </ul>
          </nav>

          <nav className="space-y-3" aria-label="Legal links">
            <h4 className="font-display font-semibold text-warm-ivory">Legal</h4>
            <ul className="space-y-2">
              <li><Link to="/terms" className="text-body-sm text-muted-text hover:text-warm-ivory transition-colors">Terms of Use</Link></li>
              <li><Link to="/privacy" className="text-body-sm text-muted-text hover:text-warm-ivory transition-colors">Privacy Policy</Link></li>
              <li><Link to="/contact" className="text-body-sm text-muted-text hover:text-warm-ivory transition-colors">Support</Link></li>
            </ul>
          </nav>
        </div>

        <div className="mt-8 pt-8 border-t border-navy/20 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-body-sm text-muted-text">
            © {currentYear} Life in Africa. All rights reserved.
          </p>
          <p className="text-caption text-muted-text">
            18+ only. Fictional simulation. Not financial advice.
          </p>
        </div>
      </div>
    </footer>
  )
}