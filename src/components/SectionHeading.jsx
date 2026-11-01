import React from 'react';
import { motion } from 'motion/react';

const EASE = [0.16, 1, 0.3, 1];

const container = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.08 } },
};

const rule = {
  hidden: { scaleX: 0 },
  shown: { scaleX: 1, transition: { duration: 1.2, ease: EASE } },
};

const standUp = {
  hidden: { opacity: 0, y: 36, rotateX: 55 },
  shown: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.9, ease: EASE } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

const swingIn = {
  hidden: { opacity: 0, x: 40, rotateY: -60 },
  shown: { opacity: 1, x: 0, rotateY: 0, transition: { duration: 1.1, ease: EASE } },
};

/**
 * Section heading drawn like a title block on a technical drawing:
 * an eyebrow rule with a z-index annotation, a large title that stands up out of
 * the page, and the section number as an outlined, extruded numeral.
 */
export function SectionHeading({ eyebrow, title, subtitle, compact = false, aside = null, className = '' }) {
  const index = (eyebrow || '').split('/')[0].trim();

  return (
    <motion.header
      className={`relative ${compact ? 'mb-6 md:mb-8' : 'mb-14 md:mb-20'} ${className}`}
      variants={container}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.4 }}
    >
      <div className="flex items-center gap-4 font-mono text-xs uppercase tracking-[0.2em] text-text-muted">
        <span className="shrink-0">{eyebrow}</span>
        <motion.span aria-hidden="true" variants={rule} className="h-px flex-1 origin-left bg-border" />
        {index && (
          <span aria-hidden="true" className="shrink-0 normal-case tracking-normal">
            z-{index}
          </span>
        )}
      </div>

      <div className={`flex items-end justify-between gap-6 ${compact ? 'mt-4' : 'mt-7'}`}>
        <div className="min-w-0">
          <motion.h2
            variants={standUp}
            style={{ transformPerspective: 900, transformOrigin: '50% 100%' }}
            className={`font-black leading-[0.95] tracking-[-0.04em] text-text ${
              compact ? 'text-[clamp(2rem,4.6vw,3.5rem)]' : 'text-[clamp(2.4rem,6.4vw,5rem)]'
            }`}
          >
            {title}
          </motion.h2>
          {subtitle && (
            <motion.p variants={fadeUp} className="mt-5 max-w-2xl text-base text-text-muted md:text-lg">
              {subtitle}
            </motion.p>
          )}
        </div>

        {aside}

        {!compact && index && (
          <motion.span
            aria-hidden="true"
            variants={swingIn}
            style={{ transformPerspective: 800 }}
            className="section-index ghost-text hidden shrink-0 pb-1 pr-3 text-[clamp(4.5rem,10vw,8.5rem)] sm:block"
            data-text={index}
          />
        )}
      </div>
    </motion.header>
  );
}

export default SectionHeading;
