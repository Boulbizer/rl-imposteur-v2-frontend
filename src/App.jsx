// App.jsx — Routeur principal
// Chaque URL correspond à un écran du jeu

import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Lobby from './pages/Lobby'
import Playing from './pages/Playing'
import Vote from './pages/Vote'
import Reveal from './pages/Reveal'
import Scores from './pages/Scores'
import ThemeToggle from './components/ThemeToggle'
import CookieBanner from './components/CookieBanner'
import { useTheme } from './hooks/useTheme'

export default function App() {
  const { theme, persistTheme } = useTheme()

  return (
    <>
      <ThemeToggle />

      <Routes>
        {/* Page d'accueil : créer ou rejoindre une salle */}
        <Route path="/" element={<Home />} />

        {/* Lien d'invitation : /room/abc123 → rejoindre directement */}
        <Route path="/room/:roomId" element={<Lobby />} />

        {/* Écrans de jeu (accessibles via l'état interne après avoir rejoint) */}
        <Route path="/room/:roomId/playing" element={<Playing />} />
        <Route path="/room/:roomId/vote"    element={<Vote />} />
        <Route path="/room/:roomId/reveal"  element={<Reveal />} />
        <Route path="/room/:roomId/scores"  element={<Scores />} />

        {/* Toute autre URL → accueil */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <CookieBanner onAccept={() => persistTheme(theme)} />
    </>
  )
}
