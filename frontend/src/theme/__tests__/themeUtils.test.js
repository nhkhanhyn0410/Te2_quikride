/**
 * @vitest-environment node
 */
import { describe, it, expect, vi } from 'vitest';
import {
  getColor,
  getSpacing,
  getTypography,
  getShadow,
  getBorderRadius,
  generateCSSVariables,
  createBreakpoints
} from '../themeUtils';
import { defaultTheme } from '../themeConfig';

describe('Theme Utils', () => {
  describe('getColor', () => {
    it('should return correct color value', () => {
      expect(getColor('primary', 500)).toBe('#0ea5e9');
      expect(getColor('success', 500)).toBe('#22c55e');
      expect(getColor('error', 500)).toBe('#ef4444');
    });

    it('should return color with default shade when shade not specified', () => {
      expect(getColor('primary')).toBe('#0ea5e9');
    });

    it('should handle invalid color gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      const result = getColor('invalid');
      expect(result).toBe('#6b7280'); // neutral fallback
      expect(consoleSpy).toHaveBeenCalledWith("Color 'invalid' not found in theme");
      
      consoleSpy.mockRestore();
    });

    it('should handle invalid shade gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      const result = getColor('primary', 999);
      expect(result).toBe('#0ea5e9'); // fallback to 500
      expect(consoleSpy).toHaveBeenCalledWith("Shade '999' not found for color 'primary'");
      
      consoleSpy.mockRestore();
    });

    it('should handle errors gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      const result = getColor('primary', 500, null);
      expect(result).toBe('#6b7280'); // fallback color
      expect(consoleSpy).toHaveBeenCalledWith('Error getting color:', expect.any(TypeError));
      
      consoleSpy.mockRestore();
    });
  });

  describe('getSpacing', () => {
    it('should return correct spacing value', () => {
      expect(getSpacing(4)).toBe('16px');
      expect(getSpacing(8)).toBe('32px');
      expect(getSpacing(0)).toBe('0px');
    });

    it('should handle string input', () => {
      expect(getSpacing('4')).toBe('16px');
    });

    it('should handle invalid spacing gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      const result = getSpacing(999);
      expect(result).toBe('16px'); // fallback spacing
      expect(consoleSpy).toHaveBeenCalledWith("Spacing '999' not found in theme");
      
      consoleSpy.mockRestore();
    });

    it('should handle errors gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      const result = getSpacing(4, null);
      expect(result).toBe('16px'); // fallback spacing
      expect(consoleSpy).toHaveBeenCalledWith('Error getting spacing:', expect.any(TypeError));
      
      consoleSpy.mockRestore();
    });
  });

  describe('getTypography', () => {
    it('should return correct typography value', () => {
      const fontSize = getTypography('fontSize', 'base');
      expect(fontSize).toEqual(['16px', { lineHeight: '24px' }]);
    });

    it('should handle invalid property gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      const result = getTypography('invalid', 'base');
      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith("Typography property 'invalid' not found in theme");
      
      consoleSpy.mockRestore();
    });

    it('should handle invalid size gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      const result = getTypography('fontSize', 'invalid');
      expect(result).toEqual(['16px', { lineHeight: '24px' }]); // fallback to base
      expect(consoleSpy).toHaveBeenCalledWith("Typography size 'invalid' not found for property 'fontSize'");
      
      consoleSpy.mockRestore();
    });

    it('should handle errors gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      const result = getTypography('fontSize', 'base', null);
      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith('Error getting typography:', expect.any(TypeError));
      
      consoleSpy.mockRestore();
    });
  });

  describe('getShadow', () => {
    it('should return correct shadow value', () => {
      expect(getShadow('base')).toBe('0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)');
      expect(getShadow('sm')).toBe('0 1px 2px 0 rgb(0 0 0 / 0.05)');
    });

    it('should use base as default', () => {
      expect(getShadow()).toBe('0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)');
    });

    it('should handle invalid shadow gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      const result = getShadow('invalid');
      expect(result).toBe('0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)'); // fallback to base
      expect(consoleSpy).toHaveBeenCalledWith("Shadow 'invalid' not found in theme");
      
      consoleSpy.mockRestore();
    });

    it('should handle errors gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      const result = getShadow('base', null);
      expect(result).toBe('0 1px 3px 0 rgb(0 0 0 / 0.1)'); // fallback shadow
      expect(consoleSpy).toHaveBeenCalledWith('Error getting shadow:', expect.any(TypeError));
      
      consoleSpy.mockRestore();
    });
  });

  describe('getBorderRadius', () => {
    it('should return correct border radius value', () => {
      expect(getBorderRadius('base')).toBe('4px');
      expect(getBorderRadius('lg')).toBe('8px');
      expect(getBorderRadius('full')).toBe('9999px');
    });

    it('should use base as default', () => {
      expect(getBorderRadius()).toBe('4px');
    });

    it('should handle invalid radius gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      const result = getBorderRadius('invalid');
      expect(result).toBe('4px'); // fallback to base
      expect(consoleSpy).toHaveBeenCalledWith("Border radius 'invalid' not found in theme");
      
      consoleSpy.mockRestore();
    });

    it('should handle errors gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      const result = getBorderRadius('base', null);
      expect(result).toBe('4px'); // fallback radius
      expect(consoleSpy).toHaveBeenCalledWith('Error getting border radius:', expect.any(TypeError));
      
      consoleSpy.mockRestore();
    });
  });

  describe('generateCSSVariables', () => {
    it('should generate CSS variables for colors', () => {
      const cssVars = generateCSSVariables();
      
      expect(cssVars).toHaveProperty('--color-primary-500', '#0ea5e9');
      expect(cssVars).toHaveProperty('--color-success-500', '#22c55e');
      expect(cssVars).toHaveProperty('--color-error-500', '#ef4444');
    });

    it('should generate CSS variables for spacing', () => {
      const cssVars = generateCSSVariables();
      
      expect(cssVars).toHaveProperty('--spacing-4', '16px');
      expect(cssVars).toHaveProperty('--spacing-8', '32px');
    });

    it('should generate CSS variables for typography', () => {
      const cssVars = generateCSSVariables();
      
      expect(cssVars).toHaveProperty('--font-size-base', '16px');
      expect(cssVars).toHaveProperty('--font-size-lg', '18px');
    });

    it('should generate CSS variables for shadows', () => {
      const cssVars = generateCSSVariables();
      
      expect(cssVars).toHaveProperty('--shadow-base');
      expect(cssVars).toHaveProperty('--shadow-sm');
    });

    it('should generate CSS variables for border radius', () => {
      const cssVars = generateCSSVariables();
      
      expect(cssVars).toHaveProperty('--border-radius-base', '4px');
      expect(cssVars).toHaveProperty('--border-radius-lg', '8px');
    });

    it('should handle errors gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      const result = generateCSSVariables(null);
      expect(result).toEqual({});
      expect(consoleSpy).toHaveBeenCalledWith('Error generating CSS variables:', expect.any(TypeError));
      
      consoleSpy.mockRestore();
    });
  });

  describe('createBreakpoints', () => {
    it('should create breakpoint utilities', () => {
      const breakpoints = createBreakpoints();
      
      expect(breakpoints).toHaveProperty('mobile');
      expect(breakpoints).toHaveProperty('tablet');
      expect(breakpoints).toHaveProperty('desktop');
      expect(breakpoints).toHaveProperty('wide');
      expect(breakpoints).toHaveProperty('between');
    });

    it('should generate correct media queries', () => {
      const breakpoints = createBreakpoints();
      
      expect(breakpoints.mobile).toBe('@media (max-width: 768px)');
      expect(breakpoints.tablet).toBe('@media (max-width: 1024px)');
      expect(breakpoints.desktop).toBe('@media (min-width: 1024px)');
      expect(breakpoints.wide).toBe('@media (min-width: 1536px)');
    });

    it('should create between utility function', () => {
      const breakpoints = createBreakpoints();
      
      expect(typeof breakpoints.between).toBe('function');
      expect(breakpoints.between('mobile', 'tablet')).toBe(
        '@media (min-width: 768px) and (max-width: 1024px)'
      );
    });
  });
});