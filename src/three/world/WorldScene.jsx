import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import { WorldProvider } from './materials';
import CameraRig from './CameraRig';
import { Plate, Rails } from './Tower';
import { Cloud, Dust, Floor, Fragments } from './Atmosphere';
import Interface from './dioramas/Interface';
import CommitGraph from './dioramas/CommitGraph';
import ContainerYard from './dioramas/ContainerYard';
import DependencyGraph from './dioramas/DependencyGraph';
import Algorithms from './dioramas/Algorithms';
import SiliconDie from './dioramas/SiliconDie';
import Network from './dioramas/Network';

/*
 * "The Stack": a descent from cloud to silicon. See waypoints.js for the layout and
 * DESIGN.md §9 for the concept.
 */
export default function WorldScene({ reduced, compact, fine, wrapper, onFirstFrame }) {
  const { colors } = useTheme();
  const palette = colors.world;
  const shared = { reduced, compact };

  return (
    <WorldProvider palette={palette}>
      <fog attach="fog" args={[palette.bg, 70, 175]} color={palette.bg} />
      <CameraRig reduced={reduced} fine={fine} wrapper={wrapper} onFirstFrame={onFirstFrame} />

      <ambientLight intensity={palette.ambient} />
      <directionalLight position={[18, 40, 24]} intensity={palette.key} />
      <directionalLight position={[-24, 12, -14]} intensity={palette.fill} />

      <Floor />
      <Network {...shared} />
      <Rails {...shared} />

      <Plate k={1}>
        <Interface k={1} {...shared} />
      </Plate>
      <Plate k={2}>
        <CommitGraph {...shared} />
      </Plate>
      <Plate k={3}>
        <ContainerYard k={3} {...shared} />
      </Plate>
      <Plate k={4}>
        <DependencyGraph {...shared} />
      </Plate>
      <Plate k={5}>
        <Algorithms {...shared} />
      </Plate>
      <Plate k={6}>
        <SiliconDie {...shared} />
      </Plate>

      <Cloud {...shared} />
      <Fragments {...shared} />
      <Dust count={compact ? 140 : 360} />
    </WorldProvider>
  );
}
