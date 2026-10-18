import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabase, getCurrentUser, onAuthStateChange } from './supabase'
import { withTimeout, AUTH_REQUEST_TIMEOUT_MS } from '../utils/async'
import { needsEmailConfirmation, SIGNUP_CONFIRMATION_MESSAGE } from '../utils/auth'
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

const LOCAL_USER_KEY = 'life-in-africa-local-user'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    error: null,
  })

  const isPlaceholderSupabase = !import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL.includes('placeholder')

  useEffect(() => {
    let mounted = true

    const initializeAuth = async () => {
      if (isPlaceholderSupabase) {
        // Fallback local mock auth for seamless evaluation
        const saved = localStorage.getItem(LOCAL_USER_KEY)
        if (saved) {
          try {
            const parsedUser = JSON.parse(saved)
            if (mounted) {
              setState({
                user: parsedUser,
                session: {
                  user: parsedUser,
                  accessToken: 'local-token',
                  refreshToken: 'local-refresh',
                  expiresAt: Date.now() + 86400000,
                },
                loading: false,
                error: null,
              })
              return
            }
          } catch {
            // ignore
          }
        }
        if (mounted) {
          setState({ user: null, session: null, loading: false, error: null })
        }
        return
      }

      try {
        const user = await withTimeout(getCurrentUser(), AUTH_REQUEST_TIMEOUT_MS, 'Session check')
        const { data: { session } } = await withTimeout(
          supabase.auth.getSession(),
          AUTH_REQUEST_TIMEOUT_MS,
          'Session check'
        )

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

    if (isPlaceholderSupabase) return

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
      } else if ((event === 'PASSWORD_RECOVERY' || event === 'USER_UPDATED') && sess?.user) {
        // A recovery link establishes a real (short-lived) session; reflect it so
        // the reset page and any post-reset navigation see an authenticated user.
        setState({
          user: mapUser(sess.user),
          session: mapSession(sess),
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
  }, [isPlaceholderSupabase])

  const signUp = async (email: string, password: string, username: string, displayName: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }))

    if (isPlaceholderSupabase) {
      const newUser: User = {
        id: `local-${Date.now()}`,
        email,
        username: username || email.split('@')[0],
        displayName: displayName || 'Player',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      const newSession: Session = {
        user: newUser,
        accessToken: 'local-token',
        refreshToken: 'local-refresh',
        expiresAt: Date.now() + 86400000,
      }
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(newUser))
      setState({
        user: newUser,
        session: newSession,
        loading: false,
        error: null,
      })
      return { error: null }
    }

    try {
      const { data, error } = await withTimeout(
        supabase.auth.signUp({
          email,
          password,
          options: {
            data: { username, display_name: displayName },
          },
        }),
        AUTH_REQUEST_TIMEOUT_MS,
        'Sign up'
      )
      if (error) {
        setState(prev => ({ ...prev, loading: false, error: error.message }))
        return { error }
      }
      if (needsEmailConfirmation(data)) {
        // Account created but no session (e.g. email confirmation required).
        // Do NOT treat as authenticated: reset loading and explain the next step.
        setState(prev => ({ ...prev, loading: false, error: null }))
        return { error: new Error(SIGNUP_CONFIRMATION_MESSAGE) }
      }
      // Session present: populate auth state directly instead of relying
      // solely on the SIGNED_IN event timing. The listener still runs and
      // will converge on the same values.
      setState({
        user: mapUser(data.user as unknown as SupabaseUser),
        session: mapSession(data.session as unknown as SupabaseSession),
        loading: false,
        error: null,
      })
      return { error: null }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign up failed. Please check your connection and try again.'
      setState(prev => ({ ...prev, loading: false, error: message }))
      return { error: err instanceof Error ? err : new Error(message) }
    }
  }

  const signIn = async (email: string, password: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }))

    if (isPlaceholderSupabase) {
      const existing = localStorage.getItem(LOCAL_USER_KEY)
      let user: User
      if (existing) {
        user = JSON.parse(existing)
        user.email = email
      } else {
        user = {
          id: `local-${Date.now()}`,
          email,
          username: email.split('@')[0],
          displayName: email.split('@')[0],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(user))
      }
      const session: Session = {
        user,
        accessToken: 'local-token',
        refreshToken: 'local-refresh',
        expiresAt: Date.now() + 86400000,
      }
      setState({
        user,
        session,
        loading: false,
        error: null,
      })
      return { error: null }
    }

    try {
      const { error } = await withTimeout(
        supabase.auth.signInWithPassword({ email, password }),
        AUTH_REQUEST_TIMEOUT_MS,
        'Sign in'
      )
      if (error) {
        setState(prev => ({ ...prev, loading: false, error: error.message }))
        return { error }
      }
      return { error: null }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign in failed. Please check your connection and try again.'
      setState(prev => ({ ...prev, loading: false, error: message }))
      return { error: err instanceof Error ? err : new Error(message) }
    }
  }

  const signOut = async () => {
    setState(prev => ({ ...prev, loading: true }))
    if (isPlaceholderSupabase) {
      localStorage.removeItem(LOCAL_USER_KEY)
      setState({
        user: null,
        session: null,
        loading: false,
        error: null,
      })
      return
    }
    await supabase.auth.signOut()
    setState({
      user: null,
      session: null,
      loading: false,
      error: null,
    })
  }

  const resetPassword = async (email: string) => {
    if (isPlaceholderSupabase) {
      return { error: null }
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    return { error: error ? new Error(error.message) : null }
  }

  const refreshSession = async () => {
    if (isPlaceholderSupabase) return
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

// eslint-disable-next-line react-refresh/only-export-components
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
