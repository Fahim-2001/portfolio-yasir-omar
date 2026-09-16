import React from 'react';
import { motion, useScroll } from 'motion/react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { CursorProvider } from '../context/CursorContext';
import { CustomCursor } from '../components/CustomCursor';

export function Layout({ children }) {
  const { scrollYProgress } = useScroll();

  return (
    <CursorProvider>
      <div className="min-h-screen flex flex-col bg-bg text-text transition-colors duration-200">
        {/* Top Reading Progress Bar */}
        <motion.div
          className="fixed top-0 left-0 right-0 h-[2px] bg-neutral-950 dark:bg-white z-50 origin-left pointer-events-none"
          style={{ scaleX: scrollYProgress }}
        />
        <CustomCursor />
        {/* Accessible Skip to content */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-text focus:text-bg focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-text font-medium text-sm transition-all"
        >
          Skip to main content
        </a>

        <Navbar />

        <main id="main-content" className="flex-1 w-full" tabIndex={-1}>
          {children}
        </main>

        <Footer />
      </div>
    </CursorProvider>
  );
}

export default Layout;
