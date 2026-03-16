// pages/Vote.jsx
// Phase de vote : chaque joueur clique sur l'imposteur présumé
// Layout 16:9 : grille de vote à gauche, progression + illustration à droite

import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useGame } from '../hooks/useGame'
import { SpyIllustration } from '../components/Illustrations'

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
    <div className="page">
      <div className="layout-split">

        {/* Colonne gauche — Grille de vote ou confirmation */}
        <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* Header */}
          <div>
            <div className="status-pill" style={{
              background: '#f59e0b15',
              border: '1px solid var(--amber)',
              color: 'var(--amber)',
              marginBottom: '1rem',
            }}>
              🗳️ Phase de vote
            </div>
            <h1 style={{ fontSize: '2.2rem' }}>Qui est l'imposteur ?</h1>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.3rem', fontSize: '0.95rem' }}>
              Designez le joueur que vous suspectez
            </p>
          </div>

          {!hasVoted ? (
            <div>
              <div className="section-label">Selectionne un joueur</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {room.players
                  .filter(p => p.id !== socketId)
                  .map(player => (
                    <button
                      key={player.id}
                      onClick={() => setSelected(player.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        padding: '1rem 1.25rem',
                        background: selected === player.id ? '#ef444415' : 'var(--bg-elevated)',
                        border: `2px solid ${selected === player.id ? 'var(--red)' : 'var(--border)'}`,
                        borderRadius: 'var(--radius)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        width: '100%',
                        textAlign: 'left',
                        color: 'var(--text)',
                        boxShadow: selected === player.id ? '0 0 20px var(--red-glow)' : 'none',
                      }}
                    >
                      <div style={{
                        width: 44, height: 44, borderRadius: '50%',
                        background: selected === player.id ? 'var(--red)' : 'var(--bg-card)',
                        border: `2px solid ${selected === player.id ? 'var(--red)' : 'var(--border)'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.2rem',
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
                        {player.id === room.hostId && <span style={{ color: 'var(--text-dim)', fontWeight: 400, fontSize: '0.8rem', marginLeft: '0.4rem' }}>(hote)</span>}
                      </span>
                      {selected === player.id && (
                        <span style={{ color: 'var(--red)', fontSize: '1.3rem' }}>🎯</span>
                      )}
                    </button>
                  ))}
              </div>

              <button
                className="btn btn-danger btn-lg btn-full"
                style={{ marginTop: '1.25rem' }}
                onClick={handleVote}
                disabled={!selected}
              >
                {selected
                  ? `Voter contre ${room.players.find(p => p.id === selected)?.name}`
                  : 'Selectionne un joueur'}
              </button>
            </div>
          ) : (
            <div className="card-glow" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
              <p style={{ color: 'var(--green)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.4rem', marginBottom: '0.5rem' }}>
                Vote enregistre !
              </p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                Tu as vote contre <strong style={{ color: 'var(--text)' }}>{room.players.find(p => p.id === selected)?.name}</strong>
              </p>
              <p style={{ color: 'var(--text-dim)', fontSize: '0.88rem', marginTop: '1rem' }}>
                En attente des autres joueurs...
              </p>
            </div>
          )}
        </div>

        {/* Colonne droite — Progression + Illustration */}
        <div className="fade-up" style={{ animationDelay: '0.1s', display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>

          {/* Illustration */}
          <div className="float">
            <SpyIllustration size={280} />
          </div>

          {/* Barre de progression */}
          <div className="card" style={{ width: '100%', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Votes recus</span>
              <span style={{ color: 'var(--amber)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem' }}>
                {votesCount} / {totalPlayers}
              </span>
            </div>
            <div style={{ background: 'var(--bg-elevated)', borderRadius: 999, height: 8, overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                background: 'var(--amber)',
                borderRadius: 999,
                width: `${totalPlayers > 0 ? (votesCount / totalPlayers) * 100 : 0}%`,
                transition: 'width 0.4s ease',
                boxShadow: '0 0 12px var(--amber)',
              }} />
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-dim)', marginTop: '0.75rem', textAlign: 'center' }}>
              Les resultats seront reveles quand tout le monde aura vote
            </p>
          </div>

          {/* Rappel */}
          <div className="card-glass" style={{ width: '100%', padding: '1.25rem', textAlign: 'center' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <strong style={{ color: 'var(--amber)' }}>+2 pts</strong> si tu votes correctement
              <br />
              <strong style={{ color: 'var(--red)' }}>+3 pts</strong> pour l'imposteur s'il n'est pas decouvert
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
