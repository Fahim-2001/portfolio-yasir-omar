import { useState, useEffect, useMemo } from 'react';

export function useTheme() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof document !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    const observer = new MutationObserver(() => {
      setIsDark(root.classList.contains('dark'));
    });

    observer.observe(root, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    const willBeDark = !root.classList.contains('dark');
    if (willBeDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem('theme', willBeDark ? 'dark' : 'light');
    } catch (err) {
      console.warn('Unable to access localStorage for theme:', err);
    }
  };

  // Monochrome palette for the 3D scene (materials, edges, lines and lights).
  const colors = useMemo(() => {
    if (isDark) {
      return {
        plate: '#18181B',
        edge: '#FAFAFA',
        ring: '#71717A',
        ringStrong: '#A1A1AA',
        keycap: '#18181B',
        keycapInk: '#FFFFFF',
        keycapEdge: '#A1A1AA',
        particle: '#A1A1AA',
        gridCell: '#27272A',
        gridSection: '#3F3F46',
        halo: '#FFFFFF',
        haloOpacity: 0.08,
        ambientIntensity: 2.6,
        keyLightIntensity: 2.6,
        fillLightIntensity: 0.9,
      };
    }
    return {
      plate: '#FFFFFF',
      edge: '#0A0A0A',
      ring: '#A1A1AA',
      ringStrong: '#3F3F46',
      keycap: '#FFFFFF',
      keycapInk: '#0A0A0A',
      keycapEdge: '#0A0A0A',
      particle: '#3F3F46',
      gridCell: '#E4E4E7',
      gridSection: '#A1A1AA',
      halo: '#0A0A0A',
      haloOpacity: 0.16,
      ambientIntensity: 1.7,
      keyLightIntensity: 1.7,
      fillLightIntensity: 0.6,
    };
  }, [isDark]);

  return {
    isDark,
    theme: isDark ? 'dark' : 'light',
    toggleTheme,
    colors,
  };
}
