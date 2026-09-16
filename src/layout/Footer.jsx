import React from 'react';
import { ArrowUp } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa6';
import portfolioData from '../data/portfolio';

const SOCIAL_ICONS = {
  GitHub: FaGithub,
  LinkedIn: FaLinkedin,
};

export function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer className="border-t border-border bg-bg py-12 md:py-16 transition-colors">
      <div className="max-w-6xl mx-auto px-6 md:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Profile Info */}
        <div className="flex flex-col items-center md:items-start gap-1 text-center md:text-left">
          <span className="font-semibold text-text text-sm">
            {portfolioData.profile.name}
          </span>
          <span className="font-mono text-xs text-text-muted">
            © {currentYear} · Designed with passion
          </span>
        </div>

        {/* Back to top */}
        <div>
          <button
            type="button"
            onClick={scrollToTop}
            className="group inline-flex items-center gap-1.5 font-mono text-xs text-text-muted hover:text-text focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-text rounded px-2 py-1 transition-colors cursor-pointer"
            aria-label="Back to top of page"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
