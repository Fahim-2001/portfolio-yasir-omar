import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, animate } from 'motion/react';
import { SiCodechef, SiCodeforces } from 'react-icons/si';
import { Section } from '../components/Section';
import { SectionHeading } from '../components/SectionHeading';
import { Card } from '../components/Card';
import { Reveal } from '../components/Reveal';
import portfolioData from '../data/portfolio';

// Platform brand icons
const PLATFORM_ICONS = {
  CodeChef: SiCodechef,
  Codeforces: SiCodeforces,
};

/**
 * Animated number counter component
 * Counts up smoothly once visible; renders final number immediately if prefers-reduced-motion
 */
function AnimatedCounter({ value, suffix = '', label }) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);
      const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  useEffect(() => {
    if (!isInView) return;

    if (prefersReducedMotion) {
      setDisplayValue(value);
      return;
    }

    const controls = animate(0, value, {
      duration: 1.5,
      ease: [0.16, 1, 0.3, 1], // smooth cubic-bezier easeOut
      onUpdate: (latest) => {
        setDisplayValue(Math.floor(latest));
      },
    });

    return () => controls.stop();
  }, [isInView, value, prefersReducedMotion]);

  return (
    <div ref={ref} className="flex flex-col">
      <div className="flex items-baseline gap-0.5">
        <span className="font-mono text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-text tabular-nums">
          {displayValue}
        </span>
        <span className="font-mono text-2xl sm:text-3xl lg:text-4xl font-bold text-text-muted">
          {suffix}
        </span>
      </div>
      <span className="font-mono text-xs uppercase tracking-wider text-text-muted mt-2">
        {label}
      </span>
    </div>
  );
}

export function Achievements() {
  const cp = portfolioData.competitiveProgramming;

  // Dynamically derive counter numbers from portfolioData
  const problemsStat = portfolioData.highlights.find((h) =>
    h.label.toLowerCase().includes('problems')
  );
  const contestsStat = portfolioData.highlights.find((h) =>
    h.label.toLowerCase().includes('contests')
  );

  const problemsCount = parseInt(problemsStat?.value || '350', 10);
  const contestsCount = parseInt(contestsStat?.value || '20', 10);

  return (
    <Section id="achievements" className="py-20 md:py-28">
      <Reveal>
        <SectionHeading
          eyebrow="05 / Problem Solving"
          title="Competitive Programming"
          subtitle="Algorithmic problem solving and contest performance"
        />
      </Reveal>

      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Wide Summary Card with Animated Counters */}
        <Reveal delay={0.1}>
          <Card className="p-8 sm:p-10 md:p-12">
            <div className="flex flex-col gap-8 md:gap-10">
              {/* Top row: Editorial summary */}
              <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 border-b border-border pb-6 md:pb-8">
                <span className="font-mono text-xs uppercase tracking-widest text-text-muted">
                  // Track Record
                </span>
                <p className="text-base sm:text-lg text-text leading-relaxed max-w-2xl font-normal">
                  {cp.summary}
                </p>
              </div>

              {/* Bottom row: Two large animated counters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-2">
                <div className="p-6 rounded-xl border border-border/70 bg-bg/50">
                  <AnimatedCounter
                    value={problemsCount}
                    suffix="+"
                    label="Problems Solved"
                  />
                </div>

                <div className="p-6 rounded-xl border border-border/70 bg-bg/50">
                  <AnimatedCounter
                    value={contestsCount}
                    suffix="+"
                    label="Contests Competed"
                  />
                </div>
              </div>
            </div>
          </Card>
        </Reveal>

        {/* Platform Cards (CodeChef, Codeforces) */}
        <Reveal delay={0.2} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {cp.profiles.map((profile) => {
            const Icon = PLATFORM_ICONS[profile.platform];
            const isLink = Boolean(profile.url);

            const CardContent = (
              <Card
                className={`p-6 sm:p-8 flex flex-col justify-between min-h-[190px] transition-all duration-300 ${
                  isLink
                    ? 'group cursor-pointer hover:border-neutral-400 dark:hover:border-neutral-500'
                    : ''
                }`}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl border border-border bg-bg flex items-center justify-center text-text shadow-xs">
                      {Icon ? <Icon className="w-5 h-5 text-current" /> : null}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-text tracking-tight">
                        {profile.platform}
                      </h3>
                      <span className="font-mono text-[11px] text-text-muted">
                        // Platform
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border/60 flex items-baseline justify-between">
                  <span className="font-mono text-xs uppercase tracking-wider text-text-muted">
                    Max Rating
                  </span>
                  <span className="font-mono text-3xl sm:text-4xl font-bold tracking-tight text-text tabular-nums">
                    {profile.maxRating}
                  </span>
                </div>
              </Card>
            );

            if (isLink) {
              return (
                <a
                  key={profile.platform}
                  href={profile.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-text rounded-2xl"
                  aria-label={`${profile.platform} profile, max rating ${profile.maxRating} (opens in a new tab)`}
                >
                  {CardContent}
                </a>
              );
            }

            return <div key={profile.platform}>{CardContent}</div>;
          })}
        </Reveal>
      </div>
    </Section>
  );
}

export default Achievements;
