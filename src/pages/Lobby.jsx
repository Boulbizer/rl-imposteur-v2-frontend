// pages/Lobby.jsx
// Salle d'attente : liste des joueurs, lien d'invitation, bouton "Lancer" (hôte)

import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useGame } from '../hooks/useGame'

// Sous-composant : carte d'un joueur dans la liste
function PlayerCard({ player, isHost, isMe }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '0.75rem 1rem',
      background: isMe ? '#7c3aed18' : 'var(--bg-elevated)',
      border: `1px solid ${isMe ? 'var(--purple)' : 'var(--border)'}`,
      borderRadius: 'var(--radius)',
      transition: 'all 0.3s ease',
    }}>
      {/* Avatar généré par initiale */}
      <div style={{
        width: 36, height: 36,
        borderRadius: '50%',
        background: isMe ? 'var(--purple)' : 'var(--bg-card)',
        border: `2px solid ${isMe ? 'var(--purple)' : 'var(--border)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: '1rem',
        color: isMe ? '#fff' : 'var(--text-muted)',
        flexShrink: 0,
      }}>
        {player.name[0].toUpperCase()}
      </div>

      <span style={{
        fontFamily: 'var(--font-display)',
        fontWeight: 600,
        fontSize: '1.05rem',
        flex: 1,
      }}>
        {player.name}
        {isMe && <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: '0.85rem', marginLeft: '0.5rem' }}>(toi)</span>}
      </span>

      {isHost && (
        <span className="badge badge-host">Hôte</span>
      )}
    </div>
  )
}

export default function Lobby() {
  const { roomId } = useParams()
  const { room, myName, socketId, joinRoom, startGame, error, setError, loading } = useGame()

  // Si le joueur arrive via le lien d'invitation → demander son pseudo
  const [nameInput, setNameInput] = useState('')
  const [copied, setCopied] = useState(false)
  const [joining, setJoining] = useState(false)

  // Détermine si le joueur a déjà rejoint la salle
   const hasJoined = room && (
  room.players.some(p => p.id === socketId) ||
  room.players.some(p => p.name === myName)
  )
  const isHost = room && room.hostId === socketId
  const inviteUrl = `${window.location.origin}/room/${roomId}`

  // Si on n'est pas encore dans la salle (arrivée via lien), on affiche le formulaire de pseudo
  useEffect(() => {
    // Si la salle existe et qu'on y est déjà → rien à faire
    if (hasJoined) return
    // Sinon on attend que l'utilisateur entre son pseudo
  }, [hasJoined])

  function handleJoin(e) {
    e.preventDefault()
    if (!nameInput.trim()) return
    setJoining(true)
    joinRoom(roomId, nameInput.trim())
  }

  function handleCopyLink() {
    navigator.clipboard.writeText(inviteUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  // Si pas encore rejoint ET qu'on n'a pas de nom (= vrai visiteur via lien)
  if (!hasJoined && !myName) {
    return (
      <div className="page">
        <div style={{ width: '100%', maxWidth: 420 }} className="fade-up">
          <div className="card-glow">
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🚀</div>
              <h2 style={{ fontSize: '1.3rem', color: 'var(--cyan)' }}>Tu es invité·e !</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                Salle <code style={{ color: 'var(--purple)', fontFamily: 'monospace' }}>{roomId}</code>
              </p>
            </div>

            <form onSubmit={handleJoin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Ton pseudo
                </label>
                <input
                  className="input"
                  type="text"
                  placeholder="Ex : SupraNova_RL"
                  value={nameInput}
                  onChange={e => { setNameInput(e.target.value); setError('') }}
                  maxLength={20}
                  autoFocus
                />
              </div>

              {error && <div className="error-msg">{error}</div>}

              <button
                className="btn btn-primary btn-full"
                type="submit"
                disabled={!nameInput.trim() || joining}
              >
                {joining ? <span className="spinner" /> : 'Rejoindre la salle'}
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  // ── Salle d'attente ───────────────────────────────────────────────
  return (
    <div className="page" style={{ alignItems: 'flex-start', paddingTop: '2rem' }}>
      <div style={{ width: '100%', maxWidth: 560, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

        {/* Header */}
        <div className="fade-up" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', color: 'var(--text)' }}>
              <span style={{ color: 'var(--cyan)' }}>RL</span> Imposteur
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Salle d'attente · Manche {room.round}
            </p>
          </div>
          <span style={{
            fontFamily: 'monospace',
            fontSize: '0.8rem',
            color: 'var(--text-dim)',
            padding: '0.25rem 0.5rem',
            border: '1px solid var(--border)',
            borderRadius: 4,
          }}>
            {room.players.length}/10 joueurs
          </span>
        </div>

        {/* Lien d'invitation */}
        <div className="card fade-up" style={{ animationDelay: '0.05s', padding: '1rem 1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            🔗 Lien d'invitation
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <code style={{
              flex: 1,
              fontSize: '0.8rem',
              color: 'var(--cyan)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {inviteUrl}
            </code>
            <button
              className="btn btn-ghost"
              onClick={handleCopyLink}
              style={{ padding: '0.4rem 0.9rem', fontSize: '0.85rem', flexShrink: 0 }}
            >
              {copied ? '✓ Copié !' : 'Copier'}
            </button>
          </div>
        </div>

        {/* Liste des joueurs */}
        <div className="fade-up" style={{ animationDelay: '0.1s' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Joueurs connectés
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {room.players.map(player => (
              <PlayerCard
                key={player.id}
                player={player}
                isHost={player.id === room.hostId}
                isMe={player.id === socketId}
              />
            ))}
            {/* Placeholder si peu de joueurs */}
            {room.players.length < 2 && (
              <div style={{
                padding: '0.75rem 1rem',
                border: '1px dashed var(--border)',
                borderRadius: 'var(--radius)',
                color: 'var(--text-dim)',
                fontSize: '0.85rem',
                textAlign: 'center',
              }}>
                En attente de joueurs…
              </div>
            )}
          </div>
        </div>

        {/* Règles du jeu */}
        <div className="card fade-up" style={{ animationDelay: '0.15s', borderColor: 'var(--border-glow)' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--purple)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-display)', fontWeight: 700 }}>
            ⚡ Règles du jeu
          </div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {[
              { icon: '🎭', text: "Un imposteur secret est désigné au lancement" },
              { icon: '🚗', text: "Jouez votre partie Rocket League normalement" },
              { icon: '🕵️', text: "L'imposteur doit faire perdre son équipe discrètement" },
              { icon: '🗳️', text: "À la fin : tout le monde vote pour désigner l'imposteur" },
              { icon: '🏆', text: "Bons votants +2 pts · Imposteur non découvert +3 pts" },
            ].map(({ icon, text }) => (
              <li key={text} style={{ display: 'flex', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--text-muted)', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '1rem', flexShrink: 0 }}>{icon}</span>
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Bouton lancer (hôte uniquement) */}
        {isHost ? (
          <div className="fade-up" style={{ animationDelay: '0.2s' }}>
            {error && <div className="error-msg" style={{ marginBottom: '0.75rem' }}>{error}</div>}
            <button
              className={`btn btn-primary btn-full ${room.players.length >= 2 ? 'neon-pulse' : ''}`}
              onClick={() => startGame(room.id)}
              disabled={room.players.length < 2}
            >
              {room.players.length < 2
                ? '⏳ En attente d\'un autre joueur…'
                : `🚀 Lancer la partie (${room.players.length} joueurs)`}
            </button>
          </div>
        ) : (
          <div className="fade-up" style={{
            animationDelay: '0.2s',
            textAlign: 'center',
            color: 'var(--text-muted)',
            fontSize: '0.9rem',
            padding: '1rem',
            border: '1px dashed var(--border)',
            borderRadius: 'var(--radius)',
          }}>
            ⏳ En attente que <strong style={{ color: 'var(--text)' }}>{room.hostName}</strong> lance la partie…
          </div>
        )}

      </div>
    </div>
  )
}
