import { useAuth } from '../lib/auth'
import { useGameTime } from '../hooks/useGameTime'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button } from '../components/ui'
import { formatKoboCompact, formatGameTime, formatDayName, isWeekend } from '../utils/format'

export default function GamePage() {
  const { user, loading } = useAuth()
  const gameTime = useGameTime()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-bg" role="status" aria-label="Loading game">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-life-red border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-body text-muted-text">Loading your life…</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-bg px-4">
        <div className="w-full max-w-md text-center">
          <div className="text-6xl mb-4" aria-hidden="true">🔒</div>
          <h1 className="heading-display text-display-lg mb-2">Sign In Required</h1>
          <p className="text-body text-muted-text mb-6">You need to be signed in to play Nigeria Life.</p>
          <a href="/login" className="btn-primary inline-block">Sign In</a>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="heading-display text-display-lg">Welcome back, {user.displayName}</h1>
          <p className="text-body text-muted-text">
            {formatDayName(gameTime.gameDay)}, {formatGameTime(gameTime.gameHours)} •{' '}
            <span className={isWeekend(gameTime.gameDay) ? 'text-life-red' : 'text-choice-blue'}>
              {isWeekend(gameTime.gameDay) ? 'Weekend' : 'Weekday'}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <Button variant="ghost" size="sm" onClick={gameTime.isRunning ? gameTime.pause : gameTime.start}>
            {gameTime.isRunning ? '⏸️ Pause' : '▶️ Resume'}
          </Button>
          <Button variant="outline" size="sm" onClick={gameTime.reset}>⟲ Reset</Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-body-sm text-muted-text">Cash</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-display text-3xl tabular-nums text-life-red">{formatKoboCompact(1250000)}</div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm">Deposit</Button>
            <Button variant="ghost" size="sm">Withdraw</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-body-sm text-muted-text">Bank</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-display text-3xl tabular-nums text-choice-blue">{formatKoboCompact(3400000)}</div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm">Transfer</Button>
            <Button variant="ghost" size="sm">Invest</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-body-sm text-muted-text">Rent Due</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-display text-3xl tabular-nums text-warm-ivory">{formatKoboCompact(1500000)}</div>
          </CardContent>
          <CardFooter>
            <span className="text-body-sm text-muted-text">Saturday • 3 days left</span>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-body-sm text-muted-text">Next Payday</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-display text-3xl tabular-nums text-warm-ivory">{formatKoboCompact(450000)}</div>
          </CardContent>
          <CardFooter>
            <span className="text-body-sm text-muted-text">Friday • Shift ends 6 PM</span>
          </CardFooter>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="lg:col-span-2 space-y-4">
          <h2 className="heading-lg text-display-sm">Quick Actions</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Card variant="interactive">
              <CardContent className="text-center py-8">
                <div className="text-4xl mb-2" aria-hidden="true">😴</div>
                <h3 className="font-display font-medium text-warm-ivory mb-1">Sleep</h3>
                <p className="text-body-sm text-muted-text">8 hours • Energy +100%</p>
                <div className="mt-3">
                  <Button variant="primary" size="sm">Go to Bed</Button>
                </div>
              </CardContent>
            </Card>

            <Card variant="interactive">
              <CardContent className="text-center py-8">
                <div className="text-4xl mb-2" aria-hidden="true">🍽️</div>
                <h3 className="font-display font-medium text-warm-ivory mb-1">Eat</h3>
                <p className="text-body-sm text-muted-text">Mama Put • ₦1,500</p>
                <div className="mt-3">
                  <Button variant="secondary" size="sm">Order Food</Button>
                </div>
              </CardContent>
            </Card>

            <Card variant="interactive">
              <CardContent className="text-center py-8">
                <div className="text-4xl mb-2" aria-hidden="true">🚿</div>
                <h3 className="font-display font-medium text-warm-ivory mb-1">Shower</h3>
                <p className="text-body-sm text-muted-text">30 mins • Hygiene +40%</p>
                <div className="mt-3">
                  <Button variant="secondary" size="sm">Freshen Up</Button>
                </div>
              </CardContent>
            </Card>

            <Card variant="interactive">
              <CardContent className="text-center py-8">
                <div className="text-4xl mb-2" aria-hidden="true">🚌</div>
                <h3 className="font-display font-medium text-warm-ivory mb-1">Travel</h3>
                <p className="text-body-sm text-muted-text">Danfo to Balogun Market</p>
                <div className="mt-3">
                  <Button variant="outline" size="sm">Go</Button>
                </div>
              </CardContent>
            </Card>

            <Card variant="interactive">
              <CardContent className="text-center py-8">
                <div className="text-4xl mb-2" aria-hidden="true">💼</div>
                <h3 className="font-display font-medium text-warm-ivory mb-1">Work Shift</h3>
                <p className="text-body-sm text-muted-text">Danfo Conductor • 8 hrs</p>
                <div className="mt-3">
                  <Button variant="primary" size="sm" disabled>Start Shift</Button>
                </div>
              </CardContent>
            </Card>

            <Card variant="interactive">
              <CardContent className="text-center py-8">
                <div className="text-4xl mb-2" aria-hidden="true">📱</div>
                <h3 className="font-display font-medium text-warm-ivory mb-1">Phone</h3>
                <p className="text-body-sm text-muted-text">Check messages, jobs, bank</p>
                <div className="mt-3">
                  <Button variant="secondary" size="sm">Open Phone</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="heading-lg text-display-sm">Needs</h2>
          <Card>
            <CardContent className="space-y-4">
              {[
                { label: 'Energy', value: 72, color: 'text-choice-blue', bg: 'bg-choice-blue/20' },
                { label: 'Hunger', value: 45, color: 'text-life-red', bg: 'bg-life-red/20' },
                { label: 'Hygiene', value: 68, color: 'text-warm-ivory', bg: 'bg-warm-ivory/20' },
                { label: 'Fun', value: 33, color: 'text-earth-accent', bg: 'bg-earth-accent/20' },
                { label: 'Social', value: 55, color: 'text-life-red', bg: 'bg-life-red/20' },
                { label: 'Bladder', value: 22, color: 'text-yellow-400', bg: 'bg-yellow-400/20' },
              ].map(need => (
                <div key={need.label} className="space-y-1">
                  <div className="flex justify-between text-body-sm">
                    <span className="font-medium">{need.label}</span>
                    <span className={need.color} tabular-nums>{need.value}%</span>
                  </div>
                  <div className="h-2 bg-navy/30 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${need.bg} rounded-full transition-all duration-500`}
                      style={{ width: `${need.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <h2 className="heading-lg text-display-sm">Current Location</h2>
          <Card>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-brand bg-navy/50 flex items-center justify-center text-2xl" aria-hidden="true">🏠</div>
                <div>
                  <h3 className="font-display font-medium text-warm-ivory">Home — Mushin</h3>
                  <p className="text-body-sm text-muted-text">Face-me-I-face-you • ₦2,400/week</p>
                </div>
              </div>
              <div className="pt-2 border-t border-navy/20 flex flex-wrap gap-2">
                <Button variant="outline" size="sm">Buy Mode</Button>
                <Button variant="outline" size="sm">Rest</Button>
                <Button variant="ghost" size="sm">Leave</Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>

      <div className="card">
        <CardHeader>
          <CardTitle className="text-display-sm">Active Goals</CardTitle>
          <CardDescription>Track your progress. Create custom goals from the Phone.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { label: 'Pay this week\'s rent', progress: 0, target: 1500000, type: 'daily' },
            { label: 'Complete 3 work shifts', progress: 1, target: 3, type: 'daily' },
            { label: 'Reach Energy 80% before shift', progress: 72, target: 80, type: 'daily' },
            { label: 'Save ₦500,000 for studio apartment', progress: 1250000, target: 5000000, type: 'short_term' },
          ].map((goal, i) => (
            <div key={i} className="space-y-1.5">
              <div className="flex justify-between text-body-sm">
                <span className="font-medium">{goal.label}</span>
                <span className="text-muted-text">{goal.type === 'daily' ? 'Daily' : 'Short-term'}</span>
              </div>
              <div className="h-2 bg-navy/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-choice-blue/50 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (goal.progress / goal.target) * 100)}%` }}
                />
              </div>
              <p className="text-caption text-muted-text tabular-nums">
                {formatKoboCompact(goal.progress)} / {formatKoboCompact(goal.target)}
              </p>
            </div>
          ))}
        </CardContent>
      </div>
    </div>
  )
}