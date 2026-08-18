import React, { useState } from 'react';
import { APP_LOGOS } from '../constants/logos';

interface UnsriLogoProps {
  className?: string;
  size?: number;
  onClick?: () => void;
}

export const UnsriLogo: React.FC<UnsriLogoProps> = ({ className = '', size = 44, onClick }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div 
      onClick={onClick}
      className={`relative flex items-center justify-center select-none group cursor-pointer ${className}`}
      title="Universitas Sriwijaya (UNSRI) - Riset SEKANAK GGL"
    >
      {!imgError ? (
        <img
          src={APP_LOGOS.unsri}
          alt="Logo Universitas Sriwijaya (UNSRI)"
          width={size}
          height={size}
          style={{ width: size, height: size }}
          className="object-contain filter drop-shadow-sm transition-transform duration-200 group-hover:scale-105"
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
        />
      ) : (
        <svg 
          width={size} 
          height={size + 6} 
          viewBox="0 0 200 220" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="filter drop-shadow-sm transition-transform duration-200 group-hover:scale-105"
        >
          {/* Outer 5-petaled yellow flower background */}
          <g id="flower-petals">
            <path 
              d="M 100 15 
                 C 130 5, 165 25, 165 55 
                 C 185 80, 180 120, 155 140 
                 C 145 160, 120 175, 100 170 
                 C 80 175, 55 160, 45 140 
                 C 20 120, 15 80, 35 55 
                 C 35 25, 70 5, 100 15 Z" 
              fill="#FACC15" 
              stroke="#1E1E1E" 
              strokeWidth="4" 
              strokeLinejoin="round" 
            />
            <path d="M 100 25 L 100 65" stroke="#EAB308" strokeWidth="3" strokeLinecap="round" />
            <path d="M 150 60 L 125 90" stroke="#EAB308" strokeWidth="3" strokeLinecap="round" />
            <path d="M 140 135 L 115 110" stroke="#EAB308" strokeWidth="3" strokeLinecap="round" />
            <path d="M 60 135 L 85 110" stroke="#EAB308" strokeWidth="3" strokeLinecap="round" />
            <path d="M 50 60 L 75 90" stroke="#EAB308" strokeWidth="3" strokeLinecap="round" />
          </g>

          <circle cx="100" cy="92" r="50" fill="#1E3A8A" stroke="#1E1E1E" strokeWidth="4" />
          <circle cx="100" cy="92" r="46" fill="#172554" />

          <g id="sunburst">
            {Array.from({ length: 16 }).map((_, i) => {
              const angle = (i * 360) / 16;
              const rad = (angle * Math.PI) / 180;
              const x1 = 100 + 20 * Math.cos(rad);
              const y1 = 92 + 20 * Math.sin(rad);
              const x2 = 100 + 34 * Math.cos(rad);
              const y2 = 92 + 34 * Math.sin(rad);
              return (
                <line 
                  key={i} 
                  x1={x1} 
                  y1={y1} 
                  x2={x2} 
                  y2={y2} 
                  stroke="#FACC15" 
                  strokeWidth="3.5" 
                  strokeLinecap="round" 
                />
              );
            })}
            <circle cx="100" cy="92" r="16" fill="#FEF08A" stroke="#F59E0B" strokeWidth="2" />
          </g>

          <path id="text-arc-top" d="M 58 92 A 42 42 0 0 1 142 92" fill="none" />
          <text fill="#FFFFFF" fontSize="10.5" fontWeight="bold" letterSpacing="0.8">
            <textPath href="#text-arc-top" startOffset="50%" textAnchor="middle">
              UNIVERSITAS
            </textPath>
          </text>

          <path id="text-arc-bottom" d="M 142 92 A 42 42 0 0 1 58 92" fill="none" />
          <text fill="#FFFFFF" fontSize="10.5" fontWeight="bold" letterSpacing="0.8">
            <textPath href="#text-arc-bottom" startOffset="50%" textAnchor="middle">
              SRIWIJAYA
            </textPath>
          </text>

          <g id="ribbon">
            <path 
              d="M 30 180 L 170 180 L 180 198 L 170 212 L 30 212 L 20 198 Z" 
              fill="#18181B" 
              stroke="#1E1E1E" 
              strokeWidth="3" 
            />
            <text 
              x="100" 
              y="198" 
              fill="#FACC15" 
              fontSize="10" 
              fontWeight="900" 
              textAnchor="middle" 
              dominantBaseline="central"
              letterSpacing="0.5"
            >
              ILMU ALAT PENGABDIAN
            </text>
          </g>
        </svg>
      )}
      <span className="sr-only">Logo Universitas Sriwijaya</span>
    </div>
  );
};
