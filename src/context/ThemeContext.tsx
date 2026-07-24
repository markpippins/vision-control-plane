import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeMode = 'dark' | 'light' | 'steel';

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  uiPort: number;
  setUiPort: (port: number) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  setTheme: () => {},
  uiPort: 4211,
  setUiPort: () => {}
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('vision_ui_theme');
    return (saved as ThemeMode) || 'dark';
  });

  const [uiPort, setUiPortState] = useState<number>(() => {
    const savedPort = localStorage.getItem('vision_ui_port');
    return savedPort ? parseInt(savedPort, 10) : 4211;
  });

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    localStorage.setItem('vision_ui_theme', newTheme);
  };

  const setUiPort = (port: number) => {
    setUiPortState(port);
    localStorage.setItem('vision_ui_port', port.toString());
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, uiPort, setUiPort }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
