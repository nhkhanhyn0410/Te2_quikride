/**
 * ResponsiveGrid Component
 * Provides responsive grid layout with consistent breakpoints
 */

import React from 'react';
import PropTypes from 'prop-types';
import { generateResponsiveClasses } from '../../../utils/responsive';

const ResponsiveGrid = ({
  children,
  columns = { xs: 1, sm: 2, md: 3, lg: 4, xl: 6 },
  gap = 'md',
  className = '',
  as: Component = 'div',
  ...props
}) => {
  // Generate responsive grid classes
  const getGridClasses = () => {
    const classes = ['grid'];
    
    // Generate responsive column classes
    const columnClasses = generateResponsiveClasses(columns, 'grid-cols-');
    if (columnClasses) {
      classes.push(columnClasses);
    }
    
    // Gap handling
    if (typeof gap === 'string') {
      classes.push(`gap-responsive-${gap}`);
    } else if (typeof gap === 'object') {
      const gapClasses = generateResponsiveClasses(gap, 'gap-');
      if (gapClasses) {
        classes.push(gapClasses);
      }
    }
    
    return classes.join(' ');
  };

  const gridClasses = `${getGridClasses()} ${className}`.trim();

  return (
    <Component className={gridClasses} {...props}>
      {children}
    </Component>
  );
};

ResponsiveGrid.propTypes = {
  children: PropTypes.node.isRequired,
  columns: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.object, // { xs: 1, sm: 2, md: 3, lg: 4, xl: 6 }
  ]),
  gap: PropTypes.oneOfType([
    PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
    PropTypes.object, // { xs: 2, sm: 4, md: 6 }
  ]),
  className: PropTypes.string,
  as: PropTypes.elementType,
};

export default ResponsiveGrid;