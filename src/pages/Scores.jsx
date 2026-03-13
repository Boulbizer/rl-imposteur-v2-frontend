// pages/Scores.jsx
// Tableau des scores cumulés sur toutes les manches
// L'hôte peut lancer la manche suivante depuis ici

import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useGame } from '../hooks/useGame'
import socket from '../lib/socket'

// Médailles pour le podium
const MEDALS = ['🥇', '🥈', '🥉']

export default function Scores() {
  const { roomId } = useParams()
  const { scores, room, myName, requestScores, startNextRound } = useGame()

  // Charge les scores au montage
  useEffect(() => {
    if (roomId) requestScores(roomId)
  }, [roomId, requestScores])

  if (!room) return null
  const isHost = room.hostId === socket.id || room.hostName === myName
  const maxScore = scores.length > 0 ? scores[0].total : 1

  return (
    <div className="page" style={{ alignItems: 'flex-start', paddingTop: '2rem' }}>
      <div style={{ width: '100%', maxWidth: 520, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

        {/* Header */}
        <div className="fade-up" style={{ textAlign: 'center' }}>
          <div style={{
            display: 'inline-block',
            padding: '0.3rem 1rem',
            background: '#7c3aed18',
            border: '1px solid var(--purple)',
            borderRadius: 999,
            fontSize: '0.8rem',
            color: '#a78bfa',
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            marginBottom: '1rem',
          }}>
            🏆 Classement général
          </div>
          <h1 style={{ fontSize: '2rem' }}>Scores cumulés</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Manche {room.round} terminée
          </p>
        </div>

        {/* Podium (top 3) */}
        {scores.length >= 1 && (
          <div className="fade-up" style={{
            animationDelay: '0.05s',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-end',
            gap: '0.75rem',
            padding: '1.5rem 0 0',
          }}>
            {/* Réorganise : 2e, 1er, 3e pour l'effet podium */}
            {[1, 0, 2].map(rankIndex => {
              const player = scores[rankIndex]
              if (!player) return <div key={rankIndex} style={{ width: 110 }} />
              const heights = [100, 130, 80]
              const colors = ['var(--amber)', 'var(--cyan)', '#cd7f32']
              return (
                <div key={rankIndex} style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.5rem',
                  width: 110,
                }}>
                  <div style={{ fontSize: '2rem' }}>{MEDALS[rankIndex]}</div>
                  <div style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    color: 'var(--text)',
                    textAlign: 'center',
                    maxWidth: '100%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {player.name}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    fontSize: '1.4rem',
                    color: colors[rankIndex],
                  }}>
                    {player.total}
                  </div>
                  <div style={{
                    width: '100%',
                    height: heights[rankIndex],
                    background: `${colors[rankIndex]}22`,
                    border: `1px solid ${colors[rankIndex]}66`,
                    borderRadius: '8px 8px 0 0',
                    boxShadow: `0 0 20px ${colors[rankIndex]}33`,
                  }} />
                </div>
              )
            })}
          </div>
        )}

        {/* Classement complet */}
        <div className="card fade-up" style={{ animationDelay: '0.1s', padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Classement complet
          </div>

          {scores.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-dim)', fontSize: '0.9rem' }}>
              <span className="spinner" style={{ margin: '0 auto 0.75rem', display: 'block' }} />
              Chargement des scores…
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {scores.map((player, i) => {
                const pct = maxScore > 0 ? (player.total / maxScore) * 100 : 0
                const isMe = player.name === myName
                return (
                  <div key={player.name} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.6rem 0.75rem',
                    background: isMe ? '#7c3aed18' : 'transparent',
                    borderRadius: 'var(--radius)',
                    border: isMe ? '1px solid #7c3aed44' : '1px solid transparent',
                  }}>
                    {/* Rang */}
                    <span style={{
                      width: 28,
                      textAlign: 'center',
                      fontSize: i < 3 ? '1.1rem' : '0.85rem',
                      color: 'var(--text-dim)',
                      fontFamily: 'var(--font-display)',
                      fontWeight: 700,
                      flexShrink: 0,
                    }}>
                      {i < 3 ? MEDALS[i] : `${i + 1}.`}
                    </span>

                    {/* Nom + barre */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontFamily: 'var(--font-display)',
                        fontWeight: 600,
                        fontSize: '0.95rem',
                        color: isMe ? '#a78bfa' : 'var(--text)',
                        marginBottom: '0.25rem',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
                        {player.name}{isMe ? ' (toi)' : ''}
                      </div>
                      <div style={{ background: 'var(--bg-elevated)', borderRadius: 999, height: 4, overflow: 'hidden' }}>
                        <div style={{
                          height: '100%',
                          width: `${pct}%`,
                          background: i === 0 ? 'var(--cyan)' : 'var(--purple)',
                          borderRadius: 999,
                          transition: 'width 1s ease',
                        }} />
                      </div>
                    </div>

                    {/* Score */}
                    <span style={{
                      fontFamily: 'var(--font-display)',
                      fontWeight: 700,
                      fontSize: '1.2rem',
                      color: i === 0 ? 'var(--cyan)' : isMe ? '#a78bfa' : 'var(--text)',
                      flexShrink: 0,
                      minWidth: 40,
                      textAlign: 'right',
                    }}>
                      {player.total}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Système de points — rappel */}
        <div className="fade-up" style={{
          animationDelay: '0.15s',
          padding: '0.75rem 1rem',
          border: '1px dashed var(--border)',
          borderRadius: 'var(--radius)',
          fontSize: '0.82rem',
          color: 'var(--text-dim)',
          display: 'flex',
          gap: '1.5rem',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}>
          <span>🎯 Bon vote → <strong style={{ color: 'var(--text-muted)' }}>+2 pts</strong></span>
          <span>😈 Imposteur non découvert → <strong style={{ color: 'var(--text-muted)' }}>+3 pts</strong></span>
        </div>

        {/* Actions */}
        {isHost ? (
          <div className="fade-up" style={{ animationDelay: '0.2s', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button
              className="btn btn-primary btn-full neon-pulse"
              onClick={() => startNextRound(roomId)}
              style={{ fontSize: '1rem' }}
            >
              🔄 Lancer la manche {room.round + 1}
            </button>
          </div>
        ) : (
          <div className="fade-up" style={{
            animationDelay: '0.2s',
            textAlign: 'center',
            color: 'var(--text-muted)',
            fontSize: '0.9rem',
            padding: '1rem',
            border: '1px dashed var(--border)',
            borderRadius: 'var(--radius)',
          }}>
            ⏳ En attente que <strong style={{ color: 'var(--text)' }}>{room.hostName}</strong> lance la manche suivante…
          </div>
        )}

      </div>
    </div>
  )
}
