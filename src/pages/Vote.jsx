// pages/Vote.jsx
// Phase de vote — Layout split : urne/progression sur coral, choix sur noir

import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useGame } from '../hooks/useGame'
import { BallotBox } from '../components/Illustrations'

export default function Vote() {
  const { roomId } = useParams()
  const { room, socketId, castVote, votesCount } = useGame()
  const [selected, setSelected] = useState(null)
  const [hasVoted, setHasVoted] = useState(false)

  if (!room) return null

  const totalPlayers = room.players.length
  const pct = totalPlayers > 0 ? (votesCount / totalPlayers) * 100 : 0

  function handleVote() {
    if (!selected || hasVoted) return
    castVote(roomId, selected)
    setHasVoted(true)
  }

  return (
    <div className="page-split">

      {/* Panneau gauche — Coral avec progression */}
      <div className="panel-left fade-up" style={{ background: 'var(--coral)' }}>
        <div className="illustration-container">
          <BallotBox color="#000" opacity={0.12} />
        </div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div className="section-label-dark">Phase de vote</div>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
            color: 'var(--text-dark)',
            marginBottom: '2rem',
          }}>
            Qui est l'imposteur ?
          </h1>

          {/* Compteur de votes */}
          <div style={{ marginTop: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'rgba(0,0,0,0.75)', fontWeight: 600 }}>Votes recus</span>
              <span style={{ fontSize: '1.5rem', color: 'var(--text-dark)', fontWeight: 900 }}>
                {votesCount} / {totalPlayers}
              </span>
            </div>
            <div className="progress-bar-dark">
              <div className="progress-bar-dark-fill" style={{ width: `${pct}%` }} />
            </div>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'rgba(0,0,0,0.7)', marginTop: '1.5rem' }}>
            Les resultats seront reveles quand tout le monde aura vote
          </p>
        </div>
      </div>

      {/* Panneau droit — Liste de vote sur noir */}
      <div className="panel-right fade-up" style={{ animationDelay: '0.1s', justifyContent: 'flex-start', paddingTop: '3rem' }}>

        {!hasVoted ? (
          <div>
            <div className="section-label">Designe le joueur que tu suspectes</div>

            {room.players
              .filter(p => p.id !== socketId)
              .map(player => {
                const isSelected = selected === player.id
                return (
                  <div
                    key={player.id}
                    className={`list-row list-row-interactive ${isSelected ? 'list-row-selected' : ''}`}
                    onClick={() => setSelected(player.id)}
                    style={isSelected ? { borderColor: 'var(--coral)' } : {}}
                  >
                    <div className="row-left">
                      <span style={{ fontWeight: 600 }}>
                        {player.name}
                        {player.id === room.hostId && <span style={{ color: 'var(--text-dim)', fontSize: '0.85rem', marginLeft: '0.5rem' }}>hote</span>}
                      </span>
                    </div>
                    <div className="row-right">
                      {isSelected
                        ? <span style={{ color: 'var(--coral)', fontSize: '1.2rem', fontWeight: 900 }}>●</span>
                        : <span style={{ fontSize: '1.2rem' }}>→</span>
                      }
                    </div>
                  </div>
                )
              })}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h2 style={{ fontSize: '2rem', color: 'var(--text-light)' }}>
              Vote enregistre
            </h2>
            <p style={{ color: 'var(--text-gray)', fontSize: '1rem' }}>
              Tu as vote contre <strong style={{ color: 'var(--text-light)' }}>{room.players.find(p => p.id === selected)?.name}</strong>
            </p>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>
              En attente des autres joueurs...
            </p>
          </div>
        )}
      </div>

      {/* Footer action bar */}
      <div className="action-bar">
        <div className="action-bar-label">
          <span>+2 pts bon vote · +3 pts imposteur non decouvert</span>
        </div>
        {!hasVoted ? (
          <button
            className="action-bar-item primary arrow-down-right"
            style={{ color: selected ? 'var(--coral)' : 'var(--text-light)' }}
            onClick={handleVote}
            disabled={!selected}
          >
            {selected
              ? `Voter contre ${room.players.find(p => p.id === selected)?.name}`
              : 'Selectionne un joueur'}
          </button>
        ) : (
          <div className="action-bar-label" style={{ justifyContent: 'flex-end' }}>
            <span>{votesCount} / {totalPlayers} votes</span>
          </div>
        )}
      </div>

    </div>
  )
}
