import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowDown, Download, ChevronRight } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa6';
import portfolioData from '../data/portfolio';
import { Button } from '../components/Button';
import { TechCoreCanvas } from '../three/TechCoreCanvas';

export function Hero() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const media = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(media.matches);
      const listener = (e) => setPrefersReducedMotion(e.matches);
      media.addEventListener('change', listener);
      return () => media.removeEventListener('change', listener);
    }
  }, []);

  // Dynamically compute current role and company from data file
  const currentPosition = portfolioData.experience.find(
    (exp) => exp.end === 'Present'
  );
  const statusLine = currentPosition
    ? `${portfolioData.profile.role} · Currently at ${currentPosition.company}`
    : `${portfolioData.profile.role}`;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.12,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0 : 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <section
      id="hero"
      className="relative min-h-[calc(100vh-4.5rem)] flex flex-col justify-between overflow-hidden bg-grid-pattern pt-4 pb-16 md:pt-0 md:pb-20"
    >
      {/* Background ambient gradient subtle falloff (monochrome only) */}
      <div
        className="pointer-events-none absolute inset-0 bg-radial from-transparent via-bg/60 to-bg -z-10"
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto px-6 md:px-8 w-full my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Hero Content */}
          <motion.div
            className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left z-10"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Status Line with Pulsing Monochrome Dot */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-border bg-surface text-xs font-mono text-text-muted mb-6 select-none shadow-xs"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neutral-400 dark:bg-neutral-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-text" />
              </span>
              <span>{statusLine}</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              variants={itemVariants}
              className="text-[clamp(2.2rem,6.5vw,4.5rem)] font-black tracking-tighter text-text leading-[1.08] mb-6 max-w-2xl"
            >
              Md. Yasir Omar{' '}
              <span className="block sm:inline text-transparent [-webkit-text-stroke:1.5px_var(--text)] hover:text-text transition-colors duration-300">
                {portfolioData.profile.shortName}
              </span>
            </motion.h1>

            {/* Tagline */}
            <motion.p
              variants={itemVariants}
              className="text-base sm:text-lg md:text-xl text-text-muted leading-relaxed max-w-[60ch] mb-8 font-normal"
            >
              {portfolioData.profile.tagline}
            </motion.p>

            {/* Call to Actions & Social Links */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-8 lg:mb-0"
            >
              <Button variant="primary" size="md" href="#projects">
                View Projects
                <ChevronRight className="w-4 h-4 ml-0.5" />
              </Button>

              <Button
                variant="outline"
                size="md"
                href={portfolioData.profile.resumeUrl}
                external
                download
                className="font-mono"
              >
                <Download className="w-4 h-4 mr-1" />
                Download Resume
              </Button>

              {/* Social Icon Links */}
              <div className="flex items-center gap-2 pl-2">
                {portfolioData.profile.socials.map((social) => {
                  const Icon =
                    social.label === 'GitHub' ? FaGithub : FaLinkedin;
                  return (
                    <a
                      key={social.label}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${portfolioData.profile.shortName}'s ${social.label} (opens in a new tab)`}
                      className="p-2.5 rounded-lg border border-border bg-surface text-text-muted hover:text-text hover:border-text focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-text transition-all duration-200"
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: 3D Visual & Floating Code Window */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
            {/* 3D Canvas Container */}
            <div className="relative w-[280px] h-[280px] sm:w-[340px] sm:h-[340px] lg:w-[480px] lg:h-[480px] xl:w-[520px] xl:h-[520px]">
              <TechCoreCanvas className="w-full h-full" />

              {/* Overlapping Floating Code-Window Card (Desktop Only) */}
              <div
                className="hidden lg:block absolute -bottom-2 -left-8 z-20 w-80 rounded-xl border border-border bg-white dark:bg-neutral-900 p-4 shadow-2xl select-none transition-transform hover:-translate-y-1 duration-300"
                aria-hidden="true"
              >
                {/* Window Title Bar */}
                <div className="flex items-center gap-1.5 pb-3 mb-3 border-b border-border">
                  <div className="w-2.5 h-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                  <div className="w-2.5 h-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                  <div className="w-2.5 h-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                  <span className="ml-2 font-mono text-[10px] text-neutral-500 dark:text-neutral-400 tracking-tight font-medium">
                    engineer.js
                  </span>
                </div>

                {/* Short JS Snippet built strictly from portfolio data */}
                <pre className="font-mono text-xs leading-relaxed text-neutral-900 dark:text-neutral-100">
                  <code>
                    <span className="text-neutral-500 dark:text-neutral-400">const</span>{' '}
                    <span className="font-bold text-neutral-900 dark:text-neutral-100">engineer</span> = {'{'}{'\n'}
                    {'  '}<span className="text-neutral-600 dark:text-neutral-400">name:</span>{' '}
                    <span className="font-semibold text-neutral-950 dark:text-neutral-50">"{portfolioData.profile.shortName}"</span>,{'\n'}
                    {'  '}<span className="text-neutral-600 dark:text-neutral-400">role:</span>{' '}
                    <span className="font-semibold text-neutral-950 dark:text-neutral-50">"{portfolioData.profile.role}"</span>,{'\n'}
                    {'  '}<span className="text-neutral-600 dark:text-neutral-400">stack:</span> [
                    <span className="font-semibold text-neutral-950 dark:text-neutral-50">"{portfolioData.skills[0]?.items[0]}"</span>,{' '}
                    <span className="font-semibold text-neutral-950 dark:text-neutral-50">"{portfolioData.skills[0]?.items[1]}"</span>,{' '}
                    <span className="font-semibold text-neutral-950 dark:text-neutral-50">"{portfolioData.skills[0]?.items[2]}"</span>,{' '}
                    <span className="font-semibold text-neutral-950 dark:text-neutral-50">"{portfolioData.skills[0]?.items[3]}"</span>
                    ]{'\n'}
                    {'}'};
                  </code>
                </pre>
              </div>
            </div>

            {/* Interactive orbit caption (Desktop only) */}
            <p className="hidden lg:block font-mono text-[11px] text-text-muted mt-3 tracking-wider">
              // hover badges to inspect
            </p>
          </div>
        </div>

        {/* Below the Fold: 4 Highlight Stat Cards */}
        <div className="mt-16 md:mt-24 pt-10 border-t border-border">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {portfolioData.highlights.map((item, index) => (
              <div
                key={index}
                className="p-4 sm:p-5 md:p-6 rounded-2xl border border-border bg-surface transition-all duration-300 hover:border-neutral-400 dark:hover:border-neutral-500 hover:-translate-y-0.5"
              >
                <div className="font-mono text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-text mb-1.5">
                  {item.value}
                </div>
                <div className="text-xs sm:text-sm text-text-muted leading-snug font-medium">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Animated Scroll Down Indicator */}
        <div className="flex justify-center mt-12">
          <a
            href="#about"
            className="flex flex-col items-center gap-1.5 font-mono text-xs text-text-muted hover:text-text transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-text rounded px-2 py-1"
            aria-label="Scroll down to About section"
          >
            <span>scroll</span>
            <motion.div
              animate={prefersReducedMotion ? {} : { y: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
            >
              <ArrowDown className="w-3.5 h-3.5" />
            </motion.div>
          </a>
        </div>
      </div>
    </section>
  );
}

export default Hero;
