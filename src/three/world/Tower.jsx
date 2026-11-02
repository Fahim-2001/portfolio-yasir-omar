import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useWorld } from './materials';
import { rig } from './scrollRig';
import { CLOUD_Y, LAYERS, PLATE, PLATE_T, WAYPOINTS, plateY } from './waypoints';
import { UNIT_BOX, circle, dashed, polyline, rect, rng, segments } from './geometry';
import { Label, easeOutCubic } from './parts';

/*
 * The stack itself: six plates on four rails. Plates separate along the rails while
 * the page scrolls fast and assemble on load (an exploded view that explains its own
 * structure), the plate under the camera takes ink edges, and data packets ride the
 * rails between the layers.
 */

const HALF = PLATE / 2;
const RAIL = HALF + 0.45;
const CORNERS = [
  [RAIL, RAIL],
  [-RAIL, RAIL],
  [-RAIL, -RAIL],
  [RAIL, -RAIL],
];

const PLATE_BOX = new THREE.BoxGeometry(PLATE, PLATE_T, PLATE);
const PLATE_EDGES = new THREE.EdgesGeometry(PLATE_BOX);

// Ruler ticks along two edges and a mounting hole at each corner, like a drawn part
const PLATE_DETAIL = (() => {
  const y = PLATE_T / 2 + 0.004;
  const pairs = [];
  for (let i = 0; i <= 20; i++) {
    const t = -HALF + i * 0.5;
    const len = i % 5 === 0 ? 0.42 : 0.2;
    pairs.push([t, y, HALF], [t, y, HALF - len]);
    pairs.push([-HALF, y, t], [-HALF + len, y, t]);
  }
  CORNERS.forEach(([x, z]) => {
    const cx = Math.sign(x) * (HALF - 0.55);
    const cz = Math.sign(z) * (HALF - 0.55);
    circle(0.2, 16, y).forEach(([px, py, pz]) => pairs.push([px + cx, py, pz + cz]));
  });
  return segments(pairs);
})();

// The ghost plate: a dashed outline offset below and behind, as on every card
const GHOST = dashed(segments(rect(PLATE, PLATE, -0.75, 0.5, 0.5)));

export function Plate({ k, children }) {
  const { mats } = useWorld();
  const group = useRef(null);
  const edges = useRef(null);
  const slot = useRef(null);
  const baseY = plateY(k);

  useFrame(() => {
    const p = rig.progress;
    // Spread around the plate nearest the camera, so the subject holds still
    const pivot = THREE.MathUtils.clamp(p, 1, 6);
    const spread = rig.explode * 2.2 + (1 - easeOutCubic(rig.intro)) * 1.4;
    // …but never through the floor
    group.current.position.y = Math.max(1.2, baseY - (k - pivot) * spread);
    edges.current.material = Math.abs(p - k) < 0.5 ? mats.line : mats.faint;
    // Every diorama shows in the overview; after that, each one assembles as the
    // camera arrives at its plate and packs away as it leaves, so only the section
    // on screen has a subject behind its text.
    const overview = 1 - THREE.MathUtils.smoothstep(p, 0.35, 0.95);
    const arrival = THREE.MathUtils.smoothstep(1 - Math.abs(p - k), 0, 0.45);
    const scale = Math.max(overview, arrival);
    slot.current.visible = scale > 0.002;
    slot.current.scale.setScalar(Math.max(scale, 0.002));
  });

  return (
    <group ref={group} position={[0, baseY, 0]}>
      <mesh geometry={PLATE_BOX} material={mats.plate} />
      <lineSegments ref={edges} geometry={PLATE_EDGES} material={mats.faint} />
      <lineSegments geometry={PLATE_DETAIL} material={mats.faint} />
      <lineSegments geometry={GHOST} material={mats.dashed} />
      {/* Each diorama turns to face the camera's waypoint for its section */}
      <group ref={slot} position={[0, PLATE_T / 2, 0]} rotation-y={THREE.MathUtils.degToRad(WAYPOINTS[k].theta)}>
        <Label
          text={`${LAYERS[k].z}  ${LAYERS[k].name.toUpperCase()}`}
          position={[-2.45, 0.01, 3.95]}
          height={0.36}
          flat
        />
        {children}
      </group>
    </group>
  );
}

const RAIL_GEOMETRY = dashed(
  segments(CORNERS.flatMap(([x, z]) => polyline([[x, -0.5, z], [x, CLOUD_Y, z]])))
);
const RAIL_SPAN = CLOUD_Y + 0.5;
const PACKET_SIZE = 0.17;

/** Four assembly rails with packets riding up and down them. */
export function Rails({ compact }) {
  const { mats } = useWorld();
  const packets = useRef(null);
  const count = compact ? 14 : 24;

  const data = useMemo(() => {
    const random = rng(7);
    return Array.from({ length: count }, (_, i) => ({
      rail: CORNERS[i % 4],
      offset: random() * RAIL_SPAN,
      speed: 1.6 + random() * 2.8,
      dir: random() < 0.42 ? -1 : 1,
    }));
  }, [count]);

  const matrix = useMemo(() => new THREE.Matrix4(), []);

  useFrame(() => {
    const mesh = packets.current;
    if (!mesh) return;
    data.forEach((packet, i) => {
      const travelled = packet.offset + rig.flow * packet.speed * packet.dir;
      const y = (((travelled % RAIL_SPAN) + RAIL_SPAN) % RAIL_SPAN) - 0.5;
      matrix.makeScale(PACKET_SIZE, PACKET_SIZE * 2.2, PACKET_SIZE);
      matrix.setPosition(packet.rail[0], y, packet.rail[1]);
      mesh.setMatrixAt(i, matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      <lineSegments geometry={RAIL_GEOMETRY} material={mats.dashed} />
      <instancedMesh ref={packets} args={[UNIT_BOX, mats.ink, count]} frustumCulled={false} />
    </group>
  );
}
