import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabase, getCurrentUser, onAuthStateChange } from './supabase'
import type { User, Session, AuthState } from '../types'

interface AuthContextType extends AuthState {
  signUp: (email: string, password: string, username: string, displayName: string) => Promise<{ error: Error | null }>
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: Error | null }>
  refreshSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

interface SupabaseUser {
  id: string
  email?: string
  user_metadata?: Record<string, unknown>
  created_at?: string
  updated_at?: string
}

interface SupabaseSession {
  user: SupabaseUser
  access_token: string
  refresh_token: string
  expires_at?: number
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    let mounted = true

    const initializeAuth = async () => {
      try {
        const user = await getCurrentUser()
        const { data: { session } } = await supabase.auth.getSession()

        if (mounted) {
          if (user && session) {
            setState({
              user: mapUser(user as unknown as SupabaseUser),
              session: mapSession(session as unknown as SupabaseSession),
              loading: false,
              error: null,
            })
          } else {
            setState({
              user: null,
              session: null,
              loading: false,
              error: null,
            })
          }
        }
      } catch (err) {
        if (mounted) {
          setState({
            user: null,
            session: null,
            loading: false,
            error: err instanceof Error ? err.message : 'Authentication error',
          })
        }
      }
    }

    initializeAuth()

    const { data: { subscription } } = onAuthStateChange(async (event, session: unknown) => {
      if (!mounted) return

      const sess = session as SupabaseSession | null

      if (event === 'SIGNED_IN' && sess?.user) {
        setState({
          user: mapUser(sess.user),
          session: mapSession(sess),
          loading: false,
          error: null,
        })
      } else if (event === 'SIGNED_OUT') {
        setState({
          user: null,
          session: null,
          loading: false,
          error: null,
        })
      } else if (event === 'TOKEN_REFRESHED' && sess) {
        setState(prev => ({
          ...prev,
          session: mapSession(sess),
        }))
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const signUp = async (email: string, password: string, username: string, displayName: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username, display_name: displayName },
      },
    })
    if (error) {
      setState(prev => ({ ...prev, loading: false, error: error.message }))
      return { error }
    }
    return { error: null }
  }

  const signIn = async (email: string, password: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setState(prev => ({ ...prev, loading: false, error: error.message }))
      return { error }
    }
    return { error: null }
  }

  const signOut = async () => {
    setState(prev => ({ ...prev, loading: true }))
    await supabase.auth.signOut()
    setState({
      user: null,
      session: null,
      loading: false,
      error: null,
    })
  }

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    return { error: error ? new Error(error.message) : null }
  }

  const refreshSession = async () => {
    const { data: { session } } = await supabase.auth.refreshSession()
    if (session) {
      setState(prev => ({ ...prev, session: mapSession(session as unknown as SupabaseSession) }))
    }
  }

  return (
    <AuthContext.Provider value={{ ...state, signUp, signIn, signOut, resetPassword, refreshSession }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

function mapUser(user: SupabaseUser): User {
  return {
    id: user.id,
    email: user.email,
    username: (user.user_metadata?.username as string) || '',
    displayName: (user.user_metadata?.display_name as string) || user.email || 'Player',
    createdAt: user.created_at || new Date().toISOString(),
    updatedAt: user.updated_at || user.created_at || new Date().toISOString(),
  }
}

function mapSession(session: SupabaseSession): Session {
  return {
    user: mapUser(session.user),
    accessToken: session.access_token,
    refreshToken: session.refresh_token,
    expiresAt: session.expires_at ? session.expires_at * 1000 : Date.now() + 3600000,
  }
}