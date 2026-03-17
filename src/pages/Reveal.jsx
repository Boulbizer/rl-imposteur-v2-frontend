// pages/Reveal.jsx
// Glassmorphism light UI — centered layout

import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useGame } from '../hooks/useGame'
import Avatar from '../components/Avatar'

export default function Reveal() {
  const { roomId } = useParams()
  const navigate = useNavigate()
  const { results, room, socketId, amHost, requestScores, startNextRound } = useGame()

  const [phase, setPhase] = useState('suspense') // 'suspense' | 'reveal' | 'points'

  useEffect(() => {
    if (!results) return
    const t1 = setTimeout(() => setPhase('reveal'), 2500)
    const t2 = setTimeout(() => setPhase('points'), 5000)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [results])

  useEffect(() => {
    if (roomId) requestScores(roomId)
  }, [roomId, requestScores])

  if (!results) return (
    <div className="container fade-up" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '80vh',
      gap: '1rem',
    }}>
      <div className="spinner" style={{ width: 36, height: 36, borderWidth: 3 }} />
      <p style={{ color: 'var(--text-secondary)' }}>Chargement des résultats...</p>
    </div>
  )

  const { impostorFound, impostorName, accusedName, pointsAwarded, players, tally } = results
  const myPoints = socketId ? (pointsAwarded[socketId] || 0) : 0
  const isImpostor = results.impostorId === socketId

  // ── PHASE SUSPENSE ──
  if (phase === 'suspense') {
    return (
      <div className="container fade-up" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh',
        gap: '1.5rem',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: '5rem',
            animation: 'suspensePulse 0.6s ease-in-out infinite alternate',
            marginBottom: '1.5rem',
          }}>
            🕵️
          </div>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
            fontWeight: 800,
            color: 'var(--text-primary)',
            marginBottom: '0.5rem',
          }}>
            Révélation...
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
            Découvrons ensemble qui était l'imposteur
          </p>
          <div style={{ marginTop: '2rem', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                width: 12, height: 12,
                borderRadius: '50%',
                background: 'var(--violet)',
                animation: `dotBounce 1.2s ease-in-out ${i * 0.2}s infinite`,
              }} />
            ))}
          </div>
        </div>
        <style>{`
          @keyframes suspensePulse {
            from { transform: scale(1); }
            to   { transform: scale(1.15); }
          }
          @keyframes dotBounce {
            0%, 100% { transform: translateY(0); opacity: 0.4; }
            50%       { transform: translateY(-12px); opacity: 1; }
          }
        `}</style>
      </div>
    )
  }

  // ── PHASE REVEAL + POINTS ──
  return (
    <div className="container fade-up" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '1.5rem',
      padding: '2rem 1rem',
      paddingBottom: '3rem',
      minHeight: '100vh',
    }}>

      {/* Reveal card */}
      <div className="glass-strong" style={{
        width: '100%',
        maxWidth: 600,
        textAlign: 'center',
        padding: '2.5rem 2rem',
        borderRadius: 'var(--radius-lg)',
        animation: 'revealPop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
      }}>
        <div style={{ fontSize: '3.5rem', marginBottom: '0.75rem' }}>
          {impostorFound ? '🎉' : '😈'}
        </div>

        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.6rem, 4vw, 2.2rem)',
          fontWeight: 800,
          color: 'var(--text-primary)',
          marginBottom: '1rem',
        }}>
          L'imposteur était...
        </h1>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Avatar name={impostorName} size="lg" />
        </div>

        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.4rem, 3vw, 1.8rem)',
          fontWeight: 700,
          color: impostorFound ? 'var(--red)' : 'var(--orange)',
          margin: '0.75rem 0 0.5rem',
        }}>
          {impostorName} !
        </div>

        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '0.95rem',
          lineHeight: 1.6,
          maxWidth: 420,
          margin: '0 auto',
        }}>
          {impostorFound
            ? `L'imposteur a été démasqué par ${tally[results.impostorId] || 0} joueurs sur ${players.length}.`
            : `L'imposteur n'a pas été découvert !`}
          {accusedName && !impostorFound && accusedName !== impostorName && (
            <> Vous avez voté contre <strong style={{ color: 'var(--text-primary)' }}>{accusedName}</strong> — qui était innocent.</>
          )}
        </p>

        <div style={{ marginTop: '1rem' }}>
          <span className={`badge ${impostorFound ? 'badge-found' : 'badge-impostor'}`}>
            {impostorFound ? '✓ Démasqué' : '✗ Non découvert'}
          </span>
        </div>
      </div>

      {/* My points card */}
      {phase === 'points' && (
        <div className="glass fade-up" style={{
          width: '100%',
          maxWidth: 600,
          textAlign: 'center',
          padding: '1.75rem 2rem',
          borderRadius: 'var(--radius-lg)',
        }}>
          <div className="section-label" style={{ marginBottom: '0.5rem' }}>
            Tes points cette manche
          </div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: '3rem',
            fontWeight: 700,
            color: myPoints > 0 ? 'var(--green)' : 'var(--text-tertiary)',
            lineHeight: 1.2,
          }}>
            +{myPoints}
          </div>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            {isImpostor
              ? myPoints > 0 ? '😈 Non découvert — belle performance !' : '😅 Découvert cette fois...'
              : myPoints > 0 ? '🎯 Bonne intuition !' : "😐 Tu n'as pas visé le bon joueur"}
          </div>
        </div>
      )}

      {/* Scores table */}
      {phase === 'points' && (
        <div className="glass-strong fade-up" style={{
          width: '100%',
          maxWidth: 600,
          padding: '1.75rem 2rem',
          borderRadius: 'var(--radius-lg)',
        }}>
          <h3 style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: '1.1rem',
            color: 'var(--text-primary)',
            marginBottom: '1.25rem',
          }}>
            📊 Scores — Manche {room?.round || ''}
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {(() => {
              // Build cumulative score lookup by player name
              const cumulLookup = {}
              if (results.cumulativeScores) {
                for (const s of results.cumulativeScores) {
                  cumulLookup[s.name] = s.total
                }
              }

              // Build vote lookup: voterId -> target player name
              const voteLookup = {}
              if (results.votes) {
                for (const [voterId, targetId] of Object.entries(results.votes)) {
                  const target = players.find(p => p.id === targetId)
                  if (target) voteLookup[voterId] = { name: target.name, correct: targetId === results.impostorId }
                }
              }

              return players
                .slice()
                .sort((a, b) => (cumulLookup[b.name] || 0) - (cumulLookup[a.name] || 0))
                .map((player, i) => {
                  const pts = pointsAwarded[player.id] || 0
                  const cumul = cumulLookup[player.name]
                  const isMe = player.id === socketId
                  const isActualImpostor = player.id === results.impostorId
                  const vote = voteLookup[player.id]

                  return (
                    <div key={player.id} className="score-row" style={{
                      background: isMe ? 'rgba(139, 92, 246, 0.07)' : undefined,
                      border: isMe ? '1px solid rgba(139, 92, 246, 0.15)' : '1px solid transparent',
                    }}>
                      <span className="score-rank" style={{
                        color: i < 3 ? 'var(--green)' : 'var(--text-tertiary)',
                        fontWeight: 700,
                      }}>
                        {i + 1}
                      </span>

                      <Avatar name={player.name} size="sm" />

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <span className="score-player">
                          {player.name}
                        </span>
                        {isActualImpostor && (
                          <span className="badge badge-impostor" style={{ marginLeft: '0.5rem', fontSize: '0.7rem', padding: '0.15rem 0.5rem' }}>
                            🎭 Imposteur
                          </span>
                        )}
                        {!isActualImpostor && vote && (
                          <span className={`badge ${vote.correct ? 'badge-found' : 'badge-impostor'}`} style={{ marginLeft: '0.5rem', fontSize: '0.7rem', padding: '0.15rem 0.5rem' }}>
                            {vote.correct ? '✓' : '✗'} A voté {vote.name}
                          </span>
                        )}
                      </div>

                      <span style={{
                        fontFamily: 'var(--font-display)',
                        fontWeight: 700,
                        fontSize: '1.05rem',
                        color: 'var(--text-primary)',
                        minWidth: 40,
                        textAlign: 'right',
                      }}>
                        {cumul != null ? cumul : 0}
                      </span>
                      <span style={{
                        fontFamily: 'var(--font-display)',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        color: pts > 0 ? 'var(--green)' : 'var(--text-tertiary)',
                        minWidth: 35,
                      }}>
                        +{pts}
                      </span>
                    </div>
                  )
                })
            })()}
          </div>
        </div>
      )}

      {/* Action buttons */}
      {phase === 'points' && (
        <div style={{
          display: 'flex',
          gap: '0.75rem',
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginTop: '0.5rem',
        }}>
          {amHost ? (
            <button
              className="btn btn-primary"
              onClick={() => startNextRound(roomId)}
            >
              ▶ Manche suivante
            </button>
          ) : (
            <div style={{
              color: 'var(--text-secondary)',
              fontSize: '0.9rem',
              padding: '0.75rem 1.5rem',
            }}>
              En attente que <strong style={{ color: 'var(--text-primary)' }}>{room?.hostName}</strong> lance la manche suivante...
            </div>
          )}
          <button
            className="btn btn-glass"
            onClick={() => navigate(`/room/${roomId}/scores`)}
          >
            📊 Classement général
          </button>
        </div>
      )}

      <style>{`
        @keyframes revealPop {
          from { transform: scale(0.85); opacity: 0; }
          to   { transform: scale(1);   opacity: 1; }
        }
      `}</style>
    </div>
  )
}
