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

  const colors = useMemo(() => {
    if (isDark) {
      return {
        core: '#18181B',
        edges: '#FAFAFA',
        ringsAndLines: '#A1A1AA',
        packetsAndPoints: '#FFFFFF',
        ambient: '#FFFFFF',
        ambientIntensity: 0.4,
        keyLight: '#FFFFFF',
        keyLightIntensity: 2.0,
        rimLight: '#FFFFFF',
        rimLightIntensity: 1.2,
      };
    }
    return {
      core: '#0A0A0A',
      edges: '#A1A1AA',
      ringsAndLines: '#3F3F46',
      packetsAndPoints: '#18181B',
      ambient: '#FFFFFF',
      ambientIntensity: 0.6,
      keyLight: '#FFFFFF',
      keyLightIntensity: 1.5,
      rimLight: '#FFFFFF',
      rimLightIntensity: 0.8,
    };
  }, [isDark]);

  return {
    isDark,
    theme: isDark ? 'dark' : 'light',
    toggleTheme,
    colors,
  };
}
