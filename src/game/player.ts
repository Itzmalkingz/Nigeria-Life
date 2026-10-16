import {
  Scene,
  TransformNode,
  MeshBuilder,
  StandardMaterial,
  Color3,
  Vector3,
  ArcRotateCamera,
} from '@babylonjs/core'

export const PLAYER_SPEED = 4.5
const PLAYER_RADIUS = 0.4
const ARRIVE_DISTANCE = 0.35

export interface ZoneBounds {
  minX: number
  maxX: number
  minZ: number
  maxZ: number
}

export interface PlayerOptions {
  scene: Scene
  canvas: HTMLCanvasElement
  camera: ArcRotateCamera
  getBounds: () => ZoneBounds
  getBlockers: () => { x: number; z: number; r: number }[]
  getWalls: () => { x1: number; z1: number; x2: number; z2: number; thickness: number }[]
  pickupGround: (screenX: number, screenY: number) => Vector3 | null
  onInteractKey: () => void
}

export interface PlayerHandle {
  root: TransformNode
  getPosition: () => Vector3
  setPosition: (x: number, z: number) => void
  stop: () => void
  update: (dt: number) => void
  dispose: () => void
}

function material(scene: Scene, name: string, r: number, g: number, b: number): StandardMaterial {
  const mat = new StandardMaterial(name, scene)
  mat.diffuseColor = new Color3(r, g, b)
  mat.specularColor = new Color3(0.05, 0.05, 0.05)
  return mat
}

/** Stylised low-poly humanoid (~1.7 units tall). Returns root + parts for animation. */
function buildCharacter(scene: Scene): { root: TransformNode; body: TransformNode; legL: TransformNode; legR: TransformNode } {
  const root = new TransformNode('player', scene)
  const body = new TransformNode('playerBody', scene)
  body.parent = root

  const skin = material(scene, 'skinMat', 0.36, 0.23, 0.15)
  const shirt = material(scene, 'shirtMat', 0.15, 0.39, 0.85)
  const trousers = material(scene, 'trousersMat', 0.13, 0.14, 0.19)
  const hair = material(scene, 'hairMat', 0.05, 0.04, 0.04)

  const torso = MeshBuilder.CreateBox('playerTorso', { width: 0.55, height: 0.65, depth: 0.32 }, scene)
  torso.position.y = 1.05
  torso.material = shirt
  torso.parent = body

  const head = MeshBuilder.CreateSphere('playerHead', { diameter: 0.34, segments: 16 }, scene)
  head.position.y = 1.56
  head.material = skin
  head.parent = body

  const hairCap = MeshBuilder.CreateSphere('playerHair', { diameter: 0.35, segments: 12 }, scene)
  hairCap.position.y = 1.62
  hairCap.scaling = new Vector3(1, 0.72, 1)
  hairCap.material = hair
  hairCap.parent = body

  const armL = MeshBuilder.CreateCylinder('playerArmL', { height: 0.55, diameterTop: 0.11, diameterBottom: 0.09 }, scene)
  armL.position = new Vector3(-0.36, 1.05, 0)
  armL.material = shirt
  armL.parent = body

  const armR = MeshBuilder.CreateCylinder('playerArmR', { height: 0.55, diameterTop: 0.11, diameterBottom: 0.09 }, scene)
  armR.position = new Vector3(0.36, 1.05, 0)
  armR.material = shirt
  armR.parent = body

  const legLPivot = new TransformNode('playerLegL', scene)
  legLPivot.position = new Vector3(-0.15, 0.72, 0)
  legLPivot.parent = root
  const legL = MeshBuilder.CreateCylinder('playerLegLMesh', { height: 0.72, diameterTop: 0.14, diameterBottom: 0.11 }, scene)
  legL.position.y = -0.36
  legL.material = trousers
  legL.parent = legLPivot

  const legRPivot = new TransformNode('playerLegR', scene)
  legRPivot.position = new Vector3(0.15, 0.72, 0)
  legRPivot.parent = root
  const legR = MeshBuilder.CreateCylinder('playerLegRMesh', { height: 0.72, diameterTop: 0.14, diameterBottom: 0.11 }, scene)
  legR.position.y = -0.36
  legR.material = trousers
  legR.parent = legRPivot

  return { root, body, legL: legLPivot, legR: legRPivot }
}

function shortestAngle(from: number, to: number): number {
  let d = (to - from) % (Math.PI * 2)
  if (d > Math.PI) d -= Math.PI * 2
  if (d < -Math.PI) d += Math.PI * 2
  return d
}

export function createPlayer(options: PlayerOptions): PlayerHandle {
  const { scene, canvas, camera, getBounds, getBlockers, getWalls, pickupGround, onInteractKey } = options
  const { root, body, legL, legR } = buildCharacter(scene)

  const keys = new Set<string>()
  let target: Vector3 | null = null
  let walkPhase = 0
  let disposed = false

  const onKeyDown = (e: KeyboardEvent) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) e.preventDefault()
    if (e.code === 'KeyE') {
      onInteractKey()
      return
    }
    keys.add(e.code)
    if (keys.size > 0) target = null
  }
  const onKeyUp = (e: KeyboardEvent) => {
    keys.delete(e.code)
  }

  let downX = 0
  let downY = 0
  const onPointerDown = (e: PointerEvent) => {
    downX = e.clientX
    downY = e.clientY
  }
  const onPointerUp = (e: PointerEvent) => {
    const moved = Math.hypot(e.clientX - downX, e.clientY - downY)
    if (moved > 8 || disposed) return
    const rect = canvas.getBoundingClientRect()
    const hit = pickupGround(e.clientX - rect.left, e.clientY - rect.top)
    if (hit) target = hit
  }

  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('keyup', onKeyUp)
  canvas.addEventListener('pointerdown', onPointerDown)
  canvas.addEventListener('pointerup', onPointerUp)

  const cameraOffset = new Vector3(0, 1.2, 0)

  return {
    root,
    getPosition: () => root.position.clone(),
    setPosition: (x: number, z: number) => {
      root.position.x = x
      root.position.z = z
      target = null
    },
    stop: () => {
      target = null
      keys.clear()
    },
    update: (dt: number) => {
      if (disposed || dt <= 0) return
      const frame = Math.min(dt, 0.05)

      let dx = 0
      let dz = 0
      if (keys.has('KeyW') || keys.has('ArrowUp')) dz -= 1
      if (keys.has('KeyS') || keys.has('ArrowDown')) dz += 1
      if (keys.has('KeyA') || keys.has('ArrowLeft')) dx -= 1
      if (keys.has('KeyD') || keys.has('ArrowRight')) dx += 1

      // Camera-relative movement on the ground plane.
      if (dx !== 0 || dz !== 0) {
        const forward = camera.getTarget().subtract(camera.position)
        forward.y = 0
        forward.normalize()
        const right = new Vector3(-forward.z, 0, forward.x)
        const move = forward.scale(-dz).add(right.scale(dx))
        move.normalize()
        dx = move.x
        dz = move.z
      } else if (target) {
        const tx = target.x - root.position.x
        const tz = target.z - root.position.z
        const dist = Math.hypot(tx, tz)
        if (dist < ARRIVE_DISTANCE) {
          target = null
        } else {
          dx = tx / dist
          dz = tz / dist
        }
      }

      const moving = dx !== 0 || dz !== 0
      if (moving) {
        const step = PLAYER_SPEED * frame
        let nx = root.position.x + dx * step
        let nz = root.position.z + dz * step

        const bounds = getBounds()
        nx = Math.min(bounds.maxX, Math.max(bounds.minX, nx))
        nz = Math.min(bounds.maxZ, Math.max(bounds.minZ, nz))

        for (const wall of getWalls()) {
          const segX = wall.x2 - wall.x1
          const segZ = wall.z2 - wall.z1
          const lenSq = segX * segX + segZ * segZ
          if (lenSq === 0) continue
          const t = Math.min(1, Math.max(0, ((nx - wall.x1) * segX + (nz - wall.z1) * segZ) / lenSq))
          const cx = wall.x1 + segX * t
          const cz = wall.z1 + segZ * t
          const ox = nx - cx
          const oz = nz - cz
          const minDist = PLAYER_RADIUS + wall.thickness / 2
          const dSq = ox * ox + oz * oz
          if (dSq < minDist * minDist && dSq > 0) {
            const d = Math.sqrt(dSq)
            nx = cx + (ox / d) * minDist
            nz = cz + (oz / d) * minDist
          }
        }

        for (const blocker of getBlockers()) {
          const ox = nx - blocker.x
          const oz = nz - blocker.z
          const minDist = PLAYER_RADIUS + blocker.r
          const dSq = ox * ox + oz * oz
          if (dSq < minDist * minDist && dSq > 0) {
            const d = Math.sqrt(dSq)
            nx = blocker.x + (ox / d) * minDist
            nz = blocker.z + (oz / d) * minDist
          }
        }

        root.position.x = nx
        root.position.z = nz

        const heading = Math.atan2(dx, dz)
        root.rotation.y += shortestAngle(root.rotation.y, heading) * Math.min(1, frame * 12)

        walkPhase += frame * 11
        const swing = Math.sin(walkPhase)
        legL.rotation.x = swing * 0.55
        legR.rotation.x = -swing * 0.55
        body.position.y = Math.abs(Math.cos(walkPhase)) * 0.05
      } else {
        legL.rotation.x *= 0.8
        legR.rotation.x *= 0.8
        body.position.y *= 0.8
      }

      // Follow camera: keep the player framed, preserve user orbit/zoom.
      const desired = root.position.add(cameraOffset)
      camera.target.x += (desired.x - camera.target.x) * Math.min(1, frame * 5)
      camera.target.y += (desired.y - camera.target.y) * Math.min(1, frame * 5)
      camera.target.z += (desired.z - camera.target.z) * Math.min(1, frame * 5)
    },
    dispose: () => {
      disposed = true
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      canvas.removeEventListener('pointerdown', onPointerDown)
      canvas.removeEventListener('pointerup', onPointerUp)
      root.dispose()
    },
  }
}

/** Third-person follow camera. User can orbit/zoom; the target tracks the player. */
export function createFollowCamera(scene: Scene, canvas: HTMLCanvasElement, startTarget: Vector3): ArcRotateCamera {
  const camera = new ArcRotateCamera('followCamera', -Math.PI / 2, 1.08, 15, startTarget.clone(), scene)
  camera.lowerRadiusLimit = 6
  camera.upperRadiusLimit = 32
  camera.lowerBetaLimit = 0.25
  camera.upperBetaLimit = 1.35
  camera.wheelPrecision = 30
  camera.panningSensibility = 0
  camera.attachControl(canvas, true)
  scene.activeCamera = camera
  return camera
}
