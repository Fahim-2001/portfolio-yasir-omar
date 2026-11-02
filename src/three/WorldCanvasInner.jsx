import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import './consoleFilter';
import WorldScene from './world/WorldScene';
import { progressAt, startRig } from './world/scrollRig';
import { useFinePointer, useMediaQuery } from '../hooks/useMediaQuery';

/**
 * Paces the world's frames (the canvas runs in demand mode):
 * - full rate while scrolling, during the opening move and while the camera settles;
 * - half rate once the page has been still for a moment, for the ambient motion only;
 * - under reduced motion, a frame only when the section on screen changes.
 * It also governs resolution: if frames run long while scrolling, the pixel ratio
 * steps down, and it creeps back up when there is headroom.
 */
function FrameDriver({ reduced, maxDpr }) {
  const invalidate = useThree((s) => s.invalidate);
  const setDpr = useThree((s) => s.setDpr);

  useEffect(() => {
    if (reduced) {
      let last = -1;
      let frame = 0;
      const check = () => {
        frame = 0;
        const index = Math.round(progressAt(window.scrollY));
        if (index !== last) {
          last = index;
          invalidate();
        }
      };
      const onChange = () => {
        if (!frame) frame = window.requestAnimationFrame(check);
      };
      window.addEventListener('scroll', onChange, { passive: true });
      window.addEventListener('resize', onChange, { passive: true });
      check();
      return () => {
        window.removeEventListener('scroll', onChange);
        window.removeEventListener('resize', onChange);
        if (frame) window.cancelAnimationFrame(frame);
      };
    }

    let raf = 0;
    let lastY = window.scrollY;
    let still = -200; // the opening move runs at full rate
    let tick = 0;
    let previous = performance.now();
    let sum = 0;
    let samples = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, maxDpr);

    const loop = (now) => {
      raf = window.requestAnimationFrame(loop);
      const dt = now - previous;
      previous = now;

      const y = window.scrollY;
      if (y !== lastY) {
        lastY = y;
        still = Math.min(still, 0);
      }
      still += 1;
      const busy = still < 90;
      if (busy || (tick++ & 1) === 0) invalidate();

      if (busy && dt < 200) {
        sum += dt;
        samples += 1;
        if (samples >= 45) {
          const average = sum / samples;
          sum = 0;
          samples = 0;
          if (average > 24 && dpr > 1) {
            dpr = Math.max(1, dpr * 0.8);
            setDpr(dpr);
          } else if (average < 15 && dpr < maxDpr) {
            dpr = Math.min(maxDpr, dpr + 0.1);
            setDpr(dpr);
          }
        }
      }
    };

    raf = window.requestAnimationFrame(loop);
    return () => window.cancelAnimationFrame(raf);
  }, [reduced, maxDpr, invalidate, setDpr]);

  return null;
}

/**
 * Compiles every shader in the world before its first frame. Where the browser
 * supports KHR_parallel_shader_compile this happens off the main thread, so the
 * world arrives without a long task. Mounted after the scene, so it sees all of it.
 */
function Warmup({ onReady }) {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const camera = useThree((s) => s.camera);

  useEffect(() => {
    let cancelled = false;
    const done = () => {
      if (!cancelled) onReady();
    };
    // compileAsync warns when the extension is missing; `has` probes it silently
    if (gl.extensions.has('KHR_parallel_shader_compile')) {
      gl.compileAsync(scene, camera).then(done, done);
    } else {
      gl.compile(scene, camera);
      done();
    }
    return () => {
      cancelled = true;
    };
  }, [gl, scene, camera, onReady]);

  return null;
}

/**
 * The fixed, full-viewport background world. Purely decorative: the wrapper is
 * aria-hidden and pointer-events: none, so the canvas never takes scroll, touch or
 * clicks. CameraRig drives the wrapper's opacity (fade-in and dimming).
 */
export default function WorldCanvasInner({ reduced, onFirstFrame }) {
  const wrapRef = useRef(null);
  const fine = useFinePointer();
  const compact = useMediaQuery('(max-width: 767px)');
  const maxDpr = fine ? 1.5 : 1.25;
  const [ready, setReady] = useState(false);
  const handleReady = useCallback(() => setReady(true), []);

  useEffect(() => startRig(), []);

  return (
    <div ref={wrapRef} className="absolute inset-0" style={{ opacity: 0 }}>
      <Canvas
        flat
        frameloop={ready ? 'demand' : 'never'}
        dpr={[1, maxDpr]}
        camera={{ fov: 36, near: 0.5, far: 300, position: [0, 60, 80] }}
        gl={{ antialias: true, alpha: true, stencil: false, powerPreference: 'high-performance' }}
      >
        {ready && <FrameDriver reduced={reduced} maxDpr={maxDpr} />}
        <WorldScene reduced={reduced} compact={compact} fine={fine} wrapper={wrapRef} onFirstFrame={onFirstFrame} />
        <Warmup onReady={handleReady} />
      </Canvas>
    </div>
  );
}
