/**
 * AlgoX.ai shared SVG logo — used in Header, hero, and AI buttons
 */
interface AlgoXLogoProps {
  size?: number;
  className?: string;
}

export default function AlgoXLogo({ size = 24, className = '' }: AlgoXLogoProps) {
  const id = `logoGrad_${size}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Hexagon frame */}
      <path
        d="M16 2L28 9V23L16 30L4 23V9L16 2Z"
        fill={`url(#${id})`}
        fillOpacity="0.15"
        stroke={`url(#${id})`}
        strokeWidth="1.5"
      />
      {/* Neural node dots on vertices */}
      <circle cx="16" cy="6"  r="1.5" fill={`url(#${id})`} />
      <circle cx="26" cy="13" r="1.5" fill={`url(#${id})`} />
      <circle cx="26" cy="19" r="1.5" fill={`url(#${id})`} />
      <circle cx="16" cy="26" r="1.5" fill={`url(#${id})`} />
      <circle cx="6"  cy="19" r="1.5" fill={`url(#${id})`} />
      <circle cx="6"  cy="13" r="1.5" fill={`url(#${id})`} />
      {/* Stylised X */}
      <path d="M11 11L16 16M21 11L16 16L21 21" stroke={`url(#${id})`} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11 21L16 16" stroke={`url(#${id})`} strokeWidth="2" strokeLinecap="round" />
      <defs>
        <linearGradient id={id} x1="4" y1="2" x2="28" y2="30" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2dd4bf" />
          <stop offset="1" stopColor="#818cf8" />
        </linearGradient>
      </defs>
    </svg>
  );
}
