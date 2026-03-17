// pages/Lobby.jsx
// Salle d'attente — Layout split : info salle sur bleu, joueurs sur noir

import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useGame } from '../hooks/useGame'
import { GamepadPattern } from '../components/Illustrations'

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
        <div className="panel-left fade-up" style={{ background: 'var(--blue)' }}>
          <div className="illustration-container">
            <GamepadPattern color="#000" opacity={0.06} />
          </div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', color: 'var(--text-dark)' }}>
              Tu es invite !
            </h1>
            <p style={{ fontSize: '1rem', color: 'rgba(0,0,0,0.6)', marginTop: '1rem' }}>
              Salle <strong>{roomId}</strong>
            </p>
          </div>
        </div>

        <div className="panel-right fade-up" style={{ animationDelay: '0.1s' }}>
          <div style={{ maxWidth: 400 }}>
            <div className="section-label">Rejoindre la salle</div>
            <form onSubmit={handleJoin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-gray)', marginBottom: '0.5rem', fontWeight: 500 }}>
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
            </form>
          </div>
        </div>

        <div className="action-bar">
          <div className="action-bar-label">
            <span>Salle {roomId}</span>
          </div>
          <button
            className="action-bar-item primary arrow-down-right"
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
        <div className="panel-left" style={{ background: 'var(--blue)' }}>
          <div className="illustration-container">
            <GamepadPattern color="#000" opacity={0.06} />
          </div>
        </div>
        <div className="panel-right" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div className="spinner" style={{ margin: '0 auto 1rem', width: 32, height: 32 }} />
            <p style={{ color: 'var(--text-gray)' }}>Connexion a la salle...</p>
          </div>
        </div>
        <div className="action-bar">
          <div className="action-bar-label"><span>Chargement...</span></div>
          <div className="action-bar-label"><span></span></div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-split">

      {/* Panneau gauche — Info salle sur bleu */}
      <div className="panel-left fade-up" style={{ background: 'var(--blue)' }}>
        <div className="illustration-container">
          <GamepadPattern color="#000" opacity={0.06} />
        </div>
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div>
            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: 'var(--text-dark)', marginBottom: '0.5rem' }}>
              RL Imposteur
            </h1>
            <p style={{ fontSize: '0.95rem', color: 'rgba(0,0,0,0.6)' }}>
              Salle d'attente · Manche {room.round}
            </p>
          </div>

          {/* Lien d'invitation */}
          <div>
            <div className="section-label-dark">Lien d'invitation</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
              <span style={{
                flex: 1,
                fontSize: '0.85rem',
                color: 'rgba(0,0,0,0.7)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                fontWeight: 500,
              }}>
                {inviteUrl}
              </span>
              <button
                onClick={handleCopyLink}
                style={{
                  background: 'rgba(0,0,0,0.1)',
                  border: 'none',
                  padding: '0.4rem 1rem',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  color: 'var(--text-dark)',
                  fontFamily: 'var(--font)',
                }}
              >
                {copied ? 'Copie !' : 'Copier'}
              </button>
            </div>
          </div>

          {/* Regles condensees */}
          <div>
            <div className="section-label-dark">Regles</div>
            <p style={{ fontSize: '0.9rem', color: 'rgba(0,0,0,0.6)', lineHeight: 1.7, marginTop: '0.25rem' }}>
              Un imposteur secret est designe. Jouez votre partie RL. L'imposteur sabote discretement. A la fin, votez. Bon vote +2 pts, imposteur non decouvert +3 pts.
            </p>
          </div>
        </div>
      </div>

      {/* Panneau droit — Liste joueurs sur noir */}
      <div className="panel-right fade-up" style={{ animationDelay: '0.1s', justifyContent: 'flex-start', paddingTop: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <div className="section-label" style={{ marginBottom: 0 }}>Joueurs connectes</div>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-gray)', fontWeight: 600 }}>
            {room.players.length}/10
          </span>
        </div>

        <div>
          {room.players.map(player => {
            const isMe = player.id === socketId
            const isPlayerHost = player.id === room.hostId
            const isDisconnected = player.disconnected
            return (
              <div
                key={player.id}
                className="list-row"
                style={isDisconnected ? { opacity: 0.4 } : {}}
              >
                <div className="row-left">
                  <span style={{ fontWeight: isMe ? 800 : 600 }}>
                    {player.name}
                    {isMe && <span style={{ color: 'var(--text-dim)', fontWeight: 400, fontSize: '0.85rem', marginLeft: '0.5rem' }}>(toi)</span>}
                    {isDisconnected && <span style={{ color: 'var(--text-dim)', fontWeight: 400, fontSize: '0.85rem', marginLeft: '0.5rem' }}>deconnecte</span>}
                  </span>
                </div>
                <div className="row-right">
                  {isPlayerHost && <span className="badge" style={{ color: 'var(--blue)' }}>Hote</span>}
                </div>
              </div>
            )
          })}

          {room.players.length < 2 && (
            <div className="waiting-banner" style={{ marginTop: '0.5rem' }}>
              En attente de joueurs...
            </div>
          )}
        </div>
      </div>

      {/* Footer action bar */}
      <div className="action-bar">
        <div className="action-bar-label">
          <span>Salle d'attente · {room.players.length} joueur{room.players.length > 1 ? 's' : ''}</span>
        </div>
        {isHost ? (
          <button
            className="action-bar-item primary arrow-down-right"
            onClick={() => startGame(room.id)}
            disabled={room.players.length < 2}
          >
            {room.players.length < 2
              ? "En attente d'un autre joueur..."
              : `Lancer la partie (${room.players.length} joueurs)`}
          </button>
        ) : (
          <div className="action-bar-label" style={{ justifyContent: 'flex-end' }}>
            <span>En attente que {room.hostName} lance la partie...</span>
          </div>
        )}
      </div>

    </div>
  )
}
