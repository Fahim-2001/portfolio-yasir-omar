import * as THREE from 'three';

/*
 * Procedural geometry for the background world. No models and no image textures:
 * boxes, hairlines and points, plus mono labels drawn into canvases at runtime.
 */

export const UNIT_BOX = new THREE.BoxGeometry(1, 1, 1);
export const UNIT_EDGES = new THREE.EdgesGeometry(UNIT_BOX);
export const OCTA = new THREE.OctahedronGeometry(1, 0);

/** LineSegments geometry from a flat list of [x, y, z] points, read in pairs. */
export function segments(pairs) {
  const array = new Float32Array(pairs.length * 3);
  pairs.forEach((p, i) => {
    array[i * 3] = p[0];
    array[i * 3 + 1] = p[1];
    array[i * 3 + 2] = p[2];
  });
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(array, 3));
  return geometry;
}

/** Adds the lineDistance attribute that LineDashedMaterial needs. */
export function dashed(geometry) {
  new THREE.LineSegments(geometry).computeLineDistances();
  return geometry;
}

/** A polyline [p0, p1, p2, …] as segment pairs. */
export function polyline(points, closed = false) {
  const out = [];
  for (let i = 0; i < points.length - 1; i++) out.push(points[i], points[i + 1]);
  if (closed && points.length > 2) out.push(points[points.length - 1], points[0]);
  return out;
}

/** Closed circle in the XZ plane, as segment pairs. */
export function circle(radius, steps = 96, y = 0) {
  const points = Array.from({ length: steps }, (_, i) => {
    const a = (i / steps) * Math.PI * 2;
    return [Math.cos(a) * radius, y, Math.sin(a) * radius];
  });
  return polyline(points, true);
}

/** Closed rectangle in the XZ plane, as segment pairs. */
export function rect(w, d, y = 0, cx = 0, cz = 0) {
  const x0 = cx - w / 2;
  const x1 = cx + w / 2;
  const z0 = cz - d / 2;
  const z1 = cz + d / 2;
  return polyline(
    [
      [x0, y, z0],
      [x1, y, z0],
      [x1, y, z1],
      [x0, y, z1],
    ],
    true
  );
}

/** A polyline prepared for sampling by distance. */
export function makePath(points) {
  const vectors = points.map((p) => new THREE.Vector3(...p));
  const lengths = [0];
  for (let i = 1; i < vectors.length; i++) lengths.push(lengths[i - 1] + vectors[i].distanceTo(vectors[i - 1]));
  return { vectors, lengths, total: lengths[lengths.length - 1] };
}

/** Writes the point at fraction t (0 → 1) along a path into `out`. */
export function pointOnPath(path, t, out) {
  const d = Math.min(1, Math.max(0, t)) * path.total;
  const { vectors, lengths } = path;
  let i = 1;
  while (i < lengths.length - 1 && lengths[i] < d) i++;
  const span = lengths[i] - lengths[i - 1] || 1;
  return out.lerpVectors(vectors[i - 1], vectors[i], (d - lengths[i - 1]) / span);
}

/** Small deterministic PRNG (mulberry32), so the world is identical on every visit. */
export function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const LABEL_ASPECT = 1024 / 96;

/**
 * A single line of JetBrains Mono drawn in white into a texture, so a material
 * colour can tint it per theme without redrawing. Redraws once the font is ready.
 */
export function labelTexture(text, { align = 'left', onUpdate } = {}) {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 96;
  const ctx = canvas.getContext('2d');
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  const font = '500 52px "JetBrains Mono", ui-monospace, monospace';

  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffffff';
    ctx.font = font;
    ctx.textBaseline = 'middle';
    ctx.textAlign = align;
    if ('letterSpacing' in ctx) ctx.letterSpacing = '3px';
    ctx.fillText(text, align === 'center' ? canvas.width / 2 : 6, canvas.height / 2 + 2);
    texture.needsUpdate = true;
    onUpdate?.();
  };

  draw();
  document.fonts?.load(font).then(draw, () => {});
  return texture;
}
