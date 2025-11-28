import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    // Check localStorage first, default to dark mode on first visit
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      // If no saved theme, default to dark (true)
      // If theme is saved, use it (dark = true, light = false)
      return saved ? saved === 'dark' : true;
    }
    // Default to dark mode
    return true;
  });

  useEffect(() => {
    // Apply theme to document on mount and when theme changes
    if (typeof window !== 'undefined') {
      const root = document.documentElement;
      if (isDark) {
        root.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        root.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    }
  }, [isDark]);

  // Apply theme immediately on mount - ensures dark is default
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const root = document.documentElement;
      const saved = localStorage.getItem('theme');
      // Default to dark mode if no preference is saved
      const shouldBeDark = saved ? saved === 'dark' : true;
      if (shouldBeDark) {
        root.classList.add('dark');
        // Save dark as default if no preference exists
        if (!saved) {
          localStorage.setItem('theme', 'dark');
        }
      } else {
        root.classList.remove('dark');
      }
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

