import React from 'react';
import { motion } from 'motion/react';
import { usePointerTilt } from '../hooks/usePointerTilt';

/**
 * Plate: the signature surface. A content face with one or two ghost plates
 * stacked behind it, like an exploded-view drawing. On hover the plates separate;
 * with `tilt` they also separate along real Z as the plate follows the pointer.
 */
export function Card({
  children,
  className = '',
  wrapperClassName = '',
  tilt = false,
  maxTilt = 5,
  lift = true,
  layers = 1,
  spotlight = false,
  as: Tag = 'div',
  ...props
}) {
  const { ref, enabled, rotateX, rotateY, handlers } = usePointerTilt({ max: maxTilt });
  const is3d = tilt && enabled;
  const tracksPointer = enabled && (tilt || spotlight);

  return (
    <motion.div
      ref={ref}
      className={`plate ${lift ? 'plate--lift' : ''} ${is3d ? 'plate--3d' : ''} ${wrapperClassName}`}
      style={is3d ? { rotateX, rotateY, transformPerspective: 1100 } : undefined}
      {...(tracksPointer ? handlers : {})}
    >
      {layers > 1 && <span aria-hidden="true" className="plate-ghost plate-ghost--2" />}
      <span aria-hidden="true" className="plate-ghost" />
      <Tag className={`plate-face ${className}`} {...props}>
        {spotlight && enabled && <span aria-hidden="true" className="plate-spot" />}
        {children}
      </Tag>
    </motion.div>
  );
}

export default Card;
