// pages/Playing.jsx
// Écran affiché pendant la partie Rocket League
// Layout 16:9 : rôle + illustration à gauche, joueurs + actions à droite

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
    <div className="page">
      <div className="layout-split">

        {/* Colonne gauche — Rôle secret */}
        <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>

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
            <RoleDecoration isImpostor={actualIsImpostor} size={240} />
          </div>

          {/* Carte de rôle */}
          <div
            className="card-glow"
            style={{
              width: '100%',
              maxWidth: 420,
              textAlign: 'center',
              borderColor: roleColor,
              boxShadow: `0 0 40px ${roleGlow}, inset 0 0 40px ${actualIsImpostor ? '#ef444408' : '#06b6d408'}`,
            }}
          >
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
              Ton role secret
            </div>

            <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>
              {actualIsImpostor ? '🎭' : '🚗'}
            </div>

            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: '2.8rem',
              fontWeight: 700,
              letterSpacing: '0.05em',
              color: roleColor,
              marginBottom: '0.75rem',
            }}>
              {actualIsImpostor ? 'IMPOSTEUR' : 'EQUIPIER'}
            </div>

            <div style={{
              fontSize: '0.92rem',
              color: 'var(--text-muted)',
              lineHeight: 1.7,
            }}>
              {actualIsImpostor
                ? 'Fais perdre ton equipe sans te faire reperer. Sois subtil.'
                : 'Joue normalement et observe. Quelqu\'un cherche a vous faire perdre.'}
            </div>
          </div>
        </div>

        {/* Colonne droite — Joueurs + Actions */}
        <div className="fade-up" style={{ animationDelay: '0.1s', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* Objectif */}
          <div className="card-glass" style={{
            textAlign: 'center',
            padding: '1.25rem',
            borderColor: roleColor,
          }}>
            <div style={{ fontSize: '1.1rem', color: roleColor, fontFamily: 'var(--font-display)', fontWeight: 700 }}>
              {actualIsImpostor
                ? '🎯 Objectif : faire perdre ton equipe sans eveiller les soupcons'
                : "🔍 Objectif : reperer l'imposteur pendant la partie"}
            </div>
          </div>

          {/* Liste des joueurs */}
          <div className="card" style={{ padding: '1.25rem' }}>
            <div className="section-label">
              Joueurs dans la partie ({room.players.length})
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {room.players.map(player => (
                <span
                  key={player.id}
                  style={{
                    padding: '0.4rem 0.9rem',
                    background: player.id === socketId ? '#7c3aed18' : 'var(--bg-elevated)',
                    border: `1px solid ${player.id === socketId ? 'var(--purple)' : 'var(--border)'}`,
                    borderRadius: 999,
                    fontSize: '0.88rem',
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
                "Fais des erreurs subtiles, pas des trahisons évidentes",
                "Accuse quelqu'un d'autre pour détourner l'attention",
                "Joue normalement au début pour gagner la confiance",
              ] : [
                "Observe les rotations et positionnements suspects",
                "Note les erreurs qui semblent intentionnelles",
                "Discutez entre vous pendant la partie",
              ]).map((tip, i) => (
                <li key={i} style={{ fontSize: '0.88rem', color: 'var(--text-muted)', display: 'flex', gap: '0.5rem' }}>
                  <span style={{ color: roleColor, flexShrink: 0 }}>›</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          {/* Bouton fin de partie */}
          {isHost ? (
            <div>
              <button
                className="btn btn-danger btn-lg btn-full"
                onClick={() => endGame(roomId)}
              >
                🏁 La partie est terminee — Passer au vote
              </button>
              <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '0.5rem' }}>
                Visible uniquement par toi (hote)
              </p>
            </div>
          ) : (
            <div className="waiting-banner">
              <strong style={{ color: 'var(--text-muted)' }}>{room.hostName}</strong> declenchera le vote a la fin de la partie.
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
