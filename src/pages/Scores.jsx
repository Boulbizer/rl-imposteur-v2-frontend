// pages/Scores.jsx
// Cyberpunk style + split fullscreen layout

import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useGame } from '../hooks/useGame'
import { TrophyIllustration } from '../components/Illustrations'

const MEDALS = ['🥇', '🥈', '🥉']

export default function Scores() {
  const { roomId } = useParams()
  const { scores, room, myName, amHost, requestScores, startNextRound } = useGame()

  useEffect(() => {
    if (roomId) requestScores(roomId)
  }, [roomId, requestScores])

  if (!room) return null
  const isHost = amHost
  const maxScore = scores.length > 0 ? scores[0].total : 1

  return (
    <div className="page-split">

      {/* Panneau gauche — Trophée + Podium */}
      <div className="panel-left fade-up" style={{
        background: 'linear-gradient(135deg, #07071a 0%, #131335 50%, #0d0d28 100%)',
        alignItems: 'center',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div className="status-pill" style={{
            background: '#7c3aed15',
            border: '1px solid var(--purple)',
            color: '#a78bfa',
            marginBottom: '1rem',
          }}>
            🏆 Classement general
          </div>
          <h1 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)' }}>Scores cumules</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.3rem' }}>
            Manche {room.round} terminee
          </p>
        </div>

        <div className="float">
          <TrophyIllustration size={260} />
        </div>

        {/* Podium visuel (top 3) */}
        {scores.length >= 1 && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-end',
            gap: '0.75rem',
            width: '100%',
            maxWidth: 400,
          }}>
            {[1, 0, 2].map(rankIndex => {
              const player = scores[rankIndex]
              if (!player) return <div key={rankIndex} style={{ width: 110 }} />
              const heights = [140, 105, 80]
              const colors = ['var(--cyan)', 'var(--amber)', '#cd7f32']
              return (
                <div key={rankIndex} style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.4rem',
                  flex: 1,
                }}>
                  <div style={{ fontSize: '1.8rem' }}>{MEDALS[rankIndex]}</div>
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
                    fontSize: '1.3rem',
                    color: colors[rankIndex],
                  }}>
                    {player.total}
                  </div>
                  <div style={{
                    width: '100%',
                    height: heights[rankIndex],
                    background: `${colors[rankIndex]}18`,
                    border: `1px solid ${colors[rankIndex]}55`,
                    borderRadius: '10px 10px 0 0',
                    boxShadow: `0 0 25px ${colors[rankIndex]}22`,
                  }} />
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Panneau droit — Leaderboard */}
      <div className="panel-right fade-up" style={{ animationDelay: '0.1s', justifyContent: 'flex-start', paddingTop: '3rem' }}>

        <div className="card" style={{ padding: '1.5rem' }}>
          <div className="section-label">Classement complet</div>

          {scores.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-dim)', fontSize: '0.95rem' }}>
              <span className="spinner" style={{ margin: '0 auto 0.75rem', display: 'block' }} />
              Chargement des scores...
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
                    padding: '0.7rem 0.85rem',
                    background: isMe ? '#7c3aed12' : 'transparent',
                    borderRadius: 'var(--radius)',
                    border: isMe ? '1px solid #7c3aed44' : '1px solid transparent',
                  }}>
                    <span style={{
                      width: 30, textAlign: 'center',
                      fontSize: i < 3 ? '1.2rem' : '0.9rem',
                      color: 'var(--text-dim)',
                      fontFamily: 'var(--font-display)',
                      fontWeight: 700,
                      flexShrink: 0,
                    }}>
                      {i < 3 ? MEDALS[i] : `${i + 1}.`}
                    </span>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontFamily: 'var(--font-display)',
                        fontWeight: 600,
                        fontSize: '1rem',
                        color: isMe ? '#a78bfa' : 'var(--text)',
                        marginBottom: '0.3rem',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
                        {player.name}{isMe ? ' (toi)' : ''}
                      </div>
                      <div style={{ background: 'var(--bg-elevated)', borderRadius: 999, height: 6, overflow: 'hidden' }}>
                        <div style={{
                          height: '100%',
                          width: `${pct}%`,
                          background: i === 0 ? 'var(--cyan)' : 'var(--purple)',
                          borderRadius: 999,
                          transition: 'width 1s ease',
                        }} />
                      </div>
                    </div>

                    <span style={{
                      fontFamily: 'var(--font-display)',
                      fontWeight: 700,
                      fontSize: '1.25rem',
                      color: i === 0 ? 'var(--cyan)' : isMe ? '#a78bfa' : 'var(--text)',
                      flexShrink: 0,
                      minWidth: 45,
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

        <div className="card-glass" style={{
          padding: '1rem 1.25rem',
          fontSize: '0.9rem',
          color: 'var(--text-dim)',
          display: 'flex',
          gap: '2rem',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}>
          <span>🎯 Bon vote → <strong style={{ color: 'var(--text-muted)' }}>+2 pts</strong></span>
          <span>😈 Non decouvert → <strong style={{ color: 'var(--text-muted)' }}>+3 pts</strong></span>
        </div>
      </div>

      {/* Footer action bar */}
      <div className="action-bar">
        <div className="action-bar-label">
          <span>Manche {room.round} terminee</span>
        </div>
        {isHost ? (
          <button
            className="action-bar-item primary arrow-right neon-pulse"
            onClick={() => startNextRound(roomId)}
          >
            🔄 Manche {room.round + 1}
          </button>
        ) : (
          <div className="action-bar-label" style={{ justifyContent: 'flex-end' }}>
            En attente que <strong style={{ color: 'var(--text)' }}>{room.hostName}</strong> lance la manche suivante...
          </div>
        )}
      </div>

    </div>
  )
}
