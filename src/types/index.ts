export interface User {
  id: string
  email?: string
  username: string
  displayName: string
  createdAt: string
  updatedAt: string
}

export interface Session {
  user: User
  accessToken: string
  refreshToken: string
  expiresAt: number
}

export interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
  error: string | null
}

export type AuthAction =
  | { type: 'AUTH_INIT' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; session: Session } }
  | { type: 'AUTH_ERROR'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'AUTH_LOADING'; payload: boolean }

export interface GameConfig {
  timeScale: number // real minutes per game hour (default 1)
  offlineDecayCapHours: number // default 8
  rentDay: number // 0 = Sunday, 6 = Saturday
}

export const DEFAULT_GAME_CONFIG: GameConfig = {
  timeScale: 1,
  offlineDecayCapHours: 8,
  rentDay: 6, // Saturday
}

export type NeedType = 'hunger' | 'energy' | 'hygiene' | 'fun' | 'social' | 'bladder'

export interface NeedsState {
  hunger: number
  energy: number
  hygiene: number
  fun: number
  social: number
  bladder: number
  updatedAt: string
}

export interface PlayerProfile {
  id: string
  userId: string
  displayName: string
  age: number
  cashKobo: number
  bankKobo: number
  currentLocationId: string | null
  housingUnitId: string | null
  rentDueDate: string | null
  lastTickAt: string
  isIncarcerated: boolean
  prisonReleaseAt: string | null
  createdAt: string
  updatedAt: string
}

export type LocationKey =
  | 'home'
  | 'balogun_market'
  | 'tech_hub'
  | 'nightlife'
  | 'bank_pos'

export interface Location {
  id: string
  key: LocationKey
  name: string
  description: string
  district: string
  availableActions: string[]
  travelCostKobo: number
  travelTimeMinutes: number
}

export interface JobDefinition {
  id: string
  title: string
  category: 'informal' | 'corporate' | 'tech' | 'business'
  minSkillRequirements: Record<string, number>
  shiftHours: number
  basePayKoboPerHour: number
  stressPerShift: number
  unlockRequirements: Record<string, unknown>
}

export interface SkillDefinition {
  id: string
  name: string
  description: string
  maxLevel: number
  xpCurve: number[]
}