import React, { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import portfolioData from '../../../data/portfolio';
import { useWorld } from '../materials';
import { rig } from '../scrollRig';
import { UNIT_BOX, circle, dashed, segments } from '../geometry';
import { Label } from '../parts';

/*
 * z-02 · Version control. A git graph built from the experience data: one branch per
 * role (oldest first), one commit per bullet point, merged back into main when the
 * role ended. A role that runs to "Present" stays open with HEAD on its last commit.
 * Branches step up and back in Z, so the history reads as an exploded drawing, and
 * a playhead replays the commits in order.
 */

const W = 8.2;
const MAIN = { y: 0.3, z: 1.9 };
const lane = (j) => ({ y: 0.3 + 1.05 * (j + 1), z: 1.9 - 1.55 * (j + 1) });
const slug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const STEP = 0.5;
const HOLD = 2.2;

function buildGraph() {
  const jobs = [...portfolioData.experience].reverse();
  const stops = 3 + jobs.reduce((sum, job) => sum + job.points.length + (job.end === 'Present' ? 0 : 1), 0);
  const spacing = W / (stops - 1);
  const nodes = [];
  const edges = [];
  const branches = [];
  let x = -W / 2;
  let head = null;

  const add = (kind, at) => {
    const node = { kind, p: [x, at.y, at.z] };
    nodes.push(node);
    return node;
  };
  const step = (kind, at) => {
    x += spacing;
    return add(kind, at);
  };

  let tip = add('main', MAIN);
  const second = step('main', MAIN);
  edges.push([tip.p, second.p]);
  tip = second;

  jobs.forEach((job, j) => {
    const at = lane(j);
    let last = tip;
    job.points.forEach((_, i) => {
      const commit = step('commit', at);
      if (i === 0) branches.push({ name: slug(job.company), p: commit.p });
      edges.push([last.p, commit.p]);
      last = commit;
    });
    if (job.end === 'Present') {
      head = last;
    } else {
      const merge = step('merge', MAIN);
      edges.push([last.p, merge.p], [tip.p, merge.p]);
      tip = merge;
    }
  });

  const tail = step('main', MAIN);
  edges.push([tip.p, tail.p]);

  return { nodes, edges, branches, head, lanes: jobs.map((_, j) => lane(j)) };
}

const SIZE = { main: 0.24, commit: 0.28, merge: 0.36 };

export default function CommitGraph({ reduced }) {
  const { mats, colors } = useWorld();
  const graph = useMemo(buildGraph, []);
  const commits = useRef(null);
  const ring = useRef(null);
  const matrix = useMemo(() => new THREE.Matrix4(), []);

  const lines = useMemo(() => segments(graph.edges.flat()), [graph]);
  const guides = useMemo(
    () =>
      dashed(
        segments([
          // Swimlanes for each branch
          ...graph.lanes.flatMap((at) => [[-W / 2, at.y, at.z], [W / 2, at.y, at.z]]),
          // Drop lines from floating commits to the plate
          ...graph.nodes.filter((n) => n.kind === 'commit').flatMap((n) => [n.p, [n.p[0], 0, n.p[2]]]),
        ])
      ),
    [graph]
  );
  const headRing = useMemo(() => {
    const geometry = segments(circle(0.36, 40));
    geometry.rotateX(Math.PI / 2);
    return geometry;
  }, []);

  // Instance colours must exist before the first render compiles the shader
  useLayoutEffect(() => {
    graph.nodes.forEach((_, i) => commits.current.setColorAt(i, colors.line));
  }, [graph, colors]);

  useFrame(() => {
    const mesh = commits.current;
    if (!mesh) return;
    const count = graph.nodes.length;
    const cycle = count * STEP + HOLD;
    const playhead = reduced ? count : Math.floor((rig.time % cycle) / STEP);

    graph.nodes.forEach((node, i) => {
      const current = i === playhead;
      const s = SIZE[node.kind] * (current ? 1.45 : 1);
      matrix.makeScale(s, s, s);
      matrix.setPosition(node.p[0], node.p[1], node.p[2]);
      mesh.setMatrixAt(i, matrix);
      mesh.setColorAt(i, i <= playhead ? colors.ink : colors.line);
    });
    mesh.instanceMatrix.needsUpdate = true;
    mesh.instanceColor.needsUpdate = true;

    if (ring.current && !reduced) ring.current.scale.setScalar(1 + Math.sin(rig.time * 3) * 0.14);
  });

  const head = graph.head?.p;

  return (
    <group>
      <lineSegments geometry={lines} material={mats.strong} />
      <lineSegments geometry={guides} material={mats.dashed} />
      <instancedMesh ref={commits} args={[UNIT_BOX, mats.tinted, graph.nodes.length]} frustumCulled={false} />

      <Label text="main" position={[-W / 2, MAIN.y + 0.32, MAIN.z]} height={0.3} />
      {graph.branches.map((branch) => (
        <Label key={branch.name} text={branch.name} position={[branch.p[0] - 0.2, branch.p[1] + 0.34, branch.p[2]]} height={0.28} />
      ))}

      {head && (
        <group position={head}>
          <lineSegments ref={ring} geometry={headRing} material={mats.inkLine} />
          <Label text="HEAD" position={[0.5, 0.32, 0]} height={0.3} />
        </group>
      )}
    </group>
  );
}
