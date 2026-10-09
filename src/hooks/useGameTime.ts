import { useState, useEffect, useCallback } from 'react'
import type { GameConfig } from '../types'
import { DEFAULT_GAME_CONFIG } from '../types'

interface GameTimeState {
  gameHours: number
  gameDay: number // 0 = Sunday
  realTimeElapsed: number
  isRunning: boolean
  timeScale: number
}

export function useGameTime(config: Partial<GameConfig> = {}) {
  const mergedConfig = { ...DEFAULT_GAME_CONFIG, ...config }
  const [state, setState] = useState<GameTimeState>({
    gameHours: 0,
    gameDay: 0,
    realTimeElapsed: 0,
    isRunning: false,
    timeScale: mergedConfig.timeScale,
  })

  const start = useCallback(() => {
    setState(prev => ({ ...prev, isRunning: true }))
  }, [])

  const pause = useCallback(() => {
    setState(prev => ({ ...prev, isRunning: false }))
  }, [])

  const reset = useCallback(() => {
    setState({
      gameHours: 0,
      gameDay: 0,
      realTimeElapsed: 0,
      isRunning: false,
      timeScale: mergedConfig.timeScale,
    })
  }, [mergedConfig.timeScale])

  const setTimeScale = useCallback((scale: number) => {
    setState(prev => ({ ...prev, timeScale: scale }))
  }, [])

  const advanceTime = useCallback((hours: number) => {
    setState(prev => {
      const newGameHours = prev.gameHours + hours
      const newGameDay = Math.floor(newGameHours / 24) % 7
      return {
        ...prev,
        gameHours: newGameHours,
        gameDay: newGameDay,
      }
    })
  }, [])

  // Main game loop - runs every real second
  useEffect(() => {
    if (!state.isRunning) return

    const interval = setInterval(() => {
      setState(prev => {
        // 1 real second = (timeScale / 3600) game hours
        const gameHoursPerSecond = prev.timeScale / 3600
        const newGameHours = prev.gameHours + gameHoursPerSecond
        const newGameDay = Math.floor(newGameHours / 24) % 7
        return {
          ...prev,
          gameHours: newGameHours,
          gameDay: newGameDay,
          realTimeElapsed: prev.realTimeElapsed + 1,
        }
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [state.isRunning, state.timeScale])

  // Persist to localStorage for demo purposes
  useEffect(() => {
    const saved = localStorage.getItem('nigeria-life-game-time')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setState(prev => ({ ...prev, ...parsed, isRunning: false }))
      } catch {
        // Ignore corrupted data
      }
    }
  }, [])

  useEffect(() => {
    if (state.isRunning) {
      localStorage.setItem('nigeria-life-game-time', JSON.stringify(state))
    }
  }, [state])

  return {
    ...state,
    start,
    pause,
    reset,
    setTimeScale,
    advanceTime,
    formattedTime: `${Math.floor(state.gameHours) % 24}:${Math.floor((state.gameHours % 1) * 60).toString().padStart(2, '0')}`,
    dayName: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][state.gameDay],
    isWeekend: state.gameDay === 0 || state.gameDay === 6,
  }
}