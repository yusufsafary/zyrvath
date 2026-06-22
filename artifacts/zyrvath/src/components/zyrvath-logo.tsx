interface ZyrvathLogoProps {
  size?: number;
  className?: string;
}

export function ZyrvathLogo({ size = 36, className = "" }: ZyrvathLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="zyr-grad-a" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="hsl(20,100%,72%)" />
          <stop offset="100%" stopColor="hsl(12,100%,52%)" />
        </linearGradient>
        <linearGradient id="zyr-grad-b" x1="64" y1="0" x2="0" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="hsl(25,100%,60%)" stopOpacity="0.4" />
          <stop offset="100%" stopColor="hsl(10,100%,45%)" stopOpacity="0.1" />
        </linearGradient>
        <filter id="zyr-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="zyr-softglow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Outer octagon — targeting frame */}
      <polygon
        points="32,2 52,12 62,32 52,52 32,62 12,52 2,32 12,12"
        stroke="url(#zyr-grad-a)"
        strokeWidth="1.2"
        fill="none"
        opacity="0.35"
      />

      {/* Tick marks at cardinal points — HUD crosshair feel */}
      <line x1="32" y1="2"  x2="32" y2="8"  stroke="url(#zyr-grad-a)" strokeWidth="2" strokeLinecap="round" opacity="0.9"/>
      <line x1="32" y1="56" x2="32" y2="62" stroke="url(#zyr-grad-a)" strokeWidth="2" strokeLinecap="round" opacity="0.9"/>
      <line x1="2"  y1="32" x2="8"  y2="32" stroke="url(#zyr-grad-a)" strokeWidth="2" strokeLinecap="round" opacity="0.9"/>
      <line x1="56" y1="32" x2="62" y2="32" stroke="url(#zyr-grad-a)" strokeWidth="2" strokeLinecap="round" opacity="0.9"/>

      {/* Mid hexagon — shield layer */}
      <polygon
        points="32,9 50,19.5 50,44.5 32,55 14,44.5 14,19.5"
        stroke="url(#zyr-grad-a)"
        strokeWidth="1.5"
        fill="url(#zyr-grad-b)"
        opacity="0.8"
      />

      {/* Inner glow fill */}
      <polygon
        points="32,16 44,23 44,41 32,48 20,41 20,23"
        fill="hsl(25,100%,55%)"
        fillOpacity="0.07"
      />

      {/* Stylised Z — angular, military */}
      <g filter="url(#zyr-glow)">
        {/* Top bar */}
        <line x1="22" y1="22" x2="42" y2="22" stroke="url(#zyr-grad-a)" strokeWidth="3.5" strokeLinecap="square"/>
        {/* Left notch on top bar */}
        <line x1="22" y1="22" x2="22" y2="26" stroke="url(#zyr-grad-a)" strokeWidth="2" strokeLinecap="square" opacity="0.6"/>
        {/* Right notch on top bar */}
        <line x1="42" y1="22" x2="42" y2="26" stroke="url(#zyr-grad-a)" strokeWidth="2" strokeLinecap="square" opacity="0.6"/>
        {/* Diagonal — bold */}
        <line x1="42" y1="22" x2="22" y2="42" stroke="url(#zyr-grad-a)" strokeWidth="3.5" strokeLinecap="square"/>
        {/* Bottom bar */}
        <line x1="22" y1="42" x2="42" y2="42" stroke="url(#zyr-grad-a)" strokeWidth="3.5" strokeLinecap="square"/>
        {/* Left notch on bottom bar */}
        <line x1="22" y1="38" x2="22" y2="42" stroke="url(#zyr-grad-a)" strokeWidth="2" strokeLinecap="square" opacity="0.6"/>
        {/* Right notch on bottom bar */}
        <line x1="42" y1="38" x2="42" y2="42" stroke="url(#zyr-grad-a)" strokeWidth="2" strokeLinecap="square" opacity="0.6"/>
      </g>

      {/* Corner accent diamonds — game studio detail */}
      <polygon points="32,4.5 34,7 32,9.5 30,7"    fill="hsl(25,100%,70%)" opacity="0.95"/>
      <polygon points="32,54.5 34,57 32,59.5 30,57" fill="hsl(25,100%,70%)" opacity="0.95"/>
      <polygon points="4.5,32 7,30 9.5,32 7,34"    fill="hsl(25,100%,70%)" opacity="0.95"/>
      <polygon points="54.5,32 57,30 59.5,32 57,34" fill="hsl(25,100%,70%)" opacity="0.95"/>

      {/* Subtle scanline glint across Z diagonal */}
      <line x1="38" y1="24" x2="26" y2="40" stroke="white" strokeWidth="0.8" strokeLinecap="round" opacity="0.18"/>
    </svg>
  );
}
