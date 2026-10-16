export function formatKobo(kobo: number): string {
  const naira = kobo / 100
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(naira)
}

export function formatKoboCompact(kobo: number): string {
  const naira = kobo / 100
  if (naira >= 1_000_000) {
    const millions = naira / 1_000_000
    return `₦${millions === Math.floor(millions) ? millions.toFixed(0) : millions.toFixed(1)}M`
  }
  if (naira >= 1_000) {
    const thousands = naira / 1_000
    return `₦${thousands === Math.floor(thousands) ? thousands.toFixed(0) : thousands.toFixed(1)}K`
  }
  return `₦${naira.toLocaleString()}`
}

export function parseKobo(input: string): number {
  const cleaned = input.replace(/[₦,\s]/g, '')
  const naira = parseFloat(cleaned)
  if (isNaN(naira)) return 0
  return Math.round(naira * 100)
}

export function formatTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleTimeString('en-NG', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-NG', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatRelativeTime(from: Date | string, to: Date | string = new Date()): string {
  const fromMs = typeof from === 'string' ? new Date(from).getTime() : from.getTime()
  const toMs = typeof to === 'string' ? new Date(to).getTime() : to.getTime()
  const diffMs = toMs - fromMs
  const diffMinutes = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMinutes < 1) return 'just now'
  if (diffMinutes < 60) return `${diffMinutes}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return formatDate(from)
}

export function formatGameTime(hours: number): string {
  const h = Math.floor(hours) % 24
  const m = Math.floor((hours % 1) * 60)
  const period = h >= 12 ? 'PM' : 'AM'
  const displayHour = h % 12 || 12
  return `${displayHour}:${m.toString().padStart(2, '0')} ${period}`
}

export function formatDayName(dayIndex: number): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  return days[dayIndex % 7]
}

export function isWeekend(dayIndex: number): boolean {
  return dayIndex % 7 === 0 || dayIndex % 7 === 6
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

export function throttle<T extends (...args: unknown[]) => unknown>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}