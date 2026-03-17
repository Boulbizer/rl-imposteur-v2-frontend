// pages/Home.jsx
// Page d'accueil — Layout split : panneau bleu + formulaire sur noir

import { useState } from 'react'
import { useGame } from '../hooks/useGame'
import { MaskPattern, CarSilhouette } from '../components/Illustrations'

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

      {/* Panneau gauche — Bleu avec illustration */}
      <div className="panel-left fade-up" style={{ background: 'var(--blue)' }}>
        <div className="illustration-container">
          <MaskPattern color="#000" opacity={0.12} />
        </div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{
            fontSize: 'clamp(3rem, 6vw, 5.5rem)',
            color: 'var(--text-dark)',
            marginBottom: '1.5rem',
          }}>
            RL<br />
            Imposteur
          </h1>
          <p style={{
            fontSize: '1.1rem',
            color: 'rgba(0,0,0,0.75)',
            maxWidth: 400,
            lineHeight: 1.6,
          }}>
            Jouez a Rocket League. L'un d'entre vous est un imposteur.
            Trouvez-le avant qu'il ne soit trop tard.
          </p>
        </div>
      </div>

      {/* Panneau droit — Noir avec formulaire */}
      <div className="panel-right fade-up" style={{ animationDelay: '0.1s' }}>
        <div style={{ maxWidth: 400 }}>
          <div className="section-label">Creer une partie</div>

          <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1rem' }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.85rem',
                color: 'var(--text-gray)',
                marginBottom: '0.5rem',
                fontWeight: 500,
              }}>
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

            <p style={{ color: 'var(--text-gray)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Tu as un lien d'invitation ? Clique dessus directement — il t'amenera dans la salle.
            </p>
          </form>
        </div>
      </div>

      {/* Footer action bar */}
      <div className="action-bar">
        <div className="action-bar-label">
          <span>Roles secrets · Vote en direct · Classement</span>
        </div>
        <button
          className="action-bar-item primary arrow-down-right"
          onClick={handleCreate}
          disabled={!name.trim() || loading}
        >
          {loading ? <span className="spinner" /> : 'Creer la partie'}
        </button>
      </div>

    </div>
  )
}
