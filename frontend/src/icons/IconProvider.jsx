import React, { createContext, useContext } from 'react';
import * as AntdIcons from '@ant-design/icons';
import * as FaIcons from 'react-icons/fa';
import * as MdIcons from 'react-icons/md';
import * as IoIcons from 'react-icons/io';
import { iconMapping, iconContexts, fallbackIcons, iconSizes, iconColors } from './iconMapping';

// Icon libraries mapping
const iconLibraries = {
  antd: AntdIcons,
  fa: FaIcons,
  md: MdIcons,
  io: IoIcons,
};

// Icon context
const IconContext = createContext({
  getIcon: () => null,
  getIconByContext: () => null,
  iconSizes,
  iconColors,
});

// Custom hook to use icons
export const useIcon = () => {
  const context = useContext(IconContext);
  if (!context) {
    throw new Error('useIcon must be used within an IconProvider');
  }
  return context;
};

/**
 * IconProvider component for centralized icon management
 * Provides standardized icon access throughout the application
 */
const IconProvider = ({ children }) => {
  /**
   * Get icon component by name
   * @param {string} iconName - Name of the icon
   * @param {string} type - Type of icon ('antd' or 'react')
   * @param {object} props - Props to pass to the icon component
   * @returns {React.Component|null} Icon component or null if not found
   */
  const getIcon = (iconName, type = 'antd', props = {}) => {
    try {
      if (type === 'antd') {
        const IconComponent = iconLibraries.antd[iconName];
        if (IconComponent) {
          return <IconComponent {...props} />;
        }
      } else if (type === 'react') {
        // For react icons, iconName should be an object with library and icon properties
        if (typeof iconName === 'object' && iconName.library && iconName.icon) {
          const library = iconLibraries[iconName.library];
          const IconComponent = library?.[iconName.icon];
          if (IconComponent) {
            return <IconComponent {...props} />;
          }
        }
      }
      
      // Fallback to default icon
      console.warn(`Icon '${iconName}' not found, using fallback`);
      const FallbackIcon = iconLibraries.antd[fallbackIcons.primary];
      return FallbackIcon ? <FallbackIcon {...props} /> : null;
    } catch (error) {
      console.error('Error rendering icon:', error);
      return null;
    }
  };

  /**
   * Get icon by context and action
   * @param {string} context - Context category (e.g., 'authentication', 'crud')
   * @param {string} action - Action within context (e.g., 'login', 'create')
   * @param {object} props - Props to pass to the icon component
   * @returns {React.Component|null} Icon component or null if not found
   */
  const getIconByContext = (context, action, props = {}) => {
    try {
      const contextIcons = iconContexts[context];
      if (!contextIcons) {
        console.warn(`Icon context '${context}' not found`);
        return getIcon(fallbackIcons.primary, 'antd', props);
      }

      const iconConfig = contextIcons[action];
      if (!iconConfig) {
        console.warn(`Icon action '${action}' not found in context '${context}'`);
        return getIcon(fallbackIcons.primary, 'antd', props);
      }

      // Handle string icon names (Ant Design)
      if (typeof iconConfig === 'string') {
        return getIcon(iconConfig, 'antd', props);
      }

      // Handle object icon configs (React Icons)
      if (typeof iconConfig === 'object') {
        return getIcon(iconConfig, 'react', props);
      }

      return null;
    } catch (error) {
      console.error('Error getting icon by context:', error);
      return getIcon(fallbackIcons.primary, 'antd', props);
    }
  };

  /**
   * Get standardized icon with size and color
   * @param {string} iconName - Name of the icon
   * @param {object} options - Icon options
   * @param {string} options.size - Size key from iconSizes
   * @param {string} options.color - Color key from iconColors or custom color
   * @param {string} options.type - Icon type ('antd' or 'react')
   * @param {object} options.props - Additional props
   * @returns {React.Component|null} Styled icon component
   */
  const getStandardizedIcon = (iconName, options = {}) => {
    const {
      size = 'base',
      color = 'neutral',
      type = 'antd',
      props = {}
    } = options;

    const iconSize = iconSizes[size] || iconSizes.base;
    const iconColor = iconColors[color] || color;

    const iconProps = {
      style: {
        fontSize: `${iconSize}px`,
        color: iconColor,
        ...props.style,
      },
      ...props,
    };

    return getIcon(iconName, type, iconProps);
  };

  /**
   * Create icon component with consistent styling
   * @param {string} context - Icon context
   * @param {string} action - Icon action
   * @param {object} options - Styling options
   * @returns {React.Component} Styled icon component
   */
  const createContextIcon = (context, action, options = {}) => {
    const {
      size = 'base',
      color = 'neutral',
      className = '',
      ...otherProps
    } = options;

    const iconSize = iconSizes[size] || iconSizes.base;
    const iconColor = iconColors[color] || color;

    const iconProps = {
      className: `icon-${context}-${action} ${className}`.trim(),
      style: {
        fontSize: `${iconSize}px`,
        color: iconColor,
        ...otherProps.style,
      },
      ...otherProps,
    };

    return getIconByContext(context, action, iconProps);
  };

  const contextValue = {
    getIcon,
    getIconByContext,
    getStandardizedIcon,
    createContextIcon,
    iconSizes,
    iconColors,
    iconContexts,
  };

  return (
    <IconContext.Provider value={contextValue}>
      {children}
    </IconContext.Provider>
  );
};

export default IconProvider;