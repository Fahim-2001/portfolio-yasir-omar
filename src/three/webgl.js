let cached = null;

/** True when the browser can create a WebGL context. Probed once and cached. */
export function supportsWebGL() {
  if (cached !== null) return cached;
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    cached = Boolean(
      window.WebGLRenderingContext && (canvas.getContext('webgl2') || canvas.getContext('webgl'))
    );
  } catch {
    cached = false;
  }
  return cached;
}
