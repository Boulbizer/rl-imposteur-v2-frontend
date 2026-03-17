// components/Illustrations.jsx
// Custom SVG illustrations — editorial style, no emojis
// Bold, geometric, high-contrast shapes for colored panels

// ─── MASQUE IMPOSTEUR ───────────────────────────────────────────
export function MaskPattern({ color = '#000', opacity = 0.12 }) {
  return (
    <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Grand masque principal */}
      <g transform="translate(380, 40) rotate(8)" opacity={opacity}>
        <ellipse cx="140" cy="160" rx="160" ry="140" fill={color} />
        {/* Fente des yeux */}
        <path d="M40 120 Q140 70, 240 120 Q240 175, 140 175 Q40 175, 40 120Z" fill={color === '#000' ? '#fff' : '#000'} fillOpacity="0.35" />
        {/* Oreille / antenne */}
        <rect x="280" y="80" width="55" height="110" rx="28" fill={color} />
        {/* Sourcils menaçants */}
        <line x1="60" y1="85" x2="130" y2="105" stroke={color === '#000' ? '#fff' : '#000'} strokeWidth="10" strokeLinecap="round" opacity="0.2" />
        <line x1="220" y1="85" x2="150" y2="105" stroke={color === '#000' ? '#fff' : '#000'} strokeWidth="10" strokeLinecap="round" opacity="0.2" />
      </g>
      {/* Masques satellites */}
      <g transform="translate(30, 320) rotate(-18)" opacity={opacity * 0.8}>
        <ellipse cx="55" cy="65" rx="65" ry="55" fill={color} />
        <path d="M10 45 Q55 28, 100 45 Q100 72, 55 72 Q10 72, 10 45Z" fill={color === '#000' ? '#fff' : '#000'} fillOpacity="0.3" />
        <rect x="110" y="35" width="22" height="44" rx="11" fill={color} />
      </g>
      <g transform="translate(620, 370) rotate(22)" opacity={opacity * 0.6}>
        <ellipse cx="45" cy="50" rx="50" ry="42" fill={color} />
        <path d="M8 35 Q45 22, 82 35 Q82 55, 45 55 Q8 55, 8 35Z" fill={color === '#000' ? '#fff' : '#000'} fillOpacity="0.3" />
        <rect x="88" y="26" width="18" height="36" rx="9" fill={color} />
      </g>
      {/* Points interrogation flottants */}
      <g fill={color} fontFamily="Inter, sans-serif" fontWeight="900" opacity={opacity * 0.7}>
        <text x="60" y="150" fontSize="60">?</text>
        <text x="700" y="180" fontSize="45">?</text>
        <text x="30" y="520" fontSize="40">?</text>
        <text x="680" y="550" fontSize="55">?</text>
      </g>
      {/* Lignes decoratives */}
      <line x1="0" y1="580" x2="250" y2="580" stroke={color} strokeWidth="3" opacity={opacity * 0.5} />
      <line x1="550" y1="20" x2="800" y2="20" stroke={color} strokeWidth="3" opacity={opacity * 0.5} />
    </svg>
  )
}

// ─── VOITURE RL STYLISEE ────────────────────────────────────────
export function CarSilhouette({ color = '#000', opacity = 0.12 }) {
  return (
    <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Voiture principale */}
      <g transform="translate(300, 120) rotate(-3)" opacity={opacity}>
        <path d="M0 200 L0 145 Q0 120, 25 108 L130 65 Q155 52, 180 52 L370 52 Q405 52, 425 75 L470 130 Q480 142, 495 142 L495 200 Z" fill={color} />
        <path d="M140 58 L180 -5 Q192 -22, 215 -22 L330 -22 Q355 -22, 365 -5 L405 58" fill={color} />
        {/* Roues */}
        <circle cx="405" cy="212" r="48" fill={color} />
        <circle cx="405" cy="212" r="26" fill={color === '#000' ? '#fff' : '#000'} fillOpacity="0.18" />
        <circle cx="110" cy="212" r="48" fill={color} />
        <circle cx="110" cy="212" r="26" fill={color === '#000' ? '#fff' : '#000'} fillOpacity="0.18" />
        {/* Boost */}
        <path d="M-25 150 L-100 125 Q-125 118, -115 150 Q-125 182, -100 175 L-25 150Z" fill={color} fillOpacity="0.7" />
        <path d="M-100 140 L-155 125 Q-170 120, -162 140 Q-170 160, -155 155 L-100 140Z" fill={color} fillOpacity="0.4" />
      </g>
      {/* Petite voiture en haut */}
      <g transform="translate(50, 60) rotate(12) scale(0.35)" opacity={opacity * 0.5}>
        <path d="M0 200 L0 145 Q0 120, 25 108 L130 65 Q155 52, 180 52 L370 52 Q405 52, 425 75 L470 130 L495 200 Z" fill={color} />
        <circle cx="405" cy="212" r="48" fill={color} />
        <circle cx="110" cy="212" r="48" fill={color} />
      </g>
      {/* Ballon RL */}
      <g transform="translate(650, 380)" opacity={opacity * 0.7}>
        <circle cx="40" cy="40" r="40" fill={color} />
        <path d="M15 20 Q40 5, 65 20 Q70 40, 40 55 Q10 40, 15 20Z" fill={color === '#000' ? '#fff' : '#000'} fillOpacity="0.2" />
      </g>
      {/* Lignes de vitesse */}
      <g stroke={color} strokeWidth="3" strokeLinecap="round" opacity={opacity * 0.5}>
        <line x1="20" y1="300" x2="120" y2="300" />
        <line x1="40" y1="330" x2="100" y2="330" />
        <line x1="10" y1="360" x2="80" y2="360" />
      </g>
    </svg>
  )
}

// ─── LOUPE / DETECTIVE ──────────────────────────────────────────
export function MagnifyingGlass({ color = '#000', opacity = 0.12 }) {
  return (
    <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(340, 50)" opacity={opacity}>
        <circle cx="150" cy="150" r="135" stroke={color} strokeWidth="24" fill="none" />
        <line x1="250" y1="250" x2="380" y2="380" stroke={color} strokeWidth="28" strokeLinecap="round" />
        {/* Oeil suspicieux */}
        <ellipse cx="110" cy="140" rx="35" ry="22" fill={color} />
        <ellipse cx="190" cy="140" rx="35" ry="22" fill={color} />
        {/* Sourcils */}
        <line x1="78" y1="108" x2="140" y2="116" stroke={color} strokeWidth="8" strokeLinecap="round" />
        <line x1="222" y1="108" x2="160" y2="116" stroke={color} strokeWidth="8" strokeLinecap="round" />
        {/* Reflet */}
        <path d="M55 80 Q80 40, 120 60" stroke={color === '#000' ? '#fff' : '#000'} strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.2" />
      </g>
      {/* Points d'interrogation */}
      <g fill={color} fontFamily="Inter, sans-serif" fontWeight="900" opacity={opacity * 0.8}>
        <text x="60" y="140" fontSize="90">?</text>
        <text x="680" y="420" fontSize="70">?</text>
        <text x="50" y="480" fontSize="55">?</text>
        <text x="720" y="120" fontSize="50">?</text>
      </g>
      {/* Empreintes / indices */}
      <g opacity={opacity * 0.5} fill={color}>
        <circle cx="100" cy="350" r="8" />
        <circle cx="130" cy="370" r="6" />
        <circle cx="155" cy="395" r="5" />
        <circle cx="680" cy="500" r="10" />
        <circle cx="710" cy="520" r="7" />
      </g>
    </svg>
  )
}

// ─── TROPHEE ────────────────────────────────────────────────────
export function TrophySilhouette({ color = '#000', opacity = 0.12 }) {
  return (
    <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Trophee principal */}
      <g transform="translate(380, 20)" opacity={opacity}>
        <path d="M-90 0 L-105 220 Q-105 285, -22 308 L-12 312 L-12 375 L-55 390 Q-66 396, -66 408 L-66 440 L150 440 L150 408 Q150 396, 140 390 L98 375 L98 312 L108 308 Q190 285, 190 220 L175 0Z" fill={color} />
        {/* Anses */}
        <path d="M-90 35 Q-175 35, -185 110 Q-195 185, -120 220" stroke={color} strokeWidth="22" fill="none" strokeLinecap="round" />
        <path d="M175 35 Q260 35, 270 110 Q280 185, 205 220" stroke={color} strokeWidth="22" fill="none" strokeLinecap="round" />
        {/* Etoile */}
        <polygon points="42,65 60,110 110,116 74,148 82,198 42,172 2,198 10,148 -26,116 24,110" fill={color === '#000' ? '#fff' : '#000'} fillOpacity="0.22" />
        {/* Socle */}
        <rect x="-78" y="440" width="240" height="18" rx="4" fill={color} />
      </g>
      {/* Etoiles decoratives */}
      <g opacity={opacity * 0.7} fill={color}>
        <polygon points="80,60 92,90 124,94 100,114 106,146 80,130 54,146 60,114 36,94 68,90" />
        <polygon points="700,100 709,124 735,127 716,142 720,168 700,155 680,168 684,142 665,127 691,124" />
        <polygon points="100,480 109,504 135,507 116,522 120,548 100,535 80,548 84,522 65,507 91,504" />
        <polygon points="660,450 667,468 687,470 672,481 675,501 660,491 645,501 648,481 633,470 653,468" />
      </g>
      {/* Confettis rectangles */}
      <g opacity={opacity * 0.4} fill={color}>
        <rect x="60" y="200" width="25" height="8" rx="2" transform="rotate(-20 72 204)" />
        <rect x="680" y="280" width="30" height="8" rx="2" transform="rotate(35 695 284)" />
        <rect x="40" y="400" width="20" height="6" rx="2" transform="rotate(15 50 403)" />
        <rect x="720" y="60" width="22" height="7" rx="2" transform="rotate(-30 731 64)" />
      </g>
    </svg>
  )
}

// ─── URNE DE VOTE ───────────────────────────────────────────────
export function BallotBox({ color = '#000', opacity = 0.12 }) {
  return (
    <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Urne principale */}
      <g transform="translate(350, 70)" opacity={opacity}>
        <rect x="0" y="90" width="270" height="310" rx="10" fill={color} />
        {/* Fente */}
        <rect x="65" y="90" width="140" height="14" rx="7" fill={color === '#000' ? '#fff' : '#000'} fillOpacity="0.25" />
        {/* Couvercle */}
        <path d="M-12 90 L-12 55 Q-12 32, 12 32 L258 32 Q282 32, 282 55 L282 90Z" fill={color} />
        {/* Bulletin entrant */}
        <g>
          <rect x="90" y="-45" width="80" height="115" rx="5" fill={color} />
          <rect x="90" y="-45" width="80" height="115" rx="5" fill={color === '#000' ? '#fff' : '#000'} fillOpacity="0.3" />
          <polyline points="110,15 130,40 160,-10" stroke={color} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </g>
        {/* Ligne decorative sur urne */}
        <line x1="30" y1="300" x2="240" y2="300" stroke={color === '#000' ? '#fff' : '#000'} strokeWidth="3" opacity="0.1" />
      </g>
      {/* Bulletins flottants */}
      <g opacity={opacity * 0.6}>
        <rect x="60" y="320" width="55" height="75" rx="4" fill={color} transform="rotate(-12 88 358)" />
        <polyline points="75,345 85,360 100,335" stroke={color === '#000' ? '#fff' : '#000'} strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.3" transform="rotate(-12 88 348)" />

        <rect x="640" y="180" width="50" height="68" rx="4" fill={color} transform="rotate(18 665 214)" />
        <polyline points="653,200 663,215 678,195" stroke={color === '#000' ? '#fff' : '#000'} strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.3" transform="rotate(18 665 205)" />

        <rect x="80" y="120" width="40" height="55" rx="3" fill={color} transform="rotate(8 100 148)" opacity={opacity * 0.4} />
      </g>
      {/* Croix et coches decoratives */}
      <g stroke={color} strokeWidth="4" strokeLinecap="round" opacity={opacity * 0.5}>
        <line x1="700" y1="440" x2="720" y2="460" />
        <line x1="720" y1="440" x2="700" y2="460" />
        <polyline points="30,470 40,485 60,455" fill="none" />
      </g>
    </svg>
  )
}

// ─── BOUCLIER REVEAL ────────────────────────────────────────────
export function ShieldReveal({ color = '#000', opacity = 0.12, found = true }) {
  return (
    <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(380, 30)" opacity={opacity}>
        {/* Bouclier */}
        <path d="M0 0 L-170 45 L-170 220 Q-170 385, 0 460 Q170 385, 170 220 L170 45Z" fill={color} />
        {/* Contenu interieur */}
        {found ? (
          <polyline points="-60,200 -15,255 75,140" stroke={color === '#000' ? '#fff' : '#000'} strokeWidth="24" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.3" />
        ) : (
          <g stroke={color === '#000' ? '#fff' : '#000'} strokeWidth="24" strokeLinecap="round" opacity="0.3">
            <line x1="-50" y1="150" x2="50" y2="260" />
            <line x1="50" y1="150" x2="-50" y2="260" />
          </g>
        )}
        {/* Bordure interieure */}
        <path d="M0 30 L-140 68 L-140 215 Q-140 360, 0 428 Q140 360, 140 215 L140 68Z" stroke={color === '#000' ? '#fff' : '#000'} strokeWidth="3" fill="none" opacity="0.1" />
      </g>
      {/* Elements decoratifs */}
      <g opacity={opacity * 0.6} fill={color}>
        <circle cx="80" cy="100" r="18" />
        <circle cx="700" cy="380" r="22" />
        <circle cx="130" cy="490" r="12" />
        <circle cx="60" cy="350" r="8" />
        <rect x="640" y="80" width="35" height="35" rx="5" transform="rotate(25 658 98)" />
        <rect x="680" y="500" width="28" height="28" rx="4" transform="rotate(-15 694 514)" />
      </g>
      {/* Eclats / rayons */}
      <g stroke={color} strokeWidth="3" strokeLinecap="round" opacity={opacity * 0.4}>
        <line x1="30" y1="200" x2="80" y2="180" />
        <line x1="20" y1="240" x2="70" y2="240" />
        <line x1="30" y1="280" x2="80" y2="300" />
        <line x1="720" y1="200" x2="760" y2="180" />
        <line x1="730" y1="240" x2="770" y2="240" />
        <line x1="720" y1="280" x2="760" y2="300" />
      </g>
    </svg>
  )
}

// ─── GAMEPAD (pour lobby) ───────────────────────────────────────
export function GamepadPattern({ color = '#000', opacity = 0.10 }) {
  return (
    <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Manette principale */}
      <g transform="translate(320, 90) rotate(-6)" opacity={opacity}>
        <path d="M90 0 L265 0 Q350 0, 350 90 L350 135 Q350 225, 305 270 L285 292 Q265 315, 230 315 L200 315 Q188 315, 182 303 L165 258 Q160 245, 155 258 L138 303 Q132 315, 120 315 L90 315 Q55 315, 33 292 L13 270 Q-33 225, -33 135 L-33 90 Q-33 0, 55 0Z" fill={color} />
        {/* D-pad */}
        <rect x="42" y="105" width="24" height="70" rx="5" fill={color === '#000' ? '#fff' : '#000'} fillOpacity="0.22" />
        <rect x="18" y="129" width="72" height="24" rx="5" fill={color === '#000' ? '#fff' : '#000'} fillOpacity="0.22" />
        {/* Boutons ABXY */}
        <circle cx="252" cy="110" r="17" fill={color === '#000' ? '#fff' : '#000'} fillOpacity="0.22" />
        <circle cx="287" cy="145" r="17" fill={color === '#000' ? '#fff' : '#000'} fillOpacity="0.22" />
        <circle cx="217" cy="145" r="17" fill={color === '#000' ? '#fff' : '#000'} fillOpacity="0.22" />
        <circle cx="252" cy="180" r="17" fill={color === '#000' ? '#fff' : '#000'} fillOpacity="0.22" />
        {/* Sticks analogiques */}
        <circle cx="110" cy="215" r="24" stroke={color === '#000' ? '#fff' : '#000'} strokeWidth="5" fill="none" opacity="0.22" />
        <circle cx="220" cy="240" r="24" stroke={color === '#000' ? '#fff' : '#000'} strokeWidth="5" fill="none" opacity="0.22" />
        {/* Bumpers */}
        <rect x="10" y="-15" width="100" height="15" rx="7" fill={color === '#000' ? '#fff' : '#000'} fillOpacity="0.15" />
        <rect x="245" y="-15" width="100" height="15" rx="7" fill={color === '#000' ? '#fff' : '#000'} fillOpacity="0.15" />
      </g>
      {/* Mini manettes decoratives */}
      <g transform="translate(40, 380) rotate(15) scale(0.3)" opacity={opacity * 0.7}>
        <path d="M90 0 L265 0 Q350 0, 350 90 L350 135 Q350 225, 305 270 L285 292 Q265 315, 230 315 L90 315 Q55 315, 33 292 L13 270 Q-33 225, -33 135 L-33 90 Q-33 0, 55 0Z" fill={color} />
      </g>
      <g transform="translate(630, 420) rotate(-10) scale(0.25)" opacity={opacity * 0.5}>
        <path d="M90 0 L265 0 Q350 0, 350 90 L350 135 Q350 225, 305 270 L285 292 Q265 315, 230 315 L90 315 Q55 315, 33 292 L13 270 Q-33 225, -33 135 L-33 90 Q-33 0, 55 0Z" fill={color} />
      </g>
      {/* Etoiles de connexion */}
      <g fill={color} opacity={opacity * 0.6}>
        <circle cx="700" cy="80" r="6" />
        <circle cx="720" cy="100" r="4" />
        <circle cx="740" cy="85" r="5" />
        <circle cx="50" cy="120" r="5" />
        <circle cx="75" cy="140" r="4" />
      </g>
      {/* Texte "GG" decoratif */}
      <g fill={color} fontFamily="Inter, sans-serif" fontWeight="900" opacity={opacity * 0.4}>
        <text x="650" y="550" fontSize="50">GG</text>
      </g>
    </svg>
  )
}
