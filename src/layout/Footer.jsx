import React from 'react';
import { ArrowUp } from 'lucide-react';
import portfolioData from '../data/portfolio';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative overflow-hidden border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-5 py-12 sm:flex-row sm:items-center sm:px-6 md:px-8 md:py-14">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-semibold text-text">{portfolioData.profile.name}</span>
          <span className="font-mono text-xs text-text-muted">© {currentYear} · Designed with passion</span>
        </div>

        <button type="button" onClick={scrollToTop} className="key key--outline key--sm font-mono" aria-label="Back to top of page">
          <span>Back to top</span>
          <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>

      {/* Oversized outlined wordmark, cropped by the page edge */}
      <div
        aria-hidden="true"
        data-text={portfolioData.profile.shortName}
        className="ghost-text pointer-events-none -mb-[0.2em] select-none px-3 text-center text-[clamp(6rem,27vw,23rem)] font-black leading-[0.8] tracking-[-0.06em] text-transparent [-webkit-text-stroke:1px_var(--border-strong)]"
      />
    </footer>
  );
}

export default Footer;
