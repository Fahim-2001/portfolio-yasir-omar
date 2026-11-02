import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Grid } from '@react-three/drei';
import * as THREE from 'three';
import { useWorld } from './materials';
import { rig } from './scrollRig';
import { CLOUD_Y } from './waypoints';
import { circle, dashed, polyline, rng, segments } from './geometry';

/** The drafting floor: an infinite hairline grid that fades into the page. */
export function Floor() {
  const { palette } = useWorld();
  return (
    <Grid
      position={[0, -0.02, 0]}
      args={[10, 10]}
      cellSize={1}
      cellThickness={0.6}
      cellColor={palette.gridCell}
      sectionSize={5}
      sectionThickness={1}
      sectionColor={palette.gridSection}
      fadeDistance={170}
      fadeStrength={1.6}
      infiniteGrid
    />
  );
}

/** Slow motes through the whole column, for depth. */
export function Dust({ count }) {
  const { mats } = useWorld();
  const group = useRef(null);
  const positions = useMemo(() => {
    const random = rng(11);
    const out = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const a = random() * Math.PI * 2;
      const r = 8 + Math.sqrt(random()) * 30;
      out[i * 3] = Math.cos(a) * r;
      out[i * 3 + 1] = -1 + random() * (CLOUD_Y + 10);
      out[i * 3 + 2] = Math.sin(a) * r;
    }
    return out;
  }, [count]);

  useFrame(() => {
    if (group.current) group.current.rotation.y = rig.time * 0.012 - rig.progress * 0.08;
  });

  return (
    <points ref={group} material={mats.points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
    </points>
  );
}

/** z-00: the cloud the stack hangs from, a swirl of points inside drafted orbits. */
export function Cloud({ compact }) {
  const { mats } = useWorld();
  const whole = useRef(null);
  const spin = useRef(null);
  const count = compact ? 260 : 620;

  const positions = useMemo(() => {
    const random = rng(23);
    const out = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const a = random() * Math.PI * 2;
      const r = 1.5 + Math.pow(random(), 0.7) * 8.5;
      out[i * 3] = Math.cos(a) * r;
      out[i * 3 + 1] = (random() - 0.5) * (3.4 - r * 0.22);
      out[i * 3 + 2] = Math.sin(a) * r;
    }
    return out;
  }, [count]);

  const orbits = useMemo(
    () => dashed(segments([...circle(4, 72), ...circle(6.6, 96), ...circle(9.4, 128)])),
    []
  );

  useFrame(() => {
    // The cloud belongs to the overview; it thins out as the camera dives
    const presence = 1 - THREE.MathUtils.smoothstep(rig.progress, 0.25, 0.85);
    mats.cloud.opacity = 0.55 * presence;
    if (whole.current) whole.current.visible = presence > 0.01;
    if (spin.current) spin.current.rotation.y = rig.time * 0.06 + rig.progress * 0.4;
  });

  return (
    <group ref={whole} position={[0, CLOUD_Y, 0]}>
      <group ref={spin}>
        <points material={mats.cloud}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          </bufferGeometry>
        </points>
      </group>
      <lineSegments geometry={orbits} material={mats.dashed} rotation-x={0.06} />
    </group>
  );
}

/* ── Fragments: code glyphs drifting between the camera and the stack ───── */

const mirror = (strokes) => strokes.map((stroke) => stroke.map(([x, y]) => [1 - x, y]));
const OVAL = Array.from({ length: 17 }, (_, i) => {
  const a = (i / 16) * Math.PI * 2;
  return [0.5 + Math.cos(a) * 0.26, 0.5 + Math.sin(a) * 0.48];
});
const BRACE = [[[0.68, 1], [0.52, 0.95], [0.47, 0.62], [0.3, 0.5], [0.47, 0.38], [0.52, 0.05], [0.68, 0]]];
const PAREN = [[[0.62, 1], [0.44, 0.78], [0.38, 0.5], [0.44, 0.22], [0.62, 0]]];
const BRACKET = [[[0.66, 1], [0.38, 1], [0.38, 0], [0.66, 0]]];
const ANGLE = [[[0.8, 0.9], [0.22, 0.5], [0.8, 0.1]]];

// Strokes in a unit cell (x right, y up)
const GLYPHS = {
  '{': BRACE,
  '}': mirror(BRACE),
  '(': PAREN,
  ')': mirror(PAREN),
  '[': BRACKET,
  ']': mirror(BRACKET),
  '<': ANGLE,
  '>': mirror(ANGLE),
  '/': [[[0.28, 0], [0.72, 1]]],
  '=': [[[0.18, 0.64], [0.82, 0.64]], [[0.18, 0.36], [0.82, 0.36]]],
  ';': [[[0.45, 0.74], [0.55, 0.74], [0.55, 0.64], [0.45, 0.64], [0.45, 0.74]], [[0.55, 0.3], [0.55, 0.18], [0.44, 0]]],
  '!': [[[0.5, 1], [0.5, 0.3]], [[0.45, 0.1], [0.55, 0.1], [0.55, 0], [0.45, 0], [0.45, 0.1]]],
  '#': [[[0.4, 0.96], [0.3, 0.04]], [[0.7, 0.96], [0.6, 0.04]], [[0.16, 0.66], [0.86, 0.66]], [[0.12, 0.34], [0.82, 0.34]]],
  '0': [OVAL],
  '1': [[[0.3, 0.78], [0.52, 1], [0.52, 0]], [[0.28, 0], [0.76, 0]]],
  '_': [[[0.12, 0], [0.88, 0]]],
  '.': [[[0.45, 0.1], [0.55, 0.1], [0.55, 0], [0.45, 0], [0.45, 0.1]]],
};
const TOKENS = ['{ }', '</>', '=>', '( )', '[ ]', ';', '01', '#', '//', '!=', '{}', '10', '[]', '()', '_', '...'];
const ADVANCE = 0.62;

function tokenStrokes(token) {
  const width = (token.length - 1) * ADVANCE + 1;
  const strokes = [];
  [...token].forEach((char, i) => {
    (GLYPHS[char] ?? []).forEach((stroke) => {
      strokes.push(stroke.map(([x, y]) => [x + i * ADVANCE - width / 2, y - 0.5]));
    });
  });
  return strokes;
}

/**
 * The world's foreground layer. Line-drawn code glyphs float in a ring between the
 * camera's orbit and the stack, facing outward, so they sweep across the frame as the
 * camera spirals past. The ring counter-rotates with the scroll for extra parallax.
 * One merged geometry, one draw call.
 */
export function Fragments({ compact }) {
  const { mats } = useWorld();
  const ring = useRef(null);
  const count = compact ? 20 : 34;

  const geometry = useMemo(() => {
    const random = rng(42);
    const pairs = [];
    const matrix = new THREE.Matrix4();
    const quaternion = new THREE.Quaternion();
    const point = new THREE.Vector3();
    for (let i = 0; i < count; i++) {
      const token = TOKENS[i % TOKENS.length];
      const angle = (i / count) * Math.PI * 2 + random() * 0.4;
      const radius = 11 + random() * 5;
      const y = 2 + random() * (CLOUD_Y + 2);
      const scale = 0.55 + random() * 0.7;
      quaternion.setFromEuler(new THREE.Euler(0, angle, (random() - 0.5) * 0.3));
      matrix.compose(
        new THREE.Vector3(Math.sin(angle) * radius, y, Math.cos(angle) * radius),
        quaternion,
        new THREE.Vector3(scale, scale, scale)
      );
      tokenStrokes(token).forEach((stroke) => {
        polyline(stroke).forEach(([x, py]) => {
          point.set(x, py, 0).applyMatrix4(matrix);
          pairs.push([point.x, point.y, point.z]);
        });
      });
    }
    return segments(pairs);
  }, [count]);

  useFrame(() => {
    if (ring.current) ring.current.rotation.y = -rig.progress * 0.42 + rig.time * 0.008;
  });

  return <lineSegments ref={ring} geometry={geometry} material={mats.line} />;
}
