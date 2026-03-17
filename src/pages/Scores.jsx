// pages/Scores.jsx
// Glassmorphism light UI — podium + sidebar

import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useGame } from '../hooks/useGame'
import Avatar from '../components/Avatar'

const PODIUM_ORDER = [1, 0, 2] // 2nd, 1st, 3rd
const PODIUM_HEIGHTS = [120, 155, 95]
const PODIUM_COLORS = ['#c0c0c0', '#fbbf24', '#cd7f32'] // silver, gold, bronze

export default function Scores() {
  const { roomId } = useParams()
  const { scores, room, myName, amHost, requestScores, startNextRound } = useGame()

  useEffect(() => {
    if (roomId) requestScores(roomId)
  }, [roomId, requestScores])

  if (!room) return null
  const maxScore = scores.length > 0 ? scores[0].total : 1

  // Stats
  const roundsPlayed = room.round || 0
  const avgScore = scores.length > 0
    ? Math.round(scores.reduce((sum, s) => sum + s.total, 0) / scores.length)
    : 0
  const topPlayer = scores.length > 0 ? scores[0].name : '—'

  return (
    <div className="container fade-up" style={{
      display: 'grid',
      gridTemplateColumns: '1fr 320px',
      gap: '1.5rem',
      paddingTop: '2.5rem',
      paddingBottom: '3rem',
      alignItems: 'start',
    }}>

      {/* ── Main card: classement + podium ── */}
      <div className="glass-strong" style={{
        borderRadius: 'var(--radius-lg)',
        padding: '2rem',
      }}>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          fontSize: '1.6rem',
          color: 'var(--text-primary)',
          marginBottom: '0.25rem',
        }}>
          Classement général
        </h1>
        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '0.9rem',
          marginBottom: '2rem',
        }}>
          Après {roundsPlayed} manche{roundsPlayed > 1 ? 's' : ''} sur {room.totalRounds || '?'}
        </p>

        {/* Podium (top 3) */}
        {scores.length >= 1 && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-end',
            gap: '1rem',
            marginBottom: '2rem',
          }}>
            {PODIUM_ORDER.map(rankIndex => {
              const player = scores[rankIndex]
              if (!player) return <div key={rankIndex} style={{ width: 120 }} />
              return (
                <div key={rankIndex} style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.4rem',
                  flex: '0 1 130px',
                }}>
                  <Avatar name={player.name} size="md" />
                  <div style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    color: 'var(--text-primary)',
                    textAlign: 'center',
                    maxWidth: '100%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {player.name}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.8rem',
                    color: 'var(--text-tertiary)',
                  }}>
                    {player.total} pts
                  </div>
                  {/* Podium bar */}
                  <div style={{
                    width: '100%',
                    height: PODIUM_HEIGHTS[rankIndex],
                    background: `${PODIUM_COLORS[rankIndex]}20`,
                    border: `1px solid ${PODIUM_COLORS[rankIndex]}55`,
                    borderRadius: '12px 12px 0 0',
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                    paddingBottom: '0.75rem',
                  }}>
                    <span style={{
                      fontFamily: 'var(--font-display)',
                      fontWeight: 800,
                      fontSize: '1.5rem',
                      color: PODIUM_COLORS[rankIndex],
                    }}>
                      {rankIndex + 1}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Full leaderboard (4th+) */}
        {scores.length > 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {scores.slice(3).map((player, i) => {
              const isMe = player.name === myName
              return (
                <div key={player.name} className="score-row" style={{
                  background: isMe ? 'rgba(139, 92, 246, 0.07)' : undefined,
                  border: isMe ? '1px solid rgba(139, 92, 246, 0.15)' : '1px solid transparent',
                }}>
                  <span className="score-rank">{i + 4}</span>
                  <Avatar name={player.name} size="sm" />
                  <span className="score-player" style={{
                    color: isMe ? 'var(--violet)' : 'var(--text-primary)',
                  }}>
                    {player.name}
                  </span>
                  <span className="score-points">{player.total}</span>
                </div>
              )
            })}
          </div>
        )}

        {scores.length === 0 && (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-tertiary)' }}>
            <div className="spinner" style={{ margin: '0 auto 0.75rem' }} />
            Chargement des scores...
          </div>
        )}
      </div>

      {/* ── Sidebar ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

        {/* Stats card */}
        <div className="glass" style={{
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem',
        }}>
          <h3 style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: '1rem',
            color: 'var(--text-primary)',
            marginBottom: '1rem',
          }}>
            📊 Statistiques
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {[
              { label: 'Manches jouées', value: roundsPlayed },
              { label: 'Score moyen', value: avgScore },
              { label: 'Meilleur joueur', value: topPlayer, color: 'var(--red)' },
            ].map(({ label, value, color }) => (
              <div key={label} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <span style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.88rem',
                  color: 'var(--text-secondary)',
                }}>
                  {label}
                </span>
                <span style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  color: color || 'var(--text-primary)',
                }}>
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Scoring legend */}
        <div className="glass" style={{
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem',
        }}>
          <h3 style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: '1rem',
            color: 'var(--text-primary)',
            marginBottom: '1rem',
          }}>
            🏆 Barème
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            <div>🎯 Bon vote → <strong style={{ color: 'var(--green)' }}>+2 pts</strong></div>
            <div>😈 Non découvert → <strong style={{ color: 'var(--red)' }}>+3 pts</strong></div>
          </div>
        </div>

        {/* Action button */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}>
          {amHost ? (
            <button
              className="btn btn-primary"
              onClick={() => startNextRound(roomId)}
              style={{ width: '100%' }}
            >
              ▶ Manche suivante
            </button>
          ) : (
            <div style={{
              textAlign: 'center',
              color: 'var(--text-secondary)',
              fontSize: '0.88rem',
              padding: '0.5rem',
            }}>
              En attente que <strong style={{ color: 'var(--text-primary)' }}>{room.hostName}</strong> lance la manche suivante...
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
