import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useWorld } from '../materials';
import { rig } from '../scrollRig';
import { dashed, polyline, rect, segments } from '../geometry';
import { Slab, focusOf } from '../parts';

/*
 * z-01 · Interface. An exploded browser window: the frame, the layout, the content
 * and the controls lift apart into four plates, joined by dashed assembly lines.
 * The plates separate further while About is on screen.
 */

const W = 6.6;
const D = 4.2;
const Z = -0.4;
const CARD_X = [-0.62, 0.75, 2.12];

const ADDRESS = segments(rect(3.2, 0.24, 0.145, 0.25, Z - D / 2 + 0.275));
const CONTENT_LINES = segments([
  [-1.15, 0, -0.85], [0.85, 0, -0.85],
  [-1.15, 0, -0.55], [0.35, 0, -0.55],
  ...CARD_X.flatMap((x) => [
    [x - 0.45, 0.07, 0.72], [x + 0.35, 0.07, 0.72],
    [x - 0.45, 0.07, 0.98], [x + 0.05, 0.07, 0.98],
  ]),
]);
// Unit-height assembly lines at the window's corners; scaled to the stack's height
const GUIDES = dashed(
  segments(
    [
      [-W / 2, Z - D / 2],
      [W / 2, Z - D / 2],
      [W / 2, Z + D / 2],
      [-W / 2, Z + D / 2],
    ].flatMap(([x, z]) => polyline([[x, 0, z], [x, 1, z]]))
  )
);

export default function Interface({ k, reduced }) {
  const { mats } = useWorld();
  const layers = useRef([]);
  const guides = useRef(null);
  const caret = useRef(null);
  const sepRef = useRef(0.5);

  const register = useMemo(() => [0, 1, 2, 3].map((i) => (node) => (layers.current[i] = node)), []);

  useFrame((_, delta) => {
    const target = 0.5 + focusOf(k) * 0.55 + (reduced ? 0 : Math.sin(rig.time * 0.9) * 0.05);
    sepRef.current = reduced ? target : THREE.MathUtils.damp(sepRef.current, target, 4, Math.min(delta, 0.05));
    const sep = sepRef.current;
    layers.current.forEach((layer, i) => {
      if (layer) layer.position.y = 0.2 + i * sep;
    });
    if (guides.current) {
      guides.current.position.y = 0.2;
      guides.current.scale.y = 3 * sep;
    }
    if (caret.current) caret.current.visible = reduced || Math.floor(rig.time * 1.8) % 2 === 0;
  });

  return (
    <group>
      <lineSegments ref={guides} geometry={GUIDES} material={mats.dashed} />

      {/* Frame */}
      <group ref={register[0]}>
        <Slab size={[W, 0.14, D]} position={[0, 0, Z]} fill="plate" edge="strong" />
        <Slab size={[W, 0.07, 0.55]} position={[0, 0.1, Z - D / 2 + 0.275]} />
        {[-3.0, -2.72, -2.44].map((x) => (
          <Slab key={x} size={[0.16, 0.05, 0.16]} position={[x, 0.16, Z - D / 2 + 0.275]} fill="ink" edge={null} />
        ))}
        <lineSegments geometry={ADDRESS} material={mats.line} />
      </group>

      {/* Layout */}
      <group ref={register[1]}>
        <Slab size={[6.0, 0.08, 0.42]} position={[0, 0, -1.55]} />
        <Slab size={[1.3, 0.08, 2.75]} position={[-2.35, 0, 0.18]} />
      </group>

      {/* Content */}
      <group ref={register[2]}>
        <Slab size={[4.3, 0.1, 1.05]} position={[0.75, 0, -0.62]} />
        {CARD_X.map((x) => (
          <Slab key={x} size={[1.25, 0.12, 1.2]} position={[x, 0, 0.86]} />
        ))}
      </group>

      {/* Controls */}
      <group ref={register[3]}>
        <Slab size={[1.25, 0.2, 0.42]} position={[2.2, 0, -0.62]} fill="ink" edge="inkLine" />
        <lineSegments geometry={CONTENT_LINES} material={mats.line} />
        <Slab ref={caret} size={[0.07, 0.05, 0.26]} position={[0.98, 0, -0.85]} fill="ink" edge={null} />
      </group>
    </group>
  );
}
