import { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './lib/auth'
import Layout from './components/Layout'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import PlaceholderPage from './pages/PlaceholderPage'
import { AboutPage, WorldPage, FeaturesPage, RoadmapPage, JournalPage, FAQPage, TermsPage, PrivacyPage, ContactPage } from './pages/PublicPages'

// Babylon is heavy; keep it out of the initial bundle for the landing/auth routes.
const GamePage = lazy(() => import('./pages/GamePage'))
const DemoGamePage = lazy(() => import('./pages/DemoGamePage'))

function RouteFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-abyss" role="status" aria-label="Loading">
      <div className="space-y-4 text-center">
        <div className="mx-auto h-11 w-11 animate-spin rounded-full border-2 border-choice-blue border-t-transparent" />
        <p className="text-body-sm text-text-dim">Entering the world…</p>
      </div>
    </div>
  )
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-bg" role="status" aria-label="Checking authentication">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-life-red border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-body text-muted-text">Verifying session…</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-bg" role="status" aria-label="Checking authentication">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-life-red border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-body text-muted-text">Checking session…</p>
        </div>
      </div>
    )
  }

  if (user) {
    return <Navigate to="/game" replace />
  }

  return <>{children}</>
}

export default function App() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/world" element={<WorldPage />} />
      <Route path="/features" element={<FeaturesPage />} />
      <Route path="/roadmap" element={<RoadmapPage />} />
      <Route path="/journal" element={<JournalPage />} />
      <Route path="/faq" element={<FAQPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/contact" element={<ContactPage />} />

      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <LoginPage />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicOnlyRoute>
            <SignupPage />
          </PublicOnlyRoute>
        }
      />

      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      <Route
        path="/game"
        element={
          <ProtectedRoute>
            <Layout>
              <GamePage />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/map"
        element={
          <ProtectedRoute>
            <Layout>
              <PlaceholderPage
                title="Map"
                description="Explore Lagos and beyond. Travel between locations, discover venues, plan your routes."
                icon="🗺️"
              />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/phone"
        element={
          <ProtectedRoute>
            <Layout>
              <PlaceholderPage
                title="Phone"
                description="Your in-world LifeLine. Messages, contacts, bank, jobs, maps, social feed, and more."
                icon="📱"
              />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/stats"
        element={
          <ProtectedRoute>
            <Layout>
              <PlaceholderPage
                title="Statistics"
                description="Track your progress. Skills, earnings, relationships, reputation, and lifetime achievements."
                icon="📊"
              />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/locations"
        element={
          <ProtectedRoute>
            <Layout>
              <PlaceholderPage
                title="Locations"
                description="All venues in Lagos. Opening hours, available actions, jobs, and travel costs."
                icon="📍"
              />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/skills"
        element={
          <ProtectedRoute>
            <Layout>
              <PlaceholderPage
                title="Skills"
                description="Your abilities. Train skills to unlock better jobs, businesses, and life paths."
                icon="🧠"
              />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/goals"
        element={
          <ProtectedRoute>
            <Layout>
              <PlaceholderPage
                title="Goals"
                description="Daily, short-term, life, and legacy goals. Create your own or follow authored missions."
                icon="🎯"
              />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/relationships"
        element={
          <ProtectedRoute>
            <Layout>
              <PlaceholderPage
                title="Relationships"
                description="NPCs and players. Trust, memories, family obligations, mentors, romance, and betrayal."
                icon="👥"
              />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/achievements"
        element={
          <ProtectedRoute>
            <Layout>
              <PlaceholderPage
                title="Achievements"
                description="Milestones unlocked. First rent paid, first promotion, first business, legacy goals."
                icon="🏆"
              />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <Layout>
              <PlaceholderPage
                title="History"
                description="Your life story. Events, choices, consequences, and the paths you've walked."
                icon="📜"
              />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/demo"
        element={
          <Layout>
            <DemoGamePage />
          </Layout>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}