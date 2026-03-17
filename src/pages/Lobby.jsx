// pages/Lobby.jsx
// Cyberpunk style + split fullscreen layout

import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useGame } from '../hooks/useGame'
import { LobbyIllustration } from '../components/Illustrations'

function PlayerCard({ player, isHost, isMe }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '0.85rem 1.1rem',
      background: isMe ? '#7c3aed12' : 'var(--bg-elevated)',
      border: `1px solid ${isMe ? 'var(--purple)' : 'var(--border)'}`,
      borderRadius: 'var(--radius)',
      transition: 'all 0.3s ease',
    }}>
      <div style={{
        width: 40, height: 40,
        borderRadius: '50%',
        background: isMe ? 'var(--purple)' : 'var(--bg-card)',
        border: `2px solid ${isMe ? 'var(--purple)' : 'var(--border)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: '1.1rem',
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
        {isMe && <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: '0.82rem', marginLeft: '0.5rem' }}>(toi)</span>}
      </span>
      {isHost && <span className="badge badge-host">Hote</span>}
    </div>
  )
}

export default function Lobby() {
  const { roomId } = useParams()
  const { room, myName, socketId, joinRoom, startGame, error, setError, loading } = useGame()

  const [nameInput, setNameInput] = useState('')
  const [copied, setCopied] = useState(false)
  const [joining, setJoining] = useState(false)

  const hasJoined = room && (
    room.players.some(p => p.id === socketId) ||
    room.players.some(p => p.name === myName)
  )
  const isHost = room && room.hostId === socketId
  const inviteUrl = `${window.location.origin}/room/${roomId}`

  useEffect(() => {
    if (!myName) return
    if (!roomId) return
    joinRoom(roomId, myName)
  }, [roomId, myName])

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

  // Formulaire de join pour visiteurs via lien
  if (!hasJoined && !myName) {
    return (
      <div className="page-split">
        <div className="panel-left fade-up" style={{ background: 'linear-gradient(135deg, #07071a 0%, #131335 50%, #0d0d28 100%)', alignItems: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🚀</div>
          <h2 style={{ fontSize: '2rem', color: 'var(--cyan)' }}>Tu es invite !</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.5rem' }}>
            Salle <code style={{ color: 'var(--purple)', fontFamily: 'monospace' }}>{roomId}</code>
          </p>
        </div>

        <div className="panel-right fade-up" style={{ animationDelay: '0.1s' }}>
          <div style={{ maxWidth: 400 }}>
            <div className="card-glow">
              <div className="section-label">Ton pseudo</div>
              <form onSubmit={handleJoin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input
                  className="input"
                  type="text"
                  placeholder="Ex : SupraNova_RL"
                  value={nameInput}
                  onChange={e => { setNameInput(e.target.value); setError('') }}
                  maxLength={20}
                  autoFocus
                />
                {error && <div className="error-msg">{error}</div>}
              </form>
            </div>
          </div>
        </div>

        <div className="action-bar">
          <div className="action-bar-label"><span>Salle {roomId}</span></div>
          <button
            className="action-bar-item primary arrow-right"
            onClick={handleJoin}
            disabled={!nameInput.trim() || joining}
          >
            {joining ? <span className="spinner" /> : 'Rejoindre la salle'}
          </button>
        </div>
      </div>
    )
  }

  if (!room) {
    return (
      <div className="page-split">
        <div className="panel-left" style={{ background: 'var(--bg)', alignItems: 'center', justifyContent: 'center' }}>
          <div className="spinner" style={{ width: 36, height: 36, borderWidth: 3 }} />
          <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>Connexion a la salle...</p>
        </div>
        <div className="panel-right" />
        <div className="action-bar">
          <div className="action-bar-label"><span>Chargement...</span></div>
          <div className="action-bar-label"><span></span></div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-split">

      {/* Panneau gauche — Header + Joueurs + Invite */}
      <div className="panel-left fade-up" style={{ background: 'linear-gradient(135deg, #07071a 0%, #131335 50%, #0d0d28 100%)', justifyContent: 'flex-start', paddingTop: '3rem' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h1 style={{ fontSize: '2.2rem', color: 'var(--text)' }}>
              <span style={{ color: 'var(--cyan)' }}>RL</span> Imposteur
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Salle d'attente · Manche {room.round}
            </p>
          </div>
          <div className="badge badge-amber">
            {room.players.length}/10 joueurs
          </div>
        </div>

        {/* Lien d'invitation */}
        <div className="card" style={{ padding: '1rem 1.25rem' }}>
          <div className="section-label">🔗 Lien d'invitation</div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <code style={{
              flex: 1,
              fontSize: '0.82rem',
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
              style={{ padding: '0.45rem 1rem', fontSize: '0.85rem', flexShrink: 0 }}
            >
              {copied ? '✓ Copie !' : 'Copier'}
            </button>
          </div>
        </div>

        {/* Liste des joueurs */}
        <div>
          <div className="section-label">Joueurs connectes</div>
          <div className="player-grid">
            {room.players.map(player => (
              <PlayerCard
                key={player.id}
                player={player}
                isHost={player.id === room.hostId}
                isMe={player.id === socketId}
              />
            ))}
          </div>
          {room.players.length < 2 && (
            <div className="waiting-banner" style={{ marginTop: '0.75rem' }}>
              En attente de joueurs...
            </div>
          )}
        </div>
      </div>

      {/* Panneau droit — Illustration + Règles */}
      <div className="panel-right fade-up" style={{ animationDelay: '0.1s' }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <LobbyIllustration size={300} playerCount={room.players.length} className="float" />
        </div>

        <div className="card" style={{ borderColor: 'var(--border-glow)' }}>
          <div className="section-label" style={{ color: 'var(--purple)' }}>Regles du jeu</div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
            {[
              { icon: '🎭', text: "Un imposteur secret est designe au lancement" },
              { icon: '🚗', text: "Jouez votre partie Rocket League normalement" },
              { icon: '🕵️', text: "L'imposteur doit faire perdre son equipe discretement" },
              { icon: '🗳️', text: "A la fin : tout le monde vote pour designer l'imposteur" },
              { icon: '🏆', text: "Bons votants +2 pts · Imposteur non decouvert +3 pts" },
            ].map(({ icon, text }) => (
              <li key={text} style={{ display: 'flex', gap: '0.75rem', fontSize: '0.95rem', color: 'var(--text-muted)', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '1rem', flexShrink: 0 }}>{icon}</span>
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Footer action bar */}
      <div className="action-bar">
        <div className="action-bar-label">
          <span>Salle d'attente · {room.players.length} joueur{room.players.length > 1 ? 's' : ''}</span>
        </div>
        {isHost ? (
          <button
            className={`action-bar-item primary arrow-right ${room.players.length >= 2 ? 'neon-pulse' : ''}`}
            onClick={() => startGame(room.id)}
            disabled={room.players.length < 2}
          >
            {room.players.length < 2
              ? "En attente d'un autre joueur..."
              : `Lancer la partie (${room.players.length} joueurs)`}
          </button>
        ) : (
          <div className="action-bar-label" style={{ justifyContent: 'flex-end' }}>
            En attente que <strong style={{ color: 'var(--text)' }}>{room.hostName}</strong> lance la partie...
          </div>
        )}
      </div>

    </div>
  )
}
