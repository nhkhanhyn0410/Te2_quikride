import React, { createContext, useContext, useState, useEffect } from 'react';
import { ConfigProvider } from 'antd';
import { defaultTheme } from './themeConfig';

// Theme context
const ThemeContext = createContext({
  theme: defaultTheme,
  setTheme: () => {},
  isDarkMode: false,
  toggleDarkMode: () => {},
});

// Custom hook to use theme
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

/**
 * ThemeProvider component that wraps the entire application
 * Provides theme configuration to all child components
 */
const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(defaultTheme);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load theme preference from localStorage on mount
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('quikride-theme');
      const savedDarkMode = localStorage.getItem('quikride-dark-mode');
      
      if (savedTheme) {
        const parsedTheme = JSON.parse(savedTheme);
        setTheme(parsedTheme);
      }
      
      if (savedDarkMode) {
        setIsDarkMode(JSON.parse(savedDarkMode));
      }
    } catch (error) {
      console.warn('Failed to load theme from localStorage:', error);
      // Fallback to default theme
      setTheme(defaultTheme);
      setIsDarkMode(false);
    }
  }, []);

  // Save theme preference to localStorage when changed
  useEffect(() => {
    try {
      localStorage.setItem('quikride-theme', JSON.stringify(theme));
      localStorage.setItem('quikride-dark-mode', JSON.stringify(isDarkMode));
    } catch (error) {
      console.warn('Failed to save theme to localStorage:', error);
    }
  }, [theme, isDarkMode]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
    // TODO: Implement dark theme configuration when needed
  };

  // Update theme
  const updateTheme = (newTheme) => {
    try {
      setTheme(newTheme);
    } catch (error) {
      console.error('Failed to update theme:', error);
      // Fallback to default theme
      setTheme(defaultTheme);
    }
  };

  // Get current Ant Design theme configuration
  const getAntdTheme = () => {
    try {
      return theme.antd || defaultTheme.antd;
    } catch (error) {
      console.error('Failed to get Ant Design theme:', error);
      return defaultTheme.antd;
    }
  };

  const contextValue = {
    theme,
    setTheme: updateTheme,
    isDarkMode,
    toggleDarkMode,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      <ConfigProvider theme={getAntdTheme()}>
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;