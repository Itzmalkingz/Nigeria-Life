import { useCallback } from 'react'
import type { Scene } from '@babylonjs/core'
import { BabylonCanvas } from './BabylonCanvas'
import { createMushinBackdrop } from '../scenes/MushinHome'

/**
 * Static, softly orbiting view of the Mushin home. Used behind the landing
 * hero only; the interactive game scene lives on /game.
 */
export default function LandingWorld() {
  const handleSceneReady = useCallback((scene: Scene) => {
    createMushinBackdrop(scene)
  }, [])

  return (
    <BabylonCanvas
      defaultSceneContent={false}
      onSceneReady={handleSceneReady}
      minHeight={0}
      className="h-full w-full"
      fallback={<LandingFallback />}
    />
  )
}

function LandingFallback() {
  return (
    <div className="landing-fallback" aria-hidden="true">
      <div className="landing-fallback-glow" />
      <div className="landing-fallback-house">
        <span className="landing-fallback-window" />
        <span className="landing-fallback-door" />
      </div>
      <div className="landing-fallback-stage" />
    </div>
  )
}
