/**
 * ResponsiveContainer Component
 * Provides responsive container with consistent breakpoints and spacing
 */

import React from 'react';
import PropTypes from 'prop-types';
import { getResponsiveSpacing } from '../../../utils/responsive';

const ResponsiveContainer = ({
  children,
  size = 'md',
  maxWidth = 'container',
  padding = true,
  margin = false,
  className = '',
  as: Component = 'div',
  ...props
}) => {
  // Generate responsive classes
  const getContainerClasses = () => {
    const classes = ['w-full'];
    
    // Max width handling
    if (maxWidth === 'container') {
      classes.push('container-responsive');
    } else if (maxWidth === 'full') {
      classes.push('max-w-full');
    } else if (typeof maxWidth === 'string') {
      classes.push(`max-w-${maxWidth}`);
    }
    
    // Padding handling
    if (padding) {
      if (typeof padding === 'string') {
        classes.push(getResponsiveSpacing(padding));
      } else {
        classes.push(getResponsiveSpacing(size));
      }
    }
    
    // Margin handling
    if (margin) {
      if (typeof margin === 'string') {
        classes.push(`m-responsive-${margin}`);
      } else {
        classes.push(`m-responsive-${size}`);
      }
    }
    
    // Center alignment
    classes.push('mx-auto');
    
    return classes.join(' ');
  };

  const containerClasses = `${getContainerClasses()} ${className}`.trim();

  return (
    <Component className={containerClasses} {...props}>
      {children}
    </Component>
  );
};

ResponsiveContainer.propTypes = {
  children: PropTypes.node.isRequired,
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  maxWidth: PropTypes.oneOf(['container', 'full', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl']),
  padding: PropTypes.oneOfType([PropTypes.bool, PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl'])]),
  margin: PropTypes.oneOfType([PropTypes.bool, PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl'])]),
  className: PropTypes.string,
  as: PropTypes.elementType,
};

export default ResponsiveContainer;