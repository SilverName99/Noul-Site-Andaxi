import { createContext, useContext, useRef, useState } from 'react'
import type { ReactNode } from 'react'

export type Theme = 'brand' | 'blue'

const STORAGE_KEY = 'andaxi-theme'
const FALLBACK_ANIM_MS = 700

const ThemeContext = createContext<{
  theme: Theme
  setTheme: (theme: Theme) => void
}>({ theme: 'brand', setTheme: () => {} })

const getInitialTheme = (): Theme => {
  // Pe server (prerandare) nu există localStorage: tema implicită.
  if (typeof window === 'undefined') return 'blue'
  try {
    return localStorage.getItem(STORAGE_KEY) === 'brand' ? 'brand' : 'blue'
  } catch {
    return 'blue'
  }
}

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme)
  const animTimeout = useRef<ReturnType<typeof setTimeout>>()

  const setTheme = (next: Theme) => {
    if (next === theme) return

    const apply = () => {
      document.documentElement.dataset.theme = next
      try {
        localStorage.setItem(STORAGE_KEY, next)
      } catch {
        // Fereastră privată / stocare blocată: tema se schimbă doar acum.
      }
      setThemeState(next)
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) {
      apply()
      return
    }

    // Chrome/Edge: cross-fade the whole page between themes.
    if (document.startViewTransition) {
      document.startViewTransition(apply)
      return
    }

    // Fallback (Firefox/Safari): briefly transition colors everywhere.
    const root = document.documentElement
    root.classList.add('theme-anim')
    clearTimeout(animTimeout.current)
    animTimeout.current = setTimeout(
      () => root.classList.remove('theme-anim'),
      FALLBACK_ANIM_MS,
    )
    apply()
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
