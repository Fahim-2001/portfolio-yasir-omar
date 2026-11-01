import React from 'react';

/** CSS-only 3D grid floor receding to a horizon. Purely decorative. */
export function PerspectiveFloor({ className = '' }) {
  return (
    <div aria-hidden="true" className={`perspective-floor ${className}`}>
      <div className="perspective-floor__plane" />
    </div>
  );
}

export default PerspectiveFloor;
