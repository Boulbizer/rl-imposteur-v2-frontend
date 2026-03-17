// components/Illustrations.jsx
// Custom SVG illustrations — editorial style, no emojis
// Flat, geometric, bold shapes matching QuipoQuiz aesthetic

// ─── MASQUE IMPOSTEUR (motif décoratif pour fond coloré) ─────────
// Grands shapes géométriques en arrière-plan du panneau
export function MaskPattern({ color = '#000', opacity = 0.08 }) {
  return (
    <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Grand masque imposteur stylisé */}
      <g transform="translate(420, 80) rotate(12)" opacity={opacity}>
        <ellipse cx="120" cy="140" rx="140" ry="120" fill={color} />
        <path d="M20 100 Q120 60, 220 100 Q220 160, 120 160 Q20 160, 20 100Z" fill={color === '#000' ? '#fff' : '#000'} fillOpacity="0.3" />
        {/* Backpack */}
        <rect x="240" y="80" width="50" height="100" rx="25" fill={color} />
      </g>
      {/* Petits masques flottants */}
      <g transform="translate(50, 350) rotate(-20)" opacity={opacity * 0.7}>
        <ellipse cx="40" cy="45" rx="45" ry="38" fill={color} />
        <path d="M5 32 Q40 20, 75 32 Q75 52, 40 52 Q5 52, 5 32Z" fill={color === '#000' ? '#fff' : '#000'} fillOpacity="0.3" />
        <rect x="78" y="25" width="16" height="32" rx="8" fill={color} />
      </g>
      <g transform="translate(650, 400) rotate(25)" opacity={opacity * 0.5}>
        <ellipse cx="30" cy="35" rx="35" ry="28" fill={color} />
        <path d="M3 24 Q30 15, 57 24 Q57 40, 30 40 Q3 40, 3 24Z" fill={color === '#000' ? '#fff' : '#000'} fillOpacity="0.3" />
        <rect x="60" y="18" width="12" height="24" rx="6" fill={color} />
      </g>
    </svg>
  )
}

// ─── VOITURE RL STYLISÉE (silhouette flat) ──────────────────────
export function CarSilhouette({ color = '#000', opacity = 0.1 }) {
  return (
    <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(350, 150) rotate(-5)" opacity={opacity}>
        {/* Car body */}
        <path d="M0 180 L0 130 Q0 110, 20 100 L120 60 Q140 50, 160 50 L340 50 Q370 50, 390 70 L430 120 Q440 130, 450 130 L450 180 Z" fill={color} />
        {/* Canopy */}
        <path d="M130 55 L165 0 Q175 -15, 195 -15 L305 -15 Q325 -15, 335 0 L370 55" fill={color} />
        {/* Front wheel */}
        <circle cx="370" cy="190" r="40" fill={color} />
        <circle cx="370" cy="190" r="22" fill={color === '#000' ? '#fff' : '#000'} fillOpacity="0.15" />
        {/* Rear wheel */}
        <circle cx="100" cy="190" r="40" fill={color} />
        <circle cx="100" cy="190" r="22" fill={color === '#000' ? '#fff' : '#000'} fillOpacity="0.15" />
        {/* Boost trail */}
        <path d="M-20 140 L-80 120 Q-100 115, -90 140 Q-100 165, -80 160 L-20 140Z" fill={color} fillOpacity="0.6" />
      </g>
    </svg>
  )
}

// ─── LOUPE / DETECTIVE ──────────────────────────────────────────
export function MagnifyingGlass({ color = '#000', opacity = 0.1 }) {
  return (
    <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(380, 80)" opacity={opacity}>
        {/* Glass circle */}
        <circle cx="130" cy="130" r="120" stroke={color} strokeWidth="20" fill="none" />
        {/* Handle */}
        <line x1="220" y1="220" x2="340" y2="340" stroke={color} strokeWidth="24" strokeLinecap="round" />
        {/* Eye inside — suspicious */}
        <ellipse cx="100" cy="120" rx="30" ry="20" fill={color} />
        <ellipse cx="160" cy="120" rx="30" ry="20" fill={color} />
        {/* Eyebrows */}
        <line x1="72" y1="92" x2="125" y2="98" stroke={color} strokeWidth="6" strokeLinecap="round" />
        <line x1="190" y1="98" x2="138" y2="92" stroke={color} strokeWidth="6" strokeLinecap="round" transform="scale(-1,1) translate(-330,0)" />
      </g>
      {/* Question marks */}
      <g opacity={opacity * 0.6} fill={color} fontFamily="Inter, sans-serif" fontWeight="900">
        <text x="100" y="150" fontSize="80">?</text>
        <text x="650" y="450" fontSize="60">?</text>
        <text x="80" y="480" fontSize="50">?</text>
      </g>
    </svg>
  )
}

// ─── TROPHEE ────────────────────────────────────────────────────
export function TrophySilhouette({ color = '#000', opacity = 0.1 }) {
  return (
    <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(400, 40)" opacity={opacity}>
        {/* Cup */}
        <path d="M-80 0 L-95 200 Q-95 260, -20 280 L-10 285 L-10 340 L-50 355 Q-60 360, -60 370 L-60 400 L140 400 L140 370 Q140 360, 130 355 L90 340 L90 285 L100 280 Q175 260, 175 200 L160 0Z" fill={color} />
        {/* Left handle */}
        <path d="M-80 30 Q-160 30, -170 100 Q-180 170, -110 200" stroke={color} strokeWidth="20" fill="none" strokeLinecap="round" />
        {/* Right handle */}
        <path d="M160 30 Q240 30, 250 100 Q260 170, 190 200" stroke={color} strokeWidth="20" fill="none" strokeLinecap="round" />
        {/* Star */}
        <polygon points="40,60 55,100 100,105 68,133 75,178 40,155 5,178 12,133 -20,105 25,100" fill={color === '#000' ? '#fff' : '#000'} fillOpacity="0.2" />
        {/* Base */}
        <rect x="-70" y="400" width="220" height="16" rx="4" fill={color} />
      </g>
      {/* Decorative stars */}
      <g opacity={opacity * 0.5} fill={color}>
        <polygon points="100,80 108,100 130,103 114,116 118,138 100,127 82,138 86,116 70,103 92,100" />
        <polygon points="680,120 686,136 704,138 691,148 694,166 680,157 666,166 669,148 656,138 674,136" />
        <polygon points="120,480 126,496 144,498 131,508 134,526 120,517 106,526 109,508 96,498 114,496" />
      </g>
    </svg>
  )
}

// ─── URNE DE VOTE ───────────────────────────────────────────────
export function BallotBox({ color = '#000', opacity = 0.1 }) {
  return (
    <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(380, 100)" opacity={opacity}>
        {/* Box body */}
        <rect x="0" y="80" width="240" height="280" rx="8" fill={color} />
        {/* Slot */}
        <rect x="60" y="80" width="120" height="12" rx="6" fill={color === '#000' ? '#fff' : '#000'} fillOpacity="0.2" />
        {/* Lid */}
        <path d="M-10 80 L-10 50 Q-10 30, 10 30 L230 30 Q250 30, 250 50 L250 80Z" fill={color} />
        {/* Ballot paper going in */}
        <g>
          <rect x="85" y="-30" width="70" height="100" rx="4" fill={color} />
          <rect x="85" y="-30" width="70" height="100" rx="4" fill={color === '#000' ? '#fff' : '#000'} fillOpacity="0.3" />
          {/* Checkmark on paper */}
          <polyline points="100,20 115,40 140,-5" stroke={color} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </g>
      </g>
      {/* Floating ballot papers */}
      <g opacity={opacity * 0.4}>
        <rect x="80" y="350" width="45" height="60" rx="3" fill={color} transform="rotate(-15 100 380)" />
        <rect x="620" y="200" width="40" height="55" rx="3" fill={color} transform="rotate(20 640 228)" />
      </g>
    </svg>
  )
}

// ─── SHIELD / REVEAL ────────────────────────────────────────────
export function ShieldReveal({ color = '#000', opacity = 0.1, found = true }) {
  return (
    <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(400, 50)" opacity={opacity}>
        {/* Shield shape */}
        <path d="M0 0 L-150 40 L-150 200 Q-150 350, 0 420 Q150 350, 150 200 L150 40Z" fill={color} />
        {/* Inner content */}
        {found ? (
          // Checkmark
          <polyline points="-55,180 -15,230 65,130" stroke={color === '#000' ? '#fff' : '#000'} strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.3" />
        ) : (
          // X mark
          <g stroke={color === '#000' ? '#fff' : '#000'} strokeWidth="20" strokeLinecap="round" opacity="0.3">
            <line x1="-45" y1="135" x2="45" y2="235" />
            <line x1="45" y1="135" x2="-45" y2="235" />
          </g>
        )}
      </g>
      {/* Decorative elements */}
      <g opacity={opacity * 0.4} fill={color}>
        <circle cx="100" cy="120" r="15" />
        <circle cx="680" cy="400" r="20" />
        <circle cx="150" cy="480" r="10" />
        <rect x="620" y="100" width="30" height="30" rx="4" transform="rotate(30 635 115)" />
      </g>
    </svg>
  )
}

// ─── GAMEPAD (pour lobby) ───────────────────────────────────────
export function GamepadPattern({ color = '#000', opacity = 0.08 }) {
  return (
    <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(350, 120) rotate(-8)" opacity={opacity}>
        {/* Controller body */}
        <path d="M80 0 L240 0 Q320 0, 320 80 L320 120 Q320 200, 280 240 L260 260 Q240 280, 210 280 L180 280 Q170 280, 165 270 L150 230 Q145 220, 140 230 L125 270 Q120 280, 110 280 L80 280 Q50 280, 30 260 L10 240 Q-30 200, -30 120 L-30 80 Q-30 0, 50 0Z" fill={color} />
        {/* D-pad */}
        <rect x="40" y="95" width="20" height="60" rx="4" fill={color === '#000' ? '#fff' : '#000'} fillOpacity="0.2" />
        <rect x="20" y="115" width="60" height="20" rx="4" fill={color === '#000' ? '#fff' : '#000'} fillOpacity="0.2" />
        {/* Buttons */}
        <circle cx="230" cy="100" r="14" fill={color === '#000' ? '#fff' : '#000'} fillOpacity="0.2" />
        <circle cx="260" cy="130" r="14" fill={color === '#000' ? '#fff' : '#000'} fillOpacity="0.2" />
        <circle cx="200" cy="130" r="14" fill={color === '#000' ? '#fff' : '#000'} fillOpacity="0.2" />
        <circle cx="230" cy="160" r="14" fill={color === '#000' ? '#fff' : '#000'} fillOpacity="0.2" />
        {/* Sticks */}
        <circle cx="100" cy="190" r="20" stroke={color === '#000' ? '#fff' : '#000'} strokeWidth="4" fill="none" fillOpacity="0.2" />
        <circle cx="200" cy="210" r="20" stroke={color === '#000' ? '#fff' : '#000'} strokeWidth="4" fill="none" fillOpacity="0.2" />
      </g>
      {/* Mini gamepads */}
      <g transform="translate(60, 380) rotate(15)" opacity={opacity * 0.5}>
        <rect x="0" y="0" width="80" height="55" rx="16" fill={color} />
      </g>
      <g transform="translate(650, 50) rotate(-12)" opacity={opacity * 0.4}>
        <rect x="0" y="0" width="70" height="48" rx="14" fill={color} />
      </g>
    </svg>
  )
}
