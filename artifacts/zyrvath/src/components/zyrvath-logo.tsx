interface ZyrvathLogoProps {
  size?: number;
  className?: string;
}

export function ZyrvathLogo({ size = 36, className = "" }: ZyrvathLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="zyr-grad" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="hsl(25,100%,70%)" />
          <stop offset="100%" stopColor="hsl(10,100%,50%)" />
        </linearGradient>
        <filter id="zyr-glow">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Outer diamond frame */}
      <polygon
        points="18,1 35,18 18,35 1,18"
        stroke="url(#zyr-grad)"
        strokeWidth="1.5"
        fill="none"
        opacity="0.6"
      />
      {/* Inner diamond */}
      <polygon
        points="18,6 30,18 18,30 6,18"
        stroke="url(#zyr-grad)"
        strokeWidth="1"
        fill="hsl(25,100%,55%)"
        fillOpacity="0.08"
      />
      {/* Z letterform — bold diagonal strokes */}
      <g filter="url(#zyr-glow)">
        {/* Top bar of Z */}
        <line x1="11" y1="13" x2="25" y2="13" stroke="url(#zyr-grad)" strokeWidth="2.5" strokeLinecap="round" />
        {/* Diagonal of Z */}
        <line x1="25" y1="13" x2="11" y2="23" stroke="url(#zyr-grad)" strokeWidth="2.5" strokeLinecap="round" />
        {/* Bottom bar of Z */}
        <line x1="11" y1="23" x2="25" y2="23" stroke="url(#zyr-grad)" strokeWidth="2.5" strokeLinecap="round" />
      </g>
      {/* Corner accent dots */}
      <circle cx="18" cy="1.5" r="1.2" fill="hsl(25,100%,65%)" opacity="0.9" />
      <circle cx="35" cy="18" r="1.2" fill="hsl(25,100%,65%)" opacity="0.9" />
      <circle cx="18" cy="34.5" r="1.2" fill="hsl(25,100%,65%)" opacity="0.9" />
      <circle cx="1" cy="18" r="1.2" fill="hsl(25,100%,65%)" opacity="0.9" />
    </svg>
  );
}
