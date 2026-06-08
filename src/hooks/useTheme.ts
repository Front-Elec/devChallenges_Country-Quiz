import { useState } from 'react';
import { getTheme, setTheme as saveTheme } from '../utils/storage';

function getInitialTheme(): 'light' | 'dark' {
  const saved = getTheme();
  if (saved) return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(t: 'light' | 'dark') {
  if (t === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

export function useTheme(): {
  theme: 'light' | 'dark';
  toggle: () => void;
} {
  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    const initial = getInitialTheme();
    applyTheme(initial);
    return initial;
  });

  const toggle = () => {
    setThemeState((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      saveTheme(next);
      applyTheme(next);
      return next;
    });
  };

  return { theme, toggle };
}
