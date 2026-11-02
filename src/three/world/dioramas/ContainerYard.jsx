import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import portfolioData from '../../../data/portfolio';
import { useWorld } from '../materials';
import { rig } from '../scrollRig';
import { dashed, polyline, rect, segments } from '../geometry';
import { Slab, focusOf } from '../parts';

/*
 * z-03 · Deploy. A container yard built from the project data: one stack per project,
 * one container per item in its stack. The containers hang exploded and settle into
 * a deployed stack while Projects is on screen. A gantry crane works overhead.
 */

const C = { w: 2.5, h: 0.7, d: 1.1 };
const SPACING = 3.3;
const Z = -0.5;
const GANTRY_TOP = 5.6;

// Corrugation and doors on a unit container; scaled with the container
const RIBS = segments([
  ...Array.from({ length: 11 }, (_, i) => -0.42 + i * 0.084).flatMap((x) => [
    [x, -0.5, 0.501], [x, 0.5, 0.501],
    [x, -0.5, -0.501], [x, 0.5, -0.501],
  ]),
  [0.5, -0.5, 0], [0.5, 0.5, 0],
  [0.501, -0.5, 0.25], [0.501, 0.5, 0.25],
  [0.501, -0.5, -0.25], [0.501, 0.5, -0.25],
]);

// Gantry: two legs a side, twin girders with a zig-zag truss between them
const GANTRY = (() => {
  const x = 4.1;
  const top = GANTRY_TOP;
  const z0 = Z - 0.9;
  const z1 = Z + 0.9;
  const pairs = [
    [-x, 0, z0], [-x, top, z0], [-x, 0, z1], [-x, top, z1],
    [x, 0, z0], [x, top, z0], [x, 0, z1], [x, top, z1],
    [-x, top, z0], [x, top, z0], [-x, top, z1], [x, top, z1],
    [-x, top - 0.35, z0], [x, top - 0.35, z0], [-x, top - 0.35, z1], [x, top - 0.35, z1],
  ];
  for (let i = 0; i < 16; i++) {
    const xa = -x + (i / 16) * 2 * x;
    const xb = -x + ((i + 1) / 16) * 2 * x;
    const [ya, yb] = i % 2 ? [top, top - 0.35] : [top - 0.35, top];
    pairs.push([xa, ya, z0], [xb, yb, z0], [xa, ya, z1], [xb, yb, z1]);
  }
  return segments(pairs);
})();

function Container({ innerRef, top }) {
  const { mats } = useWorld();
  return (
    <group ref={innerRef} scale={[C.w, C.h, C.d]}>
      <Slab size={[1, 1, 1]} edge={top ? 'strong' : 'line'} />
      <lineSegments geometry={RIBS} material={mats.faint} />
    </group>
  );
}

export default function ContainerYard({ k, reduced }) {
  const { mats } = useWorld();
  const stacks = useMemo(() => portfolioData.projects.map((project) => project.stack.length), []);
  const boxes = useRef([]);
  const trolley = useRef(null);
  const cable = useRef(null);
  const hook = useRef(null);
  const settle = useRef(0);

  const xs = useMemo(() => stacks.map((_, i) => (i - (stacks.length - 1) / 2) * SPACING), [stacks]);
  const pads = useMemo(() => dashed(segments(xs.flatMap((x) => rect(C.w + 0.5, C.d + 0.5, 0.01, x, Z)))), [xs]);
  const cableGeometry = useMemo(() => segments(polyline([[0, 0, 0], [0, -1, 0]])), []);

  useFrame((_, delta) => {
    const want = reduced ? 1 : focusOf(k);
    settle.current = reduced ? want : THREE.MathUtils.damp(settle.current, want, 2.6, Math.min(delta, 0.05));
    const gap = 0.06 + (1 - settle.current) * 0.6;

    let n = 0;
    stacks.forEach((count, s) => {
      for (let level = 0; level < count; level++) {
        const box = boxes.current[n++];
        if (!box) continue;
        box.position.set(xs[s], C.h / 2 + level * (C.h + gap), Z);
        box.rotation.y = (level % 2 ? 0.05 : -0.035) * (1 - settle.current * 0.6);
      }
    });

    // The trolley shuttles between the stacks, paying its cable in and out
    const t = reduced ? 0.3 : rig.time;
    const x = Math.sin(t * 0.45) * 3.1;
    const drop = 1.2 + (Math.sin(t * 0.9) * 0.5 + 0.5) * 0.9;
    if (trolley.current) trolley.current.position.x = x;
    if (cable.current) cable.current.scale.y = drop;
    if (hook.current) hook.current.position.y = -0.13 - drop;
  });

  let index = 0;

  return (
    <group>
      <lineSegments geometry={pads} material={mats.dashed} />
      {stacks.map((count, s) =>
        Array.from({ length: count }, (_, level) => {
          const i = index++;
          return (
            <Container
              key={`${s}-${level}`}
              top={level === count - 1}
              innerRef={(node) => {
                boxes.current[i] = node;
              }}
            />
          );
        })
      )}

      <lineSegments geometry={GANTRY} material={mats.line} />
      <group ref={trolley} position={[0, GANTRY_TOP - 0.18, Z]}>
        <Slab size={[0.7, 0.26, 2.05]} />
        <lineSegments ref={cable} geometry={cableGeometry} material={mats.strong} position={[0, -0.13, 0]} />
        <Slab ref={hook} size={[0.9, 0.12, 0.5]} fill="ink" edge={null} />
      </group>
    </group>
  );
}
