import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useMotionValue, useTransform } from 'motion/react';
import { ArrowUpRight, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  SiJavascript,
  SiPython,
  SiGo,
  SiReact,
  SiNextdotjs,
  SiNodedotjs,
  SiExpress,
  SiFastapi,
  SiGin,
  SiPostgresql,
  SiMysql,
  SiMongodb,
  SiGit,
  SiPostman,
  SiDocker,
  SiPrisma,
  SiJira,
  SiGithubactions,
  SiHostinger,
} from 'react-icons/si';
import { FaAws } from 'react-icons/fa6';
import portfolioData from '../data/portfolio';
import { SectionHeading } from '../components/SectionHeading';
import { Card } from '../components/Card';
import { Button } from '../components/Button';

// Exact brand icon mappings checked against installed packages
const BRAND_ICONS = {
  JavaScript: SiJavascript,
  Python: SiPython,
  Go: SiGo,
  ReactJS: SiReact,
  'Next.js': SiNextdotjs,
  'Node.js': SiNodedotjs,
  'Express.js': SiExpress,
  FastAPI: SiFastapi,
  Gin: SiGin,
  PostgreSQL: SiPostgresql,
  MySQL: SiMysql,
  MongoDB: SiMongodb,
  Git: SiGit,
  Postman: SiPostman,
  Docker: SiDocker,
  Prisma: SiPrisma,
  Jira: SiJira,
  'CI/CD': SiGithubactions,
  'Hostinger Cloud': SiHostinger,
  'AWS Elastic Beanstalk': FaAws,
  'AWS EC2': FaAws,
  'AWS Amplify': FaAws,
  'AWS S3': FaAws,
  'AWS Route53': FaAws,
};

/**
 * Desktop Pinned Card with center-proximity scale and opacity
 */
function PinnedSkillCard({ group, index, total, scrollYProgress, isLastCTA = false }) {
  const targetP = total > 1 ? index / (total - 1) : 0;
  const range = 1 / (total - 1 || 1);
  const pStart = Math.max(0, targetP - range * 0.7);
  const pEnd = Math.min(1, targetP + range * 0.7);

  const opacity = useTransform(
    scrollYProgress,
    [pStart, targetP, pEnd],
    [0.85, 1, 0.85]
  );

  const scale = useTransform(
    scrollYProgress,
    [pStart, targetP, pEnd],
    [0.96, 1, 0.96]
  );

  const panelNumber = String(index + 1).padStart(2, '0');

  if (isLastCTA) {
    return (
      <motion.div
        style={{ opacity, scale }}
        className="w-[82vw] max-w-[500px] shrink-0 will-change-transform"
      >
        <Card
          hover={false}
          className="h-[440px] md:h-[480px] p-8 md:p-10 flex flex-col justify-between border-dashed border-neutral-400 dark:border-neutral-600 bg-surface/90"
        >
          <div>
            <span
              aria-hidden="true"
              className="font-mono text-3xl md:text-4xl font-black text-text/25 block mb-6 select-none"
            >
              06
            </span>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-text mb-4">
              See these in action
            </h3>
            <p className="text-text-muted text-sm sm:text-base leading-relaxed max-w-sm">
              Explore the production systems, analytics dashboards, and cloud workflows built with this technical toolkit.
            </p>
          </div>

          <div className="pt-6 border-t border-border">
            <Button
              variant="primary"
              size="md"
              href="#projects"
              className="w-full sm:w-auto font-mono"
            >
              <span>View Selected Work</span>
              <ArrowUpRight className="w-4 h-4 ml-1 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Button>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      style={{ opacity, scale }}
      className="w-[82vw] max-w-[500px] shrink-0 will-change-transform"
    >
      <Card
        hover={false}
        className="h-[440px] md:h-[480px] p-8 md:p-10 flex flex-col justify-between shadow-sm"
      >
        <div>
          {/* Outlined index number and item count */}
          <div className="flex items-baseline justify-between mb-4">
            <span
              aria-hidden="true"
              className="font-mono text-3xl sm:text-4xl font-black text-text/25 select-none"
            >
              {panelNumber}
            </span>
            <span className="font-mono text-xs text-text-muted uppercase tracking-wider">
              {group.items.length} items
            </span>
          </div>

          {/* Group Name */}
          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-text mb-6">
            {group.group}
          </h3>

          {/* Items as large Tags with Brand Icons */}
          <div className="flex flex-wrap gap-2.5 pt-2">
            {group.items.map((item) => {
              const Icon = BRAND_ICONS[item];
              return (
                <span
                  key={item}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium border border-border bg-bg text-text hover:border-neutral-400 dark:hover:border-neutral-500 transition-colors select-none"
                >
                  {Icon && <Icon className="w-4 h-4 shrink-0 text-current opacity-90" />}
                  <span>{item}</span>
                </span>
              );
            })}
          </div>
        </div>

        <div className="pt-4 border-t border-border/60 flex items-center justify-between">
          <span className="font-mono text-[11px] text-text-muted">
            // {portfolioData.profile.shortName} · Stack
          </span>
          <span className="font-mono text-[11px] text-text-muted">
            {index + 1} of {total - 1}
          </span>
        </div>
      </Card>
    </motion.div>
  );
}

export function Skills() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);

  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 768 : true
  );
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  );
  const [travelDistance, setTravelDistance] = useState(0);
  const [activeMobileIndex, setActiveMobileIndex] = useState(0);
  const [activeCounter, setActiveCounter] = useState(1);

  // Motion values
  const scrollYProgress = useMotionValue(0);
  const x = useTransform(scrollYProgress, (progress) => -progress * travelDistance);
  const hintOpacity = useTransform(scrollYProgress, (progress) => Math.max(0, 1 - progress * 10));

  // Check viewport width and reduced motion
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const desktopQuery = window.matchMedia('(min-width: 768px)');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const updateState = () => {
      setIsDesktop(desktopQuery.matches);
      setPrefersReducedMotion(motionQuery.matches);
    };

    updateState();
    desktopQuery.addEventListener('change', updateState);
    motionQuery.addEventListener('change', updateState);

    return () => {
      desktopQuery.removeEventListener('change', updateState);
      motionQuery.removeEventListener('change', updateState);
    };
  }, []);

  // Compute scroll progress based on element position
  const updateScroll = useCallback(() => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const scrollableDistance = sectionRef.current.offsetHeight - window.innerHeight;
    if (scrollableDistance > 0) {
      const progress = Math.min(1, Math.max(0, -rect.top / scrollableDistance));
      scrollYProgress.set(progress);
      const activeIdx = Math.min(6, Math.max(1, Math.floor(progress * 5.4) + 1));
      setActiveCounter(activeIdx);
    }
  }, [scrollYProgress]);

  // Window scroll & resize listeners for rock-solid 60fps tracking
  useEffect(() => {
    if (!isDesktop || prefersReducedMotion) return;

    updateScroll();

    let rafId = null;
    const onScrollOrResize = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        updateScroll();
        rafId = null;
      });
    };

    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize, { passive: true });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }, [isDesktop, prefersReducedMotion, updateScroll]);

  // Measure travel distance from track width minus viewport width
  useEffect(() => {
    if (!isDesktop || prefersReducedMotion) return;

    const measure = () => {
      if (!trackRef.current) return;
      const trackWidth = trackRef.current.scrollWidth;
      const windowWidth = window.innerWidth;
      // Distance so last card aligns flush with right padding
      const distance = Math.max(0, trackWidth - windowWidth + 96);
      setTravelDistance(distance);
      updateScroll();
    };

    measure();

    const resizeObserver = new ResizeObserver(measure);
    if (trackRef.current) {
      resizeObserver.observe(trackRef.current);
    }
    window.addEventListener('resize', measure);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [isDesktop, prefersReducedMotion, updateScroll]);

  // Handle wheel for horizontal trackpad gestures (deltaX) or shift+wheel
  const handleWheel = (e) => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 2) {
      window.scrollBy({ top: e.deltaX, behavior: 'auto' });
    }
  };

  // Programmatic scroll to a specific panel (0..5)
  const scrollToPanel = (targetIndex) => {
    if (!sectionRef.current || !travelDistance) return;
    const clampedIndex = Math.min(5, Math.max(0, targetIndex));
    const fraction = clampedIndex / 5;
    const skillsTop = sectionRef.current.offsetTop;
    const targetScroll = skillsTop + fraction * travelDistance;
    window.scrollTo({ top: targetScroll, behavior: 'smooth' });
  };

  // Handle native mobile scroll dot indicators
  const handleMobileScroll = (e) => {
    const el = e.currentTarget;
    const itemWidth = el.scrollWidth / 6;
    const current = Math.round(el.scrollLeft / itemWidth);
    setActiveMobileIndex(Math.min(5, Math.max(0, current)));
  };

  const skillGroups = portfolioData.skills;
  const totalPanels = skillGroups.length + 1; // 5 groups + 1 CTA panel

  // 1. Mobile or Reduced Motion: Native Horizontal Snap Container
  if (!isDesktop || prefersReducedMotion) {
    return (
      <section id="skills" className="py-16 md:py-24 w-full relative overflow-x-clip">
        <div className="max-w-6xl mx-auto px-6 md:px-8 mb-8 flex items-end justify-between border-b border-border pb-6">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-text-muted block mb-2">
              04 / Skills
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-text">
              Tech Stack
            </h2>
          </div>
          <span className="font-mono text-xs text-text-muted flex items-center gap-1">
            swipe <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>

        {/* Native Snap Container */}
        <div
          tabIndex={0}
          role="region"
          aria-label="Skills horizontal scroll"
          onScroll={handleMobileScroll}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory px-6 pb-6 pt-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-text scrollbar-none"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {skillGroups.map((group, index) => {
            const panelNumber = String(index + 1).padStart(2, '0');
            return (
              <div
                key={group.group}
                className="w-[82vw] max-w-[360px] shrink-0 snap-center"
              >
                <Card className="min-h-[400px] p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-baseline justify-between mb-4">
                      <span
                        aria-hidden="true"
                        className="font-mono text-3xl font-black text-text/25"
                      >
                        {panelNumber}
                      </span>
                      <span className="font-mono text-xs text-text-muted">
                        {group.items.length} items
                      </span>
                    </div>

                    <h3 className="text-2xl font-bold tracking-tight text-text mb-5">
                      {group.group}
                    </h3>

                    <div className="flex flex-wrap gap-2 pt-2">
                      {group.items.map((item) => {
                        const Icon = BRAND_ICONS[item];
                        return (
                          <span
                            key={item}
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium border border-border bg-bg text-text"
                          >
                            {Icon && <Icon className="w-3.5 h-3.5 shrink-0 text-current" />}
                            <span>{item}</span>
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border/60 flex items-center justify-between text-[11px] font-mono text-text-muted">
                    <span>// {portfolioData.profile.shortName}</span>
                    <span>{index + 1} of {skillGroups.length}</span>
                  </div>
                </Card>
              </div>
            );
          })}

          {/* 6th CTA Panel Mobile */}
          <div className="w-[82vw] max-w-[360px] shrink-0 snap-center">
            <Card className="min-h-[400px] p-6 flex flex-col justify-between border-dashed border-neutral-400 dark:border-neutral-600 bg-surface/90">
              <div>
                <span
                  aria-hidden="true"
                  className="font-mono text-3xl font-black text-text/25 block mb-4"
                >
                  06
                </span>
                <h3 className="text-2xl font-bold tracking-tight text-text mb-3">
                  See these in action
                </h3>
                <p className="text-text-muted text-sm leading-relaxed mb-6">
                  Explore the production systems and workflows built with this technical stack.
                </p>
              </div>

              <div className="pt-4 border-t border-border">
                <Button
                  variant="primary"
                  size="md"
                  href="#projects"
                  className="w-full font-mono justify-center group"
                >
                  <span>View Selected Work</span>
                  <ArrowUpRight className="w-4 h-4 ml-1 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Mobile Dot Indicators */}
        <div className="flex justify-center items-center gap-1.5 pt-4">
          {Array.from({ length: 6 }).map((_, dIdx) => (
            <span
              key={dIdx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                activeMobileIndex === dIdx
                  ? 'w-6 bg-text'
                  : 'w-1.5 bg-neutral-300 dark:bg-neutral-700'
              }`}
            />
          ))}
        </div>
      </section>
    );
  }

  // 2. Desktop Pinned Scroll System
  return (
    <div
      ref={sectionRef}
      id="skills"
      onWheel={handleWheel}
      className="relative overflow-x-clip"
      style={{
        height: travelDistance ? `calc(100vh + ${travelDistance}px)` : '240vh',
      }}
    >
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-between pt-20 pb-8 md:pt-24 md:pb-10">
        {/* Section Header with "scroll →" hint */}
        <div className="max-w-6xl mx-auto px-6 md:px-8 w-full">
          <div className="flex items-end justify-between border-b border-border pb-6 md:pb-8 mb-6 md:mb-8">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-text-muted block mb-2">
                04 / Skills
              </span>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-text">
                Tech Stack
              </h2>
            </div>

            {/* Scroll Hint (clickable to advance) */}
            <motion.button
              type="button"
              onClick={() => scrollToPanel(activeCounter)}
              style={{ opacity: hintOpacity }}
              className="group flex items-center gap-1.5 font-mono text-xs text-text-muted hover:text-text transition-colors pb-1 cursor-pointer select-none"
              title="Next skill group"
            >
              <span>scroll</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </motion.button>
          </div>
        </div>

        {/* Horizontal Track */}
        <div className="w-full overflow-hidden my-auto">
          <motion.div
            ref={trackRef}
            style={{ x }}
            className="flex gap-6 md:gap-8 px-6 md:px-12 w-max items-stretch will-change-transform"
          >
            {skillGroups.map((group, index) => (
              <PinnedSkillCard
                key={group.group}
                group={group}
                index={index}
                total={totalPanels}
                scrollYProgress={scrollYProgress}
              />
            ))}

            {/* Final 6th Panel: See these in action */}
            <PinnedSkillCard
              index={skillGroups.length}
              total={totalPanels}
              scrollYProgress={scrollYProgress}
              isLastCTA={true}
            />
          </motion.div>
        </div>

        {/* Bottom Bar: Progress Line, Active Counter & Controls */}
        <div className="max-w-6xl mx-auto px-6 md:px-8 w-full flex items-center justify-between pt-6 border-t border-border">
          {/* Active Panel Counter & Navigation Controls */}
          <div className="flex items-center gap-4">
            <div className="font-mono text-xs text-text-muted">
              <span className="text-text font-bold">
                {String(activeCounter).padStart(2, '0')}
              </span>{' '}
              / {String(totalPanels).padStart(2, '0')}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => scrollToPanel(activeCounter - 2)}
                disabled={activeCounter <= 1}
                aria-label="Previous skill group"
                className="w-7 h-7 rounded-lg border border-border bg-bg text-text hover:border-text disabled:opacity-30 disabled:pointer-events-none transition-colors flex items-center justify-center cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollToPanel(activeCounter)}
                disabled={activeCounter >= totalPanels}
                aria-label="Next skill group"
                className="w-7 h-7 rounded-lg border border-border bg-bg text-text hover:border-text disabled:opacity-30 disabled:pointer-events-none transition-colors flex items-center justify-center cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Thin Progress Bar */}
          <div className="w-36 md:w-56 h-1 rounded-full bg-border overflow-hidden">
            <motion.div
              className="h-full bg-text rounded-full origin-left"
              style={{ scaleX: scrollYProgress }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Skills;
