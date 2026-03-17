// components/Illustrations.jsx
// SVG illustrations thématiques RL Imposteur
// Chaque illustration est un composant React inline SVG

// ─── VOITURE RL AVEC MASQUE ─────────────────────────────────────
// Utilisée sur Home + Playing
export function CarIllustration({ size = 280, className = '' }) {
  return (
    <svg viewBox="0 0 400 300" width={size} height={size * 0.75} className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Glow background */}
      <defs>
        <radialGradient id="carGlow" cx="50%" cy="60%" r="45%">
          <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="carBody" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#0891b2" />
        </linearGradient>
        <linearGradient id="carTop" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
        <linearGradient id="boostFlame" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="50%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Background glow */}
      <ellipse cx="200" cy="180" rx="180" ry="120" fill="url(#carGlow)" />

      {/* Ground shadow */}
      <ellipse cx="200" cy="230" rx="130" ry="15" fill="#7c3aed" opacity="0.15" />

      {/* Ground line */}
      <line x1="40" y1="230" x2="360" y2="230" stroke="#1e1e4a" strokeWidth="1" strokeDasharray="8 4" />

      {/* Boost trail */}
      <path d="M70 185 Q50 185, 30 175 Q10 165, 5 185 Q10 205, 30 195 Q50 185, 70 195" fill="url(#boostFlame)" opacity="0.8">
        <animate attributeName="opacity" values="0.8;0.4;0.8" dur="0.6s" repeatCount="indefinite" />
      </path>
      <path d="M60 187 Q40 180, 20 185 Q40 190, 60 193" fill="#fbbf24" opacity="0.6">
        <animate attributeName="opacity" values="0.6;0.3;0.6" dur="0.4s" repeatCount="indefinite" />
      </path>

      {/* Car body - main chassis */}
      <path d="M90 210 L90 185 Q90 175, 100 170 L160 155 Q170 152, 180 152 L260 152 Q275 152, 285 160 L310 180 Q315 185, 320 185 L320 210 Q320 215, 315 215 L95 215 Q90 215, 90 210Z" fill="url(#carBody)" />

      {/* Car top / canopy */}
      <path d="M155 155 L175 125 Q180 118, 190 118 L240 118 Q250 118, 255 125 L275 155" fill="url(#carTop)" opacity="0.9" />

      {/* Windshield */}
      <path d="M160 153 L177 128 Q180 123, 186 123 L244 123 Q250 123, 253 128 L270 153" fill="#0e0e2a" opacity="0.8" />

      {/* Windshield glare */}
      <path d="M175 133 L182 125 Q185 122, 190 128 L183 136Z" fill="#22d3ee" opacity="0.3" />

      {/* Car body stripe */}
      <rect x="100" y="175" width="210" height="4" rx="2" fill="#22d3ee" opacity="0.5" />

      {/* Front bumper */}
      <path d="M310 185 Q325 185, 330 190 L335 205 Q335 215, 325 215 L320 215 L320 185Z" fill="#0891b2" />

      {/* Headlight */}
      <rect x="325" y="192" width="8" height="12" rx="2" fill="#fbbf24" opacity="0.9" />
      <rect x="325" y="192" width="8" height="12" rx="2" fill="#fbbf24" opacity="0.4">
        <animate attributeName="opacity" values="0.4;0.7;0.4" dur="2s" repeatCount="indefinite" />
      </rect>

      {/* Rear */}
      <path d="M90 185 Q80 185, 78 190 L75 205 Q75 215, 85 215 L90 215 L90 185Z" fill="#0891b2" />

      {/* Tail light */}
      <rect x="76" y="192" width="6" height="12" rx="2" fill="#ef4444" opacity="0.8" />

      {/* Front wheel */}
      <g>
        <circle cx="280" cy="220" r="22" fill="#1e1e4a" stroke="#334155" strokeWidth="2" />
        <circle cx="280" cy="220" r="14" fill="#334155" />
        <circle cx="280" cy="220" r="4" fill="#64748b" />
        {/* Wheel spokes */}
        <line x1="280" y1="208" x2="280" y2="232" stroke="#64748b" strokeWidth="1.5">
          <animateTransform attributeName="transform" type="rotate" from="0 280 220" to="360 280 220" dur="0.8s" repeatCount="indefinite" />
        </line>
        <line x1="268" y1="220" x2="292" y2="220" stroke="#64748b" strokeWidth="1.5">
          <animateTransform attributeName="transform" type="rotate" from="0 280 220" to="360 280 220" dur="0.8s" repeatCount="indefinite" />
        </line>
      </g>

      {/* Rear wheel */}
      <g>
        <circle cx="130" cy="220" r="22" fill="#1e1e4a" stroke="#334155" strokeWidth="2" />
        <circle cx="130" cy="220" r="14" fill="#334155" />
        <circle cx="130" cy="220" r="4" fill="#64748b" />
        <line x1="130" y1="208" x2="130" y2="232" stroke="#64748b" strokeWidth="1.5">
          <animateTransform attributeName="transform" type="rotate" from="0 130 220" to="360 130 220" dur="0.8s" repeatCount="indefinite" />
        </line>
        <line x1="118" y1="220" x2="142" y2="220" stroke="#64748b" strokeWidth="1.5">
          <animateTransform attributeName="transform" type="rotate" from="0 130 220" to="360 130 220" dur="0.8s" repeatCount="indefinite" />
        </line>
      </g>

      {/* ── IMPOSTOR MASK on the car ── */}
      {/* Mask body */}
      <g transform="translate(190, 80)">
        <ellipse cx="20" cy="18" rx="24" ry="20" fill="#ef4444" />
        {/* Visor / eyes */}
        <path d="M2 12 Q20 8, 38 12 Q38 22, 20 22 Q2 22, 2 12Z" fill="#0e0e2a" />
        {/* Eye glint */}
        <circle cx="14" cy="15" r="3" fill="#ef4444" opacity="0.6" />
        <circle cx="26" cy="15" r="3" fill="#ef4444" opacity="0.6" />
        {/* Backpack */}
        <rect x="38" y="8" width="10" height="18" rx="4" fill="#dc2626" />
      </g>

      {/* Speed lines */}
      <line x1="45" y1="160" x2="15" y2="160" stroke="#06b6d4" strokeWidth="1" opacity="0.3" />
      <line x1="55" y1="170" x2="20" y2="170" stroke="#06b6d4" strokeWidth="1.5" opacity="0.4" />
      <line x1="50" y1="200" x2="25" y2="200" stroke="#06b6d4" strokeWidth="1" opacity="0.3" />

      {/* Sparkle particles */}
      <circle cx="340" cy="170" r="2" fill="#fbbf24" opacity="0.6">
        <animate attributeName="opacity" values="0.6;0;0.6" dur="1.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="355" cy="155" r="1.5" fill="#22d3ee" opacity="0.5">
        <animate attributeName="opacity" values="0.5;0;0.5" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="350" cy="190" r="1" fill="#7c3aed" opacity="0.7">
        <animate attributeName="opacity" values="0.7;0;0.7" dur="1.8s" repeatCount="indefinite" />
      </circle>
    </svg>
  )
}

// ─── DÉTECTIVE / ESPION ──────────────────────────────────────────
// Utilisée sur Vote + Reveal
export function SpyIllustration({ size = 240, className = '' }) {
  return (
    <svg viewBox="0 0 300 300" width={size} height={size} className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="spyGlow" cx="50%" cy="50%" r="45%">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Background glow */}
      <circle cx="150" cy="150" r="130" fill="url(#spyGlow)" />

      {/* Magnifying glass */}
      <g transform="translate(60, 40)">
        {/* Glass circle */}
        <circle cx="90" cy="90" r="70" stroke="#f59e0b" strokeWidth="6" fill="#f59e0b" fillOpacity="0.08" />
        <circle cx="90" cy="90" r="65" stroke="#f59e0b" strokeWidth="1" fill="none" opacity="0.3" />

        {/* Handle */}
        <line x1="145" y1="145" x2="195" y2="195" stroke="#f59e0b" strokeWidth="10" strokeLinecap="round" />
        <line x1="145" y1="145" x2="195" y2="195" stroke="#fbbf24" strokeWidth="4" strokeLinecap="round" opacity="0.5" />

        {/* Suspicious eyes inside the glass */}
        {/* Left eye */}
        <ellipse cx="68" cy="82" rx="18" ry="14" fill="#0e0e2a" />
        <ellipse cx="68" cy="85" rx="14" ry="8" fill="#7c3aed" opacity="0.8" />
        <circle cx="72" cy="83" r="4" fill="#a78bfa" />
        <circle cx="74" cy="81" r="1.5" fill="white" opacity="0.8" />

        {/* Right eye */}
        <ellipse cx="112" cy="82" rx="18" ry="14" fill="#0e0e2a" />
        <ellipse cx="112" cy="85" rx="14" ry="8" fill="#7c3aed" opacity="0.8" />
        <circle cx="116" cy="83" r="4" fill="#a78bfa" />
        <circle cx="118" cy="81" r="1.5" fill="white" opacity="0.8" />

        {/* Eyebrows - suspicious */}
        <path d="M50 70 Q68 60, 85 72" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M95 72 Q112 60, 130 70" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" fill="none" />

        {/* Mouth - worried */}
        <path d="M72 108 Q90 100, 108 108" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" fill="none" />

        {/* Glare on glass */}
        <path d="M40 55 Q50 35, 70 30" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.2" />
      </g>

      {/* Question marks floating around */}
      <g opacity="0.6">
        <text x="35" y="60" fill="#f59e0b" fontSize="24" fontFamily="var(--font-display)" fontWeight="700">?</text>
        <text x="235" y="80" fill="#7c3aed" fontSize="18" fontFamily="var(--font-display)" fontWeight="700">?</text>
        <text x="50" y="240" fill="#ef4444" fontSize="20" fontFamily="var(--font-display)" fontWeight="700">?</text>
        <text x="240" y="230" fill="#06b6d4" fontSize="16" fontFamily="var(--font-display)" fontWeight="700">?</text>
      </g>

      {/* Decorative dots */}
      <circle cx="30" cy="120" r="3" fill="#7c3aed" opacity="0.4" />
      <circle cx="270" cy="140" r="2" fill="#f59e0b" opacity="0.5" />
      <circle cx="45" cy="200" r="2.5" fill="#06b6d4" opacity="0.4" />
      <circle cx="255" cy="190" r="3" fill="#ef4444" opacity="0.3" />
    </svg>
  )
}

// ─── TROPHÉE / PODIUM ────────────────────────────────────────────
// Utilisée sur Scores
export function TrophyIllustration({ size = 240, className = '' }) {
  return (
    <svg viewBox="0 0 300 300" width={size} height={size} className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="trophyGold" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
        <radialGradient id="trophyGlow" cx="50%" cy="40%" r="45%">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="starGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>

      {/* Background glow */}
      <circle cx="150" cy="130" r="120" fill="url(#trophyGlow)" />

      {/* Trophy cup */}
      <path d="M100 70 L95 150 Q95 175, 120 180 L130 182 L130 210 L110 215 Q105 217, 105 222 L105 235 Q105 240, 110 240 L190 240 Q195 240, 195 235 L195 222 Q195 217, 190 215 L170 210 L170 182 L180 180 Q205 175, 205 150 L200 70Z" fill="url(#trophyGold)" />

      {/* Cup inner shadow */}
      <path d="M108 75 L105 145 Q105 165, 125 172 L175 172 Q195 165, 195 145 L192 75Z" fill="#d97706" opacity="0.3" />

      {/* Cup highlight */}
      <path d="M115 80 L112 140 Q115 148, 120 148" stroke="white" strokeWidth="2" fill="none" opacity="0.3" strokeLinecap="round" />

      {/* Left handle */}
      <path d="M100 85 Q65 85, 60 115 Q55 145, 85 155 L95 145" stroke="url(#trophyGold)" strokeWidth="8" fill="none" strokeLinecap="round" />
      <path d="M100 85 Q70 85, 65 115 Q60 140, 85 150" stroke="#fde68a" strokeWidth="2" fill="none" opacity="0.3" strokeLinecap="round" />

      {/* Right handle */}
      <path d="M200 85 Q235 85, 240 115 Q245 145, 215 155 L205 145" stroke="url(#trophyGold)" strokeWidth="8" fill="none" strokeLinecap="round" />
      <path d="M200 85 Q230 85, 235 115 Q240 140, 215 150" stroke="#fde68a" strokeWidth="2" fill="none" opacity="0.3" strokeLinecap="round" />

      {/* Base plate */}
      <rect x="95" y="238" width="110" height="8" rx="3" fill="#d97706" />
      <rect x="85" y="245" width="130" height="10" rx="4" fill="url(#trophyGold)" />
      <rect x="85" y="245" width="130" height="3" rx="2" fill="#fde68a" opacity="0.3" />

      {/* Star on cup */}
      <polygon points="150,95 158,115 180,118 164,132 168,155 150,143 132,155 136,132 120,118 142,115" fill="url(#starGrad)" />
      <polygon points="150,100 156,115 174,117 161,128 164,148 150,139 136,148 139,128 126,117 144,115" fill="#fde68a" opacity="0.3" />

      {/* Sparkles */}
      <g>
        <polygon points="55,55 58,48 61,55 68,58 61,61 58,68 55,61 48,58" fill="#fbbf24" opacity="0.7">
          <animate attributeName="opacity" values="0.7;0.2;0.7" dur="2s" repeatCount="indefinite" />
        </polygon>
        <polygon points="245,65 247,60 249,65 254,67 249,69 247,74 245,69 240,67" fill="#fbbf24" opacity="0.5">
          <animate attributeName="opacity" values="0.5;0.1;0.5" dur="1.5s" repeatCount="indefinite" />
        </polygon>
        <polygon points="235,195 237,190 239,195 244,197 239,199 237,204 235,199 230,197" fill="#7c3aed" opacity="0.6">
          <animate attributeName="opacity" values="0.6;0.1;0.6" dur="1.8s" repeatCount="indefinite" />
        </polygon>
        <polygon points="65,190 67,186 69,190 73,192 69,194 67,198 65,194 61,192" fill="#06b6d4" opacity="0.5">
          <animate attributeName="opacity" values="0.5;0.1;0.5" dur="2.2s" repeatCount="indefinite" />
        </polygon>
      </g>

      {/* Confetti dots */}
      <circle cx="80" cy="40" r="4" fill="#7c3aed" opacity="0.5" />
      <circle cx="220" cy="35" r="3" fill="#06b6d4" opacity="0.4" />
      <circle cx="40" cy="130" r="3" fill="#ef4444" opacity="0.4" />
      <circle cx="260" cy="120" r="2.5" fill="#10b981" opacity="0.5" />
      <rect x="70" y="270" width="6" height="6" rx="1" fill="#7c3aed" opacity="0.3" transform="rotate(30 73 273)" />
      <rect x="225" y="265" width="5" height="5" rx="1" fill="#f59e0b" opacity="0.3" transform="rotate(45 228 268)" />
    </svg>
  )
}

// ─── JOUEURS EN CERCLE (Lobby) ───────────────────────────────────
export function LobbyIllustration({ size = 240, playerCount = 0, className = '' }) {
  const avatarColors = ['#06b6d4', '#7c3aed', '#ef4444', '#10b981', '#f59e0b', '#ec4899']

  return (
    <svg viewBox="0 0 300 300" width={size} height={size} className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="lobbyGlow" cx="50%" cy="50%" r="45%">
          <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="150" cy="150" r="130" fill="url(#lobbyGlow)" />

      {/* Central connection circle */}
      <circle cx="150" cy="150" r="50" stroke="#1e1e4a" strokeWidth="2" strokeDasharray="6 4" fill="none" />
      <circle cx="150" cy="150" r="52" stroke="#7c3aed" strokeWidth="1" strokeDasharray="4 8" fill="none" opacity="0.3">
        <animateTransform attributeName="transform" type="rotate" from="0 150 150" to="360 150 150" dur="20s" repeatCount="indefinite" />
      </circle>

      {/* Central icon - gamepad */}
      <g transform="translate(130, 133)">
        <rect x="0" y="5" width="40" height="24" rx="8" fill="#7c3aed" />
        {/* D-pad */}
        <rect x="8" y="12" width="4" height="10" rx="1" fill="#a78bfa" />
        <rect x="5" y="15" width="10" height="4" rx="1" fill="#a78bfa" />
        {/* Buttons */}
        <circle cx="30" cy="14" r="2.5" fill="#06b6d4" />
        <circle cx="30" cy="22" r="2.5" fill="#ef4444" />
      </g>

      {/* Player avatars in a circle */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const angle = (i * 60 - 90) * (Math.PI / 180)
        const cx = 150 + Math.cos(angle) * 95
        const cy = 150 + Math.sin(angle) * 95
        const isActive = i < Math.max(playerCount, 2)
        const color = avatarColors[i]

        return (
          <g key={i}>
            {/* Connection line to center */}
            <line x1="150" y1="150" x2={cx} y2={cy} stroke={isActive ? color : '#1e1e4a'} strokeWidth="1" strokeDasharray="4 4" opacity={isActive ? 0.4 : 0.2} />

            {/* Avatar circle */}
            <circle cx={cx} cy={cy} r="22" fill={isActive ? `${color}22` : '#0e0e2a'} stroke={isActive ? color : '#1e1e4a'} strokeWidth="2" />

            {/* Person icon or question mark */}
            {isActive ? (
              <g>
                <circle cx={cx} cy={cy - 5} r="6" fill={color} />
                <path d={`M${cx - 10} ${cy + 15} Q${cx - 10} ${cy + 3}, ${cx} ${cy + 3} Q${cx + 10} ${cy + 3}, ${cx + 10} ${cy + 15}`} fill={color} opacity="0.7" />
              </g>
            ) : (
              <text x={cx} y={cy + 5} textAnchor="middle" fill="#334155" fontSize="16" fontFamily="var(--font-display)" fontWeight="700">?</text>
            )}
          </g>
        )
      })}

      {/* Wifi-like signals from center */}
      <g opacity="0.2">
        <path d="M135 140 Q150 125, 165 140" stroke="#7c3aed" strokeWidth="2" fill="none">
          <animate attributeName="opacity" values="0.3;0;0.3" dur="2s" repeatCount="indefinite" />
        </path>
        <path d="M128 133 Q150 113, 172 133" stroke="#7c3aed" strokeWidth="2" fill="none">
          <animate attributeName="opacity" values="0.2;0;0.2" dur="2s" begin="0.3s" repeatCount="indefinite" />
        </path>
      </g>
    </svg>
  )
}

// ─── MASQUE IMPOSTEUR (petit, pour badges/déco) ──────────────────
export function ImpostorMask({ size = 40, color = '#ef4444', className = '' }) {
  return (
    <svg viewBox="0 0 60 50" width={size} height={size * 0.83} className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="25" cy="25" rx="22" ry="20" fill={color} />
      <path d="M7 18 Q25 12, 43 18 Q43 30, 25 30 Q7 30, 7 18Z" fill="#0e0e2a" />
      <circle cx="18" cy="22" r="3.5" fill={color} opacity="0.6" />
      <circle cx="32" cy="22" r="3.5" fill={color} opacity="0.6" />
      <rect x="43" y="13" width="10" height="20" rx="5" fill={color} opacity="0.8" />
    </svg>
  )
}

// ─── ROLE CARD DECORATION ────────────────────────────────────────
export function RoleDecoration({ isImpostor = false, size = 200, className = '' }) {
  const color = isImpostor ? '#ef4444' : '#06b6d4'
  const glowColor = isImpostor ? '#ef444444' : '#06b6d444'

  return (
    <svg viewBox="0 0 300 200" width={size} height={size * 0.67} className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id={`roleGlow-${isImpostor}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="150" cy="100" r="90" fill={`url(#roleGlow-${isImpostor})`} />

      {isImpostor ? (
        // Impostor: masked figure
        <g transform="translate(105, 25)">
          <ellipse cx="45" cy="55" rx="40" ry="48" fill={color} />
          <path d="M12 40 Q45 28, 78 40 Q78 62, 45 62 Q12 62, 12 40Z" fill="#0e0e2a" />
          <circle cx="32" cy="48" r="6" fill={color} opacity="0.6">
            <animate attributeName="r" values="6;7;6" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="58" cy="48" r="6" fill={color} opacity="0.6">
            <animate attributeName="r" values="6;7;6" dur="2s" repeatCount="indefinite" />
          </circle>
          <rect x="78" y="35" width="15" height="35" rx="7" fill="#dc2626" />

          {/* Knife */}
          <g transform="translate(20, 95) rotate(-30)">
            <rect x="0" y="0" width="6" height="25" rx="2" fill="#64748b" />
            <rect x="-2" y="22" width="10" height="12" rx="2" fill="#334155" />
          </g>
        </g>
      ) : (
        // Crewmate: friendly figure with car
        <g transform="translate(100, 30)">
          <ellipse cx="50" cy="50" rx="40" ry="48" fill={color} />
          <path d="M17 35 Q50 25, 83 35 Q83 55, 50 55 Q17 55, 17 35Z" fill="#0e0e2a" />
          <circle cx="37" cy="42" r="5" fill="white" opacity="0.8" />
          <circle cx="63" cy="42" r="5" fill="white" opacity="0.8" />
          <circle cx="37" cy="43" r="2.5" fill={color} />
          <circle cx="63" cy="43" r="2.5" fill={color} />

          {/* Wrench tool */}
          <g transform="translate(60, 88) rotate(20)">
            <rect x="0" y="0" width="5" height="30" rx="2" fill="#64748b" />
            <circle cx="2.5" cy="0" r="8" fill="none" stroke="#64748b" strokeWidth="4" />
          </g>
        </g>
      )}

      {/* Floating particles */}
      <circle cx="50" cy="30" r="3" fill={color} opacity="0.3">
        <animate attributeName="cy" values="30;25;30" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="250" cy="50" r="2" fill={color} opacity="0.4">
        <animate attributeName="cy" values="50;44;50" dur="2.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="40" cy="160" r="2.5" fill={color} opacity="0.3">
        <animate attributeName="cy" values="160;155;160" dur="2.8s" repeatCount="indefinite" />
      </circle>
      <circle cx="260" cy="150" r="2" fill={color} opacity="0.4">
        <animate attributeName="cy" values="150;145;150" dur="3.2s" repeatCount="indefinite" />
      </circle>
    </svg>
  )
}
