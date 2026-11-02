import React from 'react';
import { motion, useScroll } from 'motion/react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { CursorProvider } from '../context/CursorContext';
import { CustomCursor } from '../components/CustomCursor';
import { DepthRail } from '../components/DepthRail';
import { WorldCanvas } from '../three/WorldCanvas';

export function Layout({ children }) {
  const { scrollYProgress } = useScroll();

  return (
    <CursorProvider>
      {/* The background world, then film grain over it; both sit behind all content */}
      <WorldCanvas />
      <div aria-hidden="true" className="grain" />

      <div className="relative flex min-h-screen flex-col text-text">
        {/* Reading progress */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none fixed left-0 right-0 top-0 z-50 h-[2px] origin-left bg-text"
          style={{ scaleX: scrollYProgress }}
        />
        <CustomCursor />

        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-lg focus:bg-text focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-bg"
        >
          Skip to main content
        </a>

        <Navbar />

        <main id="main-content" className="w-full flex-1 outline-none" tabIndex={-1}>
          {children}
        </main>

        <Footer />
        <DepthRail />
      </div>
    </CursorProvider>
  );
}

export default Layout;
