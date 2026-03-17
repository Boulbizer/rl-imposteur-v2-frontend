// pages/Reveal.jsx
// Révélation de l'imposteur — Layout split : résultat sur panneau coloré, détails sur noir

import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useGame } from '../hooks/useGame'
import { ShieldReveal } from '../components/Illustrations'

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
      <div className="panel-left" style={{ background: 'var(--surface)' }} />
      <div className="panel-right" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto 1rem', width: 32, height: 32 }} />
          <p style={{ color: 'var(--text-gray)' }}>Chargement des resultats...</p>
        </div>
      </div>
      <div className="action-bar">
        <div className="action-bar-label"><span>Chargement...</span></div>
        <div className="action-bar-label"><span></span></div>
      </div>
    </div>
  )

  const { impostorFound, impostorName, accusedName, pointsAwarded, players, tally } = results
  const myPoints = socketId ? (pointsAwarded[socketId] || 0) : 0
  const isImpostor = results.impostorId === socketId
  const panelColor = impostorFound ? 'var(--green)' : 'var(--coral)'

  // ── PHASE SUSPENSE ──
  if (phase === 'suspense') {
    return (
      <div className="page-split">
        <div className="panel-left" style={{ background: 'var(--surface)', justifyContent: 'center', alignItems: 'center' }}>
          <div className="illustration-container" style={{ opacity: 0.3 }}>
            <MagnifyingGlassSuspense />
          </div>
        </div>
        <div className="panel-right" style={{ justifyContent: 'center' }}>
          <div className="fade-up">
            <h1 style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', color: 'var(--text-light)' }}>
              Revelation...
            </h1>
            <p style={{ color: 'var(--text-gray)', fontSize: '1.05rem', marginTop: '1rem' }}>
              Decouvrons ensemble qui etait l'imposteur
            </p>
            <div style={{ marginTop: '2rem', display: 'flex', gap: '0.5rem' }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: 10, height: 10,
                  borderRadius: '50%',
                  background: 'var(--text-gray)',
                  animation: `dotBounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                }} />
              ))}
            </div>
          </div>
        </div>
        <div className="action-bar">
          <div className="action-bar-label"><span>Revelation en cours...</span></div>
          <div className="action-bar-label"><span></span></div>
        </div>
        <style>{`
          @keyframes dotBounce {
            0%, 100% { transform: translateY(0); opacity: 0.3; }
            50%       { transform: translateY(-8px); opacity: 1; }
          }
        `}</style>
      </div>
    )
  }

  // ── PHASE REVEAL + POINTS ──
  return (
    <div className="page-split">

      {/* Panneau gauche — Résultat sur couleur */}
      <div className="panel-left fade-up" style={{ background: panelColor }}>
        <div className="illustration-container">
          <ShieldReveal color="#000" opacity={0.12} found={impostorFound} />
        </div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div className="section-label-dark">
            {impostorFound ? 'Imposteur demasque' : "L'imposteur s'echappe"}
          </div>
          <h1 style={{
            fontSize: 'clamp(3rem, 6vw, 6rem)',
            color: 'var(--text-dark)',
            marginTop: '0.5rem',
          }}>
            {impostorName}
          </h1>

          {!impostorFound && accusedName && accusedName !== impostorName && (
            <p style={{ fontSize: '0.95rem', color: 'rgba(0,0,0,0.75)', marginTop: '1rem' }}>
              Vous avez vote contre {accusedName} — qui etait innocent.
            </p>
          )}

          {/* Mes points */}
          {phase === 'points' && (
            <div className="fade-in" style={{ marginTop: '2.5rem' }}>
              <div className="section-label-dark">Tes points cette manche</div>
              <div style={{ fontSize: '4rem', fontWeight: 900, color: 'var(--text-dark)', lineHeight: 1 }}>
                +{myPoints}
              </div>
              <p style={{ fontSize: '0.9rem', color: 'rgba(0,0,0,0.75)', marginTop: '0.5rem' }}>
                {isImpostor
                  ? myPoints > 0 ? 'Non decouvert — belle performance !' : 'Decouvert cette fois...'
                  : myPoints > 0 ? 'Bonne intuition !' : "Tu n'as pas vise le bon joueur"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Panneau droit — Détails sur noir */}
      <div className="panel-right fade-up" style={{ animationDelay: '0.1s', justifyContent: 'flex-start', paddingTop: '3rem' }}>

        {/* Décompte des votes */}
        <div>
          <div className="section-label">Resultats du vote</div>
          {players
            .slice()
            .sort((a, b) => (tally[b.id] || 0) - (tally[a.id] || 0))
            .map(player => {
              const votes = tally[player.id] || 0
              const pct = players.length > 1 ? (votes / (players.length - 1)) * 100 : 0
              const isActualImpostor = player.id === results.impostorId
              return (
                <div key={player.id} className="list-row">
                  <div className="row-left" style={{ gap: '1rem' }}>
                    <span style={{
                      fontWeight: 600,
                      color: isActualImpostor ? 'var(--coral)' : 'var(--text-light)',
                    }}>
                      {player.name}
                    </span>
                    <div style={{ flex: 1 }}>
                      <div className="progress-bar">
                        <div className="progress-bar-fill" style={{
                          width: `${pct}%`,
                          background: isActualImpostor ? 'var(--coral)' : 'var(--text-dim)',
                        }} />
                      </div>
                    </div>
                  </div>
                  <div className="row-right" style={{ fontWeight: 700, color: votes > 0 ? 'var(--text-light)' : 'var(--text-dim)' }}>
                    {votes}
                  </div>
                </div>
              )
            })}
        </div>

        {/* Points de tous les joueurs */}
        {phase === 'points' && (
          <div className="fade-in" style={{ marginTop: '1rem' }}>
            <div className="section-label">Points gagnes cette manche</div>
            {players
              .slice()
              .sort((a, b) => (pointsAwarded[b.id] || 0) - (pointsAwarded[a.id] || 0))
              .map((player, i) => {
                const pts = pointsAwarded[player.id] || 0
                const isMe = player.id === socketId
                return (
                  <div key={player.id} className="list-row">
                    <div className="row-left">
                      <span style={{ color: 'var(--text-dim)', fontSize: '0.85rem', width: 24 }}>{i + 1}</span>
                      <span style={{
                        fontWeight: isMe ? 800 : 600,
                        color: isMe ? 'var(--blue)' : 'var(--text-light)',
                      }}>
                        {player.name}
                      </span>
                    </div>
                    <div className="row-right" style={{
                      fontWeight: 700,
                      color: pts > 0 ? 'var(--green)' : 'var(--text-dim)',
                    }}>
                      +{pts} pt{pts > 1 ? 's' : ''}
                    </div>
                  </div>
                )
              })}
          </div>
        )}
      </div>

      {/* Footer action bar */}
      <div className="action-bar">
        <button
          className="action-bar-item secondary"
          onClick={() => navigate(`/room/${roomId}/scores`)}
        >
          Voir le classement general
        </button>
        {amHost ? (
          <button
            className="action-bar-item primary arrow-down-right"
            onClick={() => startNextRound(roomId)}
          >
            Lancer la manche {room?.round ? room.round + 1 : 'suivante'}
          </button>
        ) : (
          <div className="action-bar-label" style={{ justifyContent: 'flex-end' }}>
            <span>En attente que {room?.hostName} lance la manche suivante...</span>
          </div>
        )}
      </div>

    </div>
  )
}

// Mini composant pour le suspense (pas d'import externe)
function MagnifyingGlassSuspense() {
  return (
    <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(300, 100)" opacity="0.15">
        <circle cx="150" cy="150" r="130" stroke="#fff" strokeWidth="20" fill="none" />
        <line x1="245" y1="245" x2="370" y2="370" stroke="#fff" strokeWidth="24" strokeLinecap="round" />
        <text x="100" y="175" fill="#fff" fontSize="120" fontFamily="Inter, sans-serif" fontWeight="900">?</text>
      </g>
    </svg>
  )
}
