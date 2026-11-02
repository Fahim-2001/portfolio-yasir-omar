import React, { forwardRef, useEffect, useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import { useWorld } from './materials';
import { rig } from './scrollRig';
import { LABEL_ASPECT, UNIT_BOX, UNIT_EDGES, labelTexture } from './geometry';

/** 1 when the camera is at section k, falling to 0 one section away. */
export function focusOf(k) {
  return Math.max(0, 1 - Math.abs(rig.progress - k));
}

export const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

/** A box with hairline edges: the basic part every diorama is built from. */
export const Slab = forwardRef(function Slab(
  { size, position, rotation, fill = 'solid', edge = 'line' },
  ref
) {
  const { mats } = useWorld();
  return (
    <group ref={ref} position={position} rotation={rotation} scale={size}>
      {fill && <mesh geometry={UNIT_BOX} material={mats[fill]} />}
      {edge && <lineSegments geometry={UNIT_EDGES} material={mats[edge]} />}
    </group>
  );
});

/** One line of mono text. `height` is the label's height in world units. */
export function Label({ text, position, rotation, height = 0.4, align = 'left', flat = false }) {
  const { palette } = useWorld();
  const invalidate = useThree((s) => s.invalidate);
  const texture = useMemo(() => labelTexture(text, { align, onUpdate: invalidate }), [text, align, invalidate]);
  useEffect(() => () => texture.dispose(), [texture]);

  const width = height * LABEL_ASPECT;
  // Left-aligned labels are anchored at their left edge
  const offset = align === 'left' ? width / 2 : 0;

  return (
    <group position={position} rotation={flat ? [-Math.PI / 2, 0, 0] : rotation}>
      <mesh position={[offset, 0, 0]}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial map={texture} color={palette.label} transparent depthWrite={false} toneMapped={false} />
      </mesh>
    </group>
  );
}
