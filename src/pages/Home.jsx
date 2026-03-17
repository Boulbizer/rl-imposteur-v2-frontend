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
          background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-violet), #ec4899)',
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
          background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-violet), #ec4899)',
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
          margin: '0 auto 2rem',
        }}>
          Jouez a Rocket League. L'un d'entre vous est un imposteur.
          Trouvez-le avant qu'il ne soit trop tard.
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          <button
            className="btn btn-primary"
            onClick={handleCreate}
            disabled={!name.trim() || loading}
          >
            {loading ? 'Creation...' : 'Creer une partie'}
          </button>
          <button
            className="btn btn-glass"
            onClick={() => {
              const code = prompt('Code de la salle :')
              if (code) window.location.href = `/room/${code.trim()}`
            }}
          >
            Rejoindre
          </button>
        </div>
      </div>

      {/* Name input card */}
      <div className="glass-strong" style={{
        padding: '2rem',
        width: '100%',
        maxWidth: 440,
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
            title: 'Role secret',
            desc: 'Un imposteur est designe au hasard parmi les joueurs a chaque manche.',
          },
          {
            icon: '⚽',
            title: 'Rocket League',
            desc: "Jouez votre match normalement. L'imposteur doit saboter discretement.",
          },
          {
            icon: '🗳️',
            title: 'Phase de vote',
            desc: 'A la fin du match, tout le monde vote pour demasquer le traitre.',
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
    </div>
  )
}
