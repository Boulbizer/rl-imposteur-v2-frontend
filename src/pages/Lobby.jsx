import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useGame } from '../hooks/useGame'
import Avatar from '../components/Avatar'

const MAX_PLAYERS = 10

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
    if (!myName || !roomId) return
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

  // ── Join form for visitors arriving via invite link ──
  if (!hasJoined && !myName) {
    return (
      <div className="container fade-up" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh',
      }}>
        <div className="glass-strong" style={{
          padding: '2.5rem',
          borderRadius: 'var(--radius-lg)',
          width: '100%',
          maxWidth: 420,
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🚀</div>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: '1.6rem',
            color: 'var(--accent-violet)',
            marginBottom: '0.25rem',
          }}>
            Tu es invite !
          </h2>
          <p style={{
            fontFamily: 'var(--font-body)',
            color: 'var(--text-secondary)',
            fontSize: '0.95rem',
            marginBottom: '1.5rem',
          }}>
            Salle <code style={{
              color: 'var(--accent-violet)',
              fontFamily: 'monospace',
              background: 'rgba(139,92,246,0.08)',
              padding: '0.15rem 0.4rem',
              borderRadius: 'var(--radius-md)',
            }}>{roomId}</code>
          </p>

          <form onSubmit={handleJoin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
            <label className="section-label">Ton pseudo</label>
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
            <button
              className="btn btn-primary"
              type="submit"
              disabled={!nameInput.trim() || joining}
              style={{ width: '100%' }}
            >
              {joining ? 'Connexion...' : 'Rejoindre la salle'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  // ── Loading state ──
  if (!room) {
    return (
      <div className="container fade-up" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh',
        gap: '1rem',
      }}>
        <div className="spinner" style={{ width: 36, height: 36, borderWidth: 3 }} />
        <p style={{
          fontFamily: 'var(--font-body)',
          color: 'var(--text-secondary)',
        }}>
          Connexion a la salle...
        </p>
      </div>
    )
  }

  // ── Main lobby ──
  const players = room.players || []
  const emptySlots = Math.max(0, 6 - players.length)

  return (
    <div className="container fade-up" style={{
      display: 'grid',
      gridTemplateColumns: '1fr 340px',
      gap: '1.5rem',
      paddingTop: '2.5rem',
      paddingBottom: '2.5rem',
      alignItems: 'start',
    }}>

      {/* ── Main card ── */}
      <div className="glass-strong" style={{
        borderRadius: 'var(--radius-lg)',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}>
          <div>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: '1.6rem',
              color: 'var(--text-primary)',
              margin: 0,
            }}>
              Salon de jeu
            </h1>
            <p style={{
              fontFamily: 'var(--font-body)',
              color: 'var(--text-secondary)',
              fontSize: '0.9rem',
              marginTop: '0.25rem',
            }}>
              Manche {room.round || 1}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span className="badge" style={{
              background: 'rgba(139,92,246,0.12)',
              color: 'var(--accent-violet)',
              fontFamily: 'monospace',
              fontWeight: 600,
            }}>
              {room.id}
            </span>
            <span className="badge badge-amber">
              {players.length}/{MAX_PLAYERS}
            </span>
          </div>
        </div>

        {/* Invite link */}
        <div className="glass-subtle" style={{
          padding: '0.85rem 1.1rem',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
        }}>
          <span className="section-label" style={{ margin: 0, whiteSpace: 'nowrap' }}>Lien d'invitation</span>
          <code style={{
            flex: 1,
            fontSize: '0.82rem',
            color: 'var(--accent-violet)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {inviteUrl}
          </code>
          <button
            className="btn btn-glass"
            onClick={handleCopyLink}
            style={{ padding: '0.4rem 0.85rem', fontSize: '0.82rem', flexShrink: 0 }}
          >
            {copied ? 'Copie !' : 'Copier'}
          </button>
        </div>

        {/* Players grid */}
        <div>
          <div className="section-label">Joueurs connectes</div>
          <div className="players-grid">
            {players.map(player => {
              const isMe = player.id === socketId
              const playerIsHost = player.id === room.hostId
              return (
                <div
                  key={player.id}
                  className="player-slot glass-subtle"
                  style={{
                    opacity: player.disconnected ? 0.5 : 1,
                    border: isMe ? '1.5px solid var(--accent-violet)' : undefined,
                  }}
                >
                  <Avatar name={player.name} size="md" />
                  <span style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    color: 'var(--text-primary)',
                  }}>
                    {player.name}
                    {isMe && (
                      <span style={{
                        color: 'var(--text-tertiary)',
                        fontWeight: 400,
                        fontSize: '0.78rem',
                        marginLeft: '0.35rem',
                      }}>
                        (toi)
                      </span>
                    )}
                  </span>
                  {playerIsHost && <span className="badge badge-host">Hote</span>}
                </div>
              )
            })}

            {/* Empty slots */}
            {Array.from({ length: emptySlots }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="player-slot"
                style={{
                  border: '2px dashed rgba(139,92,246,0.15)',
                  background: 'transparent',
                }}
              >
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: 'var(--radius-full)',
                  background: 'rgba(139,92,246,0.06)',
                }} />
                <span style={{
                  fontFamily: 'var(--font-body)',
                  color: 'var(--text-tertiary)',
                  fontSize: '0.85rem',
                }}>
                  En attente...
                </span>
              </div>
            ))}
          </div>
        </div>

        {players.length < 2 && (
          <div className="waiting-banner">
            En attente de joueurs pour commencer...
          </div>
        )}

        {error && <div className="error-msg">{error}</div>}

        {/* Start bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '0.75rem',
          borderTop: '1px solid rgba(139,92,246,0.1)',
        }}>
          <span style={{
            fontFamily: 'var(--font-body)',
            color: 'var(--text-secondary)',
            fontSize: '0.9rem',
          }}>
            {players.length}/{MAX_PLAYERS} joueurs prets
          </span>

          {isHost ? (
            <button
              className="btn btn-primary"
              onClick={() => startGame(room.id)}
              disabled={players.length < 2}
            >
              {players.length < 2
                ? "En attente d'un autre joueur..."
                : `Lancer la partie`}
            </button>
          ) : (
            <span style={{
              fontFamily: 'var(--font-body)',
              color: 'var(--text-secondary)',
              fontSize: '0.88rem',
            }}>
              En attente que <strong style={{ color: 'var(--text-primary)' }}>{room.hostName}</strong> lance la partie...
            </span>
          )}
        </div>
      </div>

      {/* ── Sidebar ── */}
      <div className="glass" style={{
        borderRadius: 'var(--radius-lg)',
        padding: '1.75rem',
      }}>
        <div className="section-label" style={{ color: 'var(--accent-violet)' }}>Regles du jeu</div>
        <ul style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem',
        }}>
          {[
            { icon: '🎭', text: "Un imposteur secret est designe au lancement" },
            { icon: '🚗', text: "Jouez votre partie Rocket League normalement" },
            { icon: '🕵️', text: "L'imposteur doit faire perdre son equipe discretement" },
            { icon: '🗳️', text: "A la fin : tout le monde vote pour designer l'imposteur" },
            { icon: '🏆', text: "Bons votants +2 pts · Imposteur non decouvert +3 pts" },
          ].map(({ icon, text }) => (
            <li key={text} style={{
              display: 'flex',
              gap: '0.65rem',
              fontSize: '0.9rem',
              fontFamily: 'var(--font-body)',
              color: 'var(--text-secondary)',
              alignItems: 'flex-start',
              lineHeight: 1.5,
            }}>
              <span style={{ fontSize: '1rem', flexShrink: 0 }}>{icon}</span>
              <span>{text}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
