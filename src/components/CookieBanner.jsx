import { useState } from 'react'

const CONSENT_KEY = 'rl_cookie_consent'

function getConsentStatus() {
  try {
    return localStorage.getItem(CONSENT_KEY)
  } catch {
    return null
  }
}

export default function CookieBanner({ onAccept }) {
  const [visible, setVisible] = useState(() => getConsentStatus() === null)

  if (!visible) return null

  function handleAccept() {
    try {
      localStorage.setItem(CONSENT_KEY, 'accepted')
    } catch {}
    setVisible(false)
    onAccept?.()
  }

  function handleRefuse() {
    try {
      localStorage.setItem(CONSENT_KEY, 'refused')
    } catch {}
    setVisible(false)
  }

  return (
    <div className="cookie-banner">
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
      }}>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: '0.95rem',
          color: 'var(--text-primary)',
        }}>
          🍪 Préférences de navigation
        </div>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.85rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.6,
          margin: 0,
        }}>
          Ce site utilise le stockage local de votre navigateur uniquement pour
          mémoriser votre préférence de thème (clair/sombre). Aucune donnée
          personnelle n'est collectée ni partagée avec des tiers.
        </p>
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          justifyContent: 'flex-end',
        }}>
          <button
            className="btn btn-glass"
            onClick={handleRefuse}
            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
          >
            Refuser
          </button>
          <button
            className="btn btn-primary"
            onClick={handleAccept}
            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
          >
            Accepter
          </button>
        </div>
      </div>
    </div>
  )
}
