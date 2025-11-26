/**
 * ResponsiveVisibility Component
 * Controls visibility of content at different breakpoints
 */

import React from 'react';
import PropTypes from 'prop-types';

const ResponsiveVisibility = ({
  children,
  show = [],
  hide = [],
  showUp = null,
  hideUp = null,
  className = '',
  as: Component = 'div',
  ...props
}) => {
  // Generate visibility classes
  const getVisibilityClasses = () => {
    const classes = [];
    
    // Show at specific breakpoints
    if (show.length > 0) {
      show.forEach(breakpoint => {
        if (breakpoint === 'mobile') {
          classes.push('show-mobile');
        } else if (breakpoint === 'tablet') {
          classes.push('show-tablet');
        } else if (breakpoint === 'desktop') {
          classes.push('show-desktop');
        } else if (breakpoint === 'wide') {
          classes.push('show-wide');
        }
      });
    }
    
    // Hide at specific breakpoints
    if (hide.length > 0) {
      hide.forEach(breakpoint => {
        if (breakpoint === 'mobile') {
          classes.push('hide-mobile');
        } else if (breakpoint === 'tablet') {
          classes.push('hide-tablet');
        } else if (breakpoint === 'desktop') {
          classes.push('hide-desktop');
        } else if (breakpoint === 'wide') {
          classes.push('hide-wide');
        }
      });
    }
    
    // Show from breakpoint up
    if (showUp) {
      classes.push(`show-${showUp}-up`);
    }
    
    // Hide from breakpoint up
    if (hideUp) {
      classes.push(`hide-${hideUp}-up`);
    }
    
    return classes.join(' ');
  };

  const visibilityClasses = `${getVisibilityClasses()} ${className}`.trim();

  return (
    <Component className={visibilityClasses} {...props}>
      {children}
    </Component>
  );
};

ResponsiveVisibility.propTypes = {
  children: PropTypes.node.isRequired,
  show: PropTypes.arrayOf(PropTypes.oneOf(['mobile', 'tablet', 'desktop', 'wide'])),
  hide: PropTypes.arrayOf(PropTypes.oneOf(['mobile', 'tablet', 'desktop', 'wide'])),
  showUp: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', '2xl']),
  hideUp: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', '2xl']),
  className: PropTypes.string,
  as: PropTypes.elementType,
};

export default ResponsiveVisibility;