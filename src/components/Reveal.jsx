import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'motion/react';

/**
 * Reusable scroll-reveal wrapper with gentle easing and reduced-motion fallback.
 */
export function Reveal({
  children,
  delay = 0,
  duration = 0.5,
  y = 24,
  className = '',
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{
        duration,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default Reveal;
