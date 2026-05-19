'use client';

import { useState, useEffect } from 'react';

type ThemeMode = 'dark' | 'light';

const DARK_THEME = {
  bg: '#0a0a0f',
  bgSecondary: '#121212',
  text: '#ffffff',
  textSecondary: '#a0a0a0',
  border: 'rgba(255, 255, 255, 0.1)',
  accent: '#f59e0b',
  accentSecondary: '#ea580c',
  card: 'rgba(255, 255, 255, 0.05)',
  cardHover: 'rgba(255, 255, 255, 0.1)',
};

const LIGHT_THEME = {
  bg: '#f8f7f4',
  bgSecondary: '#ffffff',
  text: '#1a1a1a',
  textSecondary: '#666666',
  border: 'rgba(0, 0, 0, 0.1)',
  accent: '#d97706',
  accentSecondary: '#b45309',
  card: 'rgba(0, 0, 0, 0.03)',
  cardHover: 'rgba(0, 0, 0, 0.06)',
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function CustomThemeProvider({ children }: ThemeProviderProps) {
  const [mode, setMode] = useState<ThemeMode>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('theme-mode') as ThemeMode;
    if (stored) {
      setMode(stored);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    localStorage.setItem('theme-mode', mode);
    const root = document.documentElement;
    
    const theme = mode === 'dark' ? DARK_THEME : LIGHT_THEME;
    
    root.style.setProperty('--theme-bg', theme.bg);
    root.style.setProperty('--theme-bg-secondary', theme.bgSecondary);
    root.style.setProperty('--theme-text', theme.text);
    root.style.setProperty('--theme-text-secondary', theme.textSecondary);
    root.style.setProperty('--theme-border', theme.border);
    root.style.setProperty('--theme-accent', theme.accent);
    root.style.setProperty('--theme-accent-secondary', theme.accentSecondary);
    root.style.setProperty('--theme-card', theme.card);
    root.style.setProperty('--theme-card-hover', theme.cardHover);
    
    root.classList.remove('dark', 'light');
    root.classList.add(mode);
  }, [mode, mounted]);

  const toggleTheme = () => {
    setMode(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme, isDark: mode === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  );
}

import { createContext, useContext } from 'react';

interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
  isDark: boolean;
}

export const ThemeContext = createContext<ThemeContextType>({
  mode: 'dark',
  toggleTheme: () => {},
  isDark: true,
});

export function useTheme() {
  return useContext(ThemeContext);
}