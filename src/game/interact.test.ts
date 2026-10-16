import { describe, it, expect } from 'vitest'
import { nearestInteractable, resolveCircle, resolveWallSegment } from './interact'

describe('nearestInteractable', () => {
  const spots = [
    { id: 'bed', x: 0, z: 0, radius: 2 },
    { id: 'door', x: 5, z: 0, radius: 2 },
  ]

  it('returns null when nothing is in range', () => {
    expect(nearestInteractable(20, 20, spots)).toBeNull()
  })

  it('returns the in-range interactable', () => {
    expect(nearestInteractable(1, 0, spots)?.id).toBe('bed')
  })

  it('prefers the closest when ranges overlap', () => {
    const overlap = [
      { id: 'a', x: 0, z: 0, radius: 5 },
      { id: 'b', x: 1, z: 0, radius: 5 },
    ]
    expect(nearestInteractable(0.9, 0, overlap)?.id).toBe('b')
  })
})

describe('resolveCircle', () => {
  it('pushes an overlapping point exactly to the combined radius', () => {
    const [x, z] = resolveCircle(1, 0, 0.5, 0, 0, 1)
    expect(Math.hypot(x, z)).toBeCloseTo(1.5, 5)
  })

  it('leaves a clear point untouched', () => {
    expect(resolveCircle(5, 5, 0.5, 0, 0, 1)).toEqual([5, 5])
  })
})

describe('resolveWallSegment', () => {
  it('pushes a point out of a wall corridor', () => {
    const [x, z] = resolveWallSegment(0, 0.2, 0.4, -5, 0, 5, 0, 0.4)
    expect(Math.abs(z)).toBeGreaterThanOrEqual(0.6 - 1e-9)
    expect(x).toBeCloseTo(0, 5)
  })
})
