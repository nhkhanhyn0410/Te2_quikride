/**
 * @vitest-environment node
 */
import { describe, it, expect } from 'vitest';
import { 
  defaultTheme, 
  antdTheme, 
  colorPalette, 
  typography, 
  spacing, 
  shadows, 
  borderRadius 
} from '../themeConfig';

describe('Theme Configuration', () => {
  describe('Color Palette', () => {
    it('should have all required color categories', () => {
      expect(colorPalette).toHaveProperty('primary');
      expect(colorPalette).toHaveProperty('success');
      expect(colorPalette).toHaveProperty('warning');
      expect(colorPalette).toHaveProperty('error');
      expect(colorPalette).toHaveProperty('neutral');
    });

    it('should have complete color shades for each category', () => {
      const expectedShades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
      
      Object.values(colorPalette).forEach(palette => {
        expectedShades.forEach(shade => {
          expect(palette).toHaveProperty(shade.toString());
          expect(typeof palette[shade]).toBe('string');
          expect(palette[shade]).toMatch(/^#[0-9a-fA-F]{6}$/);
        });
      });
    });

    it('should have valid base colors (500 shade)', () => {
      expect(colorPalette.primary[500]).toBe('#0ea5e9');
      expect(colorPalette.success[500]).toBe('#22c55e');
      expect(colorPalette.warning[500]).toBe('#f59e0b');
      expect(colorPalette.error[500]).toBe('#ef4444');
      expect(colorPalette.neutral[500]).toBe('#6b7280');
    });
  });

  describe('Typography', () => {
    it('should have font family configuration', () => {
      expect(typography).toHaveProperty('fontFamily');
      expect(typography.fontFamily).toHaveProperty('sans');
      expect(Array.isArray(typography.fontFamily.sans)).toBe(true);
      expect(typography.fontFamily.sans).toContain('Inter');
    });

    it('should have complete font size scale', () => {
      const expectedSizes = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl'];
      
      expectedSizes.forEach(size => {
        expect(typography.fontSize).toHaveProperty(size);
        expect(Array.isArray(typography.fontSize[size])).toBe(true);
        expect(typography.fontSize[size]).toHaveLength(2);
      });
    });

    it('should have font weight configuration', () => {
      expect(typography).toHaveProperty('fontWeight');
      expect(typography.fontWeight).toHaveProperty('normal');
      expect(typography.fontWeight).toHaveProperty('medium');
      expect(typography.fontWeight).toHaveProperty('semibold');
      expect(typography.fontWeight).toHaveProperty('bold');
    });
  });

  describe('Spacing', () => {
    it('should have complete spacing scale', () => {
      const expectedSpacings = [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 56, 64];
      
      expectedSpacings.forEach(space => {
        expect(spacing).toHaveProperty(space.toString());
        expect(typeof spacing[space]).toBe('string');
        expect(spacing[space]).toMatch(/^\d+px$/);
      });
    });

    it('should have correct base spacing values', () => {
      expect(spacing[0]).toBe('0px');
      expect(spacing[4]).toBe('16px');
      expect(spacing[8]).toBe('32px');
    });
  });

  describe('Shadows', () => {
    it('should have complete shadow scale', () => {
      const expectedShadows = ['sm', 'base', 'md', 'lg', 'xl', '2xl'];
      
      expectedShadows.forEach(shadow => {
        expect(shadows).toHaveProperty(shadow);
        expect(typeof shadows[shadow]).toBe('string');
      });
    });
  });

  describe('Border Radius', () => {
    it('should have complete border radius scale', () => {
      const expectedRadii = ['none', 'sm', 'base', 'md', 'lg', 'xl', '2xl', '3xl', 'full'];
      
      expectedRadii.forEach(radius => {
        expect(borderRadius).toHaveProperty(radius);
        expect(typeof borderRadius[radius]).toBe('string');
      });
    });
  });

  describe('Ant Design Theme', () => {
    it('should have token configuration', () => {
      expect(antdTheme).toHaveProperty('token');
      expect(typeof antdTheme.token).toBe('object');
    });

    it('should have correct primary colors in tokens', () => {
      expect(antdTheme.token.colorPrimary).toBe(colorPalette.primary[500]);
      expect(antdTheme.token.colorSuccess).toBe(colorPalette.success[500]);
      expect(antdTheme.token.colorWarning).toBe(colorPalette.warning[500]);
      expect(antdTheme.token.colorError).toBe(colorPalette.error[500]);
    });

    it('should have component configurations', () => {
      expect(antdTheme).toHaveProperty('components');
      expect(antdTheme.components).toHaveProperty('Button');
      expect(antdTheme.components).toHaveProperty('Input');
      expect(antdTheme.components).toHaveProperty('Card');
    });

    it('should have consistent border radius across components', () => {
      expect(antdTheme.components.Button.borderRadius).toBe(6);
      expect(antdTheme.components.Input.borderRadius).toBe(6);
      expect(antdTheme.components.Card.borderRadius).toBe(8);
    });
  });

  describe('Default Theme', () => {
    it('should include all theme sections', () => {
      expect(defaultTheme).toHaveProperty('colors');
      expect(defaultTheme).toHaveProperty('typography');
      expect(defaultTheme).toHaveProperty('spacing');
      expect(defaultTheme).toHaveProperty('shadows');
      expect(defaultTheme).toHaveProperty('borderRadius');
      expect(defaultTheme).toHaveProperty('antd');
    });

    it('should reference correct sub-configurations', () => {
      expect(defaultTheme.colors).toBe(colorPalette);
      expect(defaultTheme.typography).toBe(typography);
      expect(defaultTheme.spacing).toBe(spacing);
      expect(defaultTheme.shadows).toBe(shadows);
      expect(defaultTheme.borderRadius).toBe(borderRadius);
      expect(defaultTheme.antd).toBe(antdTheme);
    });
  });
});