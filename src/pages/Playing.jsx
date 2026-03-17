// pages/Playing.jsx
// Glassmorphism light UI — centered column layout

import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useGame } from '../hooks/useGame'
import Avatar from '../components/Avatar'
import socket from '../lib/socket'

export default function Playing() {
  const { roomId } = useParams()
  const { room, isImpostor, socketId, endGame } = useGame()
  const actualIsImpostor = sessionStorage.getItem('rl_isImpostor') === 'true'
  const [roleAcknowledged, setRoleAcknowledged] = useState(false)

  if (!room) return null

  const isHost = room.hostId === socket.id

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
          background: actualIsImpostor
            ? 'rgba(220, 38, 38, 0.08)'
            : 'rgba(37, 99, 235, 0.06)',
          pointerEvents: 'none',
          borderRadius: 'inherit',
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 56, lineHeight: 1, marginBottom: '0.75rem' }}>
            {actualIsImpostor ? '🎭' : '⚽'}
          </div>

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.6rem, 4vw, 2.2rem)',
            fontWeight: 700,
            color: actualIsImpostor ? 'var(--impostor-red)' : 'var(--safe-blue)',
            marginBottom: '0.5rem',
          }}>
            {actualIsImpostor ? "Tu es l'Imposteur" : 'Tu es Equipier'}
          </h1>

          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '0.95rem',
            lineHeight: 1.6,
            maxWidth: 380,
            margin: '0 auto 1.25rem',
          }}>
            {actualIsImpostor
              ? "Fais perdre ton equipe sans te faire reperer. Sois subtil et discret."
              : "Joue normalement et observe. Quelqu'un cherche a vous faire perdre."}
          </p>

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
        }}>
          <span style={{
            width: 8,
            height: 8,
            borderRadius: 'var(--radius-full)',
            background: 'var(--accent-red)',
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
          Manche {room.round}{room.totalRounds ? ` / ${room.totalRounds}` : ''}
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
                    <span style={{ marginLeft: '0.4rem' }} title="Hote">👑</span>
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
                {isSelf && actualIsImpostor && (
                  <span style={{ fontSize: '1.2rem' }} title="Tu es l'imposteur">🎭</span>
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
            Quand la manche est terminee, lance le vote.
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
