// pages/Scores.jsx
// Scores cumulés — Layout split : trophée sur bleu, leaderboard sur noir

import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useGame } from '../hooks/useGame'
import { TrophySilhouette } from '../components/Illustrations'

const MEDALS = ['I', 'II', 'III']

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

      {/* Panneau gauche — Bleu avec trophée */}
      <div className="panel-left fade-up" style={{ background: 'var(--blue)' }}>
        <div className="illustration-container">
          <TrophySilhouette color="#000" opacity={0.06} />
        </div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div className="section-label-dark">Classement general</div>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
            color: 'var(--text-dark)',
            marginBottom: '0.5rem',
          }}>
            Scores cumules
          </h1>
          <p style={{ fontSize: '0.95rem', color: 'rgba(0,0,0,0.6)' }}>
            Apres {room.round} manche{room.round > 1 ? 's' : ''}
          </p>

          {/* Podium visuel (top 3) */}
          {scores.length >= 1 && (
            <div style={{
              display: 'flex',
              alignItems: 'flex-end',
              gap: '0.5rem',
              marginTop: '3rem',
              maxWidth: 320,
            }}>
              {[1, 0, 2].map(rankIndex => {
                const player = scores[rankIndex]
                if (!player) return <div key={rankIndex} style={{ flex: 1 }} />
                const heights = [160, 120, 90]
                return (
                  <div key={rankIndex} style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.3rem',
                  }}>
                    <span style={{
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      color: 'var(--text-dark)',
                      textAlign: 'center',
                      maxWidth: '100%',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {player.name}
                    </span>
                    <span style={{
                      fontSize: '1.3rem',
                      fontWeight: 900,
                      color: 'var(--text-dark)',
                    }}>
                      {player.total}
                    </span>
                    <div style={{
                      width: '100%',
                      height: heights[rankIndex],
                      background: 'rgba(0,0,0,0.12)',
                      borderRadius: '4px 4px 0 0',
                    }} />
                  </div>
                )
              })}
            </div>
          )}

          {/* Systeme de points */}
          <div style={{ marginTop: '2rem', fontSize: '0.85rem', color: 'rgba(0,0,0,0.5)' }}>
            Bon vote +2 pts · Imposteur non decouvert +3 pts
          </div>
        </div>
      </div>

      {/* Panneau droit — Leaderboard sur noir */}
      <div className="panel-right fade-up" style={{ animationDelay: '0.1s', justifyContent: 'flex-start', paddingTop: '3rem' }}>
        <div className="section-label">Classement complet</div>

        {scores.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <div className="spinner" style={{ margin: '0 auto 1rem' }} />
            <p style={{ color: 'var(--text-gray)' }}>Chargement des scores...</p>
          </div>
        ) : (
          <div>
            {scores.map((player, i) => {
              const pct = maxScore > 0 ? (player.total / maxScore) * 100 : 0
              const isMe = player.name === myName
              return (
                <div key={player.name} className="list-row">
                  <div className="row-left" style={{ gap: '1rem' }}>
                    <span style={{
                      width: 30,
                      fontSize: i < 3 ? '0.95rem' : '0.85rem',
                      color: 'var(--text-dim)',
                      fontWeight: 700,
                      flexShrink: 0,
                    }}>
                      {i < 3 ? MEDALS[i] : `${i + 1}.`}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontWeight: isMe ? 800 : 600,
                        color: isMe ? 'var(--blue)' : 'var(--text-light)',
                        marginBottom: '0.35rem',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
                        {player.name}{isMe ? ' (toi)' : ''}
                      </div>
                      <div className="progress-bar">
                        <div className="progress-bar-fill" style={{
                          width: `${pct}%`,
                          background: i === 0 ? 'var(--blue)' : 'var(--text-dim)',
                        }} />
                      </div>
                    </div>
                  </div>
                  <div className="row-right" style={{
                    fontWeight: 900,
                    fontSize: '1.2rem',
                    color: i === 0 ? 'var(--blue)' : isMe ? 'var(--blue)' : 'var(--text-light)',
                  }}>
                    {player.total}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Footer action bar */}
      <div className="action-bar">
        <div className="action-bar-label">
          <span>Manche {room.round} terminee</span>
        </div>
        {isHost ? (
          <button
            className="action-bar-item primary arrow-down-right"
            onClick={() => startNextRound(roomId)}
          >
            Lancer la manche {room.round + 1}
          </button>
        ) : (
          <div className="action-bar-label" style={{ justifyContent: 'flex-end' }}>
            <span>En attente que {room.hostName} lance la manche suivante...</span>
          </div>
        )}
      </div>

    </div>
  )
}
