import React from 'react';

// 1. Guilloche Security Rosette Watermark (Center background)
// Uses only basic SVG shapes — fully compatible with html2canvas
export const GuillocheWatermark = ({ className = "opacity-[0.03]", color = "currentColor" }) => (
  <svg
    className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] pointer-events-none ${className}`}
    viewBox="0 0 200 200"
    fill="none"
    stroke={color}
    strokeWidth="0.25"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g>
      {[...Array(36)].map((_, i) => (
        <ellipse
          key={i}
          cx="100"
          cy="100"
          rx="75"
          ry="25"
          transform={`rotate(${i * 10} 100 100)`}
        />
      ))}
      {[...Array(18)].map((_, i) => (
        <circle key={`c-${i}`} cx="100" cy="100" r={10 + i * 4.5} />
      ))}
    </g>
  </svg>
);

// 2. Ornate Corner Decorations for Classic/Academic Templates
export const OrnateCorner = ({ className = "text-amber-600/40" }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    className={`w-16 h-16 pointer-events-none ${className}`}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M 10 10 L 90 10 M 10 10 L 10 90" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M 15 15 C 25 15, 30 20, 30 35 C 30 50, 15 55, 15 75" />
    <path d="M 15 15 C 15 25, 20 30, 35 30 C 50 30, 55 15, 75 15" />
    <path d="M 22 22 Q 40 22 45 45 Q 22 40 22 22" fill="currentColor" className="opacity-20" />
    <circle cx="10" cy="10" r="4" fill="currentColor" />
    <circle cx="90" cy="10" r="2.5" fill="currentColor" />
    <circle cx="10" cy="90" r="2.5" fill="currentColor" />
  </svg>
);

// 3. Tech Mesh — CSS-only dot grid, NO SVG <pattern> (html2canvas compatible)
// Rendered entirely via inline style background-image (radial-gradient dots)
export const TechMesh = ({ className = "opacity-[0.05]" }) => (
  <div
    className={`absolute inset-0 pointer-events-none ${className}`}
    style={{
      backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
      backgroundSize: '28px 28px',
    }}
  />
);

// 4. Abstract Marble Veins — solid stroke paths only, NO linearGradient url() ref
// html2canvas fails on SVG <defs> url() references, so we use solid amber color
export const GoldenVeins = ({ className = "opacity-20" }) => (
  <svg
    className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
    viewBox="0 0 1000 700"
    fill="none"
    stroke="#ca8a04"
    strokeWidth="1.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    preserveAspectRatio="xMidYMid slice"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Major crack line 1 */}
    <path d="M -50 150 Q 150 120 220 250 T 450 350 T 600 580 T 1050 650" />
    <path d="M 220 250 Q 180 340 310 420" strokeWidth="0.6" />
    <path d="M 450 350 Q 550 220 720 180" strokeWidth="0.8" stroke="#eab308" />
    <path d="M 720 180 Q 820 90 950 110" strokeWidth="0.5" />

    {/* Major crack line 2 */}
    <path d="M 300 -50 Q 420 150 510 200 T 700 450 T 820 750" />
    <path d="M 510 200 Q 610 100 800 50" strokeWidth="0.7" stroke="#fef08a" />
    <path d="M 700 450 Q 600 550 420 620" strokeWidth="0.5" />

    {/* Minor veins */}
    <path d="M 100 400 Q 200 350 280 500 Q 350 600 500 570" strokeWidth="0.5" stroke="#d97706" />
    <path d="M 800 200 Q 850 300 900 280 Q 970 260 1000 320" strokeWidth="0.4" />
  </svg>
);
