const COLORS = ['#8b5cf6', '#3b82f6', '#ec4899', '#f97316', '#06b6d4', '#22c55e', '#ef4444', '#eab308']

function hashName(name) {
  let h = 0
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h)
  return Math.abs(h) % COLORS.length
}

function darken(hex) {
  const num = parseInt(hex.slice(1), 16)
  const r = Math.max(0, Math.round(((num >> 16) & 0xff) * 0.8))
  const g = Math.max(0, Math.round(((num >> 8) & 0xff) * 0.8))
  const b = Math.max(0, Math.round((num & 0xff) * 0.8))
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`
}

export default function Avatar({ name, size = 'md', color }) {
  const c = color || COLORS[hashName(name)]
  const sizeClass = size === 'sm' ? 'avatar-sm' : size === 'lg' ? 'avatar-lg' : ''
  return (
    <div
      className={`avatar ${sizeClass}`}
      style={{ background: `linear-gradient(135deg, ${c}, ${darken(c)})` }}
    >
      {name ? name[0].toUpperCase() : '?'}
    </div>
  )
}
