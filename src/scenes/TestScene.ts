import { Scene, Vector3, Color3, HemisphericLight, DirectionalLight, ShadowGenerator, MeshBuilder, StandardMaterial, TransformNode, Mesh } from '@babylonjs/core'
import '@babylonjs/loaders/glTF'

export interface TestSceneOptions {
  enableShadows?: boolean
  groundSize?: number
}

export async function createTestScene(scene: Scene, options: TestSceneOptions = {}): Promise<{
  ground: Mesh
  root: TransformNode
}> {
  const { enableShadows = true, groundSize = 100 } = options

  const root = new TransformNode('TestSceneRoot', scene)

  const ground = MeshBuilder.CreateGround('testGround', { width: groundSize, height: groundSize, subdivisions: 4 }, scene)
  ground.name = 'testGround'
  ground.parent = root

  const groundMaterial = new StandardMaterial('groundMat', scene)
  groundMaterial.diffuseColor = new Color3(0.12, 0.15, 0.22)
  groundMaterial.specularColor = new Color3(0, 0, 0)
  groundMaterial.roughness = 0.9
  ground.material = groundMaterial
  ground.receiveShadows = true

  const skybox = MeshBuilder.CreateBox('skybox', { size: groundSize * 2 }, scene)
  skybox.name = 'skybox'
  skybox.infiniteDistance = true
  skybox.parent = root

  const skyMaterial = new StandardMaterial('skyMat', scene)
  skyMaterial.backFaceCulling = false
  skyMaterial.disableLighting = true
  skyMaterial.diffuseColor = new Color3(0.07, 0.09, 0.15)
  skyMaterial.specularColor = Color3.Black()
  skybox.material = skyMaterial

  const hemiLight = new HemisphericLight('hemiLight', new Vector3(0, 1, 0), scene)
  hemiLight.intensity = 0.6
  hemiLight.diffuse = new Color3(0.95, 0.9, 0.85)
  hemiLight.specular = new Color3(0.1, 0.1, 0.1)
  hemiLight.groundColor = new Color3(0.05, 0.08, 0.12)

  const sunLight = new DirectionalLight('sunLight', new Vector3(-0.5, -1, -0.3), scene)
  sunLight.intensity = 0.8
  sunLight.diffuse = new Color3(1, 0.95, 0.85)
  sunLight.specular = new Color3(0.3, 0.3, 0.3)
  sunLight.position = new Vector3(50, 100, 50)

  let shadowGenerator: ShadowGenerator | null = null
  if (enableShadows) {
    shadowGenerator = new ShadowGenerator(2048, sunLight)
    shadowGenerator.useBlurExponentialShadowMap = true
    shadowGenerator.blurScale = 2
    shadowGenerator.setDarkness(0.35)
  }

  const testObjects: Mesh[] = []

  const cube = MeshBuilder.CreateBox('testCube', { size: 4 }, scene)
  cube.name = 'testCube'
  cube.position = new Vector3(-8, 2, 0)
  cube.parent = root
  testObjects.push(cube)

  const cubeMaterial = new StandardMaterial('cubeMat', scene)
  cubeMaterial.diffuseColor = new Color3(0.3, 0.4, 0.6)
  cubeMaterial.roughness = 0.6
  cube.material = cubeMaterial
  if (shadowGenerator) shadowGenerator.addShadowCaster(cube)

  const sphere = MeshBuilder.CreateSphere('testSphere', { diameter: 3, segments: 32 }, scene)
  sphere.name = 'testSphere'
  sphere.position = new Vector3(0, 1.5, 6)
  sphere.parent = root
  testObjects.push(sphere)

  const sphereMaterial = new StandardMaterial('sphereMat', scene)
  sphereMaterial.diffuseColor = new Color3(0.6, 0.3, 0.3)
  sphereMaterial.roughness = 0.4
  sphere.material = sphereMaterial
  if (shadowGenerator) shadowGenerator.addShadowCaster(sphere)

  const cylinder = MeshBuilder.CreateCylinder('testCylinder', { height: 5, diameterTop: 1.5, diameterBottom: 2.5 }, scene)
  cylinder.name = 'testCylinder'
  cylinder.position = new Vector3(8, 2.5, -4)
  cylinder.parent = root
  testObjects.push(cylinder)

  const cylinderMaterial = new StandardMaterial('cylinderMat', scene)
  cylinderMaterial.diffuseColor = new Color3(0.55, 0.45, 0.25)
  cylinderMaterial.roughness = 0.5
  cylinder.material = cylinderMaterial
  if (shadowGenerator) shadowGenerator.addShadowCaster(cylinder)

  const torus = MeshBuilder.CreateTorus('testTorus', { diameter: 3, thickness: 1, tessellation: 32 }, scene)
  torus.name = 'testTorus'
  torus.position = new Vector3(-4, 2, -8)
  torus.rotation.x = Math.PI / 4
  torus.parent = root
  testObjects.push(torus)

  const torusMaterial = new StandardMaterial('torusMat', scene)
  torusMaterial.diffuseColor = new Color3(0.25, 0.55, 0.45)
  torusMaterial.roughness = 0.5
  torus.material = torusMaterial
  if (shadowGenerator) shadowGenerator.addShadowCaster(torus)

  const axisRoot = new TransformNode('axisHelper', scene)
  axisRoot.parent = root

  const axisX = MeshBuilder.CreateCylinder('axisX', { height: 10, diameterTop: 0.15, diameterBottom: 0.15 }, scene)
  axisX.position = new Vector3(5, 0, 0)
  axisX.rotation.z = -Math.PI / 2
  axisX.parent = axisRoot
  const axisXMat = new StandardMaterial('axisXMat', scene)
  axisXMat.diffuseColor = new Color3(1, 0.2, 0.2)
  axisXMat.disableLighting = true
  axisX.material = axisXMat

  const axisY = MeshBuilder.CreateCylinder('axisY', { height: 10, diameterTop: 0.15, diameterBottom: 0.15 }, scene)
  axisY.position = new Vector3(0, 5, 0)
  axisY.parent = axisRoot
  const axisYMat = new StandardMaterial('axisYMat', scene)
  axisYMat.diffuseColor = new Color3(0.2, 1, 0.2)
  axisYMat.disableLighting = true
  axisY.material = axisYMat

  const axisZ = MeshBuilder.CreateCylinder('axisZ', { height: 10, diameterTop: 0.15, diameterBottom: 0.15 }, scene)
  axisZ.position = new Vector3(0, 0, 5)
  axisZ.rotation.x = Math.PI / 2
  axisZ.parent = axisRoot
  const axisZMat = new StandardMaterial('axisZMat', scene)
  axisZMat.diffuseColor = new Color3(0.2, 0.4, 1)
  axisZMat.disableLighting = true
  axisZ.material = axisZMat

  if (enableShadows) {
    ground.receiveShadows = true
  }

  return { ground, root }
}

export function disposeTestScene(root: TransformNode): void {
  root.dispose()
}