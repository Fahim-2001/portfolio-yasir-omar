import React, { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useWorld } from '../materials';
import { rig } from '../scrollRig';
import { PIN_COUNT } from '../waypoints';
import { UNIT_BOX, dashed, makePath, pointOnPath, polyline, rect, rng, segments } from '../geometry';
import { Slab } from '../parts';

/*
 * z-06 · Foundations. A processor package: die, cache grid and core on top, pins on
 * all four sides, and traces fanning out across the board with signals running along
 * them. Traces end on a circle so the board fits its plate at any rotation.
 */

const PER_SIDE = PIN_COUNT / 4;
const BOARD_R = 4.55;
const Y = 0.02;

const offsets = Array.from({ length: PER_SIDE }, (_, j) => (j - (PER_SIDE - 1) / 2) * 0.3);

// One side's traces, along +X; the other three are rotations of it
function sideTraces() {
  return offsets.map((a) => {
    const fan = a * 0.45;
    const lane = a + fan;
    const reach = Math.sqrt(BOARD_R * BOARD_R - lane * lane);
    return [
      [2.3, Y, a],
      [2.8, Y, a],
      [2.8 + Math.abs(fan), Y, lane],
      [reach, Y, lane],
    ];
  });
}

const rotateY = (p, angle) => {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return [p[0] * c + p[2] * s, p[1], -p[0] * s + p[2] * c];
};

const TRACES = [0, 1, 2, 3].flatMap((side) =>
  sideTraces().map((trace) => trace.map((p) => rotateY(p, (side * Math.PI) / 2)))
);

const TRACE_GEOMETRY = segments(
  TRACES.flatMap((trace) => {
    const end = trace[trace.length - 1];
    // A via at the end of every trace
    const via = rect(0.13, 0.13, Y, end[0], end[2]);
    return [...polyline(trace), ...via];
  })
);

const DIE_GRID = segments(
  Array.from({ length: 5 }, (_, i) => -0.8 + i * 0.4).flatMap((t) => [
    [t, 0.482, -0.8], [t, 0.482, 0.8],
    [-0.8, 0.482, t], [0.8, 0.482, t],
  ])
);

const KEEP_OUT = dashed(segments(rect(4.3, 4.3, 0.01)));

export default function SiliconDie({ reduced, compact }) {
  const { mats, colors, palette } = useWorld();
  const pins = useRef(null);
  const pulses = useRef(null);
  const matrix = useMemo(() => new THREE.Matrix4(), []);
  const point = useMemo(() => new THREE.Vector3(), []);
  const pulseCount = compact ? 14 : 26;

  const paths = useMemo(() => TRACES.map((trace) => makePath(trace)), []);
  const signals = useMemo(() => {
    const random = rng(9);
    return Array.from({ length: pulseCount }, () => ({
      path: Math.floor(random() * paths.length),
      t: random(),
      speed: 0.3 + random() * 0.35,
      inbound: random() < 0.5,
      random,
    }));
  }, [paths, pulseCount]);

  useLayoutEffect(() => {
    const q = new THREE.Quaternion();
    const position = new THREE.Vector3();
    const scale = new THREE.Vector3(0.5, 0.05, 0.12);
    for (let side = 0; side < 4; side++) {
      q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), (side * Math.PI) / 2);
      offsets.forEach((a, j) => {
        position.set(...rotateY([2.05, 0.12, a], (side * Math.PI) / 2));
        matrix.compose(position, q, scale);
        pins.current.setMatrixAt(side * PER_SIDE + j, matrix);
        pins.current.setColorAt(side * PER_SIDE + j, colors.line);
      });
    }
    pins.current.instanceMatrix.needsUpdate = true;
    pins.current.instanceColor.needsUpdate = true;
    // palette: rerun when the theme recolours `colors` in place
  }, [colors, palette, matrix]);

  useFrame((_, delta) => {
    const mesh = pulses.current;
    if (!mesh) return;
    const dt = reduced ? 0 : Math.min(delta, 0.05) * (1 + rig.explode * 2);
    signals.forEach((signal, i) => {
      signal.t += dt * signal.speed;
      if (signal.t >= 1) {
        signal.t = 0;
        signal.path = Math.floor(signal.random() * paths.length);
        signal.inbound = signal.random() < 0.5;
      }
      pointOnPath(paths[signal.path], signal.inbound ? 1 - signal.t : signal.t, point);
      matrix.makeScale(0.12, 0.07, 0.12);
      matrix.setPosition(point.x, point.y + 0.03, point.z);
      mesh.setMatrixAt(i, matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      <lineSegments geometry={KEEP_OUT} material={mats.dashed} />
      <lineSegments geometry={TRACE_GEOMETRY} material={mats.line} />
      <Slab size={[3.6, 0.3, 3.6]} position={[0, 0.15, 0]} fill="plate" edge="strong" />
      <Slab size={[1.9, 0.18, 1.9]} position={[0, 0.39, 0]} />
      <lineSegments geometry={DIE_GRID} material={mats.line} />
      <Slab size={[0.55, 0.04, 0.55]} position={[0, 0.5, 0]} fill="ink" edge={null} />
      <instancedMesh ref={pins} args={[UNIT_BOX, mats.tinted, PIN_COUNT]} />
      <instancedMesh ref={pulses} args={[UNIT_BOX, mats.ink, pulseCount]} frustumCulled={false} />
    </group>
  );
}
