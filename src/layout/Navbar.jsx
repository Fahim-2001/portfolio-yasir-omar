import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, FileText } from 'lucide-react';
import portfolioData from '../data/portfolio';
import { ThemeToggle } from '../components/ThemeToggle';
import { Button } from '../components/Button';

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Achievements', href: '#achievements' },
  { label: 'Education', href: '#education' },
  { label: 'Contact', href: '#contact' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const mobileMenuRef = useRef(null);
  const menuButtonRef = useRef(null);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Monitor scroll for border styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // IntersectionObserver to highlight active section
  useEffect(() => {
    const sectionIds = NAV_LINKS.map((link) => link.href.substring(1));
    const observers = [];

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0,
    });

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        observer.observe(el);
        observers.push(el);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  // Keyboard trap and Escape listener for mobile drawer
  useEffect(() => {
    if (!mobileMenuOpen) return;

    // Shift focus into drawer
    const timer = setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        menuButtonRef.current?.focus();
      }

      if (e.key === 'Tab' && mobileMenuRef.current) {
        const focusableElements = mobileMenuRef.current.querySelectorAll(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      clearTimeout(timer);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          scrolled
            ? 'bg-bg/85 backdrop-blur-md border-b border-border shadow-xs'
            : 'bg-bg/40 backdrop-blur-xs border-b border-transparent'
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 md:px-8 h-18 flex items-center justify-between">
          {/* Brand / Wordmark */}
          <a
            href="#"
            className="group flex items-center gap-2 text-lg font-bold tracking-tight text-text focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-text rounded px-1"
            aria-label={`${portfolioData.profile.shortName} Portfolio Home`}
          >
            <span>{portfolioData.profile.shortName}</span>
            <span className="font-mono text-xs text-text-muted font-normal group-hover:text-text transition-colors">
              {'</>'}
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-6" aria-label="Main Navigation">
            <ul className="flex items-center gap-3.5 lg:gap-5 xl:gap-6 text-xs lg:text-sm">
              {NAV_LINKS.map((link) => {
                const isActive = activeSection === link.href.substring(1);
                return (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className={`transition-colors py-1 relative focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-text rounded ${
                        isActive
                          ? 'text-text font-semibold'
                          : 'text-text-muted hover:text-text'
                      }`}
                    >
                      {link.label}
                      {isActive && (
                        <motion.span
                          layoutId="activeNavIndicator"
                          className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-text"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                    </a>
                  </li>
                );
              })}
            </ul>

            <div className="flex items-center gap-3 pl-3 border-l border-border">
              <Button
                variant="outline"
                size="sm"
                href={portfolioData.profile.resumeUrl}
                external
                download
                className="font-mono"
              >
                <FileText className="w-3.5 h-3.5" />
                Resume
              </Button>
              <ThemeToggle />
            </div>
          </nav>

          {/* Mobile Controls */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg border border-border text-text hover:bg-surface focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-text"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation-menu"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Slide-in Drawer via Portal into body to bypass backdrop-filter containing block */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {mobileMenuOpen && (
              <div className="fixed inset-0 z-50 md:hidden">
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    menuButtonRef.current?.focus();
                  }}
                  className="fixed inset-0 bg-black/60 backdrop-blur-xs"
                  aria-hidden="true"
                />

                {/* Menu Panel */}
                <motion.div
                  ref={mobileMenuRef}
                  id="mobile-navigation-menu"
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  className="fixed right-0 top-0 bottom-0 w-full max-w-xs bg-bg border-l border-border p-6 flex flex-col justify-between shadow-2xl overflow-y-auto"
                  role="dialog"
                  aria-modal="true"
                  aria-label="Mobile Navigation Menu"
                >
                  {/* Top Header inside Drawer */}
                  <div className="flex items-center justify-between pb-6 border-b border-border">
                    <span className="font-bold text-text text-base flex items-center gap-2">
                      {portfolioData.profile.shortName}
                      <span className="font-mono text-xs text-text-muted">{'</>'}</span>
                    </span>
                    <button
                      ref={closeButtonRef}
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        menuButtonRef.current?.focus();
                      }}
                      className="p-2 rounded-lg border border-border text-text hover:bg-surface focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-text"
                      aria-label="Close menu"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <nav aria-label="Mobile Navigation" className="my-auto py-6">
                    <ul className="flex flex-col gap-3 text-base">
                      {NAV_LINKS.map((link) => {
                        const isActive = activeSection === link.href.substring(1);
                        return (
                          <li key={link.href}>
                            <a
                              href={link.href}
                              onClick={handleNavClick}
                              className={`block py-3 px-4 rounded-xl border transition-all ${
                                isActive
                                  ? 'border-text bg-surface text-text font-semibold'
                                  : 'border-border bg-surface/50 text-text-muted hover:text-text hover:bg-surface'
                              }`}
                            >
                              {link.label}
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  </nav>

                  <div className="pt-6 border-t border-border flex flex-col gap-3">
                    <Button
                      variant="primary"
                      size="md"
                      href={portfolioData.profile.resumeUrl}
                      external
                      download
                      className="w-full font-mono justify-center"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Resume (PDF)
                    </Button>
                    <span className="font-mono text-xs text-text-muted text-center">
                      // {portfolioData.profile.name}
                    </span>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}

export default Navbar;
