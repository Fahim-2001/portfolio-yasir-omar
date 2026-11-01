import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useMotionValueEvent, useScroll, useTransform } from 'motion/react';
import { ArrowUpRight, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import portfolioData from '../data/portfolio';
import { SectionHeading } from '../components/SectionHeading';
import { Button } from '../components/Button';
import { BRAND_ICONS } from '../components/brandIcons';
import { useMediaQuery, usePrefersReducedMotion } from '../hooks/useMediaQuery';

const pad2 = (n) => String(n).padStart(2, '0');

/* ── Face content ─────────────────────────────────────────────────────────── */

function GroupFace({ group, index, count, compact = false }) {
  return (
    <div
      className={`flex h-full flex-col justify-between rounded-[1.25rem] border border-border bg-surface ${
        compact ? 'p-6' : 'p-7 xl:p-8'
      }`}
    >
      <div>
        <div className="mb-5 flex items-baseline justify-between">
          <span
            aria-hidden="true"
            data-text={pad2(index + 1)}
            className="section-index section-index--sm ghost-text text-4xl"
          />
          <span className="font-mono text-xs uppercase tracking-wider text-text-muted">
            {group.items.length} items
          </span>
        </div>

        <h3 className={`mb-6 font-black tracking-[-0.03em] text-text ${compact ? 'text-2xl' : 'text-3xl'}`}>
          {group.group}
        </h3>

        <ul className="flex flex-wrap gap-2.5">
          {group.items.map((item) => {
            const Icon = BRAND_ICONS[item];
            return (
              <li key={item} className={`tag ${compact ? '' : 'tag--lg'} text-text`}>
                {Icon && <Icon aria-hidden="true" className="h-4 w-4 shrink-0" />}
                <span>{item}</span>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-border pt-4 font-mono text-[11px] text-text-muted">
        <span>// {portfolioData.profile.shortName} · Stack</span>
        <span>
          {index + 1} of {count}
        </span>
      </div>
    </div>
  );
}

function CtaFace({ index, description, compact = false }) {
  return (
    <div
      className={`flex h-full flex-col justify-between rounded-[1.25rem] border border-dashed border-border-strong bg-surface ${
        compact ? 'p-6' : 'p-7 xl:p-8'
      }`}
    >
      <div>
        <span
          aria-hidden="true"
          data-text={pad2(index + 1)}
          className="section-index section-index--sm ghost-text mb-6 text-4xl"
        />
        <h3 className={`mb-4 font-black tracking-[-0.03em] text-text ${compact ? 'text-2xl' : 'text-3xl xl:text-4xl'}`}>
          See these in action
        </h3>
        <p className="max-w-sm text-sm leading-relaxed text-text-muted sm:text-base">{description}</p>
      </div>

      <div className="border-t border-border pt-6">
        <Button variant="primary" size="md" href="#projects" className="font-mono">
          <span>View Selected Work</span>
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}

/* ── Desktop: scroll-driven hexagonal prism ───────────────────────────────── */

// Holds on each face, then turns: progress → fractional face position
function dwell(progress, steps) {
  const raw = Math.min(Math.max(progress, 0), 1) * steps;
  const i = Math.min(Math.floor(raw), steps);
  const f = raw - i;
  const t = Math.min(Math.max((f - 0.18) / 0.64, 0), 1);
  return Math.min(i + t * t * (3 - 2 * t), steps);
}

function useFaceSize() {
  const [size, setSize] = useState({ width: 440, height: 450 });

  useEffect(() => {
    const measure = () => {
      const width = Math.round(Math.min(470, Math.max(330, window.innerWidth * 0.33)));
      const height = Math.round(Math.min(470, Math.max(390, window.innerHeight * 0.54)));
      setSize((s) => (s.width === width && s.height === height ? s : { width, height }));
    };
    measure();
    window.addEventListener('resize', measure, { passive: true });
    return () => window.removeEventListener('resize', measure);
  }, []);

  return size;
}

function PrismFace({ index, step, radius, angle, onFocus, children }) {
  // Faces fade as they turn away from the viewer
  const opacity = useTransform(angle, (a) => {
    const rel = Math.abs(((((index * step + a) % 360) + 540) % 360) - 180);
    return Math.max(0.12, 1 - (rel / step) * 0.5);
  });

  return (
    <motion.div
      className="prism-face"
      style={{ opacity, transform: `rotateY(${index * step}deg) translateZ(${radius}px)` }}
      onFocusCapture={onFocus}
    >
      {children}
    </motion.div>
  );
}

function PrismCap({ faces, width, height, radius, bottom = false }) {
  const R = width / (2 * Math.sin(Math.PI / faces)); // circumradius
  const step = (Math.PI * 2) / faces;
  const flip = bottom ? -1 : 1;
  const ring = (scale) =>
    Array.from({ length: faces }, (_, i) => {
      const a = (i + 0.5) * step;
      return `${(R * scale * Math.sin(a)).toFixed(1)},${(flip * R * scale * Math.cos(a)).toFixed(1)}`;
    }).join(' ');

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-1/2"
      style={{
        width: R * 2,
        height: R * 2,
        marginLeft: -R,
        marginTop: -R,
        transform: `rotateX(${bottom ? -90 : 90}deg) translateZ(${height / 2}px)`,
      }}
    >
      <svg viewBox={`${-R} ${-R} ${R * 2} ${R * 2}`} className="h-full w-full overflow-visible">
        <polygon points={ring(1)} style={{ fill: 'var(--surface)', stroke: 'var(--border-strong)' }} />
        <polygon points={ring(0.78)} style={{ fill: 'none', stroke: 'var(--border)' }} strokeDasharray="4 6" />
        <circle r={radius * 0.05} style={{ fill: 'none', stroke: 'var(--border-strong)' }} />
      </svg>
    </div>
  );
}

function SkillsPrism({ groups, ctaText }) {
  const sectionRef = useRef(null);
  const faces = groups.length + 1;
  const steps = faces - 1;
  const step = 360 / faces;
  const { width, height } = useFaceSize();
  const radius = width / 2 / Math.tan(Math.PI / faces);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
  const turn = useTransform(scrollYProgress, (p) => dwell(p, steps));
  const angle = useTransform(turn, (t) => -t * step);
  const theta = useTransform(angle, (a) => `${String(Math.round(Math.abs(a))).padStart(3, '0')}°`);
  const hintOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);

  const [active, setActive] = useState(0);
  useMotionValueEvent(turn, 'change', (t) => {
    const next = Math.round(t);
    setActive((current) => (current === next ? current : next));
  });

  const scrollToFace = useCallback(
    (target) => {
      const el = sectionRef.current;
      if (!el) return;
      const i = Math.min(Math.max(target, 0), steps);
      const travel = el.offsetHeight - window.innerHeight;
      const top = el.getBoundingClientRect().top + window.scrollY + (i / steps) * travel;
      window.scrollTo({ top, behavior: 'smooth' });
    },
    [steps]
  );

  // Horizontal trackpad swipes advance the prism too
  const handleWheel = (event) => {
    if (Math.abs(event.deltaX) > Math.abs(event.deltaY) && Math.abs(event.deltaX) > 2) {
      window.scrollBy({ top: event.deltaX, behavior: 'auto' });
    }
  };

  const faceNodes = [
    ...groups.map((group, i) => <GroupFace key={group.group} group={group} index={i} count={groups.length} />),
    <CtaFace key="cta" index={groups.length} description={ctaText} />,
  ];

  return (
    <section
      ref={sectionRef}
      id="skills"
      onWheel={handleWheel}
      className="relative"
      style={{ height: `${100 + steps * 55}vh` }}
    >
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden pb-8 pt-24">
        <div className="mx-auto w-full max-w-6xl px-8">
          <SectionHeading
            eyebrow="04 / Skills"
            title="Tech Stack"
            compact
            aside={
              <motion.button
                type="button"
                onClick={() => scrollToFace(active + 1)}
                style={{ opacity: hintOpacity }}
                className="group mb-1 flex shrink-0 items-center gap-1.5 rounded font-mono text-xs text-text-muted transition-colors hover:text-text"
                title="Next skill group"
              >
                <span>scroll</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
              </motion.button>
            }
          />
        </div>

        {/* Stage */}
        <div
          className="relative flex flex-1 items-center justify-center"
          style={{ perspective: '1900px', perspectiveOrigin: '50% 30%' }}
        >
          <div aria-hidden="true" className="prism-axis" style={{ height: height + 170 }} />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 ml-3 font-mono text-[11px] text-text-muted"
            style={{ marginTop: -(height / 2 + 82) }}
          >
            y-axis · θ <motion.span className="tabular-nums text-text">{theta}</motion.span>
          </div>

          <motion.div
            className="relative"
            style={{
              width,
              height,
              z: -radius,
              rotateX: -7,
              rotateY: angle,
              transformStyle: 'preserve-3d',
            }}
          >
            <PrismCap faces={faces} width={width} height={height} radius={radius} />
            <PrismCap faces={faces} width={width} height={height} radius={radius} bottom />
            {faceNodes.map((node, i) => (
              <PrismFace
                key={i}
                index={i}
                step={step}
                radius={radius}
                angle={angle}
                onFocus={() => scrollToFace(i)}
              >
                {node}
              </PrismFace>
            ))}
          </motion.div>
        </div>

        {/* Controls */}
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between border-t border-border px-8 pt-6">
          <div className="flex items-center gap-4">
            <div className="font-mono text-xs text-text-muted">
              <span className="font-bold text-text">{pad2(active + 1)}</span> / {pad2(faces)}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollToFace(active - 1)}
                disabled={active <= 0}
                aria-label="Previous skill group"
                className="key key--outline key--icon h-8 w-8 disabled:pointer-events-none disabled:opacity-30"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => scrollToFace(active + 1)}
                disabled={active >= steps}
                aria-label="Next skill group"
                className="key key--outline key--icon h-8 w-8 disabled:pointer-events-none disabled:opacity-30"
              >
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="h-1 w-40 overflow-hidden rounded-full bg-border md:w-56">
            <motion.div className="h-full origin-left rounded-full bg-text" style={{ scaleX: scrollYProgress }} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Touch / reduced motion: snap carousel with a coverflow tilt ───────────── */

function SkillsCarousel({ groups, ctaText }) {
  const trackRef = useRef(null);
  const reduced = usePrefersReducedMotion();
  const [active, setActive] = useState(0);
  const total = groups.length + 1;

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;
    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = track.getBoundingClientRect();
      const center = rect.left + rect.width / 2;
      let best = 0;
      let bestDistance = Infinity;
      Array.from(track.children).forEach((child, i) => {
        const r = child.getBoundingClientRect();
        const d = (r.left + r.width / 2 - center) / rect.width;
        if (Math.abs(d) < bestDistance) {
          bestDistance = Math.abs(d);
          best = i;
        }
        const c = Math.max(-1, Math.min(1, d));
        child.style.transform = reduced
          ? ''
          : `perspective(900px) rotateY(${(-c * 26).toFixed(2)}deg) scale(${(1 - Math.abs(c) * 0.08).toFixed(3)})`;
      });
      setActive(best);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    track.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      track.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [reduced]);

  return (
    <section id="skills" className="relative w-full scroll-mt-20 overflow-x-clip py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-6 md:px-8">
        <SectionHeading
          eyebrow="04 / Skills"
          title="Tech Stack"
          compact
          aside={
            <span className="mb-1 flex shrink-0 items-center gap-1 font-mono text-xs text-text-muted">
              swipe <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
          }
        />
      </div>

      <div
        ref={trackRef}
        tabIndex={0}
        role="region"
        aria-label="Skills horizontal scroll"
        className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-8 pt-6 sm:px-6 md:px-8"
      >
        {groups.map((group, i) => (
          <div key={group.group} className="min-h-[410px] w-[82vw] max-w-[380px] shrink-0 snap-center will-change-transform">
            <GroupFace group={group} index={i} count={groups.length} compact />
          </div>
        ))}
        <div className="min-h-[410px] w-[82vw] max-w-[380px] shrink-0 snap-center will-change-transform">
          <CtaFace index={groups.length} description={ctaText} compact />
        </div>
      </div>

      <div className="flex items-center justify-center gap-1.5 pt-2" aria-hidden="true">
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              active === i ? 'w-6 bg-text' : 'w-1.5 bg-border-strong'
            }`}
          />
        ))}
      </div>
    </section>
  );
}

export function Skills() {
  const desktop = useMediaQuery('(min-width: 1024px)');
  const reduced = usePrefersReducedMotion();
  const groups = portfolioData.skills;

  if (desktop && !reduced) {
    return (
      <SkillsPrism
        groups={groups}
        ctaText="Explore the production systems, analytics dashboards, and cloud workflows built with this technical toolkit."
      />
    );
  }

  return (
    <SkillsCarousel
      groups={groups}
      ctaText="Explore the production systems and workflows built with this technical stack."
    />
  );
}

export default Skills;
