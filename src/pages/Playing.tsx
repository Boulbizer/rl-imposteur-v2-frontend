// pages/Playing.tsx
// Glassmorphism light UI — centered column layout

import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useGame } from '../hooks/useGame'
import Avatar from '../components/Avatar'
import { MODE_LABELS, ROLE_INFO } from '../lib/roles'

export default function Playing() {
  // La route /room/:roomId garantit la présence du paramètre
  const { roomId = '' } = useParams<{ roomId: string }>()
  const { room, isImpostor, role, mission, clue, socketId, endGame } = useGame()
  // Ancien serveur (sans rôles) : on retombe sur imposteur / équipier
  const info = ROLE_INFO[role ?? (isImpostor ? 'impostor' : 'teammate')]
  const [roleAcknowledged, setRoleAcknowledged] = useState(false)

  if (!room) return null

  const isHost = room.hostId === socketId

  return (
    <div className="container fade-up" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '1.5rem',
      padding: '2rem 1rem',
      minHeight: '100vh',
    }}>

      {/* 1. Role reveal card */}
      <div
        className="glass-strong"
        style={{
          width: '100%',
          maxWidth: 520,
          textAlign: 'center',
          padding: '2.5rem 2rem',
          borderRadius: 'var(--radius-lg)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Tint overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: info.tint,
          pointerEvents: 'none',
          borderRadius: 'inherit',
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 56, lineHeight: 1, marginBottom: '0.75rem' }}>
            {info.emoji}
          </div>

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.6rem, 4vw, 2.2rem)',
            fontWeight: 700,
            color: info.color,
            marginBottom: '0.5rem',
          }} data-testid="role-title">
            {info.title}
          </h1>

          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '0.95rem',
            lineHeight: 1.6,
            maxWidth: 380,
            margin: '0 auto 1.25rem',
          }}>
            {info.goal}
          </p>

          {mission && (
            <div className="glass-subtle" data-testid="mission" style={{
              textAlign: 'left',
              padding: '0.9rem 1.1rem',
              borderRadius: 'var(--radius-md)',
              margin: '0 auto 1rem',
              maxWidth: 420,
            }}>
              <div className="section-label" style={{ marginBottom: '0.35rem' }}>🎯 Ta mission secrète</div>
              <div data-testid="mission-text" style={{ color: 'var(--text-primary)', lineHeight: 1.5 }}>{mission}</div>
            </div>
          )}

          {clue && (
            <div className="glass-subtle" data-testid="clue" style={{
              textAlign: 'left',
              padding: '0.9rem 1.1rem',
              borderRadius: 'var(--radius-md)',
              margin: '0 auto 1rem',
              maxWidth: 420,
            }}>
              <div className="section-label" style={{ marginBottom: '0.35rem' }}>🔎 Ton indice</div>
              <div style={{ color: 'var(--text-primary)', lineHeight: 1.5 }}>{clue}</div>
            </div>
          )}

          {!roleAcknowledged && (
            <button
              className="btn btn-glass"
              onClick={() => setRoleAcknowledged(true)}
            >
              Compris, c'est parti
            </button>
          )}
        </div>
      </div>

      {/* 2. Game status bar */}
      <div
        className="glass"
        style={{
          width: '100%',
          maxWidth: 800,
          padding: '1rem 1.5rem',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        <span className="status-pill" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          color: 'var(--red)',
          borderColor: 'rgba(239, 68, 68, 0.3)',
          background: 'rgba(239, 68, 68, 0.08)',
        }}>
          <span style={{
            width: 8,
            height: 8,
            borderRadius: 'var(--radius-full)',
            background: 'var(--red)',
            display: 'inline-block',
            animation: 'pulse 1.5s ease-in-out infinite',
          }} />
          En cours
        </span>

        <span style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 600,
          fontSize: '0.95rem',
          color: 'var(--text-secondary)',
        }}>
          Manche {room.round} · {MODE_LABELS[room.settings?.mode ?? '3v3']}
        </span>
      </div>

      {/* 3. Players list */}
      <div
        className="glass"
        style={{
          width: '100%',
          maxWidth: 800,
          padding: '1.5rem',
          borderRadius: 'var(--radius-lg)',
        }}
      >
        <div className="section-label" style={{ marginBottom: '1rem' }}>
          Joueurs ({room.players.length})
        </div>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.6rem',
        }}>
          {room.players.map(player => {
            const isSelf = player.id === socketId
            const isPlayerHost = player.id === room.hostId

            return (
              <div
                key={player.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.65rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  background: isSelf
                    ? 'rgba(139, 92, 246, 0.07)'
                    : 'transparent',
                  border: isSelf
                    ? '1px solid rgba(139, 92, 246, 0.2)'
                    : '1px solid transparent',
                }}
              >
                <Avatar name={player.name} size="sm" />

                <span style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 600,
                  fontSize: '1rem',
                  color: 'var(--text-primary)',
                  flex: 1,
                }}>
                  {player.name}
                  {isPlayerHost && (
                    <span style={{ marginLeft: '0.4rem' }} title="Hôte">👑</span>
                  )}
                  {isSelf && (
                    <span style={{
                      marginLeft: '0.4rem',
                      fontSize: '0.82rem',
                      color: 'var(--accent-violet)',
                      fontWeight: 500,
                    }}>
                      (toi)
                    </span>
                  )}
                </span>

                {/* Impostor sees mask next to own name */}
                {isSelf && role && role !== 'teammate' && (
                  <span style={{ fontSize: '1.2rem' }} title={info.label}>{info.emoji}</span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* 4. Host controls */}
      {isHost && (
        <div
          className="glass"
          style={{
            width: '100%',
            maxWidth: 800,
            padding: '1.25rem 1.5rem',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '0.9rem',
            margin: 0,
          }}>
            Quand la manche est terminée, lance le vote.
          </p>
          <button
            className="btn btn-danger"
            onClick={() => endGame(roomId)}
          >
            Fin du match
          </button>
        </div>
      )}

      {/* Pulse animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  )
}
