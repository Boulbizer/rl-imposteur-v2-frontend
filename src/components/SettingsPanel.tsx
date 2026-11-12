// components/SettingsPanel.tsx — réglages de la salle (modifiables par l'hôte)
import type { PublicRoom, RlMode, RoomSettings } from '../shared/protocol'
import { MODE_LABELS } from '../lib/roles'

const DURATIONS = [0, 30, 60, 90, 120]
const fmt = (s: number) => (s === 0 ? 'Désactivé' : s < 60 ? `${s} s` : `${s / 60} min${s % 60 ? ` ${s % 60} s` : ''}`)

export default function SettingsPanel({ room, editable, onChange }: {
  room: PublicRoom
  editable: boolean
  onChange: (patch: Partial<RoomSettings>) => void
}) {
  const s = room.settings
  const connected = room.players.filter(p => !p.disconnected).length

  const row = (label: string, control: React.ReactNode, hint?: string) => (
    <label style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
      <span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem' }}>
        <span>{label}</span>{control}
      </span>
      {hint && <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>{hint}</span>}
    </label>
  )

  const select = <T extends string | number>(value: T, options: T[], render: (v: T) => string, set: (v: T) => void, testId: string) => (
    <select
      className="input"
      data-testid={testId}
      disabled={!editable}
      value={String(value)}
      onChange={e => set((typeof value === 'number' ? Number(e.target.value) : e.target.value) as T)}
      style={{ width: 'auto', padding: '0.35rem 0.6rem', fontSize: '0.88rem' }}
    >
      {options.map(o => <option key={String(o)} value={String(o)}>{render(o)}</option>)}
    </select>
  )

  const toggle = (checked: boolean, set: (v: boolean) => void, testId: string) => (
    <input type="checkbox" data-testid={testId} checked={checked} disabled={!editable}
      onChange={e => set(e.target.checked)} style={{ width: 18, height: 18, accentColor: 'var(--violet)' }} />
  )

  return (
    <div className="glass" style={{ borderRadius: 'var(--radius-lg)', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
      <div className="section-label" style={{ color: 'var(--accent-violet)' }}>
        Réglages {editable ? '' : '(choisis par l’hôte)'}
      </div>
      {row('Mode Rocket League', select<RlMode>(s.mode, Object.keys(MODE_LABELS) as RlMode[], m => MODE_LABELS[m], mode => onChange({ mode }), 'setting-mode'),
        'Les missions sont adaptées au mode.')}
      {row('🃏 Bouffon', toggle(s.jester, jester => onChange({ jester }), 'setting-jester'),
        connected >= 4 ? 'Gagne s’il est désigné au vote.' : 'Actif à partir de 4 joueurs.')}
      {row('🔎 Détective', toggle(s.detective, detective => onChange({ detective }), 'setting-detective'),
        connected >= 5 ? 'Reçoit un indice sur un innocent.' : 'Actif à partir de 5 joueurs.')}
      {row('🗣️ Débat', select<number>(s.debateSeconds, DURATIONS, fmt, debateSeconds => onChange({ debateSeconds }), 'setting-debate'))}
      {row('🗳️ Vote', select<number>(s.voteSeconds, DURATIONS, v => (v === 0 ? 'Sans limite' : fmt(v)), voteSeconds => onChange({ voteSeconds }), 'setting-vote'))}
    </div>
  )
}
