import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export function ThemeToggle({ className = '' }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`p-2 rounded-lg border border-border bg-transparent text-text hover:bg-surface focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-text transition-all duration-200 cursor-pointer overflow-hidden relative w-9 h-9 flex items-center justify-center select-none active:scale-95 ${className}`}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={isDark ? 'dark' : 'light'}
          initial={{ y: -8, opacity: 0, rotate: -45, scale: 0.8 }}
          animate={{ y: 0, opacity: 1, rotate: 0, scale: 1 }}
          exit={{ y: 8, opacity: 0, rotate: 45, scale: 0.8 }}
          transition={{ duration: 0.22, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="flex items-center justify-center text-text"
        >
          {isDark ? <Sun className="w-4 h-4 text-current" /> : <Moon className="w-4 h-4 text-current" />}
        </motion.div>
      </AnimatePresence>
    </button>
  );
}

export default ThemeToggle;
