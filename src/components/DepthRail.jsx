import React from 'react';
import { motion, useScroll } from 'motion/react';
import { NAV_LINKS } from '../layout/navLinks';
import { useActiveSection } from '../hooks/useActiveSection';

/**
 * Z-depth rail: a fixed section index on wide screens that doubles as scroll
 * progress. Each tick is labelled with the section's depth (z-01 … z-07).
 */
export function DepthRail() {
  const active = useActiveSection();
  const { scrollYProgress } = useScroll();

  return (
    <nav
      aria-label="Section index"
      className="fixed right-6 top-1/2 z-30 hidden -translate-y-1/2 min-[1400px]:block"
    >
      <div className="relative">
        <div aria-hidden="true" className="absolute bottom-1 right-[3px] top-1 w-px bg-border">
          <motion.div className="absolute inset-0 origin-top bg-text" style={{ scaleY: scrollYProgress }} />
        </div>

        <ul className="relative flex flex-col gap-3">
          {NAV_LINKS.map((link, i) => {
            const id = link.href.slice(1);
            const isActive = active === id;
            return (
              <li key={id}>
                <a
                  href={link.href}
                  aria-label={link.label}
                  aria-current={isActive ? 'true' : undefined}
                  className="group flex items-center justify-end gap-2.5 rounded py-0.5 font-mono text-[10px] leading-none"
                >
                  <span
                    className={`text-text transition-all duration-300 ${
                      isActive
                        ? 'translate-x-0 opacity-100'
                        : 'translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'
                    }`}
                  >
                    {link.label}
                  </span>
                  <span className={isActive ? 'font-semibold text-text' : 'text-text-muted'}>
                    z-{String(i + 1).padStart(2, '0')}
                  </span>
                  <span
                    aria-hidden="true"
                    className={`block h-px transition-all duration-300 ${
                      isActive ? 'w-4 bg-text' : 'w-2 bg-border-strong group-hover:w-3'
                    }`}
                  />
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

export default DepthRail;
