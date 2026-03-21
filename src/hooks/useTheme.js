import { useState, useCallback } from 'react'

const THEME_KEY = 'rl_theme'
const CONSENT_KEY = 'rl_cookie_consent'

function hasConsent() {
  try {
    return localStorage.getItem(CONSENT_KEY) === 'accepted'
  } catch {
    return false
  }
}

function getSavedTheme() {
  try {
    if (hasConsent()) {
      return localStorage.getItem(THEME_KEY)
    }
  } catch {}
  return null
}

function getInitialTheme() {
  const saved = getSavedTheme()
  if (saved === 'dark' || saved === 'light') return saved
  // Respecte la préférence système
  if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) return 'dark'
  return 'light'
}

export function useTheme() {
  const [theme, setTheme] = useState(getInitialTheme)

  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark'
      // Sauvegarde uniquement si consentement donné
      try {
        if (hasConsent()) {
          localStorage.setItem(THEME_KEY, next)
        }
      } catch {}
      return next
    })
  }, [])

  // Appelé quand l'utilisateur accepte les cookies pour persister le thème courant
  const persistTheme = useCallback((currentTheme) => {
    try {
      localStorage.setItem(THEME_KEY, currentTheme)
    } catch {}
  }, [])

  return { theme, toggleTheme, persistTheme }
}
