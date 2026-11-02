import React, { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import portfolioData from '../../../data/portfolio';
import { useWorld } from '../materials';
import { rig } from '../scrollRig';
import { OCTA, UNIT_BOX, makePath, pointOnPath, rng, segments } from '../geometry';

/*
 * z-04 · Dependencies. A dependency graph built from the skills data: a root, one hub
 * per skill group and one leaf per skill. The graph turns slowly (and with the
 * scroll) while packets resolve from the root out to the leaves.
 */

const CENTER_Y = 2.75;
const HUB_RADIUS = 2.65;
const LEAF_RADIUS = 1.05;

function buildGraph() {
  const groups = portfolioData.skills;
  const root = new THREE.Vector3(0, CENTER_Y, 0);
  const up = new THREE.Vector3(0, 1, 0);
  const hubs = [];
  const leaves = [];

  groups.forEach((group, g) => {
    const a = (g / groups.length) * Math.PI * 2;
    const hub = new THREE.Vector3(Math.cos(a) * HUB_RADIUS, CENTER_Y + Math.sin(g * 1.7) * 0.55, Math.sin(a) * HUB_RADIUS);
    const outward = hub.clone().sub(root).setY(0).normalize();
    const tangent = new THREE.Vector3().crossVectors(up, outward);
    hubs.push(hub);
    group.items.forEach((_, j) => {
      const b = (j / group.items.length) * Math.PI * 2 + g;
      leaves.push({
        hub: g,
        p: hub
          .clone()
          .addScaledVector(outward, 0.5)
          .addScaledVector(up, Math.cos(b) * LEAF_RADIUS)
          .addScaledVector(tangent, Math.sin(b) * LEAF_RADIUS),
      });
    });
  });

  return { root, hubs, leaves };
}

export default function DependencyGraph({ reduced, compact }) {
  const { mats, colors, palette } = useWorld();
  const graph = useMemo(buildGraph, []);
  const spin = useRef(null);
  const knots = useRef(null);
  const leafMesh = useRef(null);
  const packetMesh = useRef(null);
  const matrix = useMemo(() => new THREE.Matrix4(), []);
  const point = useMemo(() => new THREE.Vector3(), []);
  const packetCount = compact ? 6 : 12;

  const edges = useMemo(() => {
    const pairs = [];
    graph.hubs.forEach((hub) => pairs.push(graph.root.toArray(), hub.toArray()));
    graph.leaves.forEach((leaf) => pairs.push(graph.hubs[leaf.hub].toArray(), leaf.p.toArray()));
    return segments(pairs);
  }, [graph]);

  // Each packet resolves one dependency: root → hub → leaf, then picks another
  const packets = useMemo(() => {
    const random = rng(5);
    const pick = () => {
      const leaf = graph.leaves[Math.floor(random() * graph.leaves.length)];
      return makePath([graph.root.toArray(), graph.hubs[leaf.hub].toArray(), leaf.p.toArray()]);
    };
    return Array.from({ length: packetCount }, (_, i) => ({ path: pick(), t: i / packetCount, speed: 0.22 + random() * 0.18, pick }));
  }, [graph, packetCount]);

  useLayoutEffect(() => {
    const mesh = knots.current;
    // Root in ink, hubs in the strong grey
    mesh.setColorAt(0, colors.ink);
    graph.hubs.forEach((hub, i) => mesh.setColorAt(i + 1, colors.strong));
    [graph.root, ...graph.hubs].forEach((p, i) => {
      const s = i === 0 ? 0.42 : 0.27;
      matrix.makeScale(s, s, s);
      matrix.setPosition(p);
      mesh.setMatrixAt(i, matrix);
    });
    mesh.instanceColor.needsUpdate = true;
    mesh.instanceMatrix.needsUpdate = true;

    graph.leaves.forEach((leaf, i) => {
      matrix.makeScale(0.17, 0.17, 0.17);
      matrix.setPosition(leaf.p);
      leafMesh.current.setMatrixAt(i, matrix);
      leafMesh.current.setColorAt(i, colors.line);
    });
    leafMesh.current.instanceMatrix.needsUpdate = true;
    leafMesh.current.instanceColor.needsUpdate = true;
    // palette: rerun when the theme recolours `colors` in place
  }, [graph, colors, palette, matrix]);

  useFrame((_, delta) => {
    if (spin.current) {
      spin.current.rotation.y = rig.time * 0.12 + rig.progress * 0.7;
      spin.current.position.y = reduced ? 0 : Math.sin(rig.time * 0.7) * 0.12;
    }
    const mesh = packetMesh.current;
    if (!mesh) return;
    const dt = reduced ? 0 : Math.min(delta, 0.05) * (1 + rig.explode * 2);
    packets.forEach((packet, i) => {
      packet.t += dt * packet.speed;
      if (packet.t >= 1) {
        packet.t = 0;
        packet.path = packet.pick();
      }
      pointOnPath(packet.path, packet.t, point);
      matrix.makeScale(0.13, 0.13, 0.13);
      matrix.setPosition(point);
      mesh.setMatrixAt(i, matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <group ref={spin}>
      <lineSegments geometry={edges} material={mats.line} />
      <instancedMesh ref={knots} args={[OCTA, mats.tinted, graph.hubs.length + 1]} />
      <instancedMesh ref={leafMesh} args={[UNIT_BOX, mats.tinted, graph.leaves.length]} />
      <instancedMesh ref={packetMesh} args={[UNIT_BOX, mats.ink, packetCount]} frustumCulled={false} />
    </group>
  );
}
