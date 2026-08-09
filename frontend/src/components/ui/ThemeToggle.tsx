import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'resumify-theme';

export function getTheme(): Theme {
  if (typeof document !== 'undefined' && document.documentElement.classList.contains('light')) {
    return 'light';
  }
  return 'dark';
}

export function setTheme(theme: Theme) {
  document.documentElement.classList.toggle('light', theme === 'light');
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* storage unavailable — theme still applies for this session */
  }
  // Brief crossfade so the swap never snaps (see html.theme-anim in index.css)
  document.documentElement.classList.add('theme-anim');
  window.setTimeout(() => document.documentElement.classList.remove('theme-anim'), 380);
}

export default function ThemeToggle({ className = '' }: { className?: string }) {
  const [theme, setThemeState] = useState<Theme>(getTheme);
  const isLight = theme === 'light';

  // Follow OS preference changes — but only while the user hasn't chosen explicitly.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: light)');
    const onChange = (e: MediaQueryListEvent) => {
      let stored: string | null = null;
      try { stored = localStorage.getItem(STORAGE_KEY); } catch { /* ignore */ }
      if (stored === 'light' || stored === 'dark') return;
      const next: Theme = e.matches ? 'light' : 'dark';
      setThemeState(next);
      document.documentElement.classList.toggle('light', next === 'light');
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const toggle = () => {
    const next: Theme = isLight ? 'dark' : 'light';
    setThemeState(next);
    setTheme(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
      title={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
      className={`relative p-2 rounded-[var(--radius-inner)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-surface-hover transition-colors cursor-pointer ${className}`}
    >
      <span className="relative block w-4 h-4">
        <Sun
          className={`absolute inset-0 w-4 h-4 transition-all duration-300 ${
            isLight ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'
          }`}
        />
        <Moon
          className={`absolute inset-0 w-4 h-4 transition-all duration-300 ${
            isLight ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'
          }`}
        />
      </span>
    </button>
  );
}
