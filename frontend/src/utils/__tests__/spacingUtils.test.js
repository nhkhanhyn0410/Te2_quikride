/**
 * @vitest-environment node
 */
import { describe, it, expect } from 'vitest';
import {
  getSpacing,
  generateMarginClasses,
  generatePaddingClasses,
  generateGapClasses,
  generateResponsiveSpacing,
  createSpacingStyles,
  spacingPresets,
  applySpacingPreset
} from '../spacingUtils';

describe('Spacing Utils', () => {
  describe('getSpacing', () => {
    it('should return correct spacing value for string key', () => {
      expect(getSpacing('4')).toBe('16px');
      expect(getSpacing('8')).toBe('32px');
      expect(getSpacing('0')).toBe('0px');
    });

    it('should return correct spacing value for numeric key', () => {
      expect(getSpacing(4)).toBe('16px');
      expect(getSpacing(8)).toBe('32px');
      expect(getSpacing(0)).toBe('0px');
    });

    it('should return default spacing for invalid key', () => {
      expect(getSpacing('invalid')).toBe('16px');
      expect(getSpacing(999)).toBe('16px');
    });

    it('should return default spacing for undefined key', () => {
      expect(getSpacing()).toBe('16px');
      expect(getSpacing(null)).toBe('16px');
    });
  });

  describe('generateMarginClasses', () => {
    it('should generate margin classes for all sides', () => {
      const classes = generateMarginClasses({ all: 4 });
      expect(classes).toBe('m-4');
    });

    it('should generate margin classes for x and y axes', () => {
      const classes = generateMarginClasses({ x: 4, y: 2 });
      expect(classes).toBe('mx-4 my-2');
    });

    it('should generate margin classes for individual sides', () => {
      const classes = generateMarginClasses({
        top: 1,
        right: 2,
        bottom: 3,
        left: 4
      });
      expect(classes).toBe('mt-1 mr-2 mb-3 ml-4');
    });

    it('should handle mixed margin options', () => {
      const classes = generateMarginClasses({
        all: 4,
        top: 2
      });
      expect(classes).toBe('m-4 mt-2');
    });

    it('should return empty string for no options', () => {
      const classes = generateMarginClasses();
      expect(classes).toBe('');
    });
  });

  describe('generatePaddingClasses', () => {
    it('should generate padding classes for all sides', () => {
      const classes = generatePaddingClasses({ all: 4 });
      expect(classes).toBe('p-4');
    });

    it('should generate padding classes for x and y axes', () => {
      const classes = generatePaddingClasses({ x: 4, y: 2 });
      expect(classes).toBe('px-4 py-2');
    });

    it('should generate padding classes for individual sides', () => {
      const classes = generatePaddingClasses({
        top: 1,
        right: 2,
        bottom: 3,
        left: 4
      });
      expect(classes).toBe('pt-1 pr-2 pb-3 pl-4');
    });

    it('should handle mixed padding options', () => {
      const classes = generatePaddingClasses({
        all: 4,
        x: 6
      });
      expect(classes).toBe('p-4 px-6');
    });

    it('should return empty string for no options', () => {
      const classes = generatePaddingClasses();
      expect(classes).toBe('');
    });
  });

  describe('generateGapClasses', () => {
    it('should generate gap class', () => {
      const classes = generateGapClasses(4);
      expect(classes).toBe('gap-4');
    });

    it('should generate gap-x and gap-y classes', () => {
      const classes = generateGapClasses(undefined, 4, 2);
      expect(classes).toBe('gap-x-4 gap-y-2');
    });

    it('should generate all gap classes', () => {
      const classes = generateGapClasses(6, 4, 2);
      expect(classes).toBe('gap-6 gap-x-4 gap-y-2');
    });

    it('should return empty string for no parameters', () => {
      const classes = generateGapClasses();
      expect(classes).toBe('');
    });
  });

  describe('generateResponsiveSpacing', () => {
    it('should generate responsive margin classes', () => {
      const breakpoints = {
        base: 4,
        md: 6,
        lg: 8
      };
      const classes = generateResponsiveSpacing(breakpoints, 'm');
      expect(classes).toBe('m-4 md:m-6 lg:m-8');
    });

    it('should generate responsive padding classes with direction', () => {
      const breakpoints = {
        base: 2,
        sm: 4
      };
      const classes = generateResponsiveSpacing(breakpoints, 'p', 'x');
      expect(classes).toBe('px-2 sm:px-4');
    });

    it('should handle single breakpoint', () => {
      const breakpoints = { base: 4 };
      const classes = generateResponsiveSpacing(breakpoints, 'm');
      expect(classes).toBe('m-4');
    });
  });

  describe('createSpacingStyles', () => {
    it('should create margin styles', () => {
      const styles = createSpacingStyles({
        margin: { all: 4 }
      });
      expect(styles).toEqual({ margin: '16px' });
    });

    it('should create padding styles', () => {
      const styles = createSpacingStyles({
        padding: { x: 4, y: 2 }
      });
      expect(styles).toEqual({
        paddingLeft: '16px',
        paddingRight: '16px',
        paddingTop: '8px',
        paddingBottom: '8px'
      });
    });

    it('should create individual side styles', () => {
      const styles = createSpacingStyles({
        margin: { top: 2, bottom: 4 },
        padding: { left: 3, right: 5 }
      });
      expect(styles).toEqual({
        marginTop: '8px',
        marginBottom: '16px',
        paddingLeft: '12px',
        paddingRight: '20px'
      });
    });

    it('should handle numeric values', () => {
      const styles = createSpacingStyles({
        margin: 4,
        padding: 2
      });
      expect(styles).toEqual({
        margin: '16px',
        padding: '8px'
      });
    });

    it('should return empty object for no options', () => {
      const styles = createSpacingStyles();
      expect(styles).toEqual({});
    });
  });

  describe('spacingPresets', () => {
    it('should have component presets', () => {
      expect(spacingPresets).toHaveProperty('component');
      expect(spacingPresets.component).toHaveProperty('tight');
      expect(spacingPresets.component).toHaveProperty('normal');
      expect(spacingPresets.component).toHaveProperty('loose');
    });

    it('should have layout presets', () => {
      expect(spacingPresets).toHaveProperty('layout');
      expect(spacingPresets.layout).toHaveProperty('section');
      expect(spacingPresets.layout).toHaveProperty('container');
      expect(spacingPresets.layout).toHaveProperty('grid');
    });

    it('should have form presets', () => {
      expect(spacingPresets).toHaveProperty('form');
      expect(spacingPresets.form).toHaveProperty('field');
      expect(spacingPresets.form).toHaveProperty('group');
      expect(spacingPresets.form).toHaveProperty('actions');
    });

    it('should have card presets', () => {
      expect(spacingPresets).toHaveProperty('card');
      expect(spacingPresets.card).toHaveProperty('compact');
      expect(spacingPresets.card).toHaveProperty('comfortable');
      expect(spacingPresets.card).toHaveProperty('spacious');
    });
  });

  describe('applySpacingPreset', () => {
    it('should return correct preset configuration', () => {
      const preset = applySpacingPreset('component', 'normal');
      expect(preset).toEqual({
        padding: { all: 4 },
        margin: { bottom: 4 }
      });
    });

    it('should return empty object for invalid category', () => {
      const preset = applySpacingPreset('invalid', 'normal');
      expect(preset).toEqual({});
    });

    it('should return empty object for invalid variant', () => {
      const preset = applySpacingPreset('component', 'invalid');
      expect(preset).toEqual({});
    });

    it('should return empty object for missing parameters', () => {
      const preset = applySpacingPreset();
      expect(preset).toEqual({});
    });
  });
});