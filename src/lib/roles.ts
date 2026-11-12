// lib/roles.ts
// Présentation des rôles et des modes de jeu (textes, couleurs, emojis)

import type { RlMode, Role } from '../shared/protocol'

export interface RoleInfo {
  label: string
  title: string
  goal: string
  emoji: string
  color: string
  tint: string
}

export const ROLE_INFO: Record<Role, RoleInfo> = {
  impostor: {
    label: 'Imposteur',
    title: "Tu es l'Imposteur",
    goal: 'Fais perdre ton équipe sans te faire repérer. Sois subtil.',
    emoji: '🎭',
    color: 'var(--impostor-red)',
    tint: 'rgba(220, 38, 38, 0.08)',
  },
  jester: {
    label: 'Bouffon',
    title: 'Tu es le Bouffon',
    goal: 'Fais-toi désigner comme imposteur au vote. Plus tu parais suspect, mieux c’est.',
    emoji: '🃏',
    color: 'var(--orange)',
    tint: 'rgba(249, 115, 22, 0.08)',
  },
  detective: {
    label: 'Détective',
    title: 'Tu es le Détective',
    goal: 'Tu as un indice. Mène l’enquête et démasque l’imposteur.',
    emoji: '🔎',
    color: 'var(--cyan)',
    tint: 'rgba(6, 182, 212, 0.08)',
  },
  teammate: {
    label: 'Équipier',
    title: 'Tu es Équipier',
    goal: "Joue normalement et observe. Quelqu'un cherche à vous faire perdre.",
    emoji: '⚽',
    color: 'var(--safe-blue)',
    tint: 'rgba(37, 99, 235, 0.06)',
  },
}

export const MODE_LABELS: Record<RlMode, string> = {
  '1v1': '1v1 · Duel',
  '2v2': '2v2 · Doubles',
  '3v3': '3v3 · Standard',
  hoops: 'Hoops',
  rumble: 'Rumble',
  dropshot: 'Dropshot',
}
