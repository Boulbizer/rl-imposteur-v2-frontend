// pages/Vote.jsx
// Glassmorphism light UI — centered column layout

import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useGame } from '../hooks/useGame'
import Avatar from '../components/Avatar'

export default function Vote() {
  const { roomId } = useParams()
  const { room, socketId, castVote, votesCount } = useGame()
  const [selected, setSelected] = useState(null)
  const [hasVoted, setHasVoted] = useState(false)

  if (!room) return null

  const totalPlayers = room.players.length
  const otherPlayers = room.players.filter(p => p.id !== socketId)
  const progressPct = totalPlayers > 0 ? (votesCount / totalPlayers) * 100 : 0

  function handleVote() {
    if (!selected || hasVoted) return
    castVote(roomId, selected)
    setHasVoted(true)
  }

  return (
    <div className="container fade-up" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '1.5rem',
      padding: '2rem 1rem',
      minHeight: '100vh',
    }}>

      {/* 1. Vote header */}
      <div style={{ textAlign: 'center', marginBottom: '0.25rem' }}>
        <div style={{ fontSize: 48, lineHeight: 1, marginBottom: '0.5rem' }}>🕵️</div>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
          fontWeight: 700,
          color: 'var(--text-primary)',
          marginBottom: '0.35rem',
        }}>
          Qui est l'imposteur ?
        </h1>
        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '0.95rem',
        }}>
          Designez le joueur que vous suspectez
        </p>
      </div>

      {/* 2. Progress indicator */}
      <div
        className="glass"
        style={{
          width: '100%',
          maxWidth: 600,
          padding: '1.25rem 1.5rem',
          borderRadius: 'var(--radius-md)',
        }}
      >
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.6rem',
        }}>
          <span style={{
            fontSize: '0.9rem',
            color: 'var(--text-secondary)',
          }}>
            Votes recus
          </span>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: '1.05rem',
            color: 'var(--accent-orange)',
          }}>
            {votesCount} / {totalPlayers}
          </span>
        </div>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        <p style={{
          fontSize: '0.85rem',
          color: 'var(--text-tertiary)',
          textAlign: 'center',
          marginTop: '0.65rem',
          marginBottom: 0,
        }}>
          {votesCount} / {totalPlayers} ont vote
        </p>
      </div>

      {/* 3. Vote grid or confirmation */}
      {!hasVoted ? (
        <>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: '1rem',
            width: '100%',
            maxWidth: 700,
          }}>
            {otherPlayers.map(player => {
              const isSelected = selected === player.id
              return (
                <div
                  key={player.id}
                  className={`vote-card${isSelected ? ' selected' : ''}`}
                  onClick={() => setSelected(player.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setSelected(player.id) }}
                >
                  <Avatar name={player.name} size="md" />

                  <span style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 600,
                    fontSize: '1rem',
                    color: 'var(--text-primary)',
                    marginTop: '0.5rem',
                  }}>
                    {player.name}
                  </span>

                  {isSelected && (
                    <span style={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      width: 24,
                      height: 24,
                      borderRadius: 'var(--radius-full)',
                      background: 'var(--accent-violet)',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                    }}>
                      ✓
                    </span>
                  )}
                </div>
              )
            })}
          </div>

          {/* 4. Confirm bar */}
          <div style={{
            width: '100%',
            maxWidth: 700,
            display: 'flex',
            justifyContent: 'center',
          }}>
            <button
              className="btn btn-primary"
              onClick={handleVote}
              disabled={!selected}
              style={{
                minWidth: 240,
                opacity: selected ? 1 : 0.5,
                cursor: selected ? 'pointer' : 'not-allowed',
              }}
            >
              Confirmer mon vote
            </button>
          </div>
        </>
      ) : (
        /* 5. Confirmation card */
        <div
          className="glass-strong"
          style={{
            width: '100%',
            maxWidth: 480,
            textAlign: 'center',
            padding: '2.5rem 2rem',
            borderRadius: 'var(--radius-lg)',
          }}
        >
          <div style={{
            width: 56,
            height: 56,
            borderRadius: 'var(--radius-full)',
            background: 'rgba(34, 197, 94, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            fontSize: '1.6rem',
          }}>
            ✅
          </div>

          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: '1.4rem',
            color: 'var(--accent-green)',
            marginBottom: '0.5rem',
          }}>
            Vote enregistre !
          </h2>

          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '0.95rem',
            marginBottom: '0.25rem',
          }}>
            Tu as vote contre{' '}
            <strong style={{ color: 'var(--text-primary)' }}>
              {room.players.find(p => p.id === selected)?.name}
            </strong>
          </p>

          <p style={{
            color: 'var(--text-tertiary)',
            fontSize: '0.88rem',
            marginTop: '1rem',
          }}>
            En attente des autres joueurs...
          </p>
        </div>
      )}
    </div>
  )
}
