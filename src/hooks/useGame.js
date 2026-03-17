// hooks/useGame.js
// Ce hook centralise TOUTE la logique Socket.io
// L'état est persisté dans sessionStorage pour survivre aux navigations
// Reconnexion automatique avec room:rejoin

import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import socket from '../lib/socket'

function loadFromSession(key, fallback) {
  try {
    const val = sessionStorage.getItem(key)
    return val ? JSON.parse(val) : fallback
  } catch { return fallback }
}

function saveToSession(key, value) {
  try { sessionStorage.setItem(key, JSON.stringify(value)) } catch {}
}

export function useGame() {
  const navigate = useNavigate()

  const [room, setRoom]             = useState(() => loadFromSession('rl_room', null))
  const [myName, setMyName]         = useState(() => loadFromSession('rl_myName', ''))
  const [isImpostor, setIsImpostor] = useState(() => loadFromSession('rl_isImpostor', false))
  const [error, setError]           = useState('')
  const [votesCount, setVotesCount] = useState(0)
  const [results, setResults]       = useState(() => loadFromSession('rl_results', null))
  const [scores, setScores]         = useState([])
  const [loading, setLoading]       = useState(false)

  // amHost est calculé dynamiquement depuis room.hostName
  const amHost = !!(room && myName && room.hostName === myName)

  useEffect(() => { saveToSession('rl_room', room) }, [room])
  useEffect(() => { saveToSession('rl_myName', myName) }, [myName])
  useEffect(() => { saveToSession('rl_isImpostor', isImpostor) }, [isImpostor])
  useEffect(() => { saveToSession('rl_results', results) }, [results])

  useEffect(() => {
    if (!socket.connected) socket.connect()

    // ─── RECONNEXION AUTOMATIQUE ─────────────────────────────────
    // Quand le socket se reconnecte, on tente un rejoin automatique
    const handleReconnect = () => {
      const savedRoom = loadFromSession('rl_room', null)
      const savedName = loadFromSession('rl_myName', '')
      if (savedRoom && savedName) {
        socket.emit('room:rejoin', { roomId: savedRoom.id, playerName: savedName })
        console.log(`🔄 Tentative de reconnexion à la salle ${savedRoom.id}`)
      }
    }
    socket.on('connect', handleReconnect)

    // ─── ÉVÉNEMENTS SALLE ────────────────────────────────────────

    socket.on('room:created', ({ room }) => {
      setRoom(room)
      setLoading(false)
      navigate(`/room/${room.id}`)
    })

    socket.on('room:joined', ({ room }) => {
      setRoom(room)
      setLoading(false)
    })

    socket.on('room:rejoined', ({ room, isImpostor }) => {
      setRoom(room)
      if (isImpostor !== undefined) {
        setIsImpostor(isImpostor)
        saveToSession('rl_isImpostor', isImpostor)
      }
      console.log(`✅ Reconnecté à la salle ${room.id}`)
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

    socket.on('reveal:result', ({ results }) => {
      saveToSession('rl_results', results)
      setResults(results)
      const currentRoom = loadFromSession('rl_room', null)
      if (currentRoom) navigate(`/room/${currentRoom.id}/reveal`)
    })

    socket.on('scores:data', ({ scores, room }) => {
      setScores(scores)
      if (room) {
        setRoom(room)
        saveToSession('rl_room', room)
      }
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

  const createRoom = useCallback((playerName) => {
    setError('')
    setLoading(true)
    setMyName(playerName)
    socket.emit('room:create', { playerName })
  }, [])

  const joinRoom = useCallback((roomId, playerName) => {
    setError('')
    setLoading(true)
    setMyName(playerName)
    socket.emit('room:join', { roomId, playerName })
  }, [])

  const startGame      = useCallback((roomId) => { socket.emit('game:start', { roomId }) }, [])
  const endGame        = useCallback((roomId) => { socket.emit('game:end', { roomId }) }, [])
  const castVote       = useCallback((roomId, targetId) => { socket.emit('vote:cast', { roomId, targetId }) }, [])
  const requestScores  = useCallback((roomId) => { socket.emit('scores:request', { roomId }) }, [])
  // Sécurisé : plus de hostName envoyé, le backend vérifie uniquement socket.id
  const startNextRound = useCallback((roomId) => {
    socket.emit('round:next', { roomId })
  }, [])

  return {
    room, myName, isImpostor, amHost, error, votesCount, results, scores, loading,
    socketId: socket.id,
    createRoom, joinRoom, startGame, endGame, castVote, requestScores, startNextRound, setError,
  }
}
