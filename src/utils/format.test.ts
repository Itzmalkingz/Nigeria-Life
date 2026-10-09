import { describe, it, expect } from 'vitest'
import {
  formatKobo,
  formatKoboCompact,
  parseKobo,
  formatGameTime,
  formatDayName,
  isWeekend,
  clamp,
  generateId,
} from './format'

describe('format utilities', () => {
  describe('formatKobo', () => {
    it('formats kobo as NGN currency', () => {
      expect(formatKobo(0)).toBe('₦0.00')
      expect(formatKobo(100)).toBe('₦1.00')
      expect(formatKobo(150000)).toBe('₦1,500.00')
      expect(formatKobo(150050)).toBe('₦1,500.50')
      expect(formatKobo(10000000)).toBe('₦100,000.00')
    })
  })

  describe('formatKoboCompact', () => {
    it('formats large amounts compactly', () => {
      expect(formatKoboCompact(50000)).toBe('₦500')
      expect(formatKoboCompact(1500000)).toBe('₦1.5K')
      expect(formatKoboCompact(25000000)).toBe('₦250K')
      expect(formatKoboCompact(1500000000)).toBe('₦1.5M')
    })
  })

  describe('parseKobo', () => {
    it('parses currency strings to kobo', () => {
      expect(parseKobo('₦1,500')).toBe(150000)
      expect(parseKobo('1500.50')).toBe(150050)
      expect(parseKobo('₦ 1,000,000')).toBe(100000000)
      expect(parseKobo('invalid')).toBe(0)
    })
  })

  describe('formatGameTime', () => {
    it('formats game hours to 12-hour time', () => {
      expect(formatGameTime(0)).toBe('12:00 AM')
      expect(formatGameTime(6.5)).toBe('6:30 AM')
      expect(formatGameTime(12)).toBe('12:00 PM')
      expect(formatGameTime(18.25)).toBe('6:15 PM')
      expect(formatGameTime(23.75)).toBe('11:45 PM')
    })
  })

  describe('formatDayName', () => {
    it('returns day names', () => {
      expect(formatDayName(0)).toBe('Sunday')
      expect(formatDayName(3)).toBe('Wednesday')
      expect(formatDayName(6)).toBe('Saturday')
      expect(formatDayName(7)).toBe('Sunday')
    })
  })

  describe('isWeekend', () => {
    it('identifies weekend days', () => {
      expect(isWeekend(0)).toBe(true)
      expect(isWeekend(5)).toBe(false)
      expect(isWeekend(6)).toBe(true)
      expect(isWeekend(7)).toBe(true)
    })
  })

  describe('clamp', () => {
    it('clamps values between min and max', () => {
      expect(clamp(5, 0, 10)).toBe(5)
      expect(clamp(-5, 0, 10)).toBe(0)
      expect(clamp(15, 0, 10)).toBe(10)
    })
  })

  describe('generateId', () => {
    it('generates unique IDs', () => {
      const ids = new Set()
      for (let i = 0; i < 100; i++) {
        ids.add(generateId())
      }
      expect(ids.size).toBe(100)
    })
  })
})