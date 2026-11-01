import React from 'react';

/*
 * Static line drawing of the hero scene: figure on a stacked pedestal, a reticle
 * behind it and two orbits of keycaps. Shown while the WebGL chunk loads, and
 * permanently when WebGL is unavailable.
 */

const CX = 260;
const ORBITS = [
  { cy: 300, rx: 172, ry: 50, count: 6, size: 24, phase: 0.35, dashed: false },
  { cy: 296, rx: 238, ry: 72, count: 8, size: 19, phase: 0.1, dashed: true },
];
const PLATES = [
  { cy: 436, rx: 138, ry: 15 },
  { cy: 423, rx: 116, ry: 13 },
  { cy: 410, rx: 94, ry: 11 },
];

const caps = ORBITS.flatMap((orbit) =>
  Array.from({ length: orbit.count }, (_, i) => {
    const t = orbit.phase + (i / orbit.count) * Math.PI * 2;
    return {
      x: CX + Math.cos(t) * orbit.rx,
      y: orbit.cy + Math.sin(t) * orbit.ry,
      size: orbit.size,
      front: Math.sin(t) > 0,
    };
  })
);

function Keycap({ x, y, size }) {
  const half = size / 2;
  return (
    <g>
      <rect x={x - half} y={y - half + 4} width={size} height={size} rx={size * 0.26} style={{ fill: 'var(--border)' }} />
      <rect
        x={x - half}
        y={y - half}
        width={size}
        height={size}
        rx={size * 0.26}
        style={{ fill: 'var(--bg)', stroke: 'var(--text)' }}
      />
    </g>
  );
}

export function OrbitFallback({ className = '' }) {
  return (
    <div className={`flex items-center justify-center ${className}`} aria-hidden="true">
      <svg viewBox="0 0 520 520" className="h-full w-full max-h-[620px]" fill="none" preserveAspectRatio="xMidYMid meet">
        {/* Reticle */}
        <circle cx={CX} cy={214} r={128} style={{ stroke: 'var(--border-strong)' }} strokeDasharray="5 6" />
        <circle cx={CX} cy={214} r={106} style={{ stroke: 'var(--border)' }} />

        {/* Orbits */}
        {ORBITS.map((orbit) => (
          <ellipse
            key={orbit.rx}
            cx={CX}
            cy={orbit.cy}
            rx={orbit.rx}
            ry={orbit.ry}
            style={{ stroke: 'var(--border-strong)' }}
            strokeDasharray={orbit.dashed ? '3 5' : undefined}
          />
        ))}

        {/* Keycaps behind the figure */}
        {caps.filter((c) => !c.front).map((c, i) => (
          <Keycap key={`b${i}`} {...c} />
        ))}

        {/* Pedestal, bottom plate first */}
        {PLATES.map((plate) => (
          <g key={plate.rx}>
            <ellipse cx={CX} cy={plate.cy + 5} rx={plate.rx} ry={plate.ry} style={{ fill: 'var(--border)', stroke: 'var(--text)' }} />
            <ellipse cx={CX} cy={plate.cy} rx={plate.rx} ry={plate.ry} style={{ fill: 'var(--bg)', stroke: 'var(--text)' }} />
          </g>
        ))}

        {/* Figure */}
        <g style={{ fill: 'var(--surface)', stroke: 'var(--text)' }} strokeLinejoin="round">
          <path d="M168 404 C168 312 204 270 260 270 C316 270 352 312 352 404 Z" />
          <path d="M244 246 h32 v28 h-32 z" />
          <ellipse cx={CX} cy={196} rx={40} ry={50} />
        </g>

        {/* Keycaps in front of the figure */}
        {caps.filter((c) => c.front).map((c, i) => (
          <Keycap key={`f${i}`} {...c} />
        ))}
      </svg>
    </div>
  );
}

export default OrbitFallback;
