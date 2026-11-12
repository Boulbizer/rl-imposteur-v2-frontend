// hooks/useGame.ts
// Ce hook centralise TOUTE la logique Socket.io
// L'état est persisté dans sessionStorage pour survivre aux navigations
// Reconnexion automatique avec room:rejoin + jeton de session

import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import socket from '../lib/socket'
import type { PublicRoom, RoundResults, ScoreLine, You } from '../shared/protocol'

/** Seule preuve d'identité auprès du serveur. */
export interface Session {
  roomId: string
  playerId: string
  token: string
}

function loadFromSession<T>(key: string, fallback: T): T {
  try {
    const val = sessionStorage.getItem(key)
    return val ? (JSON.parse(val) as T) : fallback
  } catch { return fallback }
}

function saveToSession(key: string, value: unknown) {
  try { sessionStorage.setItem(key, JSON.stringify(value)) } catch { /* stockage indisponible */ }
}

export function useGame() {
  const navigate = useNavigate()

  const [room, setRoom]             = useState<PublicRoom | null>(() => loadFromSession('rl_room', null))
  const [myName, setMyName]         = useState<string>(() => loadFromSession('rl_myName', ''))
  const [isImpostor, setIsImpostor] = useState<boolean>(() => loadFromSession('rl_isImpostor', false))
  const [error, setError]           = useState('')
  const [votesCount, setVotesCount] = useState(0)
  const [results, setResults]       = useState<RoundResults | null>(() => loadFromSession('rl_results', null))
  const [scores, setScores]         = useState<ScoreLine[]>([])
  const [loading, setLoading]       = useState(false)
  const [session, setSession]       = useState<Session | null>(() => loadFromSession('rl_session', null))

  const myId = session?.playerId ?? null
  const amHost = !!(room && myId && room.hostId === myId)

  useEffect(() => { saveToSession('rl_room', room) }, [room])
  useEffect(() => { saveToSession('rl_myName', myName) }, [myName])
  useEffect(() => { saveToSession('rl_isImpostor', isImpostor) }, [isImpostor])
  useEffect(() => { saveToSession('rl_results', results) }, [results])

  useEffect(() => {
    if (!socket.connected) socket.connect()

    // Mémorise l'identité renvoyée par le serveur (jamais déduite du pseudo)
    const storeIdentity = (room: PublicRoom, you: You) => {
      const next: Session = { roomId: room.id, playerId: you.playerId, token: you.token }
      saveToSession('rl_session', next)
      saveToSession('rl_myName', you.name)
      setSession(next)
      setMyName(you.name)
    }

    // ─── RECONNEXION AUTOMATIQUE ─────────────────────────────────
    const handleReconnect = () => {
      const saved = loadFromSession<Session | null>('rl_session', null)
      if (saved?.token) socket.emit('room:rejoin', { roomId: saved.roomId, token: saved.token })
    }
    socket.on('connect', handleReconnect)

    // ─── ÉVÉNEMENTS SALLE ────────────────────────────────────────

    socket.on('room:created', ({ room, you }) => {
      storeIdentity(room, you)
      setRoom(room)
      setLoading(false)
      navigate(`/room/${room.id}`)
    })

    socket.on('room:joined', ({ room, you }) => {
      storeIdentity(room, you)
      setRoom(room)
      setLoading(false)
    })

    socket.on('room:rejoined', ({ room, you, isImpostor }) => {
      storeIdentity(room, you)
      setRoom(room)
      setLoading(false)
      setIsImpostor(isImpostor)
      saveToSession('rl_isImpostor', isImpostor)
    })

    // Jeton refusé (salle supprimée, session expirée…) : on repart de zéro
    socket.on('room:session-lost', ({ message }) => {
      for (const key of ['rl_session', 'rl_room', 'rl_isImpostor', 'rl_results']) {
        sessionStorage.removeItem(key)
      }
      setSession(null)
      setRoom(null)
      setError(message)
      navigate('/')
    })

    socket.on('room:updated', ({ room }) => { setRoom(room) })

    socket.on('room:error', ({ message }) => {
      setError(message)
      setLoading(false)
    })

    // ─── ÉVÉNEMENTS JEU ──────────────────────────────────────────

    socket.on('game:started', ({ room, isImpostor }) => {
      setRoom(room)
      setIsImpostor(isImpostor)
      saveToSession('rl_isImpostor', isImpostor)
      navigate(`/room/${room.id}/playing`)
    })

    socket.on('voting:started', ({ room }) => {
      setRoom(room)
      setVotesCount(0)
      navigate(`/room/${room.id}/vote`)
    })

    socket.on('vote:registered', ({ votesCount }) => { setVotesCount(votesCount) })

    socket.on('reveal:result', ({ results, room }) => {
      setRoom(room)
      saveToSession('rl_results', results)
      setResults(results)
      navigate(`/room/${room.id}/reveal`)
    })

    socket.on('scores:data', ({ scores, room }) => {
      setScores(scores)
      setRoom(room)
      saveToSession('rl_room', room)
    })

    socket.on('round:next', ({ room }) => {
      setRoom(room)
      setResults(null)
      setVotesCount(0)
      setIsImpostor(false)
      saveToSession('rl_results', null)
      saveToSession('rl_isImpostor', false)
      navigate(`/room/${room.id}`)
    })

    return () => {
      socket.off('connect', handleReconnect)
      socket.off('room:created')
      socket.off('room:joined')
      socket.off('room:rejoined')
      socket.off('room:session-lost')
      socket.off('room:updated')
      socket.off('room:error')
      socket.off('game:started')
      socket.off('voting:started')
      socket.off('vote:registered')
      socket.off('reveal:result')
      socket.off('scores:data')
      socket.off('round:next')
    }
  }, [navigate])

  const createRoom = useCallback((playerName: string) => {
    setError('')
    setLoading(true)
    socket.emit('room:create', { playerName })
  }, [])

  const joinRoom = useCallback((roomId: string, playerName: string) => {
    setError('')
    setLoading(true)
    const code = roomId.trim().toUpperCase()
    const saved = loadFromSession<Session | null>('rl_session', null)
    // Le jeton n'est envoyé que pour la salle à laquelle il appartient
    const token = saved?.roomId === code ? saved.token : undefined
    socket.emit('room:join', { roomId: code, playerName, token })
  }, [])

  const startGame      = useCallback((roomId: string) => { socket.emit('game:start', { roomId }) }, [])
  const endGame        = useCallback((roomId: string) => { socket.emit('game:end', { roomId }) }, [])
  const castVote       = useCallback((roomId: string, targetId: string) => { socket.emit('vote:cast', { roomId, targetId }) }, [])
  const requestScores  = useCallback((roomId: string) => { socket.emit('scores:request', { roomId }) }, [])
  const startNextRound = useCallback((roomId: string) => { socket.emit('round:next', { roomId }) }, [])

  return {
    room, myName, myId, isImpostor, amHost, error, votesCount, results, scores, loading,
    /** Identifiant joueur stable (nom historique conservé pour les pages). */
    socketId: myId,
    createRoom, joinRoom, startGame, endGame, castVote, requestScores, startNextRound, setError,
  }
}
