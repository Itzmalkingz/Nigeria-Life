/**
 * Proximity helpers for world interactions.
 * Pure logic (no engine imports) so it stays unit-testable.
 */
export interface InteractablePoint {
  id: string
  x: number
  z: number
  radius: number
}

/** Nearest interactable within its radius of (x, z), or null. */
export function nearestInteractable<T extends InteractablePoint>(
  x: number,
  z: number,
  list: readonly T[]
): T | null {
  let best: T | null = null
  let bestDistance = Infinity
  for (const item of list) {
    const dx = item.x - x
    const dz = item.z - z
    const distance = Math.sqrt(dx * dx + dz * dz)
    if (distance <= item.radius && distance < bestDistance) {
      best = item
      bestDistance = distance
    }
  }
  return best
}

/** Push a point circle (px, pz, pr) out of a blocker circle. Returns corrected [x, z]. */
export function resolveCircle(
  px: number,
  pz: number,
  pr: number,
  cx: number,
  cz: number,
  cr: number
): [number, number] {
  const dx = px - cx
  const dz = pz - cz
  const minDist = pr + cr
  const distSq = dx * dx + dz * dz
  if (distSq >= minDist * minDist || distSq === 0) return [px, pz]
  const dist = Math.sqrt(distSq)
  const push = (minDist - dist) / dist
  return [px + dx * push, pz + dz * push]
}

/**
 * Push a point out of a wall segment (x1,z1)-(x2,z2) treated with thickness.
 * Returns corrected [x, z].
 */
export function resolveWallSegment(
  px: number,
  pz: number,
  pr: number,
  x1: number,
  z1: number,
  x2: number,
  z2: number,
  thickness: number
): [number, number] {
  const segX = x2 - x1
  const segZ = z2 - z1
  const lenSq = segX * segX + segZ * segZ
  if (lenSq === 0) return [px, pz]
  const t = Math.min(1, Math.max(0, ((px - x1) * segX + (pz - z1) * segZ) / lenSq))
  const cx = x1 + segX * t
  const cz = z1 + segZ * t
  return resolveCircle(px, pz, pr, cx, cz, thickness / 2)
}
