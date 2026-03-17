// pages/Playing.jsx
// Partie en cours — Layout split : role sur panneau coloré, infos sur noir

import { useGame } from '../hooks/useGame'
import socket from '../lib/socket'
import { useParams } from 'react-router-dom'
import { MaskPattern, CarSilhouette } from '../components/Illustrations'

export default function Playing() {
  const { roomId } = useParams()
  const { room, isImpostor, socketId, endGame } = useGame()
  const actualIsImpostor = sessionStorage.getItem('rl_isImpostor') === 'true'

  if (!room) return null

  const isHost = room.hostId === socket.id
  const panelColor = actualIsImpostor ? 'var(--coral)' : 'var(--teal)'

  return (
    <div className="page-split">

      {/* Panneau gauche — Couleur du rôle */}
      <div className="panel-left fade-up" style={{ background: panelColor, justifyContent: 'center', alignItems: 'flex-start' }}>
        <div className="illustration-container">
          {actualIsImpostor
            ? <MaskPattern color="#000" opacity={0.06} />
            : <CarSilhouette color="#000" opacity={0.06} />
          }
        </div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div className="section-label-dark">Ton role secret</div>
          <h1 style={{
            fontSize: 'clamp(3rem, 6vw, 6rem)',
            color: 'var(--text-dark)',
            marginTop: '0.5rem',
          }}>
            {actualIsImpostor ? 'Imposteur' : 'Equipier'}
          </h1>
          <p style={{
            fontSize: '1.05rem',
            color: 'rgba(0,0,0,0.6)',
            maxWidth: 380,
            lineHeight: 1.6,
            marginTop: '1.5rem',
          }}>
            {actualIsImpostor
              ? 'Fais perdre ton equipe sans te faire reperer. Sois subtil.'
              : "Joue normalement et observe. Quelqu'un cherche a vous faire perdre."}
          </p>
        </div>
      </div>

      {/* Panneau droit — Infos partie sur noir */}
      <div className="panel-right fade-up" style={{ animationDelay: '0.1s', justifyContent: 'flex-start', paddingTop: '3rem' }}>
        {/* Objectif */}
        <div>
          <div className="section-label">Objectif</div>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-light)', fontWeight: 600, lineHeight: 1.5 }}>
            {actualIsImpostor
              ? 'Faire perdre ton equipe sans eveiller les soupcons'
              : "Reperer l'imposteur pendant la partie"}
          </p>
        </div>

        {/* Joueurs */}
        <div style={{ marginTop: '1rem' }}>
          <div className="section-label">Joueurs dans la partie ({room.players.length})</div>
          {room.players.map(player => {
            const isMe = player.id === socketId
            return (
              <div key={player.id} className="list-row">
                <div className="row-left">
                  <span style={{ fontWeight: isMe ? 800 : 600 }}>
                    {player.name}
                    {player.id === room.hostId && <span style={{ color: 'var(--text-dim)', fontSize: '0.85rem', marginLeft: '0.5rem' }}>hote</span>}
                    {isMe && <span style={{ color: 'var(--text-dim)', fontSize: '0.85rem', marginLeft: '0.5rem' }}>(toi)</span>}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Conseils */}
        <div style={{ marginTop: '1rem' }}>
          <div className="section-label">Conseils</div>
          {(actualIsImpostor ? [
            "Fais des erreurs subtiles, pas des trahisons evidentes",
            "Accuse quelqu'un d'autre pour detourner l'attention",
            "Joue normalement au debut pour gagner la confiance",
          ] : [
            "Observe les rotations et positionnements suspects",
            "Note les erreurs qui semblent intentionnelles",
            "Discutez entre vous pendant la partie",
          ]).map((tip, i) => (
            <div key={i} className="list-row" style={{ fontSize: '0.95rem', color: 'var(--text-gray)', borderColor: 'var(--surface-2)' }}>
              <span>{tip}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer action bar */}
      <div className="action-bar">
        <div className="action-bar-label">
          <span>Partie en cours · Manche {room.round}</span>
        </div>
        {isHost ? (
          <button
            className="action-bar-item primary arrow-down-right"
            style={{ color: 'var(--coral)' }}
            onClick={() => endGame(roomId)}
          >
            La partie est terminee — Passer au vote
          </button>
        ) : (
          <div className="action-bar-label" style={{ justifyContent: 'flex-end' }}>
            <span>{room.hostName} declenchera le vote a la fin de la partie</span>
          </div>
        )}
      </div>

    </div>
  )
}
