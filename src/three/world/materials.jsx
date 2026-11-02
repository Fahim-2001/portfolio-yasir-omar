import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

/*
 * One set of monochrome materials for the whole world, recoloured in place when the
 * theme flips. `colors` holds THREE.Color copies for instance colours.
 */

const WorldContext = createContext(null);

function paint({ mats, colors }, palette) {
  mats.plate.color.set(palette.plate);
  mats.solid.color.set(palette.solid);
  mats.ink.color.set(palette.ink);
  mats.faint.color.set(palette.faint);
  mats.line.color.set(palette.line);
  mats.strong.color.set(palette.strong);
  mats.inkLine.color.set(palette.ink);
  mats.dashed.color.set(palette.line);
  mats.points.color.set(palette.line);
  mats.cloud.color.set(palette.strong);
  colors.solid.set(palette.solid);
  colors.faint.set(palette.faint);
  colors.line.set(palette.line);
  colors.strong.set(palette.strong);
  colors.ink.set(palette.ink);
}

export function WorldProvider({ palette, children }) {
  const invalidate = useThree((s) => s.invalidate);

  const base = useMemo(() => {
    const built = {
      mats: {
        plate: new THREE.MeshLambertMaterial(),
        solid: new THREE.MeshLambertMaterial(),
        ink: new THREE.MeshBasicMaterial(),
        // White base so per-instance colours show as they are
        tinted: new THREE.MeshLambertMaterial({ color: '#ffffff' }),
        faint: new THREE.LineBasicMaterial(),
        line: new THREE.LineBasicMaterial(),
        strong: new THREE.LineBasicMaterial(),
        inkLine: new THREE.LineBasicMaterial(),
        dashed: new THREE.LineDashedMaterial({ dashSize: 0.34, gapSize: 0.24 }),
        points: new THREE.PointsMaterial({
          size: 0.11,
          sizeAttenuation: true,
          transparent: true,
          opacity: 0.7,
          depthWrite: false,
        }),
        // Larger points: the cloud is mostly seen from the overview, far away
        cloud: new THREE.PointsMaterial({
          size: 0.26,
          sizeAttenuation: true,
          transparent: true,
          opacity: 0.55,
          depthWrite: false,
        }),
      },
      colors: {
        solid: new THREE.Color(),
        faint: new THREE.Color(),
        line: new THREE.Color(),
        strong: new THREE.Color(),
        ink: new THREE.Color(),
      },
    };
    return built;
  }, []);

  // Recolour during render, so children's layout effects already see the new theme
  const value = useMemo(() => {
    paint(base, palette);
    return { ...base, palette };
  }, [base, palette]);

  useEffect(() => {
    invalidate();
  }, [value, invalidate]);

  useEffect(() => () => Object.values(base.mats).forEach((material) => material.dispose()), [base]);

  return <WorldContext.Provider value={value}>{children}</WorldContext.Provider>;
}

export function useWorld() {
  return useContext(WorldContext);
}
