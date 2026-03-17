import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGame } from '../hooks/useGame'

export default function Home() {
  const { createRoom, loading, error } = useGame()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [showJoinModal, setShowJoinModal] = useState(false)
  const [roomCode, setRoomCode] = useState('')

  function handleCreate(e) {
    e.preventDefault()
    if (!name.trim()) return
    createRoom(name.trim())
  }

  function handleJoin(e) {
    e.preventDefault()
    if (!roomCode.trim()) return
    navigate(`/room/${roomCode.trim()}`)
  }

  return (
    <div className="container fade-up" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingTop: '4rem',
      paddingBottom: '4rem',
      gap: '3rem',
    }}>

      {/* Hero */}
      <div style={{ textAlign: 'center', maxWidth: 600 }}>
        {/* Logo icon */}
        <div style={{
          width: 88,
          height: 88,
          borderRadius: 'var(--radius-lg)',
          background: 'linear-gradient(135deg, var(--blue), var(--violet), #ec4899)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem',
          boxShadow: '0 8px 32px rgba(139, 92, 246, 0.25)',
        }}>
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2l9.196 5.308v10.384L12 23 2.804 17.692V7.308z" />
          </svg>
        </div>

        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2.8rem, 5vw, 4rem)',
          fontWeight: 800,
          lineHeight: 1.1,
          background: 'linear-gradient(135deg, var(--blue), var(--violet), #ec4899)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '1rem',
        }}>
          RL Impostor
        </h1>

        <p style={{
          fontFamily: 'var(--font-body)',
          color: 'var(--text-secondary)',
          fontSize: '1.1rem',
          lineHeight: 1.7,
          maxWidth: 480,
          margin: '0 auto',
        }}>
          Jouez à Rocket League. L'un d'entre vous est un imposteur.
          Trouvez-le avant qu'il ne soit trop tard.
        </p>
      </div>

      {/* Name input card + buttons below */}
      <div style={{ width: '100%', maxWidth: 440, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div className="glass-strong" style={{
          padding: '2rem',
          borderRadius: 'var(--radius-lg)',
        }}>
          <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
            {error && <div className="error-msg">{error}</div>}
          </form>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          <button
            className="btn btn-primary"
            onClick={handleCreate}
            disabled={!name.trim() || loading}
          >
            {loading ? 'Création...' : 'Créer une partie'}
          </button>
          <button
            className="btn btn-glass"
            onClick={() => setShowJoinModal(true)}
          >
            Rejoindre
          </button>
        </div>
      </div>

      {/* Feature cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1.25rem',
        width: '100%',
        maxWidth: 720,
      }}>
        {[
          {
            icon: '🎭',
            title: 'Rôle secret',
            desc: 'Un imposteur est désigné au hasard parmi les joueurs à chaque manche.',
          },
          {
            icon: '⚽',
            title: 'Rocket League',
            desc: "Jouez votre match normalement. L'imposteur doit saboter discrètement.",
          },
          {
            icon: '🗳️',
            title: 'Phase de vote',
            desc: 'À la fin du match, tout le monde vote pour démasquer le traître.',
          },
        ].map(({ icon, title, desc }) => (
          <div key={title} className="feature-card glass" style={{
            padding: '1.5rem',
            borderRadius: 'var(--radius-lg)',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{icon}</div>
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: '1.05rem',
              color: 'var(--text-primary)',
              marginBottom: '0.5rem',
            }}>
              {title}
            </h3>
            <p style={{
              fontFamily: 'var(--font-body)',
              color: 'var(--text-tertiary)',
              fontSize: '0.88rem',
              lineHeight: 1.6,
            }}>
              {desc}
            </p>
          </div>
        ))}
      </div>

      {/* Join Room Modal */}
      {showJoinModal && (
        <div className="modal-overlay" onClick={() => setShowJoinModal(false)}>
          <div
            className="glass-strong modal-content fade-up"
            onClick={e => e.stopPropagation()}
            style={{
              padding: '2.5rem',
              borderRadius: 'var(--radius-lg)',
              width: '100%',
              maxWidth: 420,
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🔗</div>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: '1.4rem',
              color: 'var(--text-primary)',
              marginBottom: '0.5rem',
            }}>
              Rejoindre une salle
            </h2>
            <p style={{
              color: 'var(--text-secondary)',
              fontSize: '0.9rem',
              marginBottom: '1.5rem',
            }}>
              Entre le code de la salle pour rejoindre tes amis.
            </p>
            <form onSubmit={handleJoin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input
                className="input"
                type="text"
                placeholder="Code de la salle"
                value={roomCode}
                onChange={e => setRoomCode(e.target.value)}
                autoFocus
                style={{ textAlign: 'center', fontSize: '1.1rem', letterSpacing: '0.1em' }}
              />
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  type="button"
                  className="btn btn-glass"
                  onClick={() => setShowJoinModal(false)}
                  style={{ flex: 1 }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={!roomCode.trim()}
                  style={{ flex: 1 }}
                >
                  Rejoindre
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
