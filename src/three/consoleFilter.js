import { setConsoleFunction } from 'three';

// @react-three/fiber (up to 9.8.x) constructs a THREE.Clock internally, which three
// r183+ flags as deprecated on every canvas mount. Drop that single known message via
// three's official logging hook and forward everything else untouched. Imported by
// every canvas so the filter is in place whichever one mounts first.
setConsoleFunction((type, message, ...params) => {
  if (type === 'warn' && typeof message === 'string' && message.startsWith('THREE.Clock:')) return;
  (console[type] || console.log)(message, ...params);
});
