// hooks/useGame.js
// Ce hook centralise TOUTE la logique Socket.io
// Les pages n'ont qu'à appeler les fonctions qu'il expose

import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import socket from '../lib/socket'

export function useGame() {
  const navigate = useNavigate()

  const [room, setRoom]           = useState(null)   // données de la salle
  const [myName, setMyName]       = useState('')      // mon pseudo
  const [isImpostor, setIsImpostor] = useState(false) // mon rôle secret
  const [error, setError]         = useState('')      // message d'erreur
  const [votesCount, setVotesCount] = useState(0)    // votes reçus
  const [results, setResults]     = useState(null)   // résultats du vote
  const [scores, setScores]       = useState([])     // scores cumulés
  const [loading, setLoading]     = useState(false)

  // Connexion Socket.io au montage
  useEffect(() => {
    if (!socket.connected) socket.connect()

    // ── Écoute des événements serveur ──────────────────────────────

    // Salle créée avec succès (après room:create)
    socket.on('room:created', ({ room }) => {
      setRoom(room)
      setLoading(false)
      navigate(`/room/${room.id}`)
    })

    // On a rejoint une salle (après room:join)
    socket.on('room:joined', ({ room }) => {
      setRoom(room)
      setLoading(false)
    })

    // Liste des joueurs mise à jour (quelqu'un rejoint ou quitte)
    socket.on('room:updated', ({ room }) => {
      setRoom(room)
    })

    // Erreur de salle (salle pleine, déjà démarrée…)
    socket.on('room:error', ({ message }) => {
      setError(message)
      setLoading(false)
    })

    // Partie lancée → on reçoit notre rôle secret
    socket.on('game:started', ({ room, isImpostor }) => {
      setRoom(room)
      setIsImpostor(isImpostor)
      navigate(`/room/${room.id}/playing`)
    })

    // Phase de vote déclenchée par l'hôte
    socket.on('voting:started', ({ room }) => {
      setRoom(room)
      setVotesCount(0)
      navigate(`/room/${room.id}/vote`)
    })

    // Un vote a été enregistré (indicateur de progression)
    socket.on('vote:registered', ({ votesCount }) => {
      setVotesCount(votesCount)
    })

    // Tous ont voté → résultats disponibles
    socket.on('reveal:result', ({ results }) => {
      setResults(results)
      navigate(`/room/${room?.id}/reveal`)
    })

    // Scores cumulés reçus depuis Supabase
    socket.on('scores:data', ({ scores }) => {
      setScores(scores)
    })

    // L'hôte a passé à la manche suivante
    socket.on('round:next', ({ room }) => {
      setRoom(room)
      setResults(null)
      setVotesCount(0)
      setIsImpostor(false)
      navigate(`/room/${room.id}`)
    })

    // Nettoyage : retire les listeners au démontage
    return () => {
      socket.off('room:created')
      socket.off('room:joined')
      socket.off('room:updated')
      socket.off('room:error')
      socket.off('game:started')
      socket.off('voting:started')
      socket.off('vote:registered')
      socket.off('reveal:result')
      socket.off('scores:data')
      socket.off('round:next')
    }
  }, [navigate, room?.id])

  // ── Actions émises vers le serveur ────────────────────────────────

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

  const startGame = useCallback((roomId) => {
    socket.emit('game:start', { roomId })
  }, [])

  const endGame = useCallback((roomId) => {
    socket.emit('game:end', { roomId })
  }, [])

  const castVote = useCallback((roomId, targetId) => {
    socket.emit('vote:cast', { roomId, targetId })
  }, [])

  const requestScores = useCallback((roomId) => {
    socket.emit('scores:request', { roomId })
  }, [])

  const startNextRound = useCallback((roomId) => {
    socket.emit('round:next', { roomId })
  }, [])

  return {
    // État
    room,
    myName,
    isImpostor,
    error,
    votesCount,
    results,
    scores,
    loading,
    socketId: socket.id,
    // Actions
    createRoom,
    joinRoom,
    startGame,
    endGame,
    castVote,
    requestScores,
    startNextRound,
    setError,
  }
}
