import React from 'react';

interface VicLogoProps {
  className?: string;
  variant?: 'dark' | 'light' | 'rose-gold';
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showSubtitle?: boolean;
}

export const VicLogo: React.FC<VicLogoProps> = ({
  className = '',
  variant = 'dark',
  size = 'md',
  showSubtitle = true,
}) => {
  const isLight = variant === 'light';
  const isRoseGold = variant === 'rose-gold';

  // Dimension scaling for SVG viewBox 0 0 260 76
  const sizeMap = {
    sm: { width: 140, height: 42 },
    md: { width: 195, height: 58 },
    lg: { width: 240, height: 72 },
    xl: { width: 290, height: 86 },
    '2xl': { width: 340, height: 100 }
  };

  const currentSize = sizeMap[size];

  const primaryColor = isLight ? '#ffffff' : (isRoseGold ? '#f7e7e9' : '#2c2725');
  const scriptColor = '#e5a8b0';
  const subtitleColor = isLight ? '#f2ece8' : (isRoseGold ? '#e5d0d3' : '#5a524e');
  const lineColor = isLight ? 'rgba(255,255,255,0.45)' : (isRoseGold ? '#c98a92' : 'rgba(138,128,125,0.6)');
  const starColor = '#e5a8b0';

  return (
    <div className={`inline-flex items-center justify-center select-none ${className}`}>
      <svg
        viewBox="0 0 260 76"
        style={{
          width: `${currentSize.width}px`,
          height: `${currentSize.height}px`,
          overflow: 'visible'
        }}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-opacity duration-200"
        aria-label="VIC Tissera - Estética Integral"
      >
        {/* Main Serif Text: VIC */}
        <text
          x="96"
          y="42"
          textAnchor="middle"
          fill={primaryColor}
          style={{
            fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
            fontSize: '48px',
            fontWeight: 500,
            letterSpacing: '0.12em'
          }}
        >
          VIC
        </text>

        {/* Script Overlay: Tissera */}
        <text
          x="142"
          y="48"
          textAnchor="middle"
          fill={scriptColor}
          transform="rotate(-4 142 48)"
          style={{
            fontFamily: "'Alex Brush', 'Great Vibes', 'Playfair Display', cursive",
            fontSize: '40px',
            fontWeight: 400
          }}
        >
          Tissera
        </text>

        {/* Delicate 4-pointed Star Sparkles matching user reference */}
        <g fill={starColor}>
          {/* Top right star 1 */}
          <path
            d="M 215 18 Q 215 22 219 22 Q 215 22 215 26 Q 215 22 211 22 Q 215 22 215 18 Z"
            opacity="0.95"
          />
          {/* Top right star 2 (offset) */}
          <path
            d="M 226 27 Q 226 29.5 228.5 29.5 Q 226 29.5 226 32 Q 226 29.5 223.5 29.5 Q 226 29.5 226 27 Z"
            opacity="0.85"
          />
        </g>

        {/* Subtitle: — ESTÉTICA INTEGRAL — */}
        {showSubtitle && (
          <g>
            <line x1="32" y1="65" x2="62" y2="65" stroke={lineColor} strokeWidth="1" strokeLinecap="round" />
            <text
              x="130"
              y="68"
              textAnchor="middle"
              fill={subtitleColor}
              style={{
                fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
                fontSize: '8.5px',
                fontWeight: 600,
                letterSpacing: '0.36em'
              }}
            >
              ESTÉTICA INTEGRAL
            </text>
            <line x1="198" y1="65" x2="228" y2="65" stroke={lineColor} strokeWidth="1" strokeLinecap="round" />
          </g>
        )}
      </svg>
    </div>
  );
};
