import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { BabylonCanvas } from '../components/BabylonCanvas'
import { createMushinHome } from '../scenes/MushinHome'
import type { MushinHomeHandle, PromptInfo, HomeStats, Zone } from '../scenes/MushinHome'

const ZONE_LABEL: Record<Zone, string> = {
  home: '🏠 Face-me-I-face-you, Mushin',
  street: '🛣️ Mushin Street, Lagos',
}

/**
 * Local playable demo: a controllable character in a Mushin home and street.
 * Unprotected on purpose — it uses only local state and never touches
 * Supabase, so authentication and database policies are unaffected.
 */
export default function DemoGamePage() {
  const handleRef = useRef<MushinHomeHandle | null>(null)
  const toastTimer = useRef<number | null>(null)
  const [zone, setZone] = useState<Zone>('home')
  const [prompt, setPrompt] = useState<PromptInfo | null>(null)
  const [stats, setStats] = useState<HomeStats>({ energy: 85, hunger: 90 })
  const [toast, setToast] = useState<string | null>(null)
  const [failed, setFailed] = useState<string | null>(null)

  const showToast = useCallback((message: string) => {
    setToast(message)
    if (toastTimer.current !== null) window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(null), 4000)
  }, [])

  useEffect(
    () => () => {
      if (toastTimer.current !== null) window.clearTimeout(toastTimer.current)
      handleRef.current?.dispose()
      handleRef.current = null
    },
    []
  )

  const handleSceneReady = useCallback(
    (scene: import('@babylonjs/core').Scene, canvas: HTMLCanvasElement) => {
      try {
        handleRef.current?.dispose()
        handleRef.current = createMushinHome(scene, canvas, {
          onPrompt: setPrompt,
          onStats: setStats,
          onZone: setZone,
          onToast: showToast,
        })
      } catch (err) {
        setFailed(err instanceof Error ? err.message : 'Could not start the 3D demo.')
      }
    },
    [showToast]
  )

  const interact = useCallback(() => {
    handleRef.current?.interact()
  }, [])

  return (
    <div className="space-y-4 pb-12 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="heading-display text-display-lg">Playable Demo</h1>
          <p className="text-body text-muted-text">
            Local prototype — walk home and street. Progress is not saved.
          </p>
        </div>
        <Link to="/" className="btn-secondary text-center">
          ← Back to site
        </Link>
      </div>

      {failed ? (
        <div className="p-6 rounded-brand-xl border border-life-red/50 bg-dark-bg text-center" role="alert">
          <div className="text-4xl mb-2" aria-hidden="true">⚠️</div>
          <h2 className="font-display font-bold text-warm-ivory mb-1">3D Demo Unavailable</h2>
          <p className="text-body-sm text-muted-text">{failed}</p>
        </div>
      ) : (
        <div className="relative w-full rounded-brand-xl overflow-hidden border-2 border-navy/50 shadow-brand-lg bg-[#0e1017]">
          <BabylonCanvas onSceneReady={handleSceneReady} defaultSceneContent={false} className="w-full h-[62vh]" />

          {/* Zone banner */}
          <div className="absolute top-3 left-3 px-3 py-1.5 rounded-brand bg-dark-bg/85 text-warm-ivory text-body-sm font-semibold pointer-events-none">
            {ZONE_LABEL[zone]}
          </div>

          {/* Needs bars */}
          <div className="absolute top-3 right-3 w-40 space-y-1.5 px-3 py-2 rounded-brand bg-dark-bg/85 pointer-events-none" aria-label="Needs">
            <NeedBar label="⚡ Energy" value={stats.energy} tone="bg-choice-blue" />
            <NeedBar label="🍲 Hunger" value={stats.hunger} tone="bg-life-red" />
          </div>

          {/* Toast */}
          {toast && (
            <div className="absolute top-14 left-1/2 -translate-x-1/2 max-w-[90%] px-4 py-2 rounded-brand bg-dark-bg/90 border border-navy text-warm-ivory text-body-sm text-center pointer-events-none" role="status">
              {toast}
            </div>
          )}

          {/* Interaction prompt */}
          {prompt && (
            <button
              type="button"
              onClick={interact}
              className="absolute bottom-14 left-1/2 -translate-x-1/2 btn-primary text-base shadow-brand-lg"
            >
              {prompt.emoji} {prompt.label} <span className="opacity-70 text-sm">(E)</span>
            </button>
          )}

          {/* Controls hint */}
          <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center text-caption text-muted-text bg-dark-bg/80 px-4 py-2 rounded-brand backdrop-blur-sm pointer-events-none">
            <span className="hidden sm:inline">⌨️ WASD / arrows to walk • E to interact • drag to look • scroll to zoom</span>
            <span className="sm:hidden">👆 Tap the ground to walk • tap the button to interact • drag to look</span>
            <span>🖱️ Tap ground = walk there</span>
          </div>
        </div>
      )}
    </div>
  )
}

function NeedBar({ label, value, tone }: { label: string; value: number; tone: string }) {
  const clamped = Math.min(100, Math.max(0, Math.round(value)))
  return (
    <div>
      <div className="flex justify-between text-caption text-muted-text mb-0.5">
        <span>{label}</span>
        <span className="tabular-nums">{clamped}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-navy overflow-hidden">
        <div className={`h-full rounded-full ${tone} transition-[width]`} style={{ width: `${clamped}%` }} />
      </div>
    </div>
  )
}
