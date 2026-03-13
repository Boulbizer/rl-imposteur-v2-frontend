// pages/Home.jsx
// Page d'accueil : créer une salle OU coller un lien pour rejoindre

import { useState } from 'react'
import { useGame } from '../hooks/useGame'

export default function Home() {
  const { createRoom, loading, error } = useGame()
  const [name, setName] = useState('')

  function handleCreate(e) {
    e.preventDefault()
    if (!name.trim()) return
    createRoom(name.trim())
  }

  return (
    <div className="page">
      <div style={{ width: '100%', maxWidth: 440, display: 'flex', flexDirection: 'column', gap: '2rem' }}>

        {/* Logo / Titre */}
        <div style={{ textAlign: 'center' }} className="fade-up">
          <div style={{
            fontSize: '3.5rem',
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            lineHeight: 1,
          }}>
            <span style={{ color: 'var(--cyan)' }}>RL</span>
            <span style={{ color: 'var(--text)' }}> Imposteur</span>
          </div>
          <div style={{
            fontSize: '1rem',
            fontFamily: 'var(--font-display)',
            color: 'var(--purple)',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            marginTop: '0.25rem',
          }}>
            Version 2.0
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.75rem' }}>
            Joue à Rocket League. Repère l'imposteur.
          </p>
        </div>

        {/* Carte principale */}
        <div className="card-glow fade-up" style={{ animationDelay: '0.1s' }}>
          <h2 style={{ fontSize: '1.2rem', color: 'var(--text)', marginBottom: '1.5rem' }}>
            Créer une partie
          </h2>

          <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Ton pseudo
              </label>
              <input
                className="input"
                type="text"
                placeholder="Ex : SonicBoom_77"
                value={name}
                onChange={e => setName(e.target.value)}
                maxLength={20}
                autoFocus
              />
            </div>

            {error && <div className="error-msg">{error}</div>}

            <button
              className="btn btn-primary btn-full neon-pulse"
              type="submit"
              disabled={!name.trim() || loading}
            >
              {loading ? <span className="spinner" /> : '⚡ Créer la partie'}
            </button>
          </form>
        </div>

        {/* Info rejoindre */}
        <div className="fade-up" style={{
          animationDelay: '0.2s',
          textAlign: 'center',
          color: 'var(--text-muted)',
          fontSize: '0.85rem',
          padding: '1rem',
          border: '1px dashed var(--border)',
          borderRadius: 'var(--radius)',
        }}>
          <span style={{ color: 'var(--cyan)' }}>Tu as un lien d'invitation ?</span>
          <br />
          Clique dessus directement — il t'amènera dans la salle.
        </div>

      </div>
    </div>
  )
}
