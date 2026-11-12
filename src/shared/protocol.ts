// shared/protocol.ts
// Copie du protocole socket défini côté serveur
// (rl-imposteur-v2-backend/src/types.ts, sans les types internes Player et Room).
// Toute modification du protocole doit être faite des deux côtés.

export type RoomStatus = 'lobby' | 'playing' | 'debate' | 'voting' | 'reveal'

export type Role = 'teammate' | 'impostor' | 'jester' | 'detective'

export type RlMode = '1v1' | '2v2' | '3v3' | 'hoops' | 'rumble' | 'dropshot'

export interface RoomSettings {
  /** Mode Rocket League joué (oriente les missions). */
  mode: RlMode
  /** Rôle Bouffon actif (effectif dès 4 joueurs connectés). */
  jester: boolean
  /** Rôle Détective actif (effectif dès 5 joueurs connectés). */
  detective: boolean
  /** Durée du débat en secondes (0 = pas de débat). */
  debateSeconds: number
  /** Durée du vote en secondes (0 = pas de limite). */
  voteSeconds: number
}

export interface Accusation {
  fromId: string
  targetId: string
  reason: string
}

// ─── Vues envoyées aux clients ───────────────────────────────────

export interface PublicPlayer {
  id: string
  name: string
  disconnected: boolean
  hasVoted: boolean
}

export interface PublicRoom {
  id: string
  hostId: string
  hostName: string
  status: RoomStatus
  round: number
  players: PublicPlayer[]
  votesCount: number
  settings: RoomSettings
  phaseEndsAt: number | null
  accusations: Accusation[]
}

export interface You {
  playerId: string
  token: string
  name: string
}

export interface PrivateView {
  you: You
  isImpostor: boolean
  role: Role | null
  mission: string | null
  clue: string | null
}

export interface ScoreLine {
  name: string
  total: number
}

export interface RoundResults {
  impostorFound: boolean
  impostorId: string
  impostorName: string | undefined
  accusedId: string | null
  accusedName: string | undefined
  tally: Record<string, number>
  pointsAwarded: Record<string, number>
  players: PublicPlayer[]
  votes: Record<string, string>
  roles: Record<string, Role>
  missions: Record<string, string>
  accusations: Accusation[]
  jesterId: string | null
  jesterWon: boolean
  cumulativeScores?: ScoreLine[]
}

// ─── Protocole socket ────────────────────────────────────────────

export interface ClientToServerEvents {
  'room:create': (p: { playerName: string }) => void
  'room:join': (p: { roomId: string; playerName?: string; token?: string }) => void
  'room:rejoin': (p: { roomId: string; token: string }) => void
  'game:start': (p: { roomId: string }) => void
  'game:end': (p: { roomId: string }) => void
  'room:settings': (p: { roomId: string; settings: Partial<RoomSettings> }) => void
  'debate:accuse': (p: { roomId: string; targetId: string; reason: string }) => void
  'debate:skip': (p: { roomId: string }) => void
  'vote:cast': (p: { roomId: string; targetId: string }) => void
  'scores:request': (p: { roomId: string }) => void
  'round:next': (p: { roomId: string }) => void
}

export interface ServerToClientEvents {
  'room:created': (p: { room: PublicRoom } & PrivateView) => void
  'room:joined': (p: { room: PublicRoom } & PrivateView) => void
  'room:rejoined': (p: { room: PublicRoom } & PrivateView) => void
  'room:updated': (p: { room: PublicRoom }) => void
  'room:error': (p: { message: string }) => void
  'room:session-lost': (p: { message: string }) => void
  'host:changed': (p: { newHostId: string }) => void
  'game:started': (p: { room: PublicRoom } & PrivateView) => void
  'debate:started': (p: { room: PublicRoom }) => void
  'voting:started': (p: { room: PublicRoom }) => void
  'vote:registered': (p: { votesCount: number; totalPlayers: number }) => void
  'reveal:result': (p: { results: RoundResults; room: PublicRoom }) => void
  'scores:data': (p: { scores: ScoreLine[]; room: PublicRoom }) => void
  'round:next': (p: { room: PublicRoom }) => void
}
