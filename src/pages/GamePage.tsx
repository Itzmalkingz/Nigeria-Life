import { BabylonCanvas } from '../components/BabylonCanvas'
import { Card, CardHeader, CardTitle, CardContent, Button } from '../components/ui'
import { useAuth } from '../lib/auth'
import { useGameTime } from '../hooks/useGameTime'
import { useProfile } from '../hooks/useProfile'
import { formatKoboCompact } from '../utils/format'

export default function GamePage() {
  const { user } = useAuth()
  const gameTime = useGameTime()
  const { profile, needs, loading: profileLoading, error: profileError } = useProfile()

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-bg px-4">
        <div className="w-full max-w-md text-center">
          <div className="text-6xl mb-4" aria-hidden="true">🔒</div>
          <h1 className="heading-display text-display-lg mb-2">Sign In Required</h1>
          <p className="text-body text-muted-text mb-6">You need to be signed in to enter the world of Life in Africa.</p>
          <a href="/login" className="btn-primary inline-block">Sign In</a>
        </div>
      </div>
    )
  }

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-bg" role="status" aria-label="Loading game">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-life-red border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-body text-muted-text">Loading your life…</p>
        </div>
      </div>
    )
  }

  if (profileError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-bg px-4">
        <div className="w-full max-w-md text-center">
          <div className="text-6xl mb-4" aria-hidden="true">⚠️</div>
          <h1 className="heading-display text-display-lg mb-2">Unable to Load Profile</h1>
          <p className="text-body text-muted-text mb-6">{profileError}</p>
          <Button variant="secondary" onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    )
  }

  const cash = profile?.cashKobo ?? 1000000
  const bank = profile?.bankKobo ?? 500000
  const currentNeeds = needs ?? { hunger: 90, energy: 85, hygiene: 95, fun: 60, social: 70, bladder: 10, updatedAt: new Date().toISOString() }

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header & Simulation Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="heading-display text-display-lg">
            {profile?.displayName || user?.displayName || 'Player'}'s World
          </h1>
          <p className="text-body text-muted-text">
            Mushin Test Scene (Babylon.js 3D Engine Active) •{' '}
            <span>{gameTime.formattedTime} ({gameTime.dayName})</span>
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <Button variant="ghost" size="sm" onClick={gameTime.isRunning ? gameTime.pause : gameTime.start}>
            {gameTime.isRunning ? '⏸️ Pause' : '▶️ Resume'}
          </Button>
        </div>
      </div>

      {/* 3D ENGINE VIEWPORT CONTAINER */}
      <div className="relative w-full rounded-brand-xl overflow-hidden border-2 border-navy/50 shadow-brand-lg bg-[#0e1017]">
        <BabylonCanvas
          onSceneReady={(scene) => {
            import('../scenes/TestScene').then(({ createTestScene }) => {
              createTestScene(scene).catch(console.error)
            })
          }}
          className="w-full h-[550px]"
        />

        {/* Controls Overlay Hint */}
        <div className="absolute bottom-3 left-4 right-4 flex justify-between items-center text-caption text-muted-text bg-dark-bg/80 px-4 py-2 rounded-brand backdrop-blur-sm pointer-events-none">
          <span>🧪 Test Scene: Babylon.js 3D Engine Active</span>
          <span>🖱️ Drag to orbit • Scroll to zoom</span>
        </div>
      </div>

      {/* STATUS CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-body-sm text-muted-text">Cash Pocket</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-display text-3xl tabular-nums text-life-red">{formatKoboCompact(cash)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-body-sm text-muted-text">Bank Account</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-display text-3xl tabular-nums text-choice-blue">{formatKoboCompact(bank)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-body-sm text-muted-text">Rent Due</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-display text-3xl tabular-nums text-warm-ivory">{formatKoboCompact(240000)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-body-sm text-muted-text">Energy Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-display text-3xl tabular-nums text-choice-blue">{currentNeeds.energy}%</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}