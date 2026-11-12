// hooks/useCountdown.ts
// Secondes restantes avant `endsAt` (horodatage serveur en ms), ou null.

import { useEffect, useState } from 'react'

export function useCountdown(endsAt: number | null | undefined): number | null {
  const compute = () => (endsAt ? Math.max(0, Math.ceil((endsAt - Date.now()) / 1000)) : null)
  const [left, setLeft] = useState(compute)
  useEffect(() => {
    setLeft(compute())
    if (!endsAt) return
    const timer = setInterval(() => setLeft(compute()), 250)
    return () => clearInterval(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endsAt])
  return left
}
