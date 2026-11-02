import React, { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useWorld } from '../materials';
import { rig } from '../scrollRig';
import { BAR_COUNT } from '../waypoints';
import { UNIT_BOX, UNIT_EDGES, dashed, polyline, rng, segments } from '../geometry';
import { Label } from '../parts';

/*
 * z-05 · Algorithms. A row of bars bubble-sorts itself one swap at a time (the
 * swapping pair passes front and back of each other, in ink), while a binary tree
 * behind it is walked in order, node by node.
 */

const PITCH = 0.5;
const BAR_W = 0.34;
const BAR_Z = 1.45;
const SWAP = 0.3;
const heightOf = (id) => 0.4 + id * 0.19;
const slotX = (slot) => (slot - (BAR_COUNT - 1) / 2) * PITCH;

const DEPTH = 4;
const TREE_N = 2 ** DEPTH - 1;
const TREE_Z = -1.9;
const TREE_STEP = 0.42;

function shuffled(random) {
  const order = Array.from({ length: BAR_COUNT }, (_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}

// The swaps bubble sort makes, as the left slot of each swapped pair
function bubbleSwaps(order) {
  const a = [...order];
  const swaps = [];
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < a.length - 1 - i; j++) {
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        swaps.push(j);
      }
    }
  }
  return swaps;
}

const TREE = (() => {
  const nodes = Array.from({ length: TREE_N }, (_, i) => {
    const d = Math.floor(Math.log2(i + 1));
    const j = i + 1 - 2 ** d;
    return [((j + 0.5) / 2 ** d - 0.5) * 7, 5.2 - d * 0.95, TREE_Z];
  });
  const pairs = [];
  for (let i = 1; i < TREE_N; i++) pairs.push(nodes[Math.floor((i - 1) / 2)], nodes[i]);
  const walk = [];
  const inorder = (i) => {
    if (i >= TREE_N) return;
    inorder(2 * i + 1);
    walk.push(i);
    inorder(2 * i + 2);
  };
  inorder(0);
  const rank = [];
  walk.forEach((node, step) => (rank[node] = step));
  return { nodes, edges: segments(pairs), rank };
})();

const FRAME = dashed(
  segments(
    polyline(
      [
        [-3.85, 1.75, TREE_Z],
        [3.85, 1.75, TREE_Z],
        [3.85, 5.75, TREE_Z],
        [-3.85, 5.75, TREE_Z],
      ],
      true
    )
  )
);

export default function Algorithms({ reduced }) {
  const { mats, colors } = useWorld();
  const bars = useRef([]);
  const tree = useRef(null);
  const matrix = useMemo(() => new THREE.Matrix4(), []);

  const sort = useRef(null);
  if (!sort.current) {
    const random = rng(3);
    const order = shuffled(random);
    sort.current = { random, order, swaps: bubbleSwaps(order), step: 0, t: 0, hold: 0 };
  }

  useLayoutEffect(() => {
    for (let i = 0; i < TREE_N; i++) tree.current.setColorAt(i, colors.line);
  }, [colors]);

  useFrame((_, delta) => {
    const s = sort.current;
    const dt = reduced ? 0 : Math.min(delta, 0.05) * (1 + rig.explode);

    if (reduced) {
      s.order = Array.from({ length: BAR_COUNT }, (_, i) => i);
      s.step = s.swaps.length = 0;
    } else if (s.step < s.swaps.length) {
      s.t += dt;
      if (s.t >= SWAP) {
        const j = s.swaps[s.step];
        [s.order[j], s.order[j + 1]] = [s.order[j + 1], s.order[j]];
        s.step += 1;
        s.t -= SWAP;
      }
    } else {
      s.hold += dt;
      if (s.hold > 2.2) {
        s.order = shuffled(s.random);
        s.swaps = bubbleSwaps(s.order);
        s.step = 0;
        s.t = 0;
        s.hold = 0;
      }
    }

    const active = s.step < s.swaps.length ? s.swaps[s.step] : -1;
    const u = active >= 0 ? s.t / SWAP : 0;
    const eased = u * u * (3 - 2 * u);
    const arc = Math.sin(Math.PI * u);

    s.order.forEach((id, slot) => {
      const bar = bars.current[id];
      if (!bar) return;
      let x = slotX(slot);
      let y = 0;
      let z = BAR_Z;
      const moving = slot === active || slot === active + 1;
      if (slot === active) {
        x = THREE.MathUtils.lerp(slotX(slot), slotX(slot + 1), eased);
        y = arc * 0.3;
        z += arc * 0.5;
      } else if (slot === active + 1) {
        x = THREE.MathUtils.lerp(slotX(slot), slotX(slot - 1), eased);
        z -= arc * 0.5;
      }
      bar.position.set(x, y, z);
      bar.children[0].material = moving ? mats.ink : mats.solid;
      bar.children[1].material = moving ? mats.inkLine : mats.line;
    });

    // In-order walk
    const cycle = TREE_N * TREE_STEP + 1.8;
    const at = reduced ? TREE_N : Math.floor((rig.time % cycle) / TREE_STEP);
    const mesh = tree.current;
    TREE.nodes.forEach((p, i) => {
      const rank = TREE.rank[i];
      const sc = 0.26 * (rank === at ? 1.5 : 1);
      matrix.makeScale(sc, sc, sc);
      matrix.setPosition(p[0], p[1], p[2]);
      mesh.setMatrixAt(i, matrix);
      mesh.setColorAt(i, rank <= at ? colors.ink : colors.line);
    });
    mesh.instanceMatrix.needsUpdate = true;
    mesh.instanceColor.needsUpdate = true;
  });

  return (
    <group>
      {Array.from({ length: BAR_COUNT }, (_, id) => {
        const h = heightOf(id);
        return (
          <group
            key={id}
            ref={(node) => {
              bars.current[id] = node;
            }}
          >
            <mesh geometry={UNIT_BOX} material={mats.solid} scale={[BAR_W, h, BAR_W]} position={[0, h / 2, 0]} />
            <lineSegments geometry={UNIT_EDGES} material={mats.line} scale={[BAR_W, h, BAR_W]} position={[0, h / 2, 0]} />
          </group>
        );
      })}
      <Label text="sort(arr)" position={[-3.5, 0.02, BAR_Z + 0.75]} height={0.3} flat />

      <lineSegments geometry={TREE.edges} material={mats.line} />
      <instancedMesh ref={tree} args={[UNIT_BOX, mats.tinted, TREE_N]} frustumCulled={false} />
      <lineSegments geometry={FRAME} material={mats.dashed} />
      <Label text="walk(root)" position={[-3.75, 5.45, TREE_Z]} height={0.28} />
    </group>
  );
}
