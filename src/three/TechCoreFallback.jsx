import React from 'react';

export function TechCoreFallback({ className = '' }) {
  return (
    <div
      className={`w-full h-full flex items-center justify-center text-text select-none ${className}`}
      aria-label="3D Avatar & Rotating Tech Badges Visual"
      role="img"
    >
      <svg
        viewBox="0 0 400 400"
        className="w-full h-full max-w-[460px] max-h-[460px] opacity-85 transition-opacity"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Tilted Orbit Guideline */}
        <ellipse
          cx="200"
          cy="205"
          rx="155"
          ry="58"
          transform="rotate(-18 200 205)"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeDasharray="5 5"
          className="opacity-35"
        />

        {/* 6 Orbiting Tech Badge Dots */}
        <circle cx="55" cy="180" r="7" fill="currentColor" className="opacity-90" />
        <circle cx="110" cy="245" r="7" fill="currentColor" className="opacity-80" />
        <circle cx="210" cy="265" r="7" fill="currentColor" className="opacity-85" />
        <circle cx="335" cy="235" r="7" fill="currentColor" className="opacity-80" />
        <circle cx="340" cy="165" r="7" fill="currentColor" className="opacity-90" />
        <circle cx="215" cy="145" r="7" fill="currentColor" className="opacity-75" />

        {/* Tech Pedestal Platform Rings */}
        <ellipse
          cx="200"
          cy="295"
          rx="85"
          ry="18"
          stroke="currentColor"
          strokeWidth="1.5"
          className="opacity-40"
        />
        <ellipse
          cx="200"
          cy="295"
          rx="60"
          ry="12"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="3 3"
          className="opacity-30"
        />

        {/* Stylized Central Avatar Silhouette (Head, Shoulders, Confident Posture) */}
        <g fill="currentColor" className="opacity-85">
          {/* Head */}
          <ellipse cx="200" cy="148" rx="28" ry="34" />
          {/* Neck & Collar */}
          <path d="M190 178 h20 v14 h-20 z" />
          {/* Shoulders & Upper Torso */}
          <path d="M145 275 C145 220 170 192 200 192 C230 192 255 220 255 275 Z" />
        </g>
      </svg>
    </div>
  );
}

export default TechCoreFallback;
