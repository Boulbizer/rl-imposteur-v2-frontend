// pages/Debate.tsx
// Phase de débat : chacun peut accuser publiquement un joueur, avec une raison.
// Le vote s'ouvre à la fin du chrono, ou plus tôt si l'hôte le décide.

import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useGame } from '../hooks/useGame'
import Avatar from '../components/Avatar'
import Countdown from '../components/Countdown'

const MAX_REASON = 80

export default function Debate() {
  // La route /room/:roomId garantit la présence du paramètre
  const { roomId = '' } = useParams<{ roomId: string }>()
  const { room, myId, amHost, accuse, skipDebate, error, setError } = useGame()
  const [targetId, setTargetId] = useState('')
  const [reason, setReason] = useState('')

  if (!room) return null

  const others = room.players.filter(p => p.id !== myId)
  const nameOf = (id: string) => room.players.find(p => p.id === id)?.name ?? '?'
  const mine = room.accusations.find(a => a.fromId === myId)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!targetId || !reason.trim()) return
    accuse(roomId, targetId, reason.trim())
    setReason('')
  }

  return (
    <div className="container fade-up" style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem',
      padding: '2rem 1rem', minHeight: '100vh',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 48, lineHeight: 1, marginBottom: '0.5rem' }}>🗣️</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', fontWeight: 700, color: 'var(--text-primary)' }}>
          Débat
        </h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: 440, margin: '0.5rem auto 1rem', lineHeight: 1.6 }}>
          Parlez-en en vocal. Chacun peut poser une accusation publique avant le vote.
        </p>
        <Countdown endsAt={room.phaseEndsAt} label="Vote dans" />
      </div>

      <form onSubmit={submit} className="glass-strong" style={{
        width: '100%', maxWidth: 560, padding: '1.5rem', borderRadius: 'var(--radius-lg)',
        display: 'flex', flexDirection: 'column', gap: '0.9rem',
      }}>
        <div className="section-label">{mine ? 'Changer ton accusation' : 'Accuser quelqu’un'}</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {others.map(p => (
            <button
              type="button"
              key={p.id}
              className={`btn ${targetId === p.id ? 'btn-primary' : 'btn-glass'}`}
              onClick={() => { setTargetId(p.id); setError('') }}
              style={{ padding: '0.45rem 0.9rem', fontSize: '0.9rem', ...(targetId === p.id ? { color: '#fff' } : {}) }}
              data-testid="accuse-target"
            >
              {p.name}
            </button>
          ))}
        </div>
        <input
          className="input"
          placeholder="Pourquoi ? (ex : il a raté 3 dégagements)"
          value={reason}
          maxLength={MAX_REASON}
          onChange={e => { setReason(e.target.value); setError('') }}
        />
        {error && <div className="error-msg">{error}</div>}
        <button className="btn btn-danger" type="submit" disabled={!targetId || !reason.trim()}>
          Accuser {targetId ? nameOf(targetId) : ''}
        </button>
      </form>

      <div className="glass" style={{ width: '100%', maxWidth: 560, padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
        <div className="section-label" style={{ marginBottom: '0.75rem' }}>
          Accusations ({room.accusations.length})
        </div>
        {room.accusations.length === 0 && (
          <p style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>Personne n’a encore accusé personne…</p>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
          {room.accusations.map(a => (
            <div key={a.fromId} data-testid="accusation" style={{ display: 'flex', gap: '0.65rem', alignItems: 'flex-start' }}>
              <Avatar name={nameOf(a.fromId)} size="sm" />
              <div style={{ lineHeight: 1.5 }}>
                <strong style={{ color: 'var(--text-primary)' }}>{nameOf(a.fromId)}</strong>
                <span style={{ color: 'var(--text-tertiary)' }}> accuse </span>
                <strong style={{ color: 'var(--impostor-red)' }}>{nameOf(a.targetId)}</strong>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>« {a.reason} »</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {amHost && (
        <button className="btn btn-primary" onClick={() => skipDebate(roomId)}>
          Passer au vote maintenant
        </button>
      )}
    </div>
  )
}
