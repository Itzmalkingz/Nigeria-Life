import {
  Scene,
  Vector3,
  Color3,
  Color4,
  HemisphericLight,
  DirectionalLight,
  ShadowGenerator,
  MeshBuilder,
  StandardMaterial,
  TransformNode,
  Mesh,
  AbstractMesh,
} from '@babylonjs/core'
import { createPlayer, createFollowCamera } from '../game/player'
import type { PlayerHandle, ZoneBounds } from '../game/player'
import { nearestInteractable } from '../game/interact'

export type Zone = 'home' | 'street'

export interface HomeStats {
  energy: number
  hunger: number
}

export interface PromptInfo {
  id: string
  label: string
  emoji: string
}

export interface MushinHomeEvents {
  onPrompt: (prompt: PromptInfo | null) => void
  onStats: (stats: HomeStats) => void
  onZone: (zone: Zone) => void
  onToast: (message: string) => void
}

export interface MushinHomeHandle {
  interact: () => void
  dispose: () => void
}

interface WorldInteractable {
  id: string
  label: string
  emoji: string
  x: number
  z: number
  radius: number
  zone: Zone
  run: () => void
}

interface WallSegment {
  x1: number
  z1: number
  x2: number
  z2: number
  thickness: number
}

type RGB = [number, number, number]

const PLASTER: RGB = [0.82, 0.68, 0.5]
const PLASTER_LIGHT: RGB = [0.88, 0.76, 0.6]
const FLOOR_TILE: RGB = [0.87, 0.83, 0.74]
const WOOD: RGB = [0.42, 0.28, 0.16]
const LEAF: RGB = [0.25, 0.5, 0.25]

function mat(scene: Scene, name: string, color: RGB, opts?: { emissive?: RGB; noLight?: boolean }): StandardMaterial {
  const m = new StandardMaterial(name, scene)
  m.diffuseColor = new Color3(color[0], color[1], color[2])
  m.specularColor = new Color3(0.05, 0.05, 0.05)
  if (opts?.emissive) {
    m.emissiveColor = new Color3(opts.emissive[0], opts.emissive[1], opts.emissive[2])
  }
  if (opts?.noLight) {
    m.disableLighting = true
  }
  return m
}

function box(
  scene: Scene,
  parent: TransformNode | null,
  name: string,
  w: number,
  h: number,
  d: number,
  x: number,
  y: number,
  z: number,
  material: StandardMaterial,
  opts?: { ry?: number; ground?: boolean; shadow?: boolean; shadowGenerator?: ShadowGenerator | null }
): Mesh {
  const mesh = MeshBuilder.CreateBox(name, { width: w, height: h, depth: d }, scene)
  mesh.position = new Vector3(x, y, z)
  if (opts?.ry) mesh.rotation.y = opts.ry
  mesh.material = material
  if (parent) mesh.parent = parent
  if (opts?.ground) mesh.metadata = { isGround: true }
  if (opts?.shadow && opts?.shadowGenerator) opts.shadowGenerator.addShadowCaster(mesh)
  return mesh
}

function buildHome(scene: Scene, shadow: ShadowGenerator | null): { walls: WallSegment[]; blockers: { x: number; z: number; r: number }[] } {
  const root = new TransformNode('home', scene)
  const walls: WallSegment[] = []
  const blockers: { x: number; z: number; r: number }[] = []

  const wallMat = mat(scene, 'wallMat', PLASTER)
  const floorMat = mat(scene, 'floorMat', FLOOR_TILE)
  const woodMat = mat(scene, 'woodMat', WOOD)

  // Floor slab (walkable, tap-to-move target).
  const floor = MeshBuilder.CreateBox('homeFloor', { width: 18, height: 0.3, depth: 14 }, scene)
  floor.position = new Vector3(0, -0.15, 0)
  floor.material = floorMat
  floor.receiveShadows = true
  floor.parent = root
  floor.metadata = { isGround: true }

  const wall = (x1: number, z1: number, x2: number, z2: number, h = 3, t = 0.4, material: StandardMaterial = wallMat) => {
    const len = Math.hypot(x2 - x1, z2 - z1)
    const horizontal = Math.abs(z2 - z1) < 0.01
    const mesh = MeshBuilder.CreateBox(
      `wall-${x1}-${z1}-${x2}-${z2}`,
      horizontal ? { width: len, height: h, depth: t } : { width: t, height: h, depth: len },
      scene
    )
    mesh.position = new Vector3((x1 + x2) / 2, h / 2, (z1 + z2) / 2)
    mesh.material = material
    mesh.parent = root
    walls.push({ x1, z1, x2, z2, thickness: t })
  }

  // Outer walls (front wall leaves a door gap at x in [-1, 1]).
  wall(-9, -7, 9, -7)
  wall(-9, -7, -9, 7)
  wall(9, -7, 9, 7)
  wall(-9, 7, -1, 7)
  wall(1, 7, 9, 7)

  // Interior partitions with door gaps (sitting | bedroom / kitchen).
  wall(0, -7, 0, -4.25)
  wall(0, -2.75, 0, 1.75)
  wall(0, 3.25, 0, 7)
  wall(0, 0, 4, 0)
  wall(5.5, 0, 9, 0)

  // Door frame + ajar leaf on the front wall.
  box(scene, root, 'doorPostL', 0.25, 2.4, 0.5, -1.1, 1.2, 7, woodMat)
  box(scene, root, 'doorPostR', 0.25, 2.4, 0.5, 1.1, 1.2, 7, woodMat)
  box(scene, root, 'doorLintel', 2.45, 0.4, 0.5, 0, 2.6, 7, woodMat)
  box(scene, root, 'doorLeaf', 0.12, 2.2, 1.0, 1.35, 1.1, 6.4, woodMat, { ry: 0.7 })

  // Windows: warm emissive panes on the west and north walls.
  const windowMat = mat(scene, 'windowMat', [0.95, 0.85, 0.6], { emissive: [0.9, 0.75, 0.45], noLight: true })
  box(scene, root, 'windowW', 0.1, 1.2, 1.6, -8.85, 1.7, 2, windowMat)
  box(scene, root, 'windowN', 1.6, 1.2, 0.1, -5, 1.7, -6.85, windowMat)

  // --- Sitting room ---
  const sofaMat = mat(scene, 'sofaMat', [0.18, 0.45, 0.32])
  box(scene, root, 'sofaBase', 0.9, 0.45, 2.4, -5.5, 0.35, 2.5, sofaMat, { shadow: true, shadowGenerator: shadow })
  box(scene, root, 'sofaBack', 0.35, 0.9, 2.4, -6.0, 0.8, 2.5, sofaMat)
  box(scene, root, 'sofaArmA', 0.9, 0.7, 0.3, -5.5, 0.55, 1.45, sofaMat)
  box(scene, root, 'sofaArmB', 0.9, 0.7, 0.3, -5.5, 0.55, 3.55, sofaMat)
  blockers.push({ x: -5.6, z: 2.5, r: 1.5 })

  const rugMat = mat(scene, 'rugMat', [0.94, 0.27, 0.24])
  box(scene, root, 'rug', 3.6, 0.04, 2.8, -3.2, 0.02, 2.5, rugMat)

  const tableMat = mat(scene, 'tableMat', WOOD)
  box(scene, root, 'coffeeTable', 1.2, 0.4, 0.7, -3.2, 0.22, 2.5, tableMat)
  blockers.push({ x: -3.2, z: 2.5, r: 0.8 })

  const tvMat = mat(scene, 'tvMat', [0.05, 0.05, 0.06])
  box(scene, root, 'tvStand', 0.5, 0.5, 1.8, -0.5, 0.25, 2.5, tableMat)
  box(scene, root, 'tvBody', 0.12, 0.9, 1.6, -0.45, 1.15, 2.5, tvMat)
  const screenMat = mat(scene, 'tvScreen', [0.1, 0.2, 0.35], { emissive: [0.15, 0.35, 0.6], noLight: true })
  box(scene, root, 'tvScreen', 0.04, 0.75, 1.45, -0.38, 1.15, 2.5, screenMat)
  blockers.push({ x: -0.5, z: 2.5, r: 0.8 })

  box(scene, root, 'armchair', 0.9, 0.7, 0.9, -5.5, 0.35, -0.8, mat(scene, 'chairMat', [0.75, 0.5, 0.3]))
  blockers.push({ x: -5.5, z: -0.8, r: 0.7 })

  // Floor lamp with a warm glowing shade (emissive only; the sun lights the day scene).
  box(scene, root, 'lampPole', 0.12, 1.8, 0.12, -8, 0.9, 6, woodMat)
  const shadeMat = mat(scene, 'lampShade', [1, 0.9, 0.7], { emissive: [1, 0.8, 0.5], noLight: true })
  const shade = MeshBuilder.CreateCylinder('lampShade', { height: 0.4, diameterTop: 0.35, diameterBottom: 0.5 }, scene)
  shade.position = new Vector3(-8, 1.95, 6)
  shade.material = shadeMat
  shade.parent = root
  blockers.push({ x: -8, z: 6, r: 0.3 })

  box(scene, root, 'plantPot', 0.5, 0.5, 0.5, -8.2, 0.25, -6.2, mat(scene, 'potMat', [0.6, 0.35, 0.2]))
  const leaves = MeshBuilder.CreateSphere('plantLeaves', { diameter: 1, segments: 10 }, scene)
  leaves.position = new Vector3(-8.2, 1.1, -6.2)
  leaves.material = mat(scene, 'leafMat', LEAF)
  leaves.parent = root
  blockers.push({ x: -8.2, z: -6.2, r: 0.45 })

  // --- Bedroom ---
  const bedFrame = mat(scene, 'bedFrameMat', WOOD)
  box(scene, root, 'bedFrame', 2.2, 0.3, 3.2, 5.5, 0.2, -4, bedFrame, { shadow: true, shadowGenerator: shadow })
  box(scene, root, 'mattress', 2.0, 0.28, 3.0, 5.5, 0.48, -4, mat(scene, 'mattressMat', [0.96, 0.95, 0.91]))
  box(scene, root, 'blanket', 2.02, 0.12, 1.7, 5.5, 0.6, -3.35, mat(scene, 'blanketMat', [0.15, 0.39, 0.85]))
  box(scene, root, 'pillow', 1.2, 0.18, 0.6, 5.5, 0.62, -5.1, mat(scene, 'pillowMat', [0.98, 0.97, 0.94]))
  box(scene, root, 'headboard', 2.2, 1.0, 0.15, 5.5, 0.6, -5.65, bedFrame)
  blockers.push({ x: 5.5, z: -4, r: 2.0 })

  box(scene, root, 'wardrobe', 1.1, 2.2, 2.4, 8.2, 1.1, -4, mat(scene, 'wardrobeMat', [0.5, 0.33, 0.18]))
  blockers.push({ x: 8.2, z: -4, r: 1.2 })

  const tubMat = mat(scene, 'tubMat', [0.93, 0.93, 0.95])
  box(scene, root, 'tub', 1.7, 0.6, 0.95, 7.6, 0.3, -0.9, tubMat)
  box(scene, root, 'toiletBase', 0.5, 0.45, 0.6, 5.9, 0.22, -0.6, tubMat)
  box(scene, root, 'toiletTank', 0.5, 0.5, 0.25, 5.9, 0.65, -0.32, tubMat)
  blockers.push({ x: 7.6, z: -0.9, r: 1.1 })
  blockers.push({ x: 5.9, z: -0.6, r: 0.5 })

  // --- Kitchen ---
  const counterMat = mat(scene, 'counterMat', [0.7, 0.7, 0.72])
  box(scene, root, 'counterA', 0.7, 0.9, 3.4, 8.5, 0.45, 3.2, counterMat)
  box(scene, root, 'counterB', 2.4, 0.9, 0.7, 7.2, 0.45, 5.4, counterMat)
  blockers.push({ x: 8.5, z: 3.2, r: 1.2 })
  box(scene, root, 'fridge', 0.9, 1.9, 0.9, 8.3, 0.95, 1.2, mat(scene, 'fridgeMat', [0.94, 0.94, 0.96]))
  blockers.push({ x: 8.3, z: 1.2, r: 0.8 })
  const stoveMat = mat(scene, 'stoveMat', [0.12, 0.12, 0.14])
  box(scene, root, 'stove', 0.9, 0.85, 0.9, 6.3, 0.42, 5.9, stoveMat)
  for (const [bx, bz] of [[6.1, 5.7], [6.5, 5.7], [6.1, 6.1], [6.5, 6.1]] as const) {
    const burner = MeshBuilder.CreateCylinder(`burner-${bx}-${bz}`, { height: 0.05, diameterTop: 0.22, diameterBottom: 0.22 }, scene)
    burner.position = new Vector3(bx, 0.87, bz)
    burner.material = stoveMat
    burner.parent = root
  }
  blockers.push({ x: 6.3, z: 5.9, r: 0.8 })

  const diningTop = MeshBuilder.CreateCylinder('diningTable', { height: 0.08, diameterTop: 1.5, diameterBottom: 1.5 }, scene)
  diningTop.position = new Vector3(3.2, 0.75, 4.2)
  diningTop.material = tableMat
  diningTop.parent = root
  box(scene, root, 'diningLeg', 0.15, 0.75, 0.15, 3.2, 0.37, 4.2, tableMat)
  const stoolMat = mat(scene, 'stoolMat', [0.55, 0.36, 0.2])
  for (const [sx, sz] of [[2.2, 4.2], [4.2, 4.2], [3.2, 3.2], [3.2, 5.2]] as const) {
    const stool = MeshBuilder.CreateCylinder(`stool-${sx}-${sz}`, { height: 0.45, diameterTop: 0.4, diameterBottom: 0.4 }, scene)
    stool.position = new Vector3(sx, 0.22, sz)
    stool.material = stoolMat
    stool.parent = root
  }
  blockers.push({ x: 3.2, z: 4.2, r: 1.0 })

  return { walls, blockers }
}

function buildStreet(scene: Scene, shadow: ShadowGenerator | null): { blockers: { x: number; z: number; r: number }[] } {
  const root = new TransformNode('street', scene)
  const blockers: { x: number; z: number; r: number }[] = []

  const sandMat = mat(scene, 'sandMat', [0.74, 0.68, 0.53])
  const ground = MeshBuilder.CreateGround('streetGround', { width: 160, height: 100, subdivisions: 1 }, scene)
  ground.position = new Vector3(40, -0.05, 0)
  ground.material = sandMat
  ground.receiveShadows = true
  ground.metadata = { isGround: true }

  const asphaltMat = mat(scene, 'asphaltMat', [0.16, 0.16, 0.18])
  const road = MeshBuilder.CreateBox('road', { width: 48, height: 0.08, depth: 6 }, scene)
  road.position = new Vector3(60, 0.0, 0)
  road.material = asphaltMat
  road.receiveShadows = true
  road.metadata = { isGround: true }

  const dashMat = mat(scene, 'dashMat', [0.95, 0.95, 0.9], { noLight: true })
  for (let x = 39; x <= 81; x += 4) {
    box(scene, root, `dash-${x}`, 1.6, 0.02, 0.25, x, 0.05, 0, dashMat)
  }

  const walkMat = mat(scene, 'walkMat', [0.68, 0.65, 0.58])
  const walkN = MeshBuilder.CreateBox('walkN', { width: 48, height: 0.08, depth: 3 }, scene)
  walkN.position = new Vector3(60, 0.0, 4.5)
  walkN.material = walkMat
  walkN.receiveShadows = true
  walkN.metadata = { isGround: true }
  const walkS = MeshBuilder.CreateBox('walkS', { width: 48, height: 0.08, depth: 3 }, scene)
  walkS.position = new Vector3(60, 0.0, -4.5)
  walkS.material = walkMat
  walkS.receiveShadows = true
  walkS.metadata = { isGround: true }

  // Compound houses (north side) in varied plaster tones.
  const houseTones: RGB[] = [[0.9, 0.82, 0.66], [0.85, 0.62, 0.5], [0.62, 0.75, 0.66]]
  ;[52, 62, 72].forEach((hx, i) => {
    const tone = mat(scene, `houseMat${i}`, houseTones[i])
    box(scene, root, `house${i}`, 7, 4, 5, hx, 2, -11, tone, { shadow: true, shadowGenerator: shadow })
    box(scene, root, `roof${i}`, 7.6, 0.3, 5.6, hx, 4.15, -11, mat(scene, `roofMat${i}`, [0.45, 0.3, 0.22]))
    const winMat = mat(scene, `houseWin${i}`, [0.9, 0.8, 0.55], { emissive: [0.7, 0.55, 0.3], noLight: true })
    box(scene, root, `houseWin${i}`, 1.2, 1.0, 0.1, hx - 1.5, 2.2, -8.45, winMat)
    blockers.push({ x: hx, z: -11, r: 4.2 })
  })

  // Market stalls with striped awnings (south side).
  const awningA = mat(scene, 'awningA', [0.94, 0.27, 0.24])
  const awningB = mat(scene, 'awningB', [0.96, 0.95, 0.91])
  const poleMat = mat(scene, 'poleMat', WOOD)
  ;[56, 64].forEach((sx, i) => {
    for (const [px, pz] of [[sx - 1.5, 8], [sx + 1.5, 8], [sx - 1.5, 10.5], [sx + 1.5, 10.5]] as const) {
      box(scene, root, `stall${i}-pole-${px}`, 0.12, 2.4, 0.12, px, 1.2, pz, poleMat)
    }
    for (let s = 0; s < 6; s++) {
      box(scene, root, `stall${i}-stripe-${s}`, 0.55, 0.08, 3.0, sx - 1.4 + s * 0.56, 2.5, 9.25, s % 2 === 0 ? awningA : awningB, { ry: 0.12 })
    }
    box(scene, root, `stall${i}-table`, 2.6, 0.8, 1.4, sx, 0.4, 9.2, poleMat)
    box(scene, root, `stall${i}-crate`, 0.7, 0.7, 0.7, sx + 2.1, 0.35, 9.6, mat(scene, `crateMat${i}`, [0.6, 0.44, 0.26]))
    blockers.push({ x: sx, z: 9.2, r: 1.9 })
  })

  // Streetlights (emissive lamps; the sun does the lighting in this day scene).
  const lampMat = mat(scene, 'streetLamp', [1, 0.95, 0.8], { emissive: [1, 0.9, 0.65], noLight: true })
  const darkMetal = mat(scene, 'darkMetal', [0.2, 0.2, 0.22])
  for (const lx of [46, 58, 70]) {
    box(scene, root, `lampPole${lx}`, 0.18, 5, 0.18, lx, 2.5, -5, darkMetal)
    const bulb = MeshBuilder.CreateSphere(`lampBulb${lx}`, { diameter: 0.5, segments: 10 }, scene)
    bulb.position = new Vector3(lx, 5.1, -5)
    bulb.material = lampMat
    bulb.parent = root
    blockers.push({ x: lx, z: -5, r: 0.3 })
  }

  // Trees.
  const trunkMat = mat(scene, 'trunkMat', [0.4, 0.28, 0.16])
  for (const [tx, tz] of [[44, 9], [66, -15], [78, 7]] as const) {
    const trunk = MeshBuilder.CreateCylinder(`tree${tx}-trunk`, { height: 2.2, diameterTop: 0.3, diameterBottom: 0.4 }, scene)
    trunk.position = new Vector3(tx, 1.1, tz)
    trunk.material = trunkMat
    trunk.parent = root
    const crownMat = mat(scene, `crownMat${tx}`, LEAF)
    const crown = MeshBuilder.CreateSphere(`tree${tx}-crown`, { diameter: 2.4, segments: 10 }, scene)
    crown.position = new Vector3(tx, 3.1, tz)
    crown.material = crownMat
    crown.parent = root
    if (shadow) shadow.addShadowCaster(crown)
    blockers.push({ x: tx, z: tz, r: 0.7 })
  }

  // Yellow danfo bus parked at the curb.
  const danfoMat = mat(scene, 'danfoMat', [1.0, 0.78, 0.08])
  box(scene, root, 'danfoBody', 5.2, 1.9, 2.0, 70, 1.35, -1.6, danfoMat, { shadow: true, shadowGenerator: shadow })
  box(scene, root, 'danfoWindows', 4.6, 0.6, 2.02, 70, 1.75, -1.6, mat(scene, 'danfoGlass', [0.12, 0.16, 0.2]))
  const wheelMat = mat(scene, 'wheelMat', [0.08, 0.08, 0.09])
  for (const [wx, wz] of [[68.2, -0.75], [71.8, -0.75], [68.2, -2.45], [71.8, -2.45]] as const) {
    const wheel = MeshBuilder.CreateCylinder(`danfoWheel${wx}-${wz}`, { height: 0.3, diameterTop: 0.7, diameterBottom: 0.7 }, scene)
    wheel.rotation.x = Math.PI / 2
    wheel.position = new Vector3(wx, 0.35, wz)
    wheel.material = wheelMat
    wheel.parent = root
  }
  blockers.push({ x: 70, z: -1.6, r: 3.0 })

  // Front gate arch marking the compound entrance (teleport point back home).
  box(scene, root, 'gatePostL', 0.4, 2.6, 0.4, 45.2, 1.3, 6, mat(scene, 'gateMat', PLASTER_LIGHT))
  box(scene, root, 'gatePostR', 0.4, 2.6, 0.4, 48.8, 1.3, 6, mat(scene, 'gateMat2', PLASTER_LIGHT))
  box(scene, root, 'gateBeam', 4.0, 0.4, 0.4, 47, 2.7, 6, mat(scene, 'gateBeamMat', WOOD))

  return { blockers }
}

export function createMushinHome(
  scene: Scene,
  canvas: HTMLCanvasElement,
  events: MushinHomeEvents
): MushinHomeHandle {
  scene.clearColor = new Color4(0.62, 0.8, 0.92, 1)
  scene.fogMode = Scene.FOGMODE_LINEAR
  scene.fogStart = 70
  scene.fogEnd = 190

  const hemi = new HemisphericLight('homeHemi', new Vector3(0, 1, 0), scene)
  hemi.intensity = 0.75
  hemi.diffuse = new Color3(1, 0.97, 0.92)
  hemi.specular = new Color3(0.2, 0.2, 0.2)
  hemi.groundColor = new Color3(0.45, 0.38, 0.3)

  const sun = new DirectionalLight('homeSun', new Vector3(-0.45, -1, -0.35), scene)
  sun.position = new Vector3(60, 90, 40)
  sun.intensity = 1.1
  sun.diffuse = new Color3(1, 0.96, 0.88)
  sun.specular = new Color3(0.3, 0.3, 0.3)

  const shadows = new ShadowGenerator(1024, sun)
  shadows.useBlurExponentialShadowMap = true
  shadows.setDarkness(0.3)

  const home = buildHome(scene, shadows)
  const street = buildStreet(scene, shadows)

  const homeBounds: ZoneBounds = { minX: -8.2, maxX: 8.2, minZ: -6.2, maxZ: 6.2 }
  const streetBounds: ZoneBounds = { minX: 40, maxX: 80, minZ: -14, maxZ: 14 }

  let zone: Zone = 'home'
  let energy = 85
  let hunger = 90
  let lastPromptId: string | null = null
  let lastEnergyShown = -1
  let lastHungerShown = -1

  const camera = createFollowCamera(scene, canvas, new Vector3(-4, 1.2, 4))

  const setZone = (next: Zone, spawnX: number, spawnZ: number, notice: string) => {
    zone = next
    player.setPosition(spawnX, spawnZ)
    camera.radius = next === 'home' ? 15 : 19
    events.onZone(next)
    events.onToast(notice)
    lastPromptId = null
  }

  const interactables: WorldInteractable[] = [
    {
      id: 'bed', label: 'Sleep until rested', emoji: '🛏️', x: 5.5, z: -1.6, radius: 2.4, zone: 'home',
      run: () => {
        energy = 100
        events.onStats({ energy: Math.round(energy), hunger: Math.round(hunger) })
        events.onToast('😴 You slept soundly. Energy fully restored.')
      },
    },
    {
      id: 'homeDoor', label: 'Go outside', emoji: '🚪', x: 0, z: 6.1, radius: 2.2, zone: 'home',
      run: () => setZone('street', 47, 8.5, '🛣️ Mushin Street, Lagos — the city is alive.'),
    },
    {
      id: 'streetDoor', label: 'Go back inside', emoji: '🏠', x: 47, z: 6, radius: 2.6, zone: 'street',
      run: () => setZone('home', 0, 5.2, '🏠 Home sweet home. Face-me-I-face-you, Mushin.'),
    },
    {
      id: 'vendor', label: 'Buy hot akara', emoji: '🍢', x: 56, z: 9.2, radius: 2.6, zone: 'street',
      run: () => {
        hunger = 100
        events.onStats({ energy: Math.round(energy), hunger: Math.round(hunger) })
        events.onToast('🔥 Hot akara, fresh from the pan! Hunger satisfied.')
      },
    },
  ]

  const pickupGround = (screenX: number, screenY: number): Vector3 | null => {
    const pick = scene.pick(screenX, screenY, (mesh: AbstractMesh) => mesh.metadata?.isGround === true)
    if (pick?.hit && pick.pickedPoint) return pick.pickedPoint
    return null
  }

  const player: PlayerHandle = createPlayer({
    scene,
    canvas,
    camera,
    getBounds: () => (zone === 'home' ? homeBounds : streetBounds),
    getBlockers: () => (zone === 'home' ? home.blockers : street.blockers),
    getWalls: () => (zone === 'home' ? home.walls : []),
    pickupGround,
    onInteractKey: () => handle.interact(),
  })
  player.setPosition(-4, 4)
  for (const mesh of player.root.getChildMeshes()) {
    shadows.addShadowCaster(mesh)
  }

  const handle: MushinHomeHandle = {
    interact: () => {
      const pos = player.getPosition()
      const options = interactables.filter(i => i.zone === zone)
      const hit = nearestInteractable(pos.x, pos.z, options)
      if (hit) hit.run()
    },
    dispose: () => {
      scene.onBeforeRenderObservable.remove(observer)
      player.dispose()
    },
  }

  const observer = scene.onBeforeRenderObservable.add(() => {
    const dt = scene.getEngine().getDeltaTime() / 1000
    if (dt <= 0) return
    player.update(dt)

    hunger = Math.max(0, hunger - dt * 0.35)
    energy = Math.max(0, energy - dt * 0.12)
    const shownEnergy = Math.round(energy)
    const shownHunger = Math.round(hunger)
    if (shownEnergy !== lastEnergyShown || shownHunger !== lastHungerShown) {
      lastEnergyShown = shownEnergy
      lastHungerShown = shownHunger
      events.onStats({ energy: shownEnergy, hunger: shownHunger })
    }

    const pos = player.getPosition()
    const prompt = nearestInteractable(pos.x, pos.z, interactables.filter(i => i.zone === zone))
    const promptId = prompt ? prompt.id : null
    if (promptId !== lastPromptId) {
      lastPromptId = promptId
      events.onPrompt(prompt ? { id: prompt.id, label: prompt.label, emoji: prompt.emoji } : null)
    }
  })

  events.onZone('home')
  events.onStats({ energy: Math.round(energy), hunger: Math.round(hunger) })
  events.onToast('🏠 Welcome home. Walk with WASD or tap the ground — press E near glowing spots.')

  return handle
}
