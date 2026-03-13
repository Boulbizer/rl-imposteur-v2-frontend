// lib/socket.js
// Instance Socket.io partagée dans toute l'app
// On crée UNE SEULE connexion au chargement, réutilisée partout

import { io } from 'socket.io-client'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'

// autoConnect: false → on se connecte manuellement quand on en a besoin
const socket = io(BACKEND_URL, {
  autoConnect: false,
})

export default socket
