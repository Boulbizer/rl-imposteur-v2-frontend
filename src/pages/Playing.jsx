// pages/Playing.jsx
// Cyberpunk style + split fullscreen layout

import { useGame } from '../hooks/useGame'
import socket from '../lib/socket'
import { useParams } from 'react-router-dom'
import { RoleDecoration } from '../components/Illustrations'

export default function Playing() {
  const { roomId } = useParams()
  const { room, isImpostor, socketId, endGame } = useGame()
  const actualIsImpostor = sessionStorage.getItem('rl_isImpostor') === 'true'

  if (!room) return null

  const isHost = room.hostId === socket.id
  const roleColor = actualIsImpostor ? 'var(--red)' : 'var(--cyan)'
  const roleGlow = actualIsImpostor ? 'var(--red-glow)' : 'var(--cyan-glow)'

  return (
    <div className="page-split">

      {/* Panneau gauche — Rôle secret + Illustration */}
      <div className="fade-up" style={{
        padding: '3rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1.5rem',
        background: 'linear-gradient(135deg, #07071a 0%, #131335 50%, #0d0d28 100%)',
      }}>
        {/* Status pill */}
        <div className="status-pill" style={{
          background: '#06b6d415',
          border: '1px solid var(--cyan)',
          color: 'var(--cyan)',
        }}>
          ● Partie en cours — Manche {room.round}
        </div>

        {/* Illustration du rôle */}
        <div className="float">
          <RoleDecoration isImpostor={actualIsImpostor} size={280} />
        </div>

        {/* Carte de rôle */}
        <div
          className="card-glow"
          style={{
            width: '100%',
            maxWidth: 440,
            textAlign: 'center',
            borderColor: roleColor,
            boxShadow: `0 0 40px ${roleGlow}, inset 0 0 40px ${actualIsImpostor ? '#ef444408' : '#06b6d408'}`,
          }}
        >
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
            Ton role secret
          </div>
          <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>
            {actualIsImpostor ? '🎭' : '🚗'}
          </div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 700,
            letterSpacing: '0.05em',
            color: roleColor,
            marginBottom: '0.75rem',
          }}>
            {actualIsImpostor ? 'IMPOSTEUR' : 'EQUIPIER'}
          </div>
          <div style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
            {actualIsImpostor
              ? 'Fais perdre ton equipe sans te faire reperer. Sois subtil.'
              : "Joue normalement et observe. Quelqu'un cherche a vous faire perdre."}
          </div>
        </div>
      </div>

      {/* Panneau droit — Joueurs + Conseils */}
      <div className="panel-right fade-up" style={{ animationDelay: '0.1s', justifyContent: 'flex-start', paddingTop: '3rem' }}>

        {/* Objectif */}
        <div className="card-glass" style={{ textAlign: 'center', padding: '1.25rem', borderColor: roleColor }}>
          <div style={{ fontSize: '1.1rem', color: roleColor, fontFamily: 'var(--font-display)', fontWeight: 700 }}>
            {actualIsImpostor
              ? '🎯 Objectif : faire perdre ton equipe sans eveiller les soupcons'
              : "🔍 Objectif : reperer l'imposteur pendant la partie"}
          </div>
        </div>

        {/* Liste des joueurs */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div className="section-label">Joueurs dans la partie ({room.players.length})</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {room.players.map(player => (
              <span
                key={player.id}
                style={{
                  padding: '0.4rem 0.9rem',
                  background: player.id === socketId ? '#7c3aed18' : 'var(--bg-elevated)',
                  border: `1px solid ${player.id === socketId ? 'var(--purple)' : 'var(--border)'}`,
                  borderRadius: 999,
                  fontSize: '0.9rem',
                  color: player.id === socketId ? '#a78bfa' : 'var(--text-muted)',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 600,
                }}
              >
                {player.name}{player.id === room.hostId ? ' 👑' : ''}
                {player.id === socketId ? ' (toi)' : ''}
              </span>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="card-glass" style={{ padding: '1.25rem' }}>
          <div className="section-label">💡 Conseils</div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {(actualIsImpostor ? [
              "Fais des erreurs subtiles, pas des trahisons evidentes",
              "Accuse quelqu'un d'autre pour detourner l'attention",
              "Joue normalement au debut pour gagner la confiance",
            ] : [
              "Observe les rotations et positionnements suspects",
              "Note les erreurs qui semblent intentionnelles",
              "Discutez entre vous pendant la partie",
            ]).map((tip, i) => (
              <li key={i} style={{ fontSize: '0.9rem', color: 'var(--text-muted)', display: 'flex', gap: '0.5rem' }}>
                <span style={{ color: roleColor, flexShrink: 0 }}>›</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>

        {!isHost && (
          <div className="waiting-banner">
            <strong style={{ color: 'var(--text-muted)' }}>{room.hostName}</strong> declenchera le vote a la fin de la partie.
          </div>
        )}
      </div>

      {/* Footer action bar */}
      <div className="action-bar">
        <div className="action-bar-label">
          <span>● Partie en cours · Manche {room.round}</span>
        </div>
        {isHost ? (
          <button
            className="action-bar-item danger arrow-right"
            onClick={() => endGame(roomId)}
          >
            🏁 Passer au vote
          </button>
        ) : (
          <div className="action-bar-label" style={{ justifyContent: 'flex-end' }}>
            <span>{room.hostName} declenchera le vote</span>
          </div>
        )}
      </div>

    </div>
  )
}
