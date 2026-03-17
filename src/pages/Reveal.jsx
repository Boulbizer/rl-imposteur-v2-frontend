// pages/Reveal.jsx
// Cyberpunk style + split fullscreen layout

import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useGame } from '../hooks/useGame'

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
    <div className="page-split">
      <div className="panel-left" style={{ background: 'var(--bg)', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner" style={{ width: 36, height: 36, borderWidth: 3 }} />
        <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>Chargement des resultats...</p>
      </div>
      <div className="panel-right" />
      <div className="action-bar">
        <div className="action-bar-label"><span>Chargement...</span></div>
        <div className="action-bar-label"><span></span></div>
      </div>
    </div>
  )

  const { impostorFound, impostorName, accusedName, pointsAwarded, players, tally } = results
  const myPoints = socketId ? (pointsAwarded[socketId] || 0) : 0
  const isImpostor = results.impostorId === socketId
  const resultColor = impostorFound ? 'var(--green)' : 'var(--red)'

  // ── PHASE SUSPENSE ──
  if (phase === 'suspense') {
    return (
      <div className="page-split">
        <div className="panel-left" style={{ background: 'linear-gradient(135deg, #07071a 0%, #131335 50%, #0d0d28 100%)', alignItems: 'center', justifyContent: 'center' }}>
          <div className="fade-up" style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '6rem',
              animation: 'suspensePulse 0.6s ease-in-out infinite alternate',
              marginBottom: '2rem',
            }}>
              🕵️
            </div>
            <h2 style={{ fontSize: '2.5rem', color: 'var(--text)', marginBottom: '0.75rem' }}>
              Revelation...
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
              Decouvrons ensemble qui etait l'imposteur
            </p>
            <div style={{ marginTop: '2.5rem', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: 12, height: 12,
                  borderRadius: '50%',
                  background: 'var(--purple)',
                  animation: `dotBounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                }} />
              ))}
            </div>
          </div>
        </div>
        <div className="panel-right" />
        <div className="action-bar">
          <div className="action-bar-label"><span>Revelation en cours...</span></div>
          <div className="action-bar-label"><span></span></div>
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
    <div className="page-split">

      {/* Panneau gauche — Résultat principal + mes points */}
      <div className="panel-left fade-up" style={{
        background: 'linear-gradient(135deg, #07071a 0%, #131335 50%, #0d0d28 100%)',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {/* Résultat principal */}
        <div
          className="card-glow"
          style={{
            width: '100%',
            maxWidth: 480,
            textAlign: 'center',
            padding: '2.5rem 2rem',
            borderColor: resultColor,
            boxShadow: impostorFound
              ? '0 0 60px #10b98144, inset 0 0 60px #10b98108'
              : '0 0 60px var(--red-glow), inset 0 0 60px #ef444408',
            animation: 'revealPop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
          }}
        >
          <div style={{ fontSize: '4.5rem', marginBottom: '1rem' }}>
            {impostorFound ? '🎉' : '😈'}
          </div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.5rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            color: resultColor,
            marginBottom: '0.5rem',
            textTransform: 'uppercase',
          }}>
            {impostorFound ? 'Imposteur demasque !' : "L'imposteur s'echappe !"}
          </div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 700,
            color: 'var(--text)',
            margin: '0.75rem 0',
          }}>
            {impostorName}
          </div>
          <span className={`badge ${impostorFound ? 'badge-crew' : 'badge-impostor'}`}>
            {impostorFound ? '✓ Decouvert' : '✗ Non decouvert'}
          </span>
          {!impostorFound && accusedName && accusedName !== impostorName && (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '1rem' }}>
              Vous avez vote contre <strong style={{ color: 'var(--text)' }}>{accusedName}</strong> — qui etait innocent.
            </p>
          )}
        </div>

        {/* Mes points (phase points) */}
        {phase === 'points' && (
          <div className="card fade-in" style={{
            width: '100%', maxWidth: 480, textAlign: 'center', padding: '1.75rem',
            borderColor: myPoints > 0 ? 'var(--purple)' : 'var(--border)',
            background: myPoints > 0 ? '#7c3aed10' : 'var(--bg-card)',
          }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Tes points cette manche
            </div>
            <div style={{
              fontFamily: 'var(--font-display)', fontSize: '4rem', fontWeight: 700,
              color: myPoints > 0 ? 'var(--purple)' : 'var(--text-muted)', lineHeight: 1,
            }}>
              +{myPoints}
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
              {isImpostor
                ? myPoints > 0 ? '😈 Non decouvert — belle performance !' : '😅 Decouvert cette fois...'
                : myPoints > 0 ? '🎯 Bonne intuition !' : "😐 Tu n'as pas vise le bon joueur"}
            </div>
          </div>
        )}
      </div>

      {/* Panneau droit — Détails des votes + points de tous */}
      <div className="panel-right fade-up" style={{ animationDelay: '0.1s', justifyContent: 'flex-start', paddingTop: '3rem' }}>

        {/* Décompte des votes */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div className="section-label">Resultats du vote</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {players
              .slice()
              .sort((a, b) => (tally[b.id] || 0) - (tally[a.id] || 0))
              .map(player => {
                const votes = tally[player.id] || 0
                const pct = players.length > 1 ? (votes / (players.length - 1)) * 100 : 0
                const isActualImpostor = player.id === results.impostorId
                return (
                  <div key={player.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{
                      fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.95rem',
                      width: 130, flexShrink: 0,
                      color: isActualImpostor ? 'var(--red)' : 'var(--text)',
                      display: 'flex', alignItems: 'center', gap: '0.4rem',
                    }}>
                      {isActualImpostor && '🎭'}
                      {player.name}
                    </span>
                    <div style={{ flex: 1, background: 'var(--bg-elevated)', borderRadius: 999, height: 8, overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', width: `${pct}%`,
                        background: isActualImpostor ? 'var(--red)' : 'var(--text-dim)',
                        borderRadius: 999, transition: 'width 0.8s ease',
                        boxShadow: isActualImpostor ? '0 0 8px var(--red)' : 'none',
                      }} />
                    </div>
                    <span style={{
                      fontSize: '0.9rem', color: votes > 0 ? 'var(--text)' : 'var(--text-dim)',
                      width: 24, textAlign: 'right', fontFamily: 'var(--font-display)', fontWeight: 700,
                    }}>
                      {votes}
                    </span>
                  </div>
                )
              })}
          </div>
        </div>

        {/* Points de tous les joueurs (phase points) */}
        {phase === 'points' && (
          <>
            <div className="card fade-in" style={{ padding: '1.5rem' }}>
              <div className="section-label">Points gagnes cette manche</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {players
                  .slice()
                  .sort((a, b) => (pointsAwarded[b.id] || 0) - (pointsAwarded[a.id] || 0))
                  .map((player, i) => {
                    const pts = pointsAwarded[player.id] || 0
                    const isMe = player.id === socketId
                    return (
                      <div key={player.id} style={{
                        display: 'flex', alignItems: 'center', gap: '0.75rem',
                        padding: '0.5rem 0.75rem',
                        background: isMe ? '#7c3aed15' : 'transparent',
                        borderRadius: 'var(--radius)',
                      }}>
                        <span style={{ width: 22, textAlign: 'center', fontSize: '0.82rem', color: 'var(--text-dim)', fontFamily: 'var(--font-display)' }}>
                          {i + 1}
                        </span>
                        <span style={{
                          flex: 1, fontFamily: 'var(--font-display)', fontWeight: 600,
                          color: isMe ? '#a78bfa' : 'var(--text)',
                        }}>
                          {player.name}
                          {player.id === results.impostorId && ' 🎭'}
                        </span>
                        <span style={{
                          fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem',
                          color: pts > 0 ? 'var(--green)' : 'var(--text-dim)',
                        }}>
                          +{pts} pt{pts > 1 ? 's' : ''}
                        </span>
                      </div>
                    )
                  })}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Footer action bar */}
      <div className="action-bar">
        <button
          className="action-bar-item secondary"
          onClick={() => navigate(`/room/${roomId}/scores`)}
        >
          📊 Classement general
        </button>
        {amHost ? (
          <button
            className="action-bar-item primary arrow-right neon-pulse"
            onClick={() => startNextRound(roomId)}
          >
            🔄 Manche {room?.round ? room.round + 1 : 'suivante'}
          </button>
        ) : (
          <div className="action-bar-label" style={{ justifyContent: 'flex-end' }}>
            En attente que <strong style={{ color: 'var(--text)' }}>{room?.hostName}</strong> lance la manche suivante...
          </div>
        )}
      </div>

      <style>{`
        @keyframes revealPop {
          from { transform: scale(0.85); opacity: 0; }
          to   { transform: scale(1);   opacity: 1; }
        }
      `}</style>
    </div>
  )
}
