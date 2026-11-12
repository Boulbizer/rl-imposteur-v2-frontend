// lib/socket.ts
// Instance Socket.io partagée dans toute l'app, typée par le protocole
// Reconnexion automatique activée

import { io, type Socket } from 'socket.io-client'
import type { ClientToServerEvents, ServerToClientEvents } from '../shared/protocol'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(BACKEND_URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
})

export default socket
