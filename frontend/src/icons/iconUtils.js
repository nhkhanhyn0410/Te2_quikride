/**
 * Icon utility functions for consistent icon rendering
 */

import * as AntdIcons from '@ant-design/icons';
import * as FaIcons from 'react-icons/fa';
import * as MdIcons from 'react-icons/md';
import * as IoIcons from 'react-icons/io';
import { antdIcons, reactIcons, iconContexts, fallbackIcons, iconSizes, iconColors } from './iconMapping';

// Icon libraries mapping
const iconLibraries = {
  antd: AntdIcons,
  fa: FaIcons,
  md: MdIcons,
  io: IoIcons,
};

/**
 * Get icon component class by name
 * @param {string} iconName - Name of the icon
 * @param {string} type - Type of icon ('antd' or 'react')
 * @returns {React.Component|null} Icon component class or null if not found
 */
export const getIconComponent = (iconName, type = 'antd') => {
  try {
    if (type === 'antd') {
      return iconLibraries.antd[iconName] || null;
    } else if (type === 'react') {
      // For react icons, iconName should be an object with library and icon properties
      if (typeof iconName === 'object' && iconName.library && iconName.icon) {
        const library = iconLibraries[iconName.library];
        return library?.[iconName.icon] || null;
      }
    }
    return null;
  } catch (error) {
    console.error('Error getting icon component:', error);
    return null;
  }
};

/**
 * Check if an icon exists in the specified library
 * @param {string} iconName - Name of the icon
 * @param {string} type - Type of icon ('antd' or 'react')
 * @returns {boolean} True if icon exists, false otherwise
 */
export const iconExists = (iconName, type = 'antd') => {
  return getIconComponent(iconName, type) !== null;
};

/**
 * Get icon name by context and action
 * @param {string} context - Context category
 * @param {string} action - Action within context
 * @returns {string|object|null} Icon name/config or null if not found
 */
export const getIconNameByContext = (context, action) => {
  try {
    const contextIcons = iconContexts[context];
    if (!contextIcons) {
      console.warn(`Icon context '${context}' not found`);
      return null;
    }

    const iconConfig = contextIcons[action];
    if (!iconConfig) {
      console.warn(`Icon action '${action}' not found in context '${context}'`);
      return null;
    }

    return iconConfig;
  } catch (error) {
    console.error('Error getting icon name by context:', error);
    return null;
  }
};

/**
 * Get all available icons in a context
 * @param {string} context - Context category
 * @returns {object} Object with action keys and icon configs
 */
export const getContextIcons = (context) => {
  try {
    return iconContexts[context] || {};
  } catch (error) {
    console.error('Error getting context icons:', error);
    return {};
  }
};

/**
 * Get all available contexts
 * @returns {string[]} Array of context names
 */
export const getAvailableContexts = () => {
  return Object.keys(iconContexts);
};

/**
 * Get standardized icon props
 * @param {object} options - Icon options
 * @param {string} options.size - Size key from iconSizes
 * @param {string} options.color - Color key from iconColors or custom color
 * @param {string} options.className - Additional CSS classes
 * @param {object} options.style - Additional inline styles
 * @returns {object} Standardized icon props
 */
export const getStandardizedIconProps = (options = {}) => {
  const {
    size = 'base',
    color = 'neutral',
    className = '',
    style = {},
    ...otherProps
  } = options;

  const iconSize = iconSizes[size] || iconSizes.base;
  const iconColor = iconColors[color] || color;

  return {
    className: className.trim(),
    style: {
      fontSize: `${iconSize}px`,
      color: iconColor,
      ...style,
    },
    ...otherProps,
  };
};

/**
 * Create icon class name for CSS styling
 * @param {string} context - Icon context
 * @param {string} action - Icon action
 * @param {string} additionalClasses - Additional CSS classes
 * @returns {string} Complete class name
 */
export const createIconClassName = (context, action, additionalClasses = '') => {
  const baseClass = `icon-${context}-${action}`;
  return `${baseClass} ${additionalClasses}`.trim();
};

/**
 * Validate icon configuration
 * @param {string|object} iconConfig - Icon configuration
 * @returns {boolean} True if valid, false otherwise
 */
export const validateIconConfig = (iconConfig) => {
  try {
    if (typeof iconConfig === 'string') {
      // Ant Design icon
      return iconExists(iconConfig, 'antd');
    } else if (typeof iconConfig === 'object' && iconConfig.library && iconConfig.icon) {
      // React icon
      return iconExists(iconConfig, 'react');
    }
    return false;
  } catch (error) {
    console.error('Error validating icon config:', error);
    return false;
  }
};

/**
 * Get fallback icon for a given type
 * @param {string} type - Icon type ('primary' or 'decorative')
 * @returns {string|object} Fallback icon configuration
 */
export const getFallbackIcon = (type = 'primary') => {
  return fallbackIcons[type] || fallbackIcons.primary;
};

/**
 * Create icon mapping for migration
 * @param {object} oldIconMap - Old icon mapping
 * @returns {object} New standardized icon mapping
 */
export const createMigrationMap = (oldIconMap) => {
  const migrationMap = {};
  
  try {
    Object.entries(oldIconMap).forEach(([key, oldIcon]) => {
      // Try to find equivalent in new mapping
      let newIcon = null;
      
      // Check if it's already in antdIcons
      if (Object.values(antdIcons).includes(oldIcon)) {
        newIcon = oldIcon;
      } else {
        // Try to find in contexts
        for (const [context, actions] of Object.entries(iconContexts)) {
          for (const [action, iconConfig] of Object.entries(actions)) {
            if (iconConfig === oldIcon || 
                (typeof iconConfig === 'object' && iconConfig.icon === oldIcon)) {
              newIcon = iconConfig;
              break;
            }
          }
          if (newIcon) break;
        }
      }
      
      migrationMap[key] = newIcon || getFallbackIcon();
    });
  } catch (error) {
    console.error('Error creating migration map:', error);
  }
  
  return migrationMap;
};

/**
 * Generate icon documentation
 * @returns {object} Documentation object with all icon information
 */
export const generateIconDocumentation = () => {
  const documentation = {
    contexts: {},
    antdIcons: Object.keys(antdIcons),
    reactIcons: Object.keys(reactIcons),
    sizes: iconSizes,
    colors: iconColors,
    fallbacks: fallbackIcons,
  };

  // Document each context
  Object.entries(iconContexts).forEach(([context, actions]) => {
    documentation.contexts[context] = {
      description: `Icons for ${context} related actions`,
      actions: Object.keys(actions),
      icons: actions,
    };
  });

  return documentation;
};

export default {
  getIconComponent,
  iconExists,
  getIconNameByContext,
  getContextIcons,
  getAvailableContexts,
  getStandardizedIconProps,
  createIconClassName,
  validateIconConfig,
  getFallbackIcon,
  createMigrationMap,
  generateIconDocumentation,
};