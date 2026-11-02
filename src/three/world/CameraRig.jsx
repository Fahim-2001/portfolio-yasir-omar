import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { WAYPOINTS } from './waypoints';
import { progressAt, rig } from './scrollRig';
import { easeOutCubic } from './parts';
import { useWorld } from './materials';

const { clamp, damp, degToRad, lerp, smoothstep } = THREE.MathUtils;

const pos = new THREE.Vector3();
const target = new THREE.Vector3();
const dir = new THREE.Vector3();
const right = new THREE.Vector3();
const UP = new THREE.Vector3(0, 1, 0);

// Mostly eased with a little linear left in: the camera settles on each section
// without stopping dead between them.
const ease = (f) => lerp(f, f * f * (3 - 2 * f), 0.72);

function sample(p, out) {
  const last = WAYPOINTS.length - 1;
  const i = clamp(Math.floor(p), 0, last - 1);
  const f = ease(clamp(p - i, 0, 1));
  const a = WAYPOINTS[i];
  const b = WAYPOINTS[i + 1];
  out.theta = degToRad(lerp(a.theta, b.theta, f));
  out.radius = lerp(a.radius, b.radius, f);
  out.y = lerp(a.y, b.y, f);
  out.tx = lerp(a.target[0], b.target[0], f);
  out.ty = lerp(a.target[1], b.target[1], f);
  out.tz = lerp(a.target[2], b.target[2], f);
  out.fov = lerp(a.fov, b.fov, f);
  out.shift = lerp(a.shift, b.shift, f);
  out.rise = lerp(a.rise, b.rise, f);
  out.fogNear = lerp(a.fog[0], b.fog[0], f);
  out.fogFar = lerp(a.fog[1], b.fog[1], f);
  out.dim = lerp(a.dim, b.dim, f);
  return out;
}

/**
 * Flies the camera through the stack. Scroll → section index (scrollRig) → damped →
 * sampled between waypoints in cylindrical coordinates, so the camera spirals
 * around the stack rather than cutting chords across it. Also owns the opening
 * dolly, the hand-held pointer drift, the tall-frame fix, fog and the world's
 * fade behind text.
 */
export default function CameraRig({ reduced, fine, wrapper, onFirstFrame }) {
  const { palette } = useWorld();
  const camera = useThree((s) => s.camera);
  const scene = useThree((s) => s.scene);
  const size = useThree((s) => s.size);
  const state = useRef({
    p: null,
    lastY: 0,
    speed: 0,
    intro: reduced ? 1 : 0,
    mx: 0,
    my: 0,
    tmx: 0,
    tmy: 0,
    opacity: -1,
    painted: false,
    view: {},
  });

  // Pointer drift: mouse and trackpad only
  useEffect(() => {
    if (reduced || !fine) return undefined;
    const s = state.current;
    const onMove = (event) => {
      if (event.pointerType === 'touch') return;
      s.tmx = (event.clientX / window.innerWidth) * 2 - 1;
      s.tmy = (event.clientY / window.innerHeight) * 2 - 1;
    };
    const onLeave = () => {
      s.tmx = 0;
      s.tmy = 0;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, [reduced, fine]);

  useFrame((_, delta) => {
    const s = state.current;
    const dt = Math.min(delta, 0.05);
    const scrollY = window.scrollY;
    const raw = progressAt(scrollY);

    if (s.p === null) {
      s.p = raw;
      s.lastY = scrollY;
    }

    if (reduced) {
      // No flight: the camera cuts to the section that fills the screen
      s.p = Math.round(raw);
    } else {
      s.p = damp(s.p, raw, 3.4, dt);
      s.intro = Math.min(1, s.intro + dt / 2.8);
      // Scroll speed pulls the stack apart: quick to open, slow to settle
      const speed = clamp(Math.abs(scrollY - s.lastY) / Math.max(dt, 1 / 240) / 2600, 0, 1);
      s.speed = damp(s.speed, speed, speed > s.speed ? 7 : 1.5, dt);
      rig.time += dt;
      rig.flow += dt * (1 + s.speed * 3);
    }
    s.lastY = scrollY;

    rig.progress = s.p;
    rig.explode = s.speed;
    rig.intro = s.intro;

    const v = sample(s.p, s.view);
    pos.set(Math.sin(v.theta) * v.radius, v.y, Math.cos(v.theta) * v.radius);
    target.set(v.tx, v.ty, v.tz);
    let fov = v.fov;
    let extra = 0; // distance added to the waypoint, carried into the fog

    // Every waypoint is composed for a wide frame; on a tall one, step back along
    // the view axis and open the lens a little instead of cropping the stack.
    const aspect = size.width / Math.max(1, size.height);
    const tall = clamp((1.45 - aspect) / 0.9, 0, 1);
    if (tall > 0) {
      dir.subVectors(pos, target);
      const back = dir.length() * 0.34 * tall;
      pos.addScaledVector(dir.normalize(), back);
      pos.y += tall * 1.4;
      fov *= 1 + tall * 0.22;
      extra += back;
    }

    // The opening dolly: a long lens easing in from further out
    const out = 1 - easeOutCubic(s.intro);
    if (out > 0) {
      dir.subVectors(pos, target).normalize();
      pos.addScaledVector(dir, out * 30);
      pos.y += out * 12;
      fov += out * 6;
      extra += out * 30;
    }

    // Hand-held drift, never enough to break the frame
    s.mx = damp(s.mx, s.tmx, 2.2, dt);
    s.my = damp(s.my, s.tmy, 2.2, dt);
    if (s.mx || s.my) {
      right.subVectors(target, pos).cross(UP).normalize();
      pos.addScaledVector(right, s.mx * 0.9);
      pos.y -= s.my * 0.6;
      target.addScaledVector(right, -s.mx * 0.3);
    }

    camera.position.copy(pos);
    camera.lookAt(target);

    // Lens shift composes the subject into the empty part of a wide frame; it fades
    // out on tall frames, where the content is a single centred column.
    const wide = smoothstep(aspect, 1.05, 1.55);
    camera.fov = fov;
    camera.setViewOffset(
      size.width,
      size.height,
      -v.shift * wide * size.width,
      v.rise * wide * size.height,
      size.width,
      size.height
    );

    if (scene.fog) {
      scene.fog.near = v.fogNear + extra;
      scene.fog.far = v.fogFar + extra;
    }

    // Fade in on arrival, and step back behind text-heavy sections; further on tall
    // frames, where every section is a full-width column of text.
    // The world begins at About: invisible over the hero, fading in on the way down.
    const fade = reduced ? 1 : smoothstep(s.intro, 0, 0.4);
    const presence = smoothstep(s.p, 0.25, 0.9);
    const opacity = fade * presence * (1 - Math.min(0.85, (v.dim + tall * 0.22) * palette.dimScale));
    if (wrapper.current && Math.abs(opacity - s.opacity) > 0.002) {
      s.opacity = opacity;
      wrapper.current.style.opacity = opacity.toFixed(3);
    }

    if (!s.painted) {
      s.painted = true;
      onFirstFrame?.();
    }
  });

  return null;
}
