import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'motion/react';
import { ArrowDown, Download, ChevronRight } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa6';
import portfolioData from '../data/portfolio';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { OrbitCanvas } from '../three/OrbitCanvas';
import { useFinePointer, usePrefersReducedMotion } from '../hooks/useMediaQuery';

const SOCIAL_ICONS = { GitHub: FaGithub, LinkedIn: FaLinkedin };
const EASE = [0.16, 1, 0.3, 1];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};

// "Md. Yasir Omar Fahim" + "Fahim" → ["Md. Yasir Omar", "Fahim"]
function splitName(name, shortName) {
  if (shortName && name.endsWith(shortName) && name.length > shortName.length) {
    return [name.slice(0, -shortName.length).trim(), shortName];
  }
  return [null, name];
}

export function Hero() {
  const heroRef = useRef(null);
  const reduced = usePrefersReducedMotion();
  const fine = useFinePointer();
  const { profile, experience, highlights } = portfolioData;
  const [lead, surname] = splitName(profile.name, profile.shortName);

  const currentPosition = experience.find((exp) => exp.end === 'Present');
  const statusLine = currentPosition
    ? `${profile.role} · Currently at ${currentPosition.company}`
    : profile.role;

  // 0 → 1 as the hero scrolls away: drives the stack + surname "explosion"
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    if (reduced) return;
    heroRef.current?.style.setProperty('--explode', value.toFixed(3));
  });

  // Pointer parallax for the layered type and the floating code window
  useEffect(() => {
    const el = heroRef.current;
    if (!el || reduced || !fine) return undefined;

    let frame = 0;
    let nx = 0;
    let ny = 0;
    const apply = () => {
      frame = 0;
      el.style.setProperty('--px', nx.toFixed(3));
      el.style.setProperty('--py', ny.toFixed(3));
    };
    const onMove = (event) => {
      if (event.pointerType === 'touch') return;
      const rect = el.getBoundingClientRect();
      nx = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      ny = ((event.clientY - rect.top) / rect.height) * 2 - 1;
      if (!frame) frame = requestAnimationFrame(apply);
    };
    const onLeave = () => {
      nx = 0;
      ny = 0;
      if (!frame) frame = requestAnimationFrame(apply);
    };

    el.addEventListener('pointermove', onMove, { passive: true });
    el.addEventListener('pointerleave', onLeave, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, [reduced, fine]);

  return (
    <section id="hero" ref={heroRef} className="relative isolate overflow-hidden">
      {/* Drafting-paper dot grid (the background world begins at About) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-dot-grid [mask-image:radial-gradient(ellipse_80%_70%_at_45%_35%,#000_25%,transparent_100%)]"
      />

      <div className="relative">
        <div className="mx-auto max-w-6xl px-5 sm:px-6 md:px-8">
          <div className="grid grid-cols-1 items-center pt-10 sm:pt-14 lg:min-h-[calc(100svh-12rem)] lg:grid-cols-12 lg:py-16">
            <motion.div
              className="relative z-10 lg:col-span-7"
              variants={container}
              initial="hidden"
              animate="visible"
            >
              <motion.p
                variants={item}
                className="mb-7 inline-flex max-w-full items-center gap-2.5 rounded-2xl border border-border bg-bg px-3.5 py-1.5 font-mono text-xs leading-snug text-text-muted shadow-[0_2px_0_0_var(--border)] sm:rounded-full"
              >
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neutral-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-text" />
                </span>
                <span>{statusLine}</span>
              </motion.p>

              <motion.h1 variants={item} className="font-black tracking-[-0.045em] text-text">
                {lead && (
                  <span className="block text-[clamp(2.1rem,5.2vw,4.25rem)] leading-[0.98]">{lead}</span>
                )}
                <span
                  className="exploded-type block pb-[0.06em] text-[clamp(4.5rem,15vw,10.25rem)] leading-[0.86]"
                  data-text={surname}
                >
                  {surname}
                </span>
              </motion.h1>

              <motion.p
                variants={item}
                className="mt-7 max-w-[54ch] text-base leading-relaxed text-text-muted sm:text-lg md:text-xl"
              >
                {profile.tagline}
              </motion.p>

              <motion.div variants={item} className="mt-9 flex flex-wrap items-center gap-3.5 sm:gap-4">
                <Button variant="primary" size="md" href="#projects">
                  View Projects
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </Button>

                <Button
                  variant="outline"
                  size="md"
                  href={profile.resumeUrl}
                  external
                  download
                  className="font-mono"
                >
                  <Download className="h-4 w-4" aria-hidden="true" />
                  Download Resume
                </Button>

                <div className="flex items-center gap-2.5">
                  {profile.socials.map((social) => {
                    const Icon = SOCIAL_ICONS[social.label];
                    if (!Icon) return null;
                    return (
                      <a
                        key={social.label}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${profile.shortName}'s ${social.label} (opens in a new tab)`}
                        className="key key--outline key--icon"
                      >
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </a>
                    );
                  })}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* 3D avatar with orbiting skills */}
        <div className="relative mx-auto mt-4 h-[380px] w-full max-w-2xl sm:h-[460px] lg:absolute lg:inset-y-0 lg:right-0 lg:mt-0 lg:h-auto lg:w-[56%] lg:max-w-none">
          <OrbitCanvas className="h-full w-full" eventSource={heroRef} progress={scrollYProgress} />
        </div>
      </div>

      {/* Highlights */}
      <div className="mx-auto max-w-6xl px-5 pb-10 pt-12 sm:px-6 md:px-8 lg:pt-6">
        <ul className="grid grid-cols-2 gap-x-5 gap-y-7 lg:grid-cols-4 lg:gap-6">
          {highlights.map((highlight, index) => (
            <motion.li
              key={highlight.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.7, delay: index * 0.08, ease: EASE }}
            >
              <Card wrapperClassName="h-full" className="flex h-full flex-col justify-between p-4 sm:p-6">
                <span aria-hidden="true" className="mb-5 font-mono text-[10px] text-text-muted">
                  {String(index + 1).padStart(2, '0')} / {String(highlights.length).padStart(2, '0')}
                </span>
                <div>
                  <div className="extrude font-mono text-3xl font-semibold tracking-tight text-text sm:text-4xl lg:text-5xl">
                    {highlight.value}
                  </div>
                  <div className="mt-3 text-xs font-medium leading-snug text-text-muted sm:text-sm">
                    {highlight.label}
                  </div>
                </div>
              </Card>
            </motion.li>
          ))}
        </ul>

        <div className="mt-12 flex justify-center">
          <a
            href="#about"
            className="flex flex-col items-center gap-2 rounded px-2 py-1 font-mono text-xs text-text-muted transition-colors hover:text-text"
            aria-label="Scroll down to About section"
          >
            <span>scroll</span>
            <motion.span
              animate={reduced ? undefined : { y: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
            >
              <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
            </motion.span>
          </a>
        </div>
      </div>
    </section>
  );
}

export default Hero;
