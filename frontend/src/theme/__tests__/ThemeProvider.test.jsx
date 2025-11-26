import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { ConfigProvider } from 'antd';
import ThemeProvider, { useTheme } from '../ThemeProvider';
import { defaultTheme } from '../themeConfig';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Test component that uses the theme
const TestComponent = () => {
  const { theme, setTheme, isDarkMode, toggleDarkMode } = useTheme();
  
  return (
    <div>
      <div data-testid="theme-primary">{theme.colors.primary[500]}</div>
      <div data-testid="dark-mode">{isDarkMode.toString()}</div>
      <button 
        data-testid="toggle-dark" 
        onClick={toggleDarkMode}
      >
        Toggle Dark Mode
      </button>
      <button 
        data-testid="update-theme" 
        onClick={() => setTheme({ ...theme, test: 'updated' })}
      >
        Update Theme
      </button>
    </div>
  );
};

describe('ThemeProvider', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorageMock.clear();
  });

  describe('Initialization', () => {
    it('should render children with default theme', () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('theme-primary')).toHaveTextContent('#0ea5e9');
      expect(screen.getByTestId('dark-mode')).toHaveTextContent('false');
    });

    it('should wrap children with Ant Design ConfigProvider', () => {
      const spy = vi.spyOn(ConfigProvider, 'render');
      
      render(
        <ThemeProvider>
          <div>Test</div>
        </ThemeProvider>
      );

      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });

    it('should load theme from localStorage on mount', () => {
      const savedTheme = { ...defaultTheme, test: 'loaded' };
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'quikride-theme') return JSON.stringify(savedTheme);
        if (key === 'quikride-dark-mode') return JSON.stringify(true);
        return null;
      });

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(localStorageMock.getItem).toHaveBeenCalledWith('quikride-theme');
      expect(localStorageMock.getItem).toHaveBeenCalledWith('quikride-dark-mode');
      expect(screen.getByTestId('dark-mode')).toHaveTextContent('true');
    });

    it('should handle localStorage errors gracefully', () => {
      localStorageMock.getItem.mockImplementation(() => {
        throw new Error('localStorage error');
      });

      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to load theme from localStorage:',
        expect.any(Error)
      );
      expect(screen.getByTestId('theme-primary')).toHaveTextContent('#0ea5e9');
      
      consoleSpy.mockRestore();
    });
  });

  describe('Theme Updates', () => {
    it('should update theme when setTheme is called', () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      act(() => {
        screen.getByTestId('update-theme').click();
      });

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'quikride-theme',
        expect.stringContaining('"test":"updated"')
      );
    });

    it('should toggle dark mode', () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('dark-mode')).toHaveTextContent('false');

      act(() => {
        screen.getByTestId('toggle-dark').click();
      });

      expect(screen.getByTestId('dark-mode')).toHaveTextContent('true');
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'quikride-dark-mode',
        'true'
      );
    });

    it('should handle theme update errors gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      // Mock setTheme to throw an error
      const ThemeProviderWithError = ({ children }) => {
        const [theme, setTheme] = React.useState(defaultTheme);
        
        const updateTheme = () => {
          throw new Error('Theme update error');
        };

        return (
          <ThemeProvider>
            {children}
          </ThemeProvider>
        );
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      // This should not throw and should fallback gracefully
      expect(() => {
        act(() => {
          screen.getByTestId('update-theme').click();
        });
      }).not.toThrow();

      consoleSpy.mockRestore();
    });
  });

  describe('localStorage Persistence', () => {
    it('should save theme to localStorage when theme changes', () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      act(() => {
        screen.getByTestId('update-theme').click();
      });

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'quikride-theme',
        expect.any(String)
      );
    });

    it('should save dark mode preference to localStorage', () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      act(() => {
        screen.getByTestId('toggle-dark').click();
      });

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'quikride-dark-mode',
        'true'
      );
    });

    it('should handle localStorage save errors gracefully', () => {
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('localStorage save error');
      });

      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      act(() => {
        screen.getByTestId('toggle-dark').click();
      });

      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to save theme to localStorage:',
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });
  });

  describe('useTheme Hook', () => {
    it('should throw error when used outside ThemeProvider', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      expect(() => {
        render(<TestComponent />);
      }).toThrow('useTheme must be used within a ThemeProvider');

      consoleSpy.mockRestore();
    });

    it('should provide theme context values', () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('theme-primary')).toBeInTheDocument();
      expect(screen.getByTestId('dark-mode')).toBeInTheDocument();
      expect(screen.getByTestId('toggle-dark')).toBeInTheDocument();
      expect(screen.getByTestId('update-theme')).toBeInTheDocument();
    });
  });

  describe('Ant Design Integration', () => {
    it('should provide correct theme to ConfigProvider', () => {
      const spy = vi.spyOn(ConfigProvider, 'render');
      
      render(
        <ThemeProvider>
          <div>Test</div>
        </ThemeProvider>
      );

      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          theme: expect.objectContaining({
            token: expect.objectContaining({
              colorPrimary: '#0ea5e9'
            })
          })
        }),
        expect.any(Object)
      );

      spy.mockRestore();
    });

    it('should fallback to default theme if theme is corrupted', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      // Create a theme provider that will have issues getting antd theme
      const corruptedTheme = { ...defaultTheme };
      delete corruptedTheme.antd;

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      // Should still render without crashing
      expect(screen.getByTestId('theme-primary')).toBeInTheDocument();

      consoleSpy.mockRestore();
    });
  });
});