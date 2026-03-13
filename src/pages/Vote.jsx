// pages/Vote.jsx
// Phase de vote : chaque joueur clique sur l'imposteur présumé

import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useGame } from '../hooks/useGame'

export default function Vote() {
  const { roomId } = useParams()
  const { room, socketId, castVote, votesCount } = useGame()
  const [selected, setSelected] = useState(null)
  const [hasVoted, setHasVoted] = useState(false)

  if (!room) return null

  const totalPlayers = room.players.length

  function handleVote() {
    if (!selected || hasVoted) return
    castVote(roomId, selected)
    setHasVoted(true)
  }

  return (
    <div className="page" style={{ alignItems: 'flex-start', paddingTop: '2rem' }}>
      <div style={{ width: '100%', maxWidth: 520, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

        {/* Header */}
        <div className="fade-up" style={{ textAlign: 'center' }}>
          <div style={{
            display: 'inline-block',
            padding: '0.3rem 1rem',
            background: '#f59e0b15',
            border: '1px solid var(--amber)',
            borderRadius: 999,
            fontSize: '0.8rem',
            color: 'var(--amber)',
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            marginBottom: '1rem',
          }}>
            🗳️ Phase de vote
          </div>
          <h1 style={{ fontSize: '2rem' }}>Qui est l'imposteur ?</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem', fontSize: '0.9rem' }}>
            Désignez le joueur que vous suspectez
          </p>
        </div>

        {/* Barre de progression des votes */}
        <div className="card fade-up" style={{ animationDelay: '0.05s', padding: '1rem 1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Votes reçus</span>
            <span style={{ color: 'var(--amber)', fontFamily: 'var(--font-display)', fontWeight: 700 }}>
              {votesCount} / {totalPlayers}
            </span>
          </div>
          <div style={{ background: 'var(--bg-elevated)', borderRadius: 999, height: 6, overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              background: 'var(--amber)',
              borderRadius: 999,
              width: `${totalPlayers > 0 ? (votesCount / totalPlayers) * 100 : 0}%`,
              transition: 'width 0.4s ease',
              boxShadow: '0 0 8px var(--amber)',
            }} />
          </div>
        </div>

        {/* Grille de vote */}
        {!hasVoted ? (
          <div className="fade-up" style={{ animationDelay: '0.1s' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Sélectionne un joueur
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {room.players
                .filter(p => p.id !== socketId) // on ne vote pas pour soi-même
                .map(player => (
                  <button
                    key={player.id}
                    onClick={() => setSelected(player.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '0.9rem 1.25rem',
                      background: selected === player.id ? '#ef444418' : 'var(--bg-elevated)',
                      border: `2px solid ${selected === player.id ? 'var(--red)' : 'var(--border)'}`,
                      borderRadius: 'var(--radius)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      width: '100%',
                      textAlign: 'left',
                      color: 'var(--text)',
                      boxShadow: selected === player.id ? '0 0 16px var(--red-glow)' : 'none',
                    }}
                  >
                    {/* Avatar */}
                    <div style={{
                      width: 40, height: 40, borderRadius: '50%',
                      background: selected === player.id ? 'var(--red)' : 'var(--bg-card)',
                      border: `2px solid ${selected === player.id ? 'var(--red)' : 'var(--border)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem',
                      color: selected === player.id ? '#fff' : 'var(--text-muted)',
                      transition: 'all 0.2s ease',
                      flexShrink: 0,
                    }}>
                      {player.name[0].toUpperCase()}
                    </div>
                    <span style={{
                      fontFamily: 'var(--font-display)',
                      fontWeight: 600,
                      fontSize: '1.1rem',
                      flex: 1,
                    }}>
                      {player.name}
                      {player.id === room.hostId && <span style={{ color: 'var(--text-dim)', fontWeight: 400, fontSize: '0.8rem', marginLeft: '0.4rem' }}>(hôte)</span>}
                    </span>
                    {selected === player.id && (
                      <span style={{ color: 'var(--red)', fontSize: '1.2rem' }}>🎯</span>
                    )}
                  </button>
                ))}
            </div>

            <button
              className="btn btn-danger btn-full"
              style={{ marginTop: '1rem', fontSize: '1rem' }}
              onClick={handleVote}
              disabled={!selected}
            >
              {selected
                ? `Voter contre ${room.players.find(p => p.id === selected)?.name}`
                : 'Sélectionne un joueur'}
            </button>
          </div>
        ) : (
          /* Confirmation du vote */
          <div className="card-glow fade-up" style={{ animationDelay: '0.1s', textAlign: 'center', padding: '2rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>✅</div>
            <p style={{ color: 'var(--green)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.2rem', marginBottom: '0.5rem' }}>
              Vote enregistré !
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Tu as voté contre <strong style={{ color: 'var(--text)' }}>{room.players.find(p => p.id === selected)?.name}</strong>
            </p>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', marginTop: '0.75rem' }}>
              En attente des autres joueurs…
            </p>
          </div>
        )}

      </div>
    </div>
  )
}
