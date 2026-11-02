import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useWorld } from '../materials';
import { rig } from '../scrollRig';
import { ROUTE_COUNT } from '../waypoints';
import { UNIT_BOX, circle, dashed, makePath, pointOnPath, polyline, rect, rng, segments } from '../geometry';

/*
 * z-07 · Network. The floor under the stack: routes leave its footprint in every
 * direction, each with one 45° jog, and packets stream out along them to the horizon
 * while signal rings broadcast outward. Seen from above in the overview and from
 * ground level at Contact.
 */

const Y = 0.03;
const START = 8.6;
const RING_START = 8.6;
const RING_END = 64;
const RING_TIME = 7;

function buildRoutes() {
  const random = rng(17);
  return Array.from({ length: ROUTE_COUNT }, (_, i) => {
    const a = (i / ROUTE_COUNT) * Math.PI * 2 + (random() - 0.5) * 0.08;
    const dir = [Math.cos(a), Math.sin(a)];
    const turn = a + (random() < 0.5 ? 1 : -1) * (Math.PI / 4);
    const bend = [Math.cos(turn), Math.sin(turn)];
    const r1 = 13 + random() * 7;
    const jog = 1.8 + random() * 1.6;
    const far = 58 + random() * 28;
    const p1 = [dir[0] * r1, dir[1] * r1];
    const p2 = [p1[0] + bend[0] * jog, p1[1] + bend[1] * jog];
    return [
      [dir[0] * START, Y, dir[1] * START],
      [p1[0], Y, p1[1]],
      [p2[0], Y, p2[1]],
      [p2[0] + dir[0] * (far - r1), Y, p2[1] + dir[1] * (far - r1)],
    ];
  });
}

// Built at y = 0 so scaling the ring never lifts it off the floor
const RING = segments(circle(1, 128, 0));

export default function Network({ reduced, compact }) {
  const { mats, palette } = useWorld();
  const packets = useRef(null);
  const rings = useRef([]);
  const matrix = useMemo(() => new THREE.Matrix4(), []);
  const point = useMemo(() => new THREE.Vector3(), []);
  const packetCount = compact ? 22 : 40;

  const routes = useMemo(buildRoutes, []);
  const routeGeometry = useMemo(() => segments(routes.flatMap((route) => polyline(route))), [routes]);
  const footprint = useMemo(
    () => dashed(segments([...rect(12.4, 12.4, Y), ...circle(START, 96, Y), ...circle(15.5, 128, Y)])),
    []
  );
  const paths = useMemo(() => routes.map((route) => makePath(route)), [routes]);
  const flow = useMemo(() => {
    const random = rng(29);
    return Array.from({ length: packetCount }, (_, i) => ({
      path: i % ROUTE_COUNT,
      offset: random(),
      speed: 5 + random() * 4,
    }));
  }, [packetCount]);

  useFrame(() => {
    const mesh = packets.current;
    if (mesh) {
      flow.forEach((packet, i) => {
        const path = paths[packet.path];
        const t = (packet.offset + (rig.flow * packet.speed) / path.total) % 1;
        pointOnPath(path, t, point);
        matrix.makeScale(0.26, 0.1, 0.26);
        matrix.setPosition(point.x, point.y + 0.05, point.z);
        mesh.setMatrixAt(i, matrix);
      });
      mesh.instanceMatrix.needsUpdate = true;
    }

    rings.current.forEach((ring, i) => {
      if (!ring) return;
      const u = reduced ? 0.35 + i * 0.2 : ((rig.time / RING_TIME + i / 3) % 1);
      ring.scale.setScalar(THREE.MathUtils.lerp(RING_START, RING_END, u));
      ring.material.opacity = Math.pow(1 - u, 1.6) * 0.75;
    });
  });

  return (
    <group>
      <lineSegments geometry={footprint} material={mats.dashed} />
      <lineSegments geometry={routeGeometry} material={mats.line} />
      <instancedMesh ref={packets} args={[UNIT_BOX, mats.ink, packetCount]} frustumCulled={false} />
      {[0, 1, 2].map((i) => (
        <lineSegments
          key={i}
          ref={(node) => {
            rings.current[i] = node;
          }}
          geometry={RING}
          position-y={Y}
        >
          <lineBasicMaterial color={palette.line} transparent depthWrite={false} />
        </lineSegments>
      ))}
    </group>
  );
}
