/**
 * @vitest-environment node
 */
import { describe, it, expect, vi } from 'vitest';
import {
  getFontSize,
  getFontWeight,
  getFontFamily,
  generateTypographyClasses,
  generateResponsiveTypography,
  createTypographyStyles,
  typographyPresets,
  applyTypographyPreset,
  calculateLineHeight,
  getTextTruncationClasses,
  getContrastTextClasses
} from '../typographyUtils';

describe('Typography Utils', () => {
  describe('getFontSize', () => {
    it('should return font size configuration for valid key', () => {
      const config = getFontSize('base');
      expect(config).toEqual({
        fontSize: '16px',
        lineHeight: '24px'
      });
    });

    it('should return font size configuration for different sizes', () => {
      const lgConfig = getFontSize('lg');
      expect(lgConfig).toEqual({
        fontSize: '18px',
        lineHeight: '28px'
      });

      const xlConfig = getFontSize('xl');
      expect(xlConfig).toEqual({
        fontSize: '20px',
        lineHeight: '28px'
      });
    });

    it('should return base configuration for invalid key', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      const config = getFontSize('invalid');
      expect(config).toEqual({
        fontSize: '16px',
        lineHeight: '24px'
      });
      expect(consoleSpy).toHaveBeenCalledWith("Font size 'invalid' not found, using base");
      
      consoleSpy.mockRestore();
    });

    it('should return base configuration when no key provided', () => {
      const config = getFontSize();
      expect(config).toEqual({
        fontSize: '16px',
        lineHeight: '24px'
      });
    });
  });

  describe('getFontWeight', () => {
    it('should return correct font weight for valid key', () => {
      expect(getFontWeight('normal')).toBe('400');
      expect(getFontWeight('medium')).toBe('500');
      expect(getFontWeight('semibold')).toBe('600');
      expect(getFontWeight('bold')).toBe('700');
    });

    it('should return normal weight for invalid key', () => {
      expect(getFontWeight('invalid')).toBe('400');
    });

    it('should return normal weight when no key provided', () => {
      expect(getFontWeight()).toBe('400');
    });
  });

  describe('getFontFamily', () => {
    it('should return font family string for valid key', () => {
      const fontFamily = getFontFamily('sans');
      expect(fontFamily).toBe('Inter, system-ui, sans-serif');
    });

    it('should return default font family for invalid key', () => {
      const fontFamily = getFontFamily('invalid');
      expect(fontFamily).toBe('Inter, system-ui, sans-serif');
    });

    it('should return default font family when no key provided', () => {
      const fontFamily = getFontFamily();
      expect(fontFamily).toBe('Inter, system-ui, sans-serif');
    });
  });

  describe('generateTypographyClasses', () => {
    it('should generate typography classes for all options', () => {
      const classes = generateTypographyClasses({
        size: 'lg',
        weight: 'medium',
        family: 'sans',
        color: 'primary-600',
        align: 'center',
        transform: 'uppercase',
        decoration: 'underline'
      });
      expect(classes).toBe('text-lg font-medium font-sans text-primary-600 text-center uppercase underline');
    });

    it('should generate classes for partial options', () => {
      const classes = generateTypographyClasses({
        size: 'xl',
        weight: 'bold'
      });
      expect(classes).toBe('text-xl font-bold');
    });

    it('should return empty string for no options', () => {
      const classes = generateTypographyClasses();
      expect(classes).toBe('');
    });

    it('should handle single option', () => {
      const classes = generateTypographyClasses({ size: 'sm' });
      expect(classes).toBe('text-sm');
    });
  });

  describe('generateResponsiveTypography', () => {
    it('should generate responsive text classes', () => {
      const breakpoints = {
        base: 'sm',
        md: 'base',
        lg: 'lg'
      };
      const classes = generateResponsiveTypography(breakpoints, 'text');
      expect(classes).toBe('text-sm md:text-base lg:text-lg');
    });

    it('should generate responsive font classes', () => {
      const breakpoints = {
        base: 'normal',
        lg: 'bold'
      };
      const classes = generateResponsiveTypography(breakpoints, 'font');
      expect(classes).toBe('font-normal lg:font-bold');
    });

    it('should handle single breakpoint', () => {
      const breakpoints = { base: 'lg' };
      const classes = generateResponsiveTypography(breakpoints, 'text');
      expect(classes).toBe('text-lg');
    });
  });

  describe('createTypographyStyles', () => {
    it('should create typography styles for all options', () => {
      const styles = createTypographyStyles({
        size: 'lg',
        weight: 'medium',
        family: 'sans',
        color: '#333',
        align: 'center',
        transform: 'uppercase',
        decoration: 'underline'
      });
      
      expect(styles).toEqual({
        fontSize: '18px',
        lineHeight: '28px',
        fontWeight: '500',
        fontFamily: 'Inter, system-ui, sans-serif',
        color: '#333',
        textAlign: 'center',
        textTransform: 'uppercase',
        textDecoration: 'underline'
      });
    });

    it('should create styles for partial options', () => {
      const styles = createTypographyStyles({
        size: 'base',
        weight: 'bold'
      });
      
      expect(styles).toEqual({
        fontSize: '16px',
        lineHeight: '24px',
        fontWeight: '700'
      });
    });

    it('should return empty object for no options', () => {
      const styles = createTypographyStyles();
      expect(styles).toEqual({});
    });

    it('should handle additional properties', () => {
      const styles = createTypographyStyles({
        letterSpacing: '0.1em',
        wordSpacing: '0.2em'
      });
      
      expect(styles).toEqual({
        letterSpacing: '0.1em',
        wordSpacing: '0.2em'
      });
    });
  });

  describe('typographyPresets', () => {
    it('should have heading presets', () => {
      expect(typographyPresets).toHaveProperty('headings');
      expect(typographyPresets.headings).toHaveProperty('h1');
      expect(typographyPresets.headings).toHaveProperty('h2');
      expect(typographyPresets.headings).toHaveProperty('h3');
      expect(typographyPresets.headings).toHaveProperty('h4');
      expect(typographyPresets.headings).toHaveProperty('h5');
      expect(typographyPresets.headings).toHaveProperty('h6');
    });

    it('should have body text presets', () => {
      expect(typographyPresets).toHaveProperty('body');
      expect(typographyPresets.body).toHaveProperty('large');
      expect(typographyPresets.body).toHaveProperty('normal');
      expect(typographyPresets.body).toHaveProperty('small');
      expect(typographyPresets.body).toHaveProperty('tiny');
    });

    it('should have UI element presets', () => {
      expect(typographyPresets).toHaveProperty('ui');
      expect(typographyPresets.ui).toHaveProperty('button');
      expect(typographyPresets.ui).toHaveProperty('label');
      expect(typographyPresets.ui).toHaveProperty('caption');
    });

    it('should have status presets', () => {
      expect(typographyPresets).toHaveProperty('status');
      expect(typographyPresets.status).toHaveProperty('success');
      expect(typographyPresets.status).toHaveProperty('warning');
      expect(typographyPresets.status).toHaveProperty('error');
      expect(typographyPresets.status).toHaveProperty('info');
    });

    it('should have link presets', () => {
      expect(typographyPresets).toHaveProperty('links');
      expect(typographyPresets.links).toHaveProperty('primary');
      expect(typographyPresets.links).toHaveProperty('secondary');
      expect(typographyPresets.links).toHaveProperty('subtle');
    });
  });

  describe('applyTypographyPreset', () => {
    it('should return correct preset configuration', () => {
      const preset = applyTypographyPreset('headings', 'h1');
      expect(preset).toEqual({
        size: '5xl',
        weight: 'bold',
        color: 'neutral-900'
      });
    });

    it('should return empty object for invalid category', () => {
      const preset = applyTypographyPreset('invalid', 'h1');
      expect(preset).toEqual({});
    });

    it('should return empty object for invalid variant', () => {
      const preset = applyTypographyPreset('headings', 'invalid');
      expect(preset).toEqual({});
    });

    it('should return empty object for missing parameters', () => {
      const preset = applyTypographyPreset();
      expect(preset).toEqual({});
    });
  });

  describe('calculateLineHeight', () => {
    it('should calculate correct line height for small fonts', () => {
      expect(calculateLineHeight('12px')).toBe('1.5');
      expect(calculateLineHeight('14px')).toBe('1.5');
    });

    it('should calculate correct line height for medium fonts', () => {
      expect(calculateLineHeight('16px')).toBe('1.4');
      expect(calculateLineHeight('18px')).toBe('1.4');
    });

    it('should calculate correct line height for large fonts', () => {
      expect(calculateLineHeight('20px')).toBe('1.3');
      expect(calculateLineHeight('24px')).toBe('1.3');
    });

    it('should calculate correct line height for extra large fonts', () => {
      expect(calculateLineHeight('30px')).toBe('1.2');
      expect(calculateLineHeight('48px')).toBe('1.2');
    });
  });

  describe('getTextTruncationClasses', () => {
    it('should return truncate class by default', () => {
      expect(getTextTruncationClasses()).toBe('truncate');
      expect(getTextTruncationClasses('truncate')).toBe('truncate');
    });

    it('should return line-clamp classes for multi-line ellipsis', () => {
      expect(getTextTruncationClasses('ellipsis', 2)).toBe('line-clamp-2');
      expect(getTextTruncationClasses('ellipsis', 3)).toBe('line-clamp-3');
    });

    it('should return clip classes for clip type', () => {
      expect(getTextTruncationClasses('clip')).toBe('text-clip overflow-hidden');
    });

    it('should fallback to truncate for invalid type', () => {
      expect(getTextTruncationClasses('invalid')).toBe('truncate');
    });
  });

  describe('getContrastTextClasses', () => {
    it('should return white text for dark backgrounds', () => {
      expect(getContrastTextClasses('neutral-800')).toBe('text-white');
      expect(getContrastTextClasses('neutral-900')).toBe('text-white');
      expect(getContrastTextClasses('primary-800')).toBe('text-white');
      expect(getContrastTextClasses('success-900')).toBe('text-white');
    });

    it('should return dark text for light backgrounds', () => {
      expect(getContrastTextClasses('neutral-100')).toBe('text-neutral-900');
      expect(getContrastTextClasses('primary-100')).toBe('text-neutral-900');
      expect(getContrastTextClasses('success-200')).toBe('text-neutral-900');
      expect(getContrastTextClasses('white')).toBe('text-neutral-900');
    });

    it('should return dark text for unknown backgrounds', () => {
      expect(getContrastTextClasses('custom-color')).toBe('text-neutral-900');
      expect(getContrastTextClasses('')).toBe('text-neutral-900');
    });
  });
});