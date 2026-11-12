// components/Countdown.tsx — pastille de compte à rebours
import { useCountdown } from '../hooks/useCountdown'

export default function Countdown({ endsAt, label }: { endsAt: number | null | undefined; label: string }) {
  const left = useCountdown(endsAt)
  if (left === null) return null
  const urgent = left <= 10
  return (
    <span
      className="status-pill"
      data-testid="countdown"
      style={{
        color: urgent ? 'var(--red)' : 'var(--text-secondary)',
        borderColor: urgent ? 'rgba(239, 68, 68, 0.3)' : undefined,
        fontVariantNumeric: 'tabular-nums',
      }}
    >
      ⏱ {label} · {Math.floor(left / 60)}:{String(left % 60).padStart(2, '0')}
    </span>
  )
}
