import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Edges, Grid, Html, Line, Outlines, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import portfolioData from '../data/portfolio';
import { BRAND_COLORS, BRAND_ICONS } from '../components/brandIcons';
import { useTheme } from '../hooks/useTheme';
import { useSplashPhase } from '../hooks/useSplash';

/*
 * The engineer at the centre of the stack.
 * A full-colour cutout of the avatar stands on an exploded pedestal while two
 * counter-rotating rings of skill keycaps orbit it, passing in front of and behind
 * the figure. Keycaps lift and label themselves on hover, the scene tilts toward the
 * pointer, and the rings widen as the hero scrolls away. Everything is procedural:
 * no models, environment maps or downloaded textures. The avatar and the skill
 * glyphs are in colour; everything else stays monochrome.
 */

const FOV = 34;
const AVATAR_HEIGHT = 2.95;
const PEDESTAL_TOP = -1.32;
const FLOOR_Y = -1.63;
const ORBIT_Y = 0.05;
const PLATES = [
  { radius: 0.98, y: -1.355 },
  { radius: 1.2, y: -1.475 },
  { radius: 1.42, y: -1.595 },
];

const RINGS = [
  { id: 'inner', radius: 1.9, tilt: [0.3, 0, 0.1], speed: 0.3, size: 0.6 },
  { id: 'outer', radius: 2.7, tilt: [0.38, 0, -0.15], speed: -0.18, size: 0.46 },
];

// Only names that exist elsewhere in the portfolio data may orbit (no invented skills).
const KNOWN_SKILLS = new Set([
  ...portfolioData.skills.flatMap((group) => group.items),
  ...portfolioData.experience.flatMap((job) => job.tech),
  ...portfolioData.projects.flatMap((project) => project.stack),
]);
const orbitNames = (list) => (list ?? []).filter((name) => KNOWN_SKILLS.has(name));
const ORBIT = {
  inner: orbitNames(portfolioData.orbit?.inner),
  outer: orbitNames(portfolioData.orbit?.outer),
};

/* ── Helpers ──────────────────────────────────────────────────────────────── */

function circle(radius, steps, plane = 'xz') {
  return Array.from({ length: steps + 1 }, (_, i) => {
    const a = (i / steps) * Math.PI * 2;
    return plane === 'xz'
      ? [Math.cos(a) * radius, 0, Math.sin(a) * radius]
      : [Math.cos(a) * radius, Math.sin(a) * radius, 0];
  });
}

const kebab = (key) => key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);

// Serialise a react-icons component to standalone SVG markup in a given colour.
function iconToSvg(Icon, color) {
  try {
    const root = Icon({});
    const viewBox = root?.props?.attr?.viewBox ?? '0 0 24 24';
    const walk = (node) => {
      if (!node || typeof node !== 'object') return '';
      if (Array.isArray(node)) return node.map(walk).join('');
      if (typeof node.type !== 'string') return '';
      const { children, ...attrs } = node.props ?? {};
      const serialised = Object.entries(attrs)
        .filter(([, v]) => v != null && typeof v !== 'object' && typeof v !== 'function')
        .map(([k, v]) => `${kebab(k)}="${String(v).replace(/"/g, '&quot;')}"`)
        .join(' ');
      return `<${node.type} ${serialised}>${walk(children)}</${node.type}>`;
    };
    const body = walk(root?.props?.children);
    if (!body) return null;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="256" height="256" fill="${color}" stroke="${color}" stroke-width="0">${body}</svg>`;
  } catch {
    return null;
  }
}

// Draws the skill's brand glyph (or its name) onto a canvas texture.
function useGlyphTexture(name, ink) {
  const invalidate = useThree((s) => s.invalidate);
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    return tex;
  }, []);

  useEffect(() => () => texture.dispose(), [texture]);

  useEffect(() => {
    const canvas = texture.image;
    const ctx = canvas.getContext('2d');
    let cancelled = false;

    const drawName = () => {
      if (cancelled) return;
      ctx.clearRect(0, 0, 256, 256);
      ctx.fillStyle = ink;
      ctx.font = '600 52px "JetBrains Mono", ui-monospace, monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(name.slice(0, 5), 128, 132);
      texture.needsUpdate = true;
      invalidate();
    };

    const Icon = BRAND_ICONS[name];
    const svg = Icon ? iconToSvg(Icon, ink) : null;
    if (!svg) {
      drawName();
      return () => {
        cancelled = true;
      };
    }

    const img = new Image();
    img.onload = () => {
      if (cancelled) return;
      ctx.clearRect(0, 0, 256, 256);
      ctx.drawImage(img, 44, 44, 168, 168);
      texture.needsUpdate = true;
      invalidate();
    };
    img.onerror = drawName;
    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

    return () => {
      cancelled = true;
    };
  }, [name, ink, texture, invalidate]);

  return texture;
}

// Loads the avatar cutout (full colour) into a texture.
function useAvatarTexture(src) {
  const invalidate = useThree((s) => s.invalidate);
  const [result, setResult] = useState({ texture: null, aspect: 839 / 992, alpha: null });

  useEffect(() => {
    if (!src) return undefined;
    let cancelled = false;
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => {
      if (cancelled) return;
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      ctx.drawImage(img, 0, 0);
      // Keep the alpha channel so pointer hits can ignore the cutout's transparent area
      const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const alpha = { width: canvas.width, height: canvas.height, data };
      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = 4;
      setResult({ texture, aspect: img.naturalWidth / img.naturalHeight, alpha });
      invalidate();
    };
    img.src = src;
    return () => {
      cancelled = true;
    };
  }, [src, invalidate]);

  useEffect(() => () => result.texture?.dispose(), [result.texture]);
  return result;
}

function scrollToSkills() {
  const target = document.getElementById('skills');
  if (!target) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
}

/* ── Pieces ──────────────────────────────────────────────────────────────── */

function Avatar({ src }) {
  const { texture, aspect, alpha } = useAvatarTexture(src);

  // Only the visible (opaque) pixels of the cutout count as a hit. Combined with
  // stopPropagation this hides keycaps that orbit behind the figure from hover.
  const raycast = useMemo(() => {
    if (!alpha) return () => {};
    return function raycastOpaque(raycaster, intersects) {
      const hits = [];
      THREE.Mesh.prototype.raycast.call(this, raycaster, hits);
      hits.forEach((hit) => {
        if (!hit.uv) return;
        const x = Math.min(alpha.width - 1, Math.floor(hit.uv.x * alpha.width));
        const y = Math.min(alpha.height - 1, Math.floor((1 - hit.uv.y) * alpha.height));
        if (alpha.data[(y * alpha.width + x) * 4 + 3] > 100) intersects.push(hit);
      });
    };
  }, [alpha]);

  if (!texture) return null;

  return (
    <mesh
      position={[0, PEDESTAL_TOP + AVATAR_HEIGHT / 2, 0]}
      raycast={raycast}
      onPointerOver={(event) => event.stopPropagation()}
      onPointerMove={(event) => event.stopPropagation()}
    >
      <planeGeometry args={[AVATAR_HEIGHT * aspect, AVATAR_HEIGHT]} />
      <meshBasicMaterial map={texture} transparent alphaTest={0.4} toneMapped={false} />
    </mesh>
  );
}

const PEDESTAL_TICKS = Array.from({ length: 24 }, (_, i) => {
  const a = (i / 24) * Math.PI * 2;
  const inner = i % 6 === 0 ? 0.7 : 0.8;
  return [
    [Math.cos(a) * inner, 0, Math.sin(a) * inner],
    [Math.cos(a) * 0.9, 0, Math.sin(a) * 0.9],
  ];
}).flat();

function Pedestal({ colors, reduced }) {
  const ticks = useRef(null);

  useFrame((_, delta) => {
    if (!reduced && ticks.current) ticks.current.rotation.y -= delta * 0.12;
  });

  return (
    <group>
      {PLATES.map((plate) => (
        <mesh key={plate.radius} position={[0, plate.y, 0]}>
          <cylinderGeometry args={[plate.radius, plate.radius, 0.07, 72]} />
          <meshStandardMaterial color={colors.plate} roughness={0.9} metalness={0} />
          <Edges color={colors.edge} threshold={20} />
        </mesh>
      ))}
      <group ref={ticks} position={[0, PEDESTAL_TOP + 0.003, 0]}>
        <Line points={PEDESTAL_TICKS} segments color={colors.ringStrong} lineWidth={1} />
      </group>
    </group>
  );
}

const AURA_OUTER = circle(1.58, 160, 'xy');
const AURA_INNER = circle(1.32, 160, 'xy');
const AURA_TICKS = [0, 1, 2, 3].flatMap((k) => {
  const a = (k / 4) * Math.PI * 2;
  return [
    [Math.cos(a) * 1.5, Math.sin(a) * 1.5, 0],
    [Math.cos(a) * 1.72, Math.sin(a) * 1.72, 0],
  ];
});

/** Drafting reticle behind the figure; sits deeper than the avatar for parallax. */
function Aura({ colors, reduced }) {
  const spin = useRef(null);

  useFrame((_, delta) => {
    if (!reduced && spin.current) spin.current.rotation.z += delta * 0.05;
  });

  return (
    <group position={[0, 0.72, -0.8]}>
      <group ref={spin}>
        <Line points={AURA_OUTER} color={colors.ring} lineWidth={1} dashed dashSize={0.05} gapSize={0.05} />
        <Line points={AURA_TICKS} segments color={colors.ringStrong} lineWidth={1} />
      </group>
      <Line points={AURA_INNER} color={colors.ring} lineWidth={1} transparent opacity={0.55} />
    </group>
  );
}

function Keycap({ name, colors, active, quaternion, onHover }) {
  const glyph = useGlyphTexture(name, BRAND_COLORS[name] ?? colors.keycapInk);

  return (
    <group quaternion={quaternion}>
      {/* Invisible hit zone, ~10px wider than the keycap on screen */}
      <mesh
        position={[0, 0, 0.18]}
        onPointerOver={(event) => {
          event.stopPropagation();
          onHover(name);
        }}
        onPointerOut={(event) => {
          event.stopPropagation();
          onHover((current) => (current === name ? null : current));
        }}
        onClick={(event) => {
          event.stopPropagation();
          scrollToSkills();
        }}
      >
        <planeGeometry args={[1.4, 1.4]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} colorWrite={false} />
      </mesh>

      <RoundedBox args={[1, 1, 0.34]} radius={0.16} smoothness={4}>
        <meshStandardMaterial color={colors.keycap} roughness={0.55} metalness={0} />
        <Outlines thickness={0.035} color={colors.keycapEdge} />
      </RoundedBox>

      <mesh position={[0, 0, 0.175]}>
        <planeGeometry args={[0.66, 0.66]} />
        <meshBasicMaterial map={glyph} transparent toneMapped={false} depthWrite={false} />
      </mesh>

      {active && (
        <Html position={[0, -0.74, 0]} center zIndexRange={[20, 0]} wrapperClass="pointer-events-none">
          <span className="scene-chip">{name}</span>
        </Html>
      )}
    </group>
  );
}

const ORBIT_LINE = circle(1, 160, 'xz');

function OrbitRing({ ring, names, colors, reduced, hovered, onHover, motion }) {
  const line = useRef(null);
  const caps = useRef([]);
  const lift = useRef(names.map(() => 0));

  // Keycaps face the camera: undo the ring's tilt, then lean back slightly
  const facing = useMemo(() => {
    const tilt = new THREE.Quaternion().setFromEuler(new THREE.Euler(...ring.tilt));
    const lean = new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.12, 0, 0));
    return tilt.invert().multiply(lean);
  }, [ring]);

  useFrame((_, delta) => {
    const { time, intro, explode } = motion.current;
    const radius = ring.radius * (1 + explode * 0.18);
    if (line.current) line.current.scale.setScalar(radius);

    names.forEach((name, i) => {
      const cap = caps.current[i];
      if (!cap) return;
      const local = Math.min(1, Math.max(0, intro * 1.5 - i * 0.06));
      const arrive = 1 - Math.pow(1 - local, 3);
      const angle = (i / names.length) * Math.PI * 2 + time * ring.speed;
      const r = radius * (1 + (1 - arrive) * 1.2);
      const target = hovered === name ? 1 : 0;
      lift.current[i] = reduced ? target : THREE.MathUtils.damp(lift.current[i], target, 10, delta);
      cap.position.set(Math.cos(angle) * r, lift.current[i] * 0.12, Math.sin(angle) * r);
      cap.scale.setScalar(Math.max(0.0001, ring.size * arrive * (1 + lift.current[i] * 0.22)));
    });
  });

  return (
    <group position={[0, ORBIT_Y, 0]} rotation={ring.tilt}>
      <group ref={line}>
        <Line
          points={ORBIT_LINE}
          color={colors.ring}
          lineWidth={1}
          dashed={ring.id === 'outer'}
          dashSize={0.02}
          gapSize={0.02}
        />
      </group>
      {names.map((name, i) => (
        <group
          key={name}
          ref={(node) => {
            caps.current[i] = node;
          }}
        >
          <Keycap name={name} colors={colors} active={hovered === name} quaternion={facing} onHover={onHover} />
        </group>
      ))}
    </group>
  );
}

function Dust({ count, colors, reduced }) {
  const points = useRef(null);
  const positions = useMemo(() => {
    const out = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / count);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = 3.3 + (i % 7) * 0.13;
      out[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      out[i * 3 + 1] = r * Math.cos(phi) * 0.7 + 0.3;
      out[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    return out;
  }, [count]);

  useFrame((_, delta) => {
    if (!reduced && points.current) points.current.rotation.y += delta * 0.02;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color={colors.particle} size={0.035} sizeAttenuation transparent opacity={0.5} depthWrite={false} />
    </points>
  );
}

function Halo({ colors }) {
  const texture = useMemo(() => {
    const size = 128;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    const falloff = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    falloff.addColorStop(0, 'rgba(255,255,255,1)');
    falloff.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = falloff;
    ctx.fillRect(0, 0, size, size);
    return new THREE.CanvasTexture(canvas);
  }, []);

  useEffect(() => () => texture.dispose(), [texture]);

  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, FLOOR_Y + 0.003, 0]}>
      <planeGeometry args={[4.6, 4.6]} />
      <meshBasicMaterial map={texture} color={colors.halo} transparent opacity={colors.haloOpacity} depthWrite={false} />
    </mesh>
  );
}

/** Frames the whole composition for any canvas aspect ratio. */
function CameraRig({ compact }) {
  const camera = useThree((s) => s.camera);
  const width = useThree((s) => s.size.width);
  const height = useThree((s) => s.size.height);

  useLayoutEffect(() => {
    const aspect = width / Math.max(height, 1);
    const tan = Math.tan(THREE.MathUtils.degToRad(FOV / 2));
    const halfWidth = compact ? 2.35 : 3.75;
    const halfHeight = 2.02;
    const distance = Math.max(halfWidth / (tan * aspect), halfHeight / tan);
    camera.position.set(0, 0.85, distance);
    camera.lookAt(0, 0.12, 0);
    camera.updateProjectionMatrix();
  }, [camera, width, height, compact]);

  return null;
}

/* ── Scene ───────────────────────────────────────────────────────────────── */

export default function OrbitScene({ progress, pointer, reduced = false, onFirstFrame }) {
  const { colors } = useTheme();
  const width = useThree((s) => s.size.width);
  const compact = width < 540;
  const [hovered, setHovered] = useState(null);
  const splashPhase = useSplashPhase();

  const tilt = useRef(null);
  const figure = useRef(null);
  const motion = useRef({ time: 0, intro: reduced ? 1 : 0, explode: 0 });
  const painted = useRef(false);

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : '';
  }, [hovered]);

  useEffect(() => () => {
    document.body.style.cursor = '';
  }, []);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 1 / 20);
    const m = motion.current;

    if (!reduced) {
      m.time += hovered ? 0 : dt;
      // The keycaps wait behind the splash and fly in as it opens
      if (splashPhase !== 'intro') m.intro = Math.min(1, m.intro + dt / 1.8);
      m.explode = progress?.get?.() ?? 0;
    }

    const p = pointer?.current ?? { x: 0, y: 0 };
    const targetY = reduced ? 0 : p.x * 0.28 + m.explode * 0.35;
    const targetX = reduced ? 0 : p.y * 0.07;
    if (tilt.current) {
      tilt.current.rotation.y = THREE.MathUtils.damp(tilt.current.rotation.y, targetY, 3, dt);
      tilt.current.rotation.x = THREE.MathUtils.damp(tilt.current.rotation.x, targetX, 3, dt);
    }
    // The flat cutout turns far less than the 3D set around it
    if (figure.current && tilt.current) figure.current.rotation.y = tilt.current.rotation.y * 0.22;

    if (!painted.current) {
      painted.current = true;
      onFirstFrame?.();
    }
  });

  return (
    <>
      <CameraRig compact={compact} />

      <ambientLight intensity={colors.ambientIntensity} />
      <directionalLight position={[2.5, 6, 6]} intensity={colors.keyLightIntensity} />
      <directionalLight position={[-5, 2, 3]} intensity={colors.fillLightIntensity} />

      <Grid
        position={[0, FLOOR_Y, 0]}
        args={[12, 12]}
        cellSize={0.5}
        cellThickness={0.6}
        cellColor={colors.gridCell}
        sectionSize={2.5}
        sectionThickness={1}
        sectionColor={colors.gridSection}
        fadeDistance={6}
        fadeStrength={1.4}
        fadeFrom={0}
        infiniteGrid
      />
      <Halo colors={colors} />
      <Dust count={compact ? 40 : 90} colors={colors} reduced={reduced} />

      <group ref={tilt}>
        <Aura colors={colors} reduced={reduced} />
        <Pedestal colors={colors} reduced={reduced} />
        <OrbitRing
          ring={RINGS[0]}
          names={ORBIT.inner}
          colors={colors}
          reduced={reduced}
          hovered={hovered}
          onHover={setHovered}
          motion={motion}
        />
        {!compact && (
          <OrbitRing
            ring={RINGS[1]}
            names={ORBIT.outer}
            colors={colors}
            reduced={reduced}
            hovered={hovered}
            onHover={setHovered}
            motion={motion}
          />
        )}
      </group>

      <group ref={figure}>
        <Avatar src={portfolioData.profile.avatar} />
      </group>
    </>
  );
}
