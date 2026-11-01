import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import portfolioData, { isPlaceholder } from '../data/portfolio';
import { Section } from '../components/Section';
import { SectionHeading } from '../components/SectionHeading';
import { Button } from '../components/Button';
import { Tag } from '../components/Tag';
import { Reveal } from '../components/Reveal';
import { useCursor } from '../context/CursorContext';
import { useFinePointer, useMediaQuery, usePrefersReducedMotion } from '../hooks/useMediaQuery';

/** Abstract skeleton of a dashboard (shown only when a project has no image). */
function TradeFlowMockup({ isHovered }) {
  return (
    <div className="flex h-full w-full select-none flex-col justify-between bg-surface p-4 md:p-6">
      <div className="mb-4 grid grid-cols-3 gap-2.5">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex flex-col gap-1.5 rounded-lg border border-border bg-bg p-2.5">
            <div className="h-2 w-8 rounded bg-neutral-200 dark:bg-neutral-700" />
            <div className="h-3.5 w-14 rounded bg-neutral-400 dark:bg-neutral-500" />
          </div>
        ))}
      </div>
      <div className="mb-4 flex flex-1 flex-col justify-between rounded-lg border border-border bg-bg p-3">
        <div className="mb-3 flex items-center justify-between">
          <div className="h-2.5 w-20 rounded bg-neutral-200 dark:bg-neutral-700" />
          <div className="h-2 w-10 rounded bg-neutral-100 dark:bg-neutral-800" />
        </div>
        <div className="flex h-24 items-end justify-between gap-3 border-b border-border px-2 pt-2">
          {[
            ['45%', '55%'],
            ['80%', '92%'],
            ['60%', '72%'],
            ['95%', '100%'],
            ['68%', '80%'],
          ].map(([rest, hover], i) => (
            <div key={i} className="flex h-full flex-1 flex-col items-center justify-end">
              <div
                className="w-full max-w-[28px] rounded-t bg-neutral-700 transition-all duration-500 ease-out dark:bg-neutral-400"
                style={{ height: isHovered ? hover : rest }}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-2 rounded-lg border border-border bg-bg p-3">
        {['w-24', 'w-28', 'w-20'].map((w, i) => (
          <div key={i} className="flex items-center justify-between py-1 opacity-70">
            <div className={`h-2 rounded bg-neutral-200 dark:bg-neutral-700 ${w}`} />
            <div className="h-2 w-14 rounded bg-neutral-100 dark:bg-neutral-800" />
            <div className="h-2 w-10 rounded bg-neutral-200 dark:bg-neutral-700" />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Abstract skeleton of a booking flow (shown only when a project has no image). */
function ZyxarkMockup() {
  return (
    <div className="flex h-full w-full select-none flex-col justify-between bg-surface p-4 md:p-6">
      <div className="mb-4 flex h-9 w-full items-center justify-between rounded-full border border-border bg-bg px-3.5">
        <div className="flex items-center gap-2">
          <div className="h-3.5 w-3.5 rounded-full bg-neutral-400 dark:bg-neutral-500" />
          <div className="h-2.5 w-28 rounded bg-neutral-200 dark:bg-neutral-700" />
        </div>
        <div className="h-5 w-12 rounded-full bg-neutral-200 dark:bg-neutral-700" />
      </div>
      <div className="mb-4 rounded-lg border border-border bg-bg p-3">
        <div className="grid grid-cols-7 gap-1.5">
          {Array.from({ length: 14 }).map((_, i) => (
            <div
              key={i}
              className={`h-4 rounded-xs ${
                i === 4 || i === 5 ? 'bg-neutral-800 dark:bg-neutral-200' : 'bg-neutral-100 dark:bg-neutral-800'
              }`}
            />
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[0, 1].map((i) => (
          <div key={i} className="flex flex-col gap-2 rounded-lg border border-border bg-bg p-2">
            <div className="aspect-[4/3] w-full rounded bg-neutral-200 dark:bg-neutral-700" />
            <div className="h-2 w-3/4 rounded bg-neutral-200 dark:bg-neutral-700" />
            <div className="h-2 w-1/2 rounded bg-neutral-100 dark:bg-neutral-800" />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * The project's screen as an exploded 3D object: it rises off the floor as it
 * scrolls in, angles toward its copy, and on hover squares up to the viewer while
 * its plates and stack chips separate along Z.
 */
function ProjectVisual({ project, index, onHoverChange }) {
  const ref = useRef(null);
  const reduced = usePrefersReducedMotion();
  const fine = useFinePointer();
  const wide = useMediaQuery('(min-width: 1024px)');
  const { setCursor, resetCursor } = useCursor();
  const [exploded, setExploded] = useState(false);

  const hasLiveUrl = !isPlaceholder(project.liveUrl);
  const hasImage = !isPlaceholder(project.image);
  const interactive = fine && !reduced;

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center 60%'] });
  const rise = useTransform(scrollYProgress, [0, 1], [reduced ? 0 : 28, 0]);

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 160, damping: 20 });
  const sy = useSpring(py, { stiffness: 160, damping: 20 });
  const settle = useSpring(0, { stiffness: 120, damping: 20 });

  useEffect(() => {
    settle.set(exploded ? 1 : 0);
  }, [exploded, settle]);

  const yaw = wide && !reduced ? (index % 2 === 0 ? 14 : -14) : 0;
  const rotateY = useTransform([settle, sx], ([s, x]) => yaw * (1 - s) + x * 6);
  const rotateX = useTransform([rise, sy], ([r, y]) => r - y * 4);

  const handleEnter = () => {
    if (!interactive) return;
    setExploded(true);
    onHoverChange(true);
    if (hasLiveUrl) setCursor('view', 'View ↗');
  };

  const handleLeave = () => {
    setExploded(false);
    onHoverChange(false);
    resetCursor();
    px.set(0);
    py.set(0);
  };

  const handleMove = (event) => {
    if (!interactive || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    px.set(((event.clientX - rect.left) / rect.width) * 2 - 1);
    py.set(((event.clientY - rect.top) / rect.height) * 2 - 1);
  };

  const screen = hasImage ? (
    <img
      src={project.image}
      alt={`${project.title} interface screenshot`}
      loading="lazy"
      decoding="async"
      className="h-full w-full object-cover object-top"
    />
  ) : project.title === 'TradeFlow' ? (
    <TradeFlowMockup isHovered={exploded} />
  ) : (
    <ZyxarkMockup />
  );

  return (
    <div
      ref={ref}
      className="project-visual relative"
      data-exploded={exploded ? 'true' : 'false'}
      onPointerEnter={handleEnter}
      onPointerLeave={handleLeave}
      onPointerMove={handleMove}
    >
      <motion.div
        className="relative"
        style={{ rotateX, rotateY, transformPerspective: 1600, transformStyle: 'preserve-3d' }}
      >
        <span aria-hidden="true" className="pv-layer pv-layer--back2" />
        <span aria-hidden="true" className="pv-layer pv-layer--back" />

        <a
          href={hasLiveUrl ? project.liveUrl : undefined}
          target={hasLiveUrl ? '_blank' : undefined}
          rel={hasLiveUrl ? 'noopener noreferrer' : undefined}
          tabIndex={-1}
          aria-hidden="true"
          className="pv-window block overflow-hidden rounded-[1.25rem] border border-border bg-bg shadow-[0_40px_80px_-40px_rgb(var(--shadow-rgb)/0.45)]"
        >
          <div className="flex h-9 items-center justify-between border-b border-border bg-surface-subtle px-4">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full border border-border-strong" />
              <span className="h-2.5 w-2.5 rounded-full border border-border-strong" />
              <span className="h-2.5 w-2.5 rounded-full border border-border-strong" />
            </div>
            <span className="font-mono text-[10px] tracking-tight text-text-muted">
              {project.title.toLowerCase()}.app
            </span>
            <span className="w-8" />
          </div>
          <div className="relative aspect-[16/10] overflow-hidden bg-bg">{screen}</div>
        </a>

        <div aria-hidden="true" className="pv-chips pointer-events-none absolute -bottom-4 right-4 flex flex-wrap justify-end gap-2 sm:right-6">
          {project.stack.slice(0, 3).map((item) => (
            <span key={item} className="tag tag--strong bg-bg">
              {item}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function ProjectRow({ project, index, dimmed, onHoverChange }) {
  const hasLiveUrl = !isPlaceholder(project.liveUrl);
  const isEven = index % 2 === 0;
  const projectNumber = String(index + 1).padStart(2, '0');

  return (
    <article
      className={`grid grid-cols-1 items-center gap-12 transition-opacity duration-500 lg:grid-cols-12 lg:gap-16 ${
        dimmed ? 'opacity-45' : 'opacity-100'
      }`}
    >
      <Reveal variant="depth" className={`lg:col-span-7 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
        <ProjectVisual project={project} index={index} onHoverChange={onHoverChange} />
      </Reveal>

      <Reveal delay={0.1} className={`flex flex-col lg:col-span-5 ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
        <div className="mb-6 flex items-center gap-4">
          <span
            aria-hidden="true"
            data-text={projectNumber}
            className="section-index section-index--sm ghost-text text-5xl"
          />
          <span aria-hidden="true" className="h-px flex-1 bg-border" />
          <Tag strong>{project.role}</Tag>
        </div>

        <h3 className="mb-4 text-[clamp(2.25rem,4.6vw,3.75rem)] font-black leading-[0.95] tracking-[-0.04em] text-text">
          {project.title}
        </h3>

        <p className="mb-6 text-base leading-relaxed text-text-muted">{project.summary}</p>

        <ul className="mb-7 space-y-2.5 text-sm leading-relaxed text-text-muted">
          {project.points.map((point, i) => (
            <li key={i} className="flex items-start gap-3">
              <span aria-hidden="true" className="mt-0.5 shrink-0 select-none font-mono text-xs">
                —
              </span>
              <span>{point}</span>
            </li>
          ))}
        </ul>

        <div className="mb-8 flex flex-wrap gap-2 border-t border-border pt-5">
          {project.stack.map((item) => (
            <Tag key={item}>{item}</Tag>
          ))}
        </div>

        {hasLiveUrl && (
          <div>
            <Button variant="primary" size="md" href={project.liveUrl} external className="font-mono">
              <span>Live Site</span>
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        )}
      </Reveal>
    </article>
  );
}

export function Projects() {
  const [hovered, setHovered] = useState(null);
  const githubUrl = portfolioData.profile.socials.find((s) => s.label === 'GitHub')?.url;

  return (
    <Section id="projects">
      <SectionHeading eyebrow="03 / Projects" title="Selected Work" />

      <div className="space-y-28 lg:space-y-40">
        {portfolioData.projects.map((project, index) => (
          <ProjectRow
            key={project.title}
            project={project}
            index={index}
            dimmed={hovered !== null && hovered !== index}
            onHoverChange={(isHovering) =>
              setHovered((current) => (isHovering ? index : current === index ? null : current))
            }
          />
        ))}
      </div>

      {githubUrl && (
        <Reveal className="mt-24 flex justify-center border-t border-border pt-10">
          <Button variant="outline" size="md" href={githubUrl} external className="font-mono">
            <span>More projects on GitHub</span>
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </Reveal>
      )}
    </Section>
  );
}

export default Projects;
