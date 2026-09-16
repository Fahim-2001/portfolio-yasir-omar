import React from 'react';
import portfolioData from '../data/portfolio';
import { Section } from '../components/Section';
import { SectionHeading } from '../components/SectionHeading';
import { Card } from '../components/Card';
import { Tag } from '../components/Tag';
import { Reveal } from '../components/Reveal';

export function Experience() {
  return (
    <Section id="experience">
      <Reveal>
        <SectionHeading eyebrow="02 / Experience" title="Where I've Worked" />
      </Reveal>

      <div className="relative max-w-5xl mx-auto">
        {portfolioData.experience.map((item, index) => {
          const isCurrent = item.end === 'Present';
          const isLast = index === portfolioData.experience.length - 1;

          return (
            <div
              key={index}
              className="relative flex gap-4 md:gap-8 pb-12 md:pb-16 last:pb-0"
            >
              {/* Desktop Date Column (left of timeline) */}
              <div className="hidden md:block w-36 lg:w-44 pt-7 text-right shrink-0">
                <span className="font-mono text-xs text-text-muted block">
                  {item.start} — {item.end}
                </span>
                {isCurrent && (
                  <span className="inline-block mt-1.5 font-mono text-[10px] uppercase tracking-wider text-text font-semibold bg-surface border border-border px-2 py-0.5 rounded-full">
                    Current
                  </span>
                )}
              </div>

              {/* Vertical Timeline Rail & Node */}
              <div className="relative flex flex-col items-center shrink-0">
                {/* Thin vertical connector line */}
                {!isLast && (
                  <div
                    className="absolute top-8 -bottom-8 md:-bottom-12 w-[1px] bg-border"
                    aria-hidden="true"
                  />
                )}

                {/* Node: Filled black with soft pulse for Current role, Hollow for Past roles */}
                <div className="pt-7 relative z-10">
                  {isCurrent ? (
                    <span className="relative flex h-3.5 w-3.5 items-center justify-center">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neutral-400 dark:bg-neutral-500 opacity-70" />
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-text ring-4 ring-bg" />
                    </span>
                  ) : (
                    <span className="relative inline-flex rounded-full h-3 w-3 border-2 border-neutral-400 dark:border-neutral-500 bg-bg ring-4 ring-bg" />
                  )}
                </div>
              </div>

              {/* Experience Card */}
              <Reveal delay={index * 0.12} className="flex-1 min-w-0">
                <Card className="p-6 md:p-8 space-y-6">
                  {/* Mobile Date display (placed above role title on mobile) */}
                  <div className="flex md:hidden items-center justify-between gap-2 pb-1 border-b border-border/50">
                    <span className="font-mono text-xs text-text-muted">
                      {item.start} — {item.end}
                    </span>
                    {isCurrent && (
                      <span className="font-mono text-[10px] uppercase tracking-wider text-text font-semibold bg-surface border border-border px-2 py-0.5 rounded-full">
                        Current
                      </span>
                    )}
                  </div>

                  {/* Header: Role, Company, Type and Location Tags */}
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-2">
                      <h3 className="text-xl md:text-2xl font-bold tracking-tight text-text">
                        {item.role}
                      </h3>
                      <span className="text-base md:text-lg font-medium text-text-muted">
                        {item.company}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                      <Tag>{item.type}</Tag>
                      {item.location && <Tag>{item.location}</Tag>}
                    </div>
                  </div>

                  {/* Bullet Points with custom thin dash markers */}
                  <ul className="space-y-2.5 text-text-muted text-sm leading-relaxed">
                    {item.points.map((point, pIdx) => (
                      <li key={pIdx} className="flex items-start">
                        <span
                          className="font-mono text-text-muted mr-3 select-none text-xs mt-0.5 shrink-0"
                          aria-hidden="true"
                        >
                          —
                        </span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Tech Stack Chips */}
                  <div className="pt-4 border-t border-border flex flex-wrap gap-2">
                    {item.tech.map((t) => (
                      <Tag key={t}>{t}</Tag>
                    ))}
                  </div>
                </Card>
              </Reveal>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

export default Experience;
