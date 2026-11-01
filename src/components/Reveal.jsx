import React from 'react';
import { motion } from 'motion/react';

const EASE = [0.16, 1, 0.3, 1];

/*
 * Scroll reveals. Transforms are skipped automatically for reduced-motion users by
 * the app-level <MotionConfig reducedMotion="user">; only the fade remains.
 *  - rise:  fades up
 *  - depth: stands up out of the page plane
 *  - swing: swings in around the Y axis from the left edge
 */
const VARIANTS = {
  rise: {
    hidden: { opacity: 0, y: 28 },
    shown: { opacity: 1, y: 0 },
  },
  depth: {
    hidden: { opacity: 0, y: 44, rotateX: 18, scale: 0.97 },
    shown: { opacity: 1, y: 0, rotateX: 0, scale: 1 },
  },
  swing: {
    hidden: { opacity: 0, x: -28, rotateY: 14 },
    shown: { opacity: 1, x: 0, rotateY: 0 },
  },
};

const ORIGINS = {
  rise: undefined,
  depth: '50% 100%',
  swing: '0% 50%',
};

export function Reveal({
  children,
  delay = 0,
  duration = 0.8,
  variant = 'rise',
  className = '',
  as = 'div',
  amount = 0.15,
}) {
  const Component = motion[as] ?? motion.div;
  const origin = ORIGINS[variant];

  return (
    <Component
      className={className}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount }}
      variants={VARIANTS[variant] ?? VARIANTS.rise}
      transition={{ duration, delay, ease: EASE }}
      style={origin ? { transformPerspective: 1200, transformOrigin: origin } : undefined}
    >
      {children}
    </Component>
  );
}

export default Reveal;
