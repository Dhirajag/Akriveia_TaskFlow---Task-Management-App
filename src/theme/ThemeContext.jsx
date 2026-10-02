import React, { createContext, useContext } from 'react';
import { lightColors, darkColors } from '../constants/colors';

const ThemeContext = createContext({
  themeMode: 'light',
  colors: lightColors,
  isDark: false,
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children, themeMode, toggleTheme }) => {
  const isDark = themeMode === 'dark';
  const colors = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ themeMode, colors, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
