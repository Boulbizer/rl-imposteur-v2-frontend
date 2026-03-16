// pages/Home.jsx
// Page d'accueil : créer une salle OU coller un lien pour rejoindre
// Layout 16:9 : illustration à gauche, formulaire à droite

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
    <div className="page">
      <div className="layout-split">

        {/* Colonne gauche — Hero + Illustration */}
        <div className="hero-side fade-up">
          <div>
            <div style={{
              fontSize: '4.5rem',
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              lineHeight: 1,
              letterSpacing: '0.03em',
            }}>
              <span style={{ color: 'var(--cyan)' }}>RL</span><br />
              <span className="text-gradient">Imposteur</span>
            </div>
            <div style={{
              fontSize: '0.9rem',
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

          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.7, maxWidth: 400 }}>
            Jouez a Rocket League. L'un d'entre vous est un imposteur.
            Trouvez-le avant qu'il ne soit trop tard.
          </p>

          {/* Illustration */}
          <div className="hero-illustration float" style={{ marginTop: '1rem' }}>
            <CarIllustration size={360} />
          </div>
        </div>

        {/* Colonne droite — Formulaire */}
        <div className="fade-up" style={{ animationDelay: '0.15s', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* Carte principale */}
          <div className="card-glow">
            <h2 style={{ fontSize: '1.3rem', color: 'var(--text)', marginBottom: '1.75rem' }}>
              Creer une partie
            </h2>

            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.82rem',
                  color: 'var(--text-muted)',
                  marginBottom: '0.6rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 600,
                }}>
                  Ton pseudo
                </label>
                <input
                  className="input input-lg"
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
                className="btn btn-primary btn-lg btn-full neon-pulse"
                type="submit"
                disabled={!name.trim() || loading}
              >
                {loading ? <span className="spinner" /> : 'Creer la partie'}
              </button>
            </form>
          </div>

          {/* Info rejoindre */}
          <div className="card-glass" style={{
            textAlign: 'center',
            color: 'var(--text-muted)',
            fontSize: '0.9rem',
          }}>
            <span style={{ color: 'var(--cyan)', fontWeight: 600 }}>Tu as un lien d'invitation ?</span>
            <br />
            Clique dessus directement — il t'amenera dans la salle.
          </div>

          {/* Mini features */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
            {[
              { icon: '🎭', label: 'Roles secrets' },
              { icon: '🗳️', label: 'Vote en direct' },
              { icon: '🏆', label: 'Classement' },
            ].map(({ icon, label }) => (
              <div key={label} className="card-glass" style={{
                textAlign: 'center',
                padding: '1rem 0.5rem',
                fontSize: '0.78rem',
                color: 'var(--text-muted)',
              }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.4rem' }}>{icon}</div>
                {label}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
