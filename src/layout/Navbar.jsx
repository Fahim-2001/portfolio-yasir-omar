import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, FileText } from 'lucide-react';
import portfolioData from '../data/portfolio';
import { ThemeToggle } from '../components/ThemeToggle';
import { Button } from '../components/Button';
import { NAV_LINKS } from './navLinks';
import { useActiveSection } from '../hooks/useActiveSection';

function Wordmark({ className = '' }) {
  return (
    <span className={`flex items-center gap-2 text-lg font-black tracking-[-0.03em] text-text ${className}`}>
      <span>{portfolioData.profile.shortName}</span>
      <span className="font-mono text-xs font-normal tracking-normal text-text-muted transition-colors group-hover:text-text">
        {'</>'}
      </span>
    </span>
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const activeSection = useActiveSection();
  const mobileMenuRef = useRef(null);
  const menuButtonRef = useRef(null);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Raise the dock once the page scrolls; tuck it away while scrolling down past
  // 16px and bring it back on the way up.
  useEffect(() => {
    let lastY = window.scrollY;
    const handleScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 16);
      if (y < 16) setHidden(false);
      else if (Math.abs(y - lastY) > 4) setHidden(y > lastY);
      else return; // ignore jitter; keep lastY as the reference point
      lastY = y;
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Focus trap and Escape for the mobile drawer
  useEffect(() => {
    if (!mobileMenuOpen) return undefined;

    const timer = setTimeout(() => closeButtonRef.current?.focus(), 50);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        menuButtonRef.current?.focus();
      }

      if (e.key === 'Tab' && mobileMenuRef.current) {
        const focusable = mobileMenuRef.current.querySelectorAll(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          last.focus();
          e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === last) {
          first.focus();
          e.preventDefault();
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

  const closeMenu = (restoreFocus = true) => {
    setMobileMenuOpen(false);
    if (restoreFocus) menuButtonRef.current?.focus();
  };

  return (
    <>
      {/* Keyboard focus inside the dock always brings it back */}
      <header
        className={`sticky top-0 z-40 w-full px-3 pb-1 pt-3 transition-transform duration-500 ease-[var(--ease-out-expo)] has-[:focus-visible]:translate-y-0 sm:px-4 ${
          hidden && !mobileMenuOpen ? '-translate-y-[calc(100%+8px)]' : 'translate-y-0'
        }`}
      >
        <div
          className={`nav-dock mx-auto flex h-14 max-w-6xl items-center justify-between rounded-2xl pl-4 pr-2 sm:pl-5 ${
            scrolled ? 'nav-dock--raised' : ''
          }`}
        >
          <a href="#" className="group rounded-md px-1" aria-label={`${portfolioData.profile.shortName} Portfolio Home`}>
            <Wordmark />
          </a>

          {/* Desktop navigation */}
          <nav className="hidden items-center gap-3 lg:flex" aria-label="Main Navigation">
            <ul className="flex items-center gap-0.5 text-sm">
              {NAV_LINKS.map((link) => {
                const isActive = activeSection === link.href.slice(1);
                return (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      aria-current={isActive ? 'true' : undefined}
                      className={`relative isolate block rounded-lg px-2.5 py-1.5 transition-colors xl:px-3 ${
                        isActive ? 'font-semibold text-text' : 'text-text-muted hover:text-text'
                      }`}
                    >
                      {link.label}
                      {isActive && (
                        <motion.span
                          layoutId="nav-active"
                          aria-hidden="true"
                          className="absolute inset-0 -z-10 rounded-lg border border-border bg-bg shadow-[0_2px_0_0_var(--border)]"
                          transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                        />
                      )}
                    </a>
                  </li>
                );
              })}
            </ul>

            <div className="flex items-center gap-2 border-l border-border pl-3">
              <Button
                variant="outline"
                size="sm"
                href={portfolioData.profile.resumeUrl}
                external
                download
                className="font-mono"
              >
                <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                Resume
              </Button>
              <ThemeToggle />
            </div>
          </nav>

          {/* Compact controls */}
          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle />
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="key key--outline key--icon"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation-menu"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </header>

      {/* Drawer is portaled to <body> so the dock's backdrop-filter can't trap it */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {mobileMenuOpen && (
              <div className="fixed inset-0 z-50 lg:hidden">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => closeMenu()}
                  className="fixed inset-0 bg-black/60 backdrop-blur-xs"
                  aria-hidden="true"
                />

                <motion.div
                  ref={mobileMenuRef}
                  id="mobile-navigation-menu"
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="fixed bottom-0 right-0 top-0 flex w-full max-w-xs flex-col justify-between overflow-y-auto border-l border-border bg-bg p-6"
                  role="dialog"
                  aria-modal="true"
                  aria-label="Mobile Navigation Menu"
                >
                  <div className="flex items-center justify-between border-b border-border pb-6">
                    <Wordmark className="text-base" />
                    <button
                      ref={closeButtonRef}
                      type="button"
                      onClick={() => closeMenu()}
                      className="key key--outline key--icon"
                      aria-label="Close menu"
                    >
                      <X className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>

                  <nav aria-label="Mobile Navigation" className="my-auto py-6">
                    <ul className="flex flex-col gap-2.5">
                      {NAV_LINKS.map((link, i) => {
                        const isActive = activeSection === link.href.slice(1);
                        return (
                          <motion.li
                            key={link.href}
                            initial={{ opacity: 0, x: 24 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.05 + i * 0.035, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                          >
                            <a
                              href={link.href}
                              onClick={() => closeMenu(false)}
                              aria-current={isActive ? 'true' : undefined}
                              className={`flex items-center justify-between rounded-xl border px-4 py-3 text-base transition-colors ${
                                isActive
                                  ? 'border-text bg-surface font-semibold text-text shadow-[0_3px_0_0_var(--text)]'
                                  : 'border-border bg-bg text-text-muted shadow-[0_3px_0_0_var(--border)] hover:text-text'
                              }`}
                            >
                              <span>{link.label}</span>
                              <span aria-hidden="true" className="font-mono text-[11px] text-text-muted">
                                z-{String(i + 1).padStart(2, '0')}
                              </span>
                            </a>
                          </motion.li>
                        );
                      })}
                    </ul>
                  </nav>

                  <div className="flex flex-col gap-4 border-t border-border pt-6">
                    <Button
                      variant="primary"
                      size="md"
                      href={portfolioData.profile.resumeUrl}
                      external
                      download
                      className="w-full font-mono"
                    >
                      <FileText className="h-4 w-4" aria-hidden="true" />
                      Resume (PDF)
                    </Button>
                    <span className="text-center font-mono text-xs text-text-muted">
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
