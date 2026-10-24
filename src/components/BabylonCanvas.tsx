import { useEffect, useRef, useState } from 'react'
import { Engine, Scene, ArcRotateCamera, HemisphericLight, Vector3, Color3, Color4, EngineOptions } from '@babylonjs/core'
import '@babylonjs/loaders/glTF'

interface BabylonCanvasProps {
  onSceneReady?: (scene: import('@babylonjs/core').Scene, canvas: HTMLCanvasElement) => void
  className?: string
  style?: React.CSSProperties
  /**
   * When false, skips the built-in orbit camera, light, and ground so the
   * scene module owns cameras, lighting, and world content (e.g. follow cam).
   */
  defaultSceneContent?: boolean
  /** Rendered instead of the error panel when WebGL is unavailable (e.g. landing backdrop). */
  fallback?: React.ReactNode
  /** Minimum canvas height in px. Set 0 to fill a sized parent (landing backdrop). */
  minHeight?: number
}

export function BabylonCanvas({
  onSceneReady,
  className = '',
  style = {},
  defaultSceneContent = true,
  fallback,
  minHeight = 400,
}: BabylonCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const engineRef = useRef<Engine | null>(null)
  const sceneRef = useRef<import('@babylonjs/core').Scene | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const [engineError, setEngineError] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true

    const handleResize = () => {
      if (engineRef.current) {
        engineRef.current.resize()
      }
    }
    window.addEventListener('resize', handleResize)

    const initEngine = async () => {
      const canvas = canvasRef.current
      if (!canvas) return

      try {
        const engineOptions: EngineOptions = {
          antialias: true,
          stencil: true,
          preserveDrawingBuffer: true,
          powerPreference: 'high-performance',
        }

        const engine = new Engine(canvas, true, engineOptions)
        engineRef.current = engine

        const scene = new Scene(engine)
        sceneRef.current = scene

        scene.clearColor = new Color4(0.07, 0.08, 0.11, 1)

        if (defaultSceneContent) {
          const camera = new ArcRotateCamera('camera', -Math.PI / 2, Math.PI / 3, 25, Vector3.Zero(), scene)
          camera.attachControl(canvas, true)
          camera.lowerRadiusLimit = 3
          camera.upperRadiusLimit = 60
          camera.wheelPrecision = 25

          const light = new HemisphericLight('light', new Vector3(0, 1, 0), scene)
          light.intensity = 0.8
          light.diffuse = new Color3(1, 0.95, 0.9)
          light.specular = new Color3(0.3, 0.3, 0.3)

          import('@babylonjs/core').then(({ MeshBuilder, StandardMaterial, Color3 }) => {
            if (!mountedRef.current) return
            const groundMesh = MeshBuilder.CreateGround('ground', { width: 50, height: 50 }, scene)
            const groundMaterial = new StandardMaterial('groundMat', scene)
            groundMaterial.diffuseColor = new Color3(0.12, 0.15, 0.22)
            groundMaterial.specularColor = Color3.Black()
            groundMesh.material = groundMaterial
            groundMesh.receiveShadows = true
          })
        }

        engine.runRenderLoop(() => {
          if (sceneRef.current && mountedRef.current) {
            sceneRef.current.render()
          }
        })

        if (onSceneReady) {
          onSceneReady(scene, canvas)
        }

        setIsInitialized(true)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to initialize Babylon.js engine'
        setEngineError(message)
        console.error('[BabylonCanvas] Engine initialization error:', err)
      }
    }

    initEngine()

    return () => {
      mountedRef.current = false
      window.removeEventListener('resize', handleResize)
      // Capture the frame ID before any potential async operations
      // eslint-disable-next-line react-hooks/exhaustive-deps
      const frameId = animationFrameRef.current
      if (frameId !== undefined && frameId !== null) {
        cancelAnimationFrame(frameId)
      }
      if (sceneRef.current) {
        sceneRef.current.dispose()
        sceneRef.current = null
      }
      if (engineRef.current) {
        engineRef.current.stopRenderLoop()
        engineRef.current.dispose()
        engineRef.current = null
      }
    }
  }, [onSceneReady, defaultSceneContent])

  if (engineError) {
    if (fallback) {
      return (
        <div className={`relative h-full w-full ${className}`} style={style}>
          {fallback}
        </div>
      )
    }
    return (
      <div className={`relative w-full h-full min-h-[400px] ${className}`} style={{ ...style, minHeight: `${Math.max(minHeight, 400)}px` }}>
        <div className="absolute inset-0 flex items-center justify-center bg-dark-bg text-center p-6 rounded-brand-xl border border-life-red/50">
          <div className="space-y-3">
            <div className="text-4xl" aria-hidden="true">⚠️</div>
            <h3 className="font-display font-bold text-warm-ivory">3D Engine Failed to Initialize</h3>
            <p className="text-body-sm text-muted-text max-w-md mx-auto">
              WebGL could not be initialized. This may be due to browser settings, driver issues, or hardware limitations.
            </p>
            <details className="text-left max-w-md mx-auto text-xs text-muted-text/70">
              <summary className="cursor-pointer text-life-red hover:text-life-red/80">Error Details</summary>
              <pre className="mt-2 p-2 bg-navy/50 rounded text-left overflow-auto">{engineError}</pre>
            </details>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative w-full h-full ${className}`} style={style}>
      <canvas
        ref={canvasRef}
        className="w-full h-full block touch-none"
        style={{
          width: '100%',
          height: '100%',
          minHeight: `${minHeight}px`,
          display: 'block',
        }}
        aria-label="Life in Africa 3D world view"
      />
      {!isInitialized && (
        <div className="absolute inset-0 flex items-center justify-center bg-abyss z-10">
          <div className="text-center space-y-3 text-text-dim">
            <div className="w-10 h-10 border-2 border-life-red border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-body-sm">Building the world…</p>
          </div>
        </div>
      )}
    </div>
  )
}