import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import portfolioData, { isPlaceholder } from '../data/portfolio';
import { Section } from '../components/Section';
import { SectionHeading } from '../components/SectionHeading';
import { Button } from '../components/Button';
import { Tag } from '../components/Tag';
import { Reveal } from '../components/Reveal';
import { useCursor } from '../context/CursorContext';

/**
 * Abstract skeleton UI mockup for TradeFlow (dashboard, chart bars, table rows)
 * strictly no real text
 */
function TradeFlowMockup({ isHovered }) {
  return (
    <div className="w-full h-full p-4 md:p-6 flex flex-col justify-between select-none bg-surface/80">
      {/* Top 3 Stat summary widgets */}
      <div className="grid grid-cols-3 gap-2.5 mb-4">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="p-2.5 rounded-lg border border-border bg-bg/60 flex flex-col gap-1.5"
          >
            <div className="w-8 h-2 rounded bg-neutral-300 dark:bg-neutral-700" />
            <div className="w-14 h-3.5 rounded bg-neutral-400 dark:bg-neutral-600" />
          </div>
        ))}
      </div>

      {/* Center Chart area with vertical bars */}
      <div className="p-3 rounded-lg border border-border bg-bg/60 mb-4 flex-1 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <div className="w-20 h-2.5 rounded bg-neutral-300 dark:bg-neutral-700" />
          <div className="w-10 h-2 rounded bg-neutral-200 dark:bg-neutral-800" />
        </div>

        {/* 5 Vertical Bar Chart items */}
        <div className="flex items-end justify-between gap-3 h-24 px-2 pt-2 border-b border-border/70">
          {[
            { h: '45%', hoverH: '55%' },
            { h: '80%', hoverH: '92%' },
            { h: '60%', hoverH: '72%' },
            { h: '95%', hoverH: '100%' },
            { h: '68%', hoverH: '80%' },
          ].map((bar, bIdx) => (
            <div
              key={bIdx}
              className="flex-1 flex flex-col items-center h-full justify-end"
            >
              <div
                className="w-full max-w-[28px] rounded-t bg-neutral-700 dark:bg-neutral-300 transition-all duration-500 ease-out"
                style={{
                  height: isHovered ? bar.hoverH : bar.h,
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Table rows with shimmer animation */}
      <div className="p-3 rounded-lg border border-border bg-bg/60 space-y-2">
        {/* Table header */}
        <div className="flex items-center justify-between pb-1.5 border-b border-border/50">
          <div className="w-16 h-2 rounded bg-neutral-400 dark:bg-neutral-600" />
          <div className="w-20 h-2 rounded bg-neutral-300 dark:bg-neutral-700" />
          <div className="w-12 h-2 rounded bg-neutral-300 dark:bg-neutral-700" />
        </div>

        {/* 3 Data Rows */}
        {[
          { w1: 'w-24', w2: 'w-16', w3: 'w-10' },
          { w1: 'w-28', w2: 'w-20', w3: 'w-12' },
          { w1: 'w-20', w2: 'w-14', w3: 'w-8' },
        ].map((row, rIdx) => (
          <div
            key={rIdx}
            className={`flex items-center justify-between py-1 transition-opacity duration-300 ${
              isHovered ? 'opacity-90' : 'opacity-60'
            }`}
          >
            <div className={`h-2 rounded bg-neutral-300 dark:bg-neutral-700 ${row.w1}`} />
            <div className={`h-2 rounded bg-neutral-200 dark:bg-neutral-800 ${row.w2}`} />
            <div className={`h-2 rounded bg-neutral-300 dark:bg-neutral-700 ${row.w3}`} />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Abstract skeleton UI mockup for Zyxark (search bar, listing cards, date picker)
 * strictly no real text
 */
function ZyxarkMockup({ isHovered }) {
  return (
    <div className="w-full h-full p-4 md:p-6 flex flex-col justify-between select-none bg-surface/80">
      {/* Top Search bar */}
      <div className="w-full h-9 rounded-full border border-border bg-bg/80 px-3.5 flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded-full bg-neutral-400 dark:bg-neutral-600" />
          <div className="w-28 h-2.5 rounded bg-neutral-300 dark:bg-neutral-700" />
        </div>
        <div className="w-12 h-5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
      </div>

      {/* Middle Date picker shape */}
      <div className="p-3 rounded-lg border border-border bg-bg/60 mb-4">
        <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-border/50">
          <div className="w-16 h-2 rounded bg-neutral-400 dark:bg-neutral-600" />
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded bg-neutral-300 dark:bg-neutral-700" />
            <div className="w-3 h-3 rounded bg-neutral-300 dark:bg-neutral-700" />
          </div>
        </div>

        {/* 2 rows of abstract date dots */}
        <div className="grid grid-cols-7 gap-1.5 pt-1">
          {Array.from({ length: 14 }).map((_, dIdx) => (
            <div
              key={dIdx}
              className={`h-4 rounded-xs flex items-center justify-center transition-colors duration-300 ${
                dIdx === 4 || dIdx === 5
                  ? 'bg-neutral-800 dark:bg-neutral-200'
                  : 'bg-neutral-200 dark:bg-neutral-800'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Bottom 2 Listing cards */}
      <div className="grid grid-cols-2 gap-3">
        {[0, 1].map((cIdx) => (
          <div
            key={cIdx}
            className="p-2 rounded-lg border border-border bg-bg/60 flex flex-col gap-2"
          >
            {/* Listing image skeleton */}
            <div className="w-full aspect-[4/3] rounded bg-neutral-300 dark:bg-neutral-700 flex items-center justify-center">
              <div className="w-6 h-6 rounded-full border border-neutral-400 dark:border-neutral-600 opacity-40" />
            </div>
            {/* 2 skeleton lines */}
            <div className="w-3/4 h-2 rounded bg-neutral-300 dark:bg-neutral-700" />
            <div className="w-1/2 h-2 rounded bg-neutral-200 dark:bg-neutral-800" />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Single Full-width Feature Card with 3D Tilt, Glare, and Spotlight Border
 */
function ProjectFeatureCard({
  project,
  index,
  isDimmed,
  onHoverStart,
  onHoverEnd,
  isFinePointer,
  prefersReducedMotion,
}) {
  const cardRef = useRef(null);
  const [isCardHovered, setIsCardHovered] = useState(false);
  const { setCursor, resetCursor } = useCursor();

  // Motion values for smooth 3D tilt
  const rawRotateX = useMotionValue(0);
  const rawRotateY = useMotionValue(0);
  const springRotateX = useSpring(rawRotateX, { damping: 25, stiffness: 260 });
  const springRotateY = useSpring(rawRotateY, { damping: 25, stiffness: 260 });

  const hasLiveUrl = !isPlaceholder(project.liveUrl);
  const hasImage = !isPlaceholder(project.image);
  const isEven = index % 2 === 0;
  const projectNumber = String(index + 1).padStart(2, '0');

  // Mouse move handler: updates CSS variables directly (zero re-render) and tilts
  const handlePointerMove = (e) => {
    if (!cardRef.current || !isFinePointer || prefersReducedMotion) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Update CSS variables for spotlight border and glare
    cardRef.current.style.setProperty('--mx', `${x}px`);
    cardRef.current.style.setProperty('--my', `${y}px`);

    // Normalized tilt coords
    const normX = (x / rect.width - 0.5) * 2;
    const normY = (y / rect.height - 0.5) * 2;
    rawRotateY.set(normX * 5.5);
    rawRotateX.set(-normY * 5.5);
  };

  const handlePointerEnter = () => {
    setIsCardHovered(true);
    onHoverStart();
  };

  const handlePointerLeave = () => {
    setIsCardHovered(false);
    onHoverEnd();
    resetCursor();
    rawRotateX.set(0);
    rawRotateY.set(0);
    if (cardRef.current) {
      cardRef.current.style.setProperty('--mx', '-999px');
      cardRef.current.style.setProperty('--my', '-999px');
    }
  };

  const handleVisualEnter = () => {
    if (hasLiveUrl) {
      setCursor('view', 'View ↗');
    }
  };

  const handleVisualLeave = () => {
    resetCursor();
  };

  return (
    <div
      className="relative [perspective:1000px] mb-16 lg:mb-24 last:mb-0"
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      <motion.div
        ref={cardRef}
        style={{
          transformStyle: 'preserve-3d',
          rotateX: isFinePointer && !prefersReducedMotion ? springRotateX : 0,
          rotateY: isFinePointer && !prefersReducedMotion ? springRotateY : 0,
        }}
        initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.05 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`group relative rounded-3xl border border-border bg-surface p-6 sm:p-8 lg:p-10 transition-all duration-300 focus-within:ring-2 focus-within:ring-text focus-within:outline-none ${
          isDimmed ? 'opacity-40' : 'opacity-100'
        }`}
      >
        {/* Spotlight Border (lights up near cursor via CSS variables) */}
        {isFinePointer && (
          <div
            className="pointer-events-none absolute -inset-px rounded-3xl border border-neutral-400 dark:border-neutral-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              maskImage:
                'radial-gradient(280px circle at var(--mx, -999px) var(--my, -999px), black, transparent)',
              WebkitMaskImage:
                'radial-gradient(280px circle at var(--mx, -999px) var(--my, -999px), black, transparent)',
            }}
            aria-hidden="true"
          />
        )}

        {/* Soft Glare Highlight following cursor */}
        {isFinePointer && (
          <div
            className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 overflow-hidden"
            style={{
              background:
                'radial-gradient(550px circle at var(--mx, -999px) var(--my, -999px), rgba(255, 255, 255, 0.07), transparent 45%)',
            }}
            aria-hidden="true"
          />
        )}

        {/* Feature Card Layout: Alternating Visual / Text on Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Visual Area (Browser Window Frame) */}
          <div
            onPointerEnter={handleVisualEnter}
            onPointerLeave={handleVisualLeave}
            className={`w-full ${
              isEven
                ? 'lg:col-span-6 lg:order-1'
                : 'lg:col-span-6 lg:order-2'
            }`}
          >
            <div className="w-full rounded-2xl border border-border bg-bg overflow-hidden shadow-md transition-transform duration-300 group-hover:-translate-y-1">
              {/* Browser Window Title Bar */}
              <div className="h-9 px-4 border-b border-border bg-surface-subtle/80 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                  <div className="w-2.5 h-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                  <div className="w-2.5 h-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                </div>
                <span className="font-mono text-[10px] text-text-muted tracking-tight">
                  {project.title.toLowerCase()}.app
                </span>
                <div className="w-8" />
              </div>

              {/* Mockup Canvas */}
              <div className="relative aspect-[16/10] overflow-hidden bg-bg">
                {hasImage ? (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-fit transition-transform duration-500 group-hover:scale-105"
                  />
                ) : project.title === 'TradeFlow' ? (
                  <div className="w-full h-full transition-transform duration-500 group-hover:scale-105 group-hover:contrast-105">
                    <TradeFlowMockup isHovered={isCardHovered} />
                  </div>
                ) : (
                  <div className="w-full h-full transition-transform duration-500 group-hover:scale-105 group-hover:contrast-105">
                    <ZyxarkMockup isHovered={isCardHovered} />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Text Area */}
          <div
            className={`flex flex-col justify-between ${
              isEven
                ? 'lg:col-span-6 lg:order-2'
                : 'lg:col-span-6 lg:order-1'
            }`}
          >
            {/* Eyebrow: Number + Role */}
            <div className="flex items-center justify-between mb-3">
              <span
                aria-hidden="true"
                className="font-mono text-3xl sm:text-4xl font-black text-text/25 select-none"
              >
                {projectNumber}
              </span>
              <Tag className="font-medium text-text border-text/40">
                {project.role}
              </Tag>
            </div>

            {/* Project Title with Hover Underline draw */}
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-text mb-3 inline-block relative">
              <span className="relative">
                {project.title}
                <span
                  className="absolute left-0 -bottom-1 h-[2px] bg-text w-full scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"
                  aria-hidden="true"
                />
              </span>
            </h3>

            {/* Summary */}
            <p className="text-text-muted text-sm sm:text-base leading-relaxed mb-6">
              {project.summary}
            </p>

            {/* Bullet Points */}
            <ul className="space-y-2 text-text-muted text-xs sm:text-sm leading-relaxed mb-6">
              {project.points.map((pt, ptIdx) => (
                <li key={ptIdx} className="flex items-start">
                  <span
                    className="font-mono text-text-muted mr-2.5 select-none text-xs mt-0.5 shrink-0"
                    aria-hidden="true"
                  >
                    —
                  </span>
                  <span>{pt}</span>
                </li>
              ))}
            </ul>

            {/* Stack Tags with subtle hover lift */}
            <div className="flex flex-wrap gap-2 pt-4 border-t border-border mb-6">
              {project.stack.map((item, tIdx) => (
                <Tag
                  key={item}
                  className="transition-transform duration-200 group-hover:-translate-y-0.5"
                >
                  {item}
                </Tag>
              ))}
            </div>

            {/* Actions: ONLY rendered if liveUrl exists */}
            {hasLiveUrl && (
              <div>
                <Button
                  variant="primary"
                  size="md"
                  href={project.liveUrl}
                  external
                  className="font-mono"
                >
                  <span>Live Site</span>
                  <ArrowUpRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function Projects() {
  const [hoveredProjectIdx, setHoveredProjectIdx] = useState(null);
  const [isFinePointer, setIsFinePointer] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const pointerMedia = window.matchMedia('(pointer: fine)');
      setIsFinePointer(pointerMedia.matches);
      const pointerListener = (e) => setIsFinePointer(e.matches);
      pointerMedia.addEventListener('change', pointerListener);

      const motionMedia = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(motionMedia.matches);
      const motionListener = (e) => setPrefersReducedMotion(e.matches);
      motionMedia.addEventListener('change', motionListener);

      return () => {
        pointerMedia.removeEventListener('change', pointerListener);
        motionMedia.removeEventListener('change', motionListener);
      };
    }
  }, []);

  const githubUrl =
    portfolioData.profile.socials.find((s) => s.label === 'GitHub')?.url || '#';

  return (
    <Section id="projects">
      <Reveal>
        <SectionHeading eyebrow="03 / Projects" title="Selected Work" />
      </Reveal>

      <div className="max-w-6xl mx-auto">
        {portfolioData.projects.map((project, index) => (
          <Reveal key={project.title} delay={index * 0.15}>
            <ProjectFeatureCard
              project={project}
              index={index}
              isDimmed={
                hoveredProjectIdx !== null && hoveredProjectIdx !== index
              }
              onHoverStart={() => setHoveredProjectIdx(index)}
              onHoverEnd={() => setHoveredProjectIdx(null)}
              isFinePointer={isFinePointer}
              prefersReducedMotion={prefersReducedMotion}
            />
          </Reveal>
        ))}

        {/* Short muted note under the section linking to GitHub URL from data */}
        <Reveal delay={0.2} className="mt-16 pt-8 border-t border-border flex justify-center">
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="More projects on GitHub (opens in a new tab)"
            className="group inline-flex items-center gap-1.5 font-mono text-xs sm:text-sm text-text-muted hover:text-text focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-text rounded px-3.5 py-1.5 border border-border bg-surface transition-colors"
          >
            <span>More projects on GitHub</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
          </a>
        </Reveal>
      </div>
    </Section>
  );
}

export default Projects;
