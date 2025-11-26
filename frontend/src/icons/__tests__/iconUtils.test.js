/**
 * @vitest-environment node
 */
import { describe, it, expect, vi } from 'vitest';
import {
  getIconComponent,
  iconExists,
  getIconNameByContext,
  getContextIcons,
  getAvailableContexts,
  getStandardizedIconProps,
  createIconClassName,
  validateIconConfig,
  getFallbackIcon,
  generateIconDocumentation
} from '../iconUtils';

// Mock the icon libraries
vi.mock('@ant-design/icons', () => ({
  SearchOutlined: 'SearchOutlined',
  UserOutlined: 'UserOutlined',
  InfoCircleOutlined: 'InfoCircleOutlined',
}));

vi.mock('react-icons/fa', () => ({
  FaBus: 'FaBus',
  FaUserTie: 'FaUserTie',
}));

vi.mock('react-icons/md', () => ({
  MdReportProblem: 'MdReportProblem',
}));

vi.mock('react-icons/io', () => ({
  IoMdImages: 'IoMdImages',
}));

describe('Icon Utils', () => {
  describe('getIconComponent', () => {
    it('should return Ant Design icon component', () => {
      const component = getIconComponent('SearchOutlined', 'antd');
      expect(component).toBe('SearchOutlined');
    });

    it('should return React icon component', () => {
      const iconConfig = { library: 'fa', icon: 'FaBus' };
      const component = getIconComponent(iconConfig, 'react');
      expect(component).toBe('FaBus');
    });

    it('should return null for non-existent icon', () => {
      const component = getIconComponent('NonExistentIcon', 'antd');
      expect(component).toBeNull();
    });

    it('should handle invalid react icon config', () => {
      const component = getIconComponent('invalid', 'react');
      expect(component).toBeNull();
    });

    it('should handle errors gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      // Pass null to cause an error
      const component = getIconComponent(null, 'antd');
      expect(component).toBeNull();
      expect(consoleSpy).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });
  });

  describe('iconExists', () => {
    it('should return true for existing Ant Design icon', () => {
      expect(iconExists('SearchOutlined', 'antd')).toBe(true);
    });

    it('should return false for non-existing Ant Design icon', () => {
      expect(iconExists('NonExistentIcon', 'antd')).toBe(false);
    });

    it('should return true for existing React icon', () => {
      const iconConfig = { library: 'fa', icon: 'FaBus' };
      expect(iconExists(iconConfig, 'react')).toBe(true);
    });

    it('should return false for non-existing React icon', () => {
      const iconConfig = { library: 'fa', icon: 'NonExistentIcon' };
      expect(iconExists(iconConfig, 'react')).toBe(false);
    });
  });

  describe('getIconNameByContext', () => {
    it('should return icon config for valid context and action', () => {
      const iconConfig = getIconNameByContext('authentication', 'login');
      expect(iconConfig).toBeDefined();
      expect(typeof iconConfig).toBe('string');
    });

    it('should return null for invalid context', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      const iconConfig = getIconNameByContext('invalid', 'login');
      expect(iconConfig).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith("Icon context 'invalid' not found");
      
      consoleSpy.mockRestore();
    });

    it('should return null for invalid action', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      const iconConfig = getIconNameByContext('authentication', 'invalid');
      expect(iconConfig).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith("Icon action 'invalid' not found in context 'authentication'");
      
      consoleSpy.mockRestore();
    });

    it('should handle errors gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      const iconConfig = getIconNameByContext(null, 'login');
      expect(iconConfig).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith("Icon context 'null' not found");
      
      consoleSpy.mockRestore();
    });
  });

  describe('getContextIcons', () => {
    it('should return all icons for a valid context', () => {
      const contextIcons = getContextIcons('authentication');
      expect(typeof contextIcons).toBe('object');
      expect(Object.keys(contextIcons).length).toBeGreaterThan(0);
    });

    it('should return empty object for invalid context', () => {
      const contextIcons = getContextIcons('invalid');
      expect(contextIcons).toEqual({});
    });

    it('should handle errors gracefully', () => {
      // getContextIcons handles null gracefully by returning empty object
      // without logging an error, so we just test the behavior
      const contextIcons = getContextIcons(null);
      expect(contextIcons).toEqual({});
    });
  });

  describe('getAvailableContexts', () => {
    it('should return array of context names', () => {
      const contexts = getAvailableContexts();
      expect(Array.isArray(contexts)).toBe(true);
      expect(contexts.length).toBeGreaterThan(0);
      expect(contexts).toContain('authentication');
      expect(contexts).toContain('crud');
      expect(contexts).toContain('navigation');
    });
  });

  describe('getStandardizedIconProps', () => {
    it('should return props with default values', () => {
      const props = getStandardizedIconProps();
      expect(props).toHaveProperty('style');
      expect(props.style.fontSize).toBe('16px');
      expect(props.style.color).toBe('#6b7280');
      expect(props.className).toBe('');
    });

    it('should apply custom size and color', () => {
      const props = getStandardizedIconProps({
        size: 'lg',
        color: 'primary',
        className: 'custom-class'
      });
      
      expect(props.style.fontSize).toBe('20px');
      expect(props.style.color).toBe('#0ea5e9');
      expect(props.className).toBe('custom-class');
    });

    it('should merge custom styles', () => {
      const props = getStandardizedIconProps({
        style: { marginRight: '8px' },
        customProp: 'value'
      });
      
      expect(props.style.marginRight).toBe('8px');
      expect(props.style.fontSize).toBe('16px');
      expect(props.customProp).toBe('value');
    });

    it('should handle custom color values', () => {
      const props = getStandardizedIconProps({
        color: '#ff0000'
      });
      
      expect(props.style.color).toBe('#ff0000');
    });
  });

  describe('createIconClassName', () => {
    it('should create basic class name', () => {
      const className = createIconClassName('authentication', 'login');
      expect(className).toBe('icon-authentication-login');
    });

    it('should include additional classes', () => {
      const className = createIconClassName('authentication', 'login', 'custom-class another-class');
      expect(className).toBe('icon-authentication-login custom-class another-class');
    });

    it('should handle empty additional classes', () => {
      const className = createIconClassName('authentication', 'login', '');
      expect(className).toBe('icon-authentication-login');
    });
  });

  describe('validateIconConfig', () => {
    it('should validate string icon config (Ant Design)', () => {
      expect(validateIconConfig('SearchOutlined')).toBe(true);
      expect(validateIconConfig('NonExistentIcon')).toBe(false);
    });

    it('should validate object icon config (React Icons)', () => {
      const validConfig = { library: 'fa', icon: 'FaBus' };
      const invalidConfig = { library: 'fa', icon: 'NonExistentIcon' };
      
      expect(validateIconConfig(validConfig)).toBe(true);
      expect(validateIconConfig(invalidConfig)).toBe(false);
    });

    it('should return false for invalid config format', () => {
      expect(validateIconConfig(null)).toBe(false);
      expect(validateIconConfig(123)).toBe(false);
      expect(validateIconConfig({})).toBe(false);
      expect(validateIconConfig({ library: 'fa' })).toBe(false);
    });

    it('should handle errors gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      // This should cause an error in the validation process
      const result = validateIconConfig(undefined);
      expect(result).toBe(false);
      
      consoleSpy.mockRestore();
    });
  });

  describe('getFallbackIcon', () => {
    it('should return primary fallback by default', () => {
      const fallback = getFallbackIcon();
      expect(fallback).toBeDefined();
    });

    it('should return decorative fallback when requested', () => {
      const fallback = getFallbackIcon('decorative');
      expect(fallback).toBeDefined();
    });

    it('should return primary fallback for invalid type', () => {
      const fallback = getFallbackIcon('invalid');
      expect(fallback).toBeDefined();
    });
  });

  describe('generateIconDocumentation', () => {
    it('should generate complete documentation', () => {
      const docs = generateIconDocumentation();
      
      expect(docs).toHaveProperty('contexts');
      expect(docs).toHaveProperty('antdIcons');
      expect(docs).toHaveProperty('reactIcons');
      expect(docs).toHaveProperty('sizes');
      expect(docs).toHaveProperty('colors');
      expect(docs).toHaveProperty('fallbacks');
    });

    it('should document all contexts', () => {
      const docs = generateIconDocumentation();
      
      expect(typeof docs.contexts).toBe('object');
      expect(Object.keys(docs.contexts).length).toBeGreaterThan(0);
      
      Object.values(docs.contexts).forEach(context => {
        expect(context).toHaveProperty('description');
        expect(context).toHaveProperty('actions');
        expect(context).toHaveProperty('icons');
        expect(Array.isArray(context.actions)).toBe(true);
      });
    });

    it('should list all available icons', () => {
      const docs = generateIconDocumentation();
      
      expect(Array.isArray(docs.antdIcons)).toBe(true);
      expect(Array.isArray(docs.reactIcons)).toBe(true);
      expect(docs.antdIcons.length).toBeGreaterThan(0);
      expect(docs.reactIcons.length).toBeGreaterThan(0);
    });
  });
});