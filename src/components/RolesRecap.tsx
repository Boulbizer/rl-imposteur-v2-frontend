// components/RolesRecap.tsx — rôles et missions de chacun, révélés en fin de manche
import type { RoundResults } from '../shared/protocol'
import { ROLE_INFO } from '../lib/roles'
import Avatar from './Avatar'

export default function RolesRecap({ results, myId }: { results: RoundResults; myId: string | null }) {
  const order = { impostor: 0, jester: 1, detective: 2, teammate: 3 } as const
  const players = [...results.players].sort(
    (a, b) => order[results.roles[a.id] ?? 'teammate'] - order[results.roles[b.id] ?? 'teammate'],
  )
  const nameOf = (id: string) => results.players.find(p => p.id === id)?.name ?? '?'

  return (
    <div className="glass-strong fade-up" style={{ width: '100%', maxWidth: 600, padding: '1.75rem 2rem', borderRadius: 'var(--radius-lg)' }}>
      <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>
        🎬 Rôles et missions
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {players.map(p => {
          const role = ROLE_INFO[results.roles[p.id] ?? 'teammate']
          return (
            <div key={p.id} data-testid="role-recap" style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <Avatar name={p.name} size="sm" />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                  {p.name}{p.id === myId && <span style={{ color: 'var(--text-tertiary)', fontWeight: 400 }}> (toi)</span>}
                  {' · '}<span style={{ color: role.color }}>{role.emoji} {role.label}</span>
                </div>
                {results.missions[p.id] && (
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    Mission : {results.missions[p.id]}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
      {results.accusations.length > 0 && (
        <>
          <div className="section-label" style={{ margin: '1.25rem 0 0.5rem' }}>Accusations du débat</div>
          {results.accusations.map(a => (
            <div key={a.fromId} style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              <strong>{nameOf(a.fromId)}</strong> → <strong>{nameOf(a.targetId)}</strong> : « {a.reason} »
            </div>
          ))}
        </>
      )}
    </div>
  )
}
