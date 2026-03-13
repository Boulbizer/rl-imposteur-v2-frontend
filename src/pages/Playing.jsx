// pages/Playing.jsx
// Écran affiché pendant la partie Rocket League
// → chaque joueur voit son rôle secret
// → l'hôte a le bouton "Partie terminée"

import { useGame } from '../hooks/useGame'
import socket from '../lib/socket'
import { useParams } from 'react-router-dom'

export default function Playing() {
  const { roomId } = useParams()
  const { room, isImpostor, socketId, endGame } = useGame()

  if (!room) return null

  const isHost = room.hostId === socket.id

  return (
    <div className="page">
      <div style={{ width: '100%', maxWidth: 500, display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>

        {/* Titre */}
        <div className="fade-up" style={{ textAlign: 'center' }}>
          <div style={{
            display: 'inline-block',
            padding: '0.3rem 1rem',
            background: '#06b6d415',
            border: '1px solid var(--cyan)',
            borderRadius: 999,
            fontSize: '0.8rem',
            color: 'var(--cyan)',
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            marginBottom: '1rem',
          }}>
            ● Partie en cours
          </div>
          <h1 style={{ fontSize: '2rem' }}>
            <span style={{ color: 'var(--cyan)' }}>RL</span> Imposteur
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Manche {room.round}
          </p>
        </div>

        {/* Carte de rôle secret */}
        <div
          className="card-glow fade-up neon-pulse"
          style={{
            animationDelay: '0.1s',
            width: '100%',
            textAlign: 'center',
            borderColor: isImpostor ? 'var(--red)' : 'var(--cyan)',
            boxShadow: isImpostor
              ? '0 0 40px var(--red-glow), inset 0 0 40px #ef444408'
              : '0 0 40px var(--cyan-glow), inset 0 0 40px #06b6d408',
          }}
        >
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
            Ton rôle secret
          </div>

          <div style={{ fontSize: '4rem', marginBottom: '0.75rem' }}>
            {isImpostor ? '🎭' : '🚗'}
          </div>

          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: '2.5rem',
            fontWeight: 700,
            letterSpacing: '0.05em',
            color: isImpostor ? 'var(--red)' : 'var(--cyan)',
            marginBottom: '0.5rem',
          }}>
            {isImpostor ? 'IMPOSTEUR' : 'ÉQUIPIER'}
          </div>

          <div style={{
            fontSize: '0.9rem',
            color: 'var(--text-muted)',
            maxWidth: 300,
            margin: '0 auto',
            lineHeight: 1.7,
          }}>
            {isImpostor
              ? 'Fais perdre ton équipe sans te faire repérer. Sois subtil — tes coéquipiers te surveillent.'
              : 'Joue normalement et observe. Quelqu\'un dans cette salle cherche à vous faire perdre.'}
          </div>
        </div>

        {/* Liste des joueurs */}
        <div className="card fade-up" style={{ animationDelay: '0.2s', width: '100%', padding: '1rem 1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Joueurs dans la partie ({room.players.length})
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {room.players.map(player => (
              <span
                key={player.id}
                style={{
                  padding: '0.3rem 0.75rem',
                  background: player.id === socketId ? '#7c3aed22' : 'var(--bg-elevated)',
                  border: `1px solid ${player.id === socketId ? 'var(--purple)' : 'var(--border)'}`,
                  borderRadius: 999,
                  fontSize: '0.85rem',
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

        {/* Objectif rappel */}
        <div className="fade-up" style={{
          animationDelay: '0.25s',
          width: '100%',
          padding: '0.75rem 1rem',
          border: '1px dashed var(--border)',
          borderRadius: 'var(--radius)',
          fontSize: '0.85rem',
          color: 'var(--text-muted)',
          textAlign: 'center',
        }}>
          {isImpostor
            ? '🎯 Objectif : faire perdre ton équipe sans éveiller les soupçons'
            : '🔍 Objectif : repérer l\'imposteur pendant la partie'}
        </div>

        {/* Bouton fin de partie — hôte uniquement */}
        {isHost && (
          <div className="fade-up" style={{ animationDelay: '0.3s', width: '100%' }}>
            <button
              className="btn btn-danger btn-full"
              onClick={() => endGame(roomId)}
              style={{ fontSize: '1rem' }}
            >
              🏁 La partie est terminée — Passer au vote
            </button>
            <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '0.5rem' }}>
              Visible uniquement par toi (hôte)
            </p>
          </div>
        )}

        {/* Message d'attente pour les non-hôtes */}
        {!isHost && (
          <div className="fade-up" style={{
            animationDelay: '0.3s',
            textAlign: 'center',
            color: 'var(--text-dim)',
            fontSize: '0.85rem',
          }}>
            <strong style={{ color: 'var(--text-muted)' }}>{room.hostName}</strong> déclenchera le vote à la fin de la partie.
          </div>
        )}

      </div>
    </div>
  )
}
