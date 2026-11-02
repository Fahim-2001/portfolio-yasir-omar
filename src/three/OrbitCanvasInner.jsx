import React, { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import './consoleFilter';
import OrbitScene from './OrbitScene';

/**
 * WebGL canvas for the hero. Pointer events come from `eventSource` (the hero
 * section) so the canvas itself never captures scroll, touch or wheel input.
 */
export default function OrbitCanvasInner({ eventSource, progress, reduced, onFirstFrame, className = '' }) {
  const wrapRef = useRef(null);
  const pointer = useRef({ x: 0, y: 0 });
  const [inView, setInView] = useState(true);

  // Stop rendering while the hero is off screen
  useEffect(() => {
    const el = wrapRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return undefined;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.01,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Parallax input: mouse/pen position relative to the canvas, across the whole hero
  useEffect(() => {
    const source = eventSource?.current;
    const wrap = wrapRef.current;
    if (!source || !wrap || reduced) return undefined;

    const onMove = (event) => {
      if (event.pointerType === 'touch') return;
      const rect = wrap.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = ((event.clientY - rect.top) / rect.height) * 2 - 1;
      pointer.current.x = Math.max(-1.6, Math.min(1.6, x));
      pointer.current.y = Math.max(-1.2, Math.min(1.2, y));
    };
    const onLeave = () => {
      pointer.current.x = 0;
      pointer.current.y = 0;
    };

    source.addEventListener('pointermove', onMove, { passive: true });
    source.addEventListener('pointerleave', onLeave, { passive: true });
    return () => {
      source.removeEventListener('pointermove', onMove);
      source.removeEventListener('pointerleave', onLeave);
    };
  }, [eventSource, reduced]);

  const frameloop = !inView ? 'never' : reduced ? 'demand' : 'always';

  return (
    <div ref={wrapRef} className={className} style={{ isolation: 'isolate' }}>
      <Canvas
        flat
        dpr={[1, 1.75]}
        frameloop={frameloop}
        camera={{ fov: 34, near: 0.1, far: 60, position: [0, 0.85, 9] }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        eventSource={eventSource}
        onCreated={(state) => {
          // The canvas is not at the viewport origin, so measure it for raycasting.
          state.setEvents({
            compute: (event, s) => {
              const rect = s.gl.domElement.getBoundingClientRect();
              s.pointer.set(
                ((event.clientX - rect.left) / rect.width) * 2 - 1,
                -((event.clientY - rect.top) / rect.height) * 2 + 1
              );
              s.raycaster.setFromCamera(s.pointer, s.camera);
            },
          });
        }}
      >
        <OrbitScene progress={progress} pointer={pointer} reduced={reduced} onFirstFrame={onFirstFrame} />
      </Canvas>
    </div>
  );
}
