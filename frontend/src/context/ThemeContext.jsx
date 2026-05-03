import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('cr-theme');
    if (saved) {
      setDark(saved === 'dark');
    }
  }, []);

  const toggleTheme = () => {
    setDark((prev) => {
      localStorage.setItem('cr-theme', !prev ? 'dark' : 'light');
      return !prev;
    });
  };

  return (
    <ThemeContext.Provider value={{ dark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
