import React, { useEffect, useRef } from 'react';
import { animate, motion, useInView, useMotionValue, useTransform } from 'motion/react';
import { SiCodechef, SiCodeforces } from 'react-icons/si';
import { Section } from '../components/Section';
import { SectionHeading } from '../components/SectionHeading';
import { Card } from '../components/Card';
import { Reveal } from '../components/Reveal';
import portfolioData from '../data/portfolio';
import { usePrefersReducedMotion } from '../hooks/useMediaQuery';

const PLATFORM_ICONS = {
  CodeChef: SiCodechef,
  Codeforces: SiCodeforces,
};

const MAX_DEPTH = 12;

// Stacked 1px text-shadows: the numeral's extruded body, `depth` pixels deep
function extrusion(depth) {
  const d = Math.round(depth);
  if (d <= 0) return 'none';
  const layers = [];
  for (let i = 1; i < d; i++) layers.push(`${i}px ${i}px 0 var(--extrude)`);
  layers.push(`${d}px ${d}px 0 var(--extrude-edge)`);
  return layers.join(', ');
}

/** Counts up once visible while the numeral extrudes out of the page. */
function ExtrudedCounter({ value, suffix = '', label }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const reduced = usePrefersReducedMotion();
  const count = useMotionValue(0);
  const text = useTransform(count, (v) => Math.round(v).toString());
  const shadow = useTransform(count, (v) => extrusion((v / Math.max(value, 1)) * MAX_DEPTH));

  useEffect(() => {
    if (!inView) return undefined;
    if (reduced) {
      count.set(value);
      return undefined;
    }
    const controls = animate(count, value, { duration: 1.8, ease: [0.16, 1, 0.3, 1] });
    return () => controls.stop();
  }, [inView, reduced, value, count]);

  return (
    <div ref={ref} className="flex flex-col">
      <span className="sr-only">
        {value}
        {suffix} {label}
      </span>
      <div aria-hidden="true" className="flex items-baseline">
        <motion.span
          className="font-mono text-[clamp(4rem,10vw,7.5rem)] font-semibold leading-none tracking-[-0.04em] text-text tabular-nums"
          style={{ textShadow: shadow }}
        >
          {text}
        </motion.span>
        <span className="ml-1 font-mono text-[clamp(2rem,5vw,3.5rem)] font-semibold leading-none text-text-muted">
          {suffix}
        </span>
      </div>
      <span aria-hidden="true" className="mt-5 font-mono text-xs uppercase tracking-[0.2em] text-text-muted">
        {label}
      </span>
    </div>
  );
}

export function Achievements() {
  const cp = portfolioData.competitiveProgramming;

  const problemsStat = portfolioData.highlights.find((h) => h.label.toLowerCase().includes('problems'));
  const contestsStat = portfolioData.highlights.find((h) => h.label.toLowerCase().includes('contests'));
  const problemsCount = parseInt(problemsStat?.value || '350', 10);
  const contestsCount = parseInt(contestsStat?.value || '20', 10);

  return (
    <Section id="achievements">
      <SectionHeading
        eyebrow="05 / Problem Solving"
        title="Competitive Programming"
        subtitle="Algorithmic problem solving and contest performance"
      />

      <div className="mx-auto max-w-5xl space-y-8">
        <Reveal variant="depth">
          <Card layers={2} className="p-7 sm:p-10 md:p-12">
            <div className="flex flex-col justify-between gap-4 border-b border-border pb-8 md:flex-row md:items-baseline">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-text-muted">// Track Record</span>
              <p className="max-w-2xl text-lg leading-relaxed text-text sm:text-xl">{cp.summary}</p>
            </div>

            <div className="grid grid-cols-1 gap-12 pt-10 sm:grid-cols-2 sm:gap-8">
              <ExtrudedCounter value={problemsCount} suffix="+" label="Problems Solved" />
              <ExtrudedCounter value={contestsCount} suffix="+" label="Contests Competed" />
            </div>
          </Card>
        </Reveal>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          {cp.profiles.map((profile, i) => {
            const Icon = PLATFORM_ICONS[profile.platform];
            const isLink = Boolean(profile.url);

            const content = (
              <Card tilt spotlight className="flex min-h-[200px] flex-col justify-between p-6 sm:p-8">
                <div className="mb-8 flex items-center gap-3.5">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-bg text-text shadow-[0_3px_0_0_var(--border)]">
                    {Icon && <Icon className="h-5 w-5" aria-hidden="true" />}
                  </span>
                  <div>
                    <h3 className="text-lg font-bold tracking-tight text-text">{profile.platform}</h3>
                    <span className="font-mono text-[11px] text-text-muted">// Platform</span>
                  </div>
                </div>

                <div className="flex items-baseline justify-between border-t border-border pt-5">
                  <span className="font-mono text-xs uppercase tracking-wider text-text-muted">Max Rating</span>
                  <span className="extrude font-mono text-4xl font-semibold tracking-tight text-text tabular-nums sm:text-5xl">
                    {profile.maxRating}
                  </span>
                </div>
              </Card>
            );

            return (
              <Reveal key={profile.platform} variant="depth" delay={0.08 * (i + 1)}>
                {isLink ? (
                  <a
                    href={profile.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-[1.25rem]"
                    aria-label={`${profile.platform} profile, max rating ${profile.maxRating} (opens in a new tab)`}
                  >
                    {content}
                  </a>
                ) : (
                  content
                )}
              </Reveal>
            );
          })}
        </div>
      </div>
    </Section>
  );
}

export default Achievements;
