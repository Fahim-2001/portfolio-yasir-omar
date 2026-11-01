import React, { useRef } from 'react';
import { motion, useScroll } from 'motion/react';
import portfolioData from '../data/portfolio';
import { Section } from '../components/Section';
import { SectionHeading } from '../components/SectionHeading';
import { Card } from '../components/Card';
import { Tag } from '../components/Tag';
import { Reveal } from '../components/Reveal';
import { usePrefersReducedMotion } from '../hooks/useMediaQuery';

function TimelineNode({ current }) {
  if (current) {
    return (
      <span className="relative flex h-4 w-4 items-center justify-center">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neutral-400 opacity-60" />
        <span className="relative inline-flex h-3.5 w-3.5 rounded-full border-2 border-bg bg-text ring-1 ring-text" />
      </span>
    );
  }
  return <span className="relative inline-flex h-3.5 w-3.5 rounded-full border-2 border-border-strong bg-bg" />;
}

export function Experience() {
  const listRef = useRef(null);
  const reduced = usePrefersReducedMotion();
  // The rail fills as the timeline scrolls through the viewport
  const { scrollYProgress } = useScroll({ target: listRef, offset: ['start 75%', 'end 55%'] });

  return (
    <Section id="experience">
      <SectionHeading eyebrow="02 / Experience" title="Where I've Worked" />

      <ol ref={listRef} className="relative mx-auto max-w-5xl">
        {/* Rail */}
        <div
          aria-hidden="true"
          className="absolute bottom-8 left-[7.5px] top-10 w-px bg-border md:left-[calc(11rem+2rem+7.5px)]"
        >
          <motion.div
            className="absolute inset-0 origin-top bg-text"
            style={{ scaleY: reduced ? 1 : scrollYProgress }}
          />
          {!reduced && <span className="rail-pulse" />}
        </div>

        {portfolioData.experience.map((item, index) => {
          const isCurrent = item.end === 'Present';
          return (
            <li
              key={`${item.company}-${item.start}`}
              className="relative grid grid-cols-[1rem_minmax(0,1fr)] gap-x-5 pb-14 last:pb-0 md:grid-cols-[11rem_1rem_minmax(0,1fr)] md:gap-x-8 md:pb-20"
            >
              {/* Dates (desktop) */}
              <div className="hidden pt-7 text-right md:block">
                <span className="block font-mono text-sm font-semibold text-text">{item.start}</span>
                <span className="mt-1 block font-mono text-xs text-text-muted">— {item.end}</span>
                {isCurrent && (
                  <Tag strong className="mt-4">
                    Current
                  </Tag>
                )}
              </div>

              {/* Node */}
              <div className="relative flex justify-center pt-8">
                <TimelineNode current={isCurrent} />
              </div>

              {/* Plate */}
              <Reveal variant="swing" delay={index * 0.1}>
                <Card tilt maxTilt={3} layers={isCurrent ? 2 : 1} className="space-y-6 p-6 md:p-8">
                  <div className="flex items-center justify-between gap-2 border-b border-border pb-3 md:hidden">
                    <span className="font-mono text-xs text-text-muted">
                      {item.start} — {item.end}
                    </span>
                    {isCurrent && <Tag strong>Current</Tag>}
                  </div>

                  <div>
                    <div className="mb-3 flex flex-col justify-between gap-1 sm:flex-row sm:items-baseline">
                      <h3 className="text-xl font-bold tracking-[-0.02em] text-text md:text-2xl">{item.role}</h3>
                      <span className="text-base font-medium text-text-muted md:text-lg">{item.company}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-1">
                      <Tag>{item.type}</Tag>
                      {item.location && <Tag>{item.location}</Tag>}
                    </div>
                  </div>

                  <ul className="space-y-3 text-sm leading-relaxed text-text-muted md:text-[15px]">
                    {item.points.map((point, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-3">
                        <span aria-hidden="true" className="mt-0.5 shrink-0 select-none font-mono text-xs text-text-muted">
                          —
                        </span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-2 border-t border-border pt-5">
                    {item.tech.map((tech) => (
                      <Tag key={tech}>{tech}</Tag>
                    ))}
                  </div>
                </Card>
              </Reveal>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}

export default Experience;
