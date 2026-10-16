import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth'
import type { PlayerProfile, NeedsState } from '../types'

export function useProfile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<PlayerProfile | null>(null)
  const [needs, setNeeds] = useState<NeedsState | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProfile = useCallback(async () => {
    if (!user) {
      setProfile(null)
      setNeeds(null)
      setLoading(false)
      return
    }

    const isPlaceholderSupabase = !import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL.includes('placeholder')
    if (isPlaceholderSupabase || user.id.startsWith('local-')) {
      // Local fallback mock profile state
      setProfile({
        id: user.id,
        userId: user.id,
        displayName: user.displayName,
        age: 18,
        cashKobo: 1000000,
        bankKobo: 500000,
        currentLocationId: 'home_mushin',
        housingUnitId: 'face_me_i_face_you',
        rentDueDate: new Date(Date.now() + 7 * 86400000).toISOString(),
        lastTickAt: new Date().toISOString(),
        isIncarcerated: false,
        prisonReleaseAt: null,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      })
      setNeeds({
        hunger: 90,
        energy: 85,
        hygiene: 95,
        fun: 60,
        social: 70,
        bladder: 10,
        updatedAt: new Date().toISOString(),
      })
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileError) throw profileError

      // Fetch needs
      const { data: needsData, error: needsError } = await supabase
        .from('player_needs')
        .select('*')
        .eq('player_id', user.id)
        .single()

      if (needsError) throw needsError

      if (profileData) {
        const p = profileData as unknown as {
          id: string
          display_name: string
          age_years: number
          cash_kobo: number
          bank_kobo: number
          current_location_id: string | null
          housing_unit_id: string | null
          rent_due_date: string | null
          last_tick_at: string
          is_incarcerated: boolean
          prison_release_at: string | null
          created_at: string
          updated_at: string
        }
        setProfile({
          id: p.id,
          userId: p.id,
          displayName: p.display_name,
          age: p.age_years,
          cashKobo: p.cash_kobo,
          bankKobo: p.bank_kobo,
          currentLocationId: p.current_location_id,
          housingUnitId: p.housing_unit_id,
          rentDueDate: p.rent_due_date,
          lastTickAt: p.last_tick_at,
          isIncarcerated: p.is_incarcerated,
          prisonReleaseAt: p.prison_release_at,
          createdAt: p.created_at,
          updatedAt: p.updated_at,
        })
      }

      if (needsData) {
        const n = needsData as unknown as {
          hunger: number
          energy: number
          hygiene: number
          fun: number
          social: number
          bladder: number
          updated_at: string
        }
        setNeeds({
          hunger: n.hunger,
          energy: n.energy,
          hygiene: n.hygiene,
          fun: n.fun,
          social: n.social,
          bladder: n.bladder,
          updatedAt: n.updated_at,
        })
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load profile'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  const executeTransaction = async (
    type: string,
    amountKobo: number,
    accountType: 'cash' | 'bank',
    description: string,
    _referenceId?: string
  ) => {
    if (!user) return { success: false, error: 'Not authenticated' }

    const isPlaceholderSupabase = !import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL.includes('placeholder')
    if (isPlaceholderSupabase || user.id.startsWith('local-')) {
      if (!profile) return { success: false, error: 'Profile not loaded' }
      const current = accountType === 'cash' ? profile.cashKobo : profile.bankKobo
      const next = current + amountKobo
      if (next < 0) return { success: false, error: 'Insufficient funds' }

      setProfile(prev => {
        if (!prev) return prev
        return {
          ...prev,
          cashKobo: accountType === 'cash' ? next : prev.cashKobo,
          bankKobo: accountType === 'bank' ? next : prev.bankKobo,
        }
      })
      return { success: true, newBalance: next }
    }

    try {
      const idempotencyKey = `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase.rpc as any)('execute_transaction', {
        p_player_id: user.id,
        p_type: type,
        p_amount_kobo: amountKobo,
        p_account_type: accountType,
        p_description: description,
        p_reference_id: _referenceId || null,
        p_idempotency_key: idempotencyKey,
      })

      if (error) throw error

      const result = data as unknown as { success: boolean; new_balance_kobo: number; error_message: string | null }[]
      if (result && result[0]) {
        if (!result[0].success) {
          return { success: false, error: result[0].error_message || 'Transaction failed' }
        }
        await fetchProfile()
        return { success: true, newBalance: result[0].new_balance_kobo }
      }

      return { success: false, error: 'Unknown transaction response' }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Transaction error'
      return { success: false, error: message }
    }
  }

  return {
    profile,
    needs,
    loading,
    error,
    refreshProfile: fetchProfile,
    executeTransaction,
  }
}
