// pages/Home.jsx
// Cyberpunk style + split fullscreen layout

import { useState } from 'react'
import { useGame } from '../hooks/useGame'
import { CarIllustration } from '../components/Illustrations'

export default function Home() {
  const { createRoom, loading, error } = useGame()
  const [name, setName] = useState('')

  function handleCreate(e) {
    e.preventDefault()
    if (!name.trim()) return
    createRoom(name.trim())
  }

  return (
    <div className="page-split">

      {/* Panneau gauche — Hero + Illustration */}
      <div className="panel-left fade-up" style={{ background: 'linear-gradient(135deg, #07071a 0%, #131335 50%, #0d0d28 100%)' }}>
        <div>
          <div style={{
            fontSize: 'clamp(3.5rem, 6vw, 5.5rem)',
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            lineHeight: 1,
            letterSpacing: '0.03em',
          }}>
            <span style={{ color: 'var(--cyan)' }}>RL</span><br />
            <span className="text-gradient">Imposteur</span>
          </div>
          <div style={{
            fontSize: '0.95rem',
            fontFamily: 'var(--font-display)',
            color: 'var(--purple-soft)',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            marginTop: '0.5rem',
            fontWeight: 600,
          }}>
            Version 2.0
          </div>
        </div>

        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.7, maxWidth: 420 }}>
          Jouez a Rocket League. L'un d'entre vous est un imposteur.
          Trouvez-le avant qu'il ne soit trop tard.
        </p>

        <div className="illustration-container float" style={{ marginTop: '1rem' }}>
          <CarIllustration size={380} />
        </div>
      </div>

      {/* Panneau droit — Formulaire */}
      <div className="panel-right fade-up" style={{ animationDelay: '0.15s' }}>
        <div style={{ maxWidth: 440, width: '100%' }}>
          <div className="card-glow">
            <h2 style={{ fontSize: '1.4rem', color: 'var(--text)', marginBottom: '1.75rem' }}>
              Creer une partie
            </h2>

            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label className="section-label">Ton pseudo</label>
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
            </form>
          </div>

          <div className="card-glass" style={{
            textAlign: 'center',
            color: 'var(--text-muted)',
            fontSize: '0.95rem',
            marginTop: '1rem',
          }}>
            <span style={{ color: 'var(--cyan)', fontWeight: 600 }}>Tu as un lien d'invitation ?</span>
            <br />
            Clique dessus directement — il t'amenera dans la salle.
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginTop: '1rem' }}>
            {[
              { icon: '🎭', label: 'Roles secrets' },
              { icon: '🗳️', label: 'Vote en direct' },
              { icon: '🏆', label: 'Classement' },
            ].map(({ icon, label }) => (
              <div key={label} className="card-glass" style={{
                textAlign: 'center',
                padding: '1rem 0.5rem',
                fontSize: '0.82rem',
                color: 'var(--text-muted)',
              }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.4rem' }}>{icon}</div>
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer action bar */}
      <div className="action-bar">
        <div className="action-bar-label">
          <span>Roles secrets · Vote en direct · Classement</span>
        </div>
        <button
          className={`action-bar-item primary arrow-right ${!name.trim() || loading ? '' : 'neon-pulse'}`}
          onClick={handleCreate}
          disabled={!name.trim() || loading}
        >
          {loading ? <span className="spinner" /> : 'Creer la partie'}
        </button>
      </div>

    </div>
  )
}
