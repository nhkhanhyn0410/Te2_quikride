/**
 * Responsive Grid System
 * CSS Grid-based responsive layout system with Tailwind CSS integration
 */

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

/**
 * Grid Container Component
 * Main container for grid layouts with responsive column configurations
 */
export const Grid = ({
  children,
  columns = { desktop: 12, tablet: 8, mobile: 1 },
  gap = { desktop: 6, tablet: 4, mobile: 3 },
  className,
  ...props
}) => {
  // Generate responsive grid classes - Enhanced Mobile First
  const gridClasses = classNames(
    'grid',
    'w-full',
    'touch-manipulation', // Better touch handling on mobile
    // Mobile first approach
    `grid-cols-${columns.mobile}`,
    `gap-${gap.mobile}`,
    // Tablet breakpoint
    `md:grid-cols-${columns.tablet}`,
    `md:gap-${gap.tablet}`,
    // Desktop breakpoint
    `lg:grid-cols-${columns.desktop}`,
    `lg:gap-${gap.desktop}`,
    // Responsive transitions
    'transition-responsive',
    className
  );

  return (
    <div className={gridClasses} {...props}>
      {children}
    </div>
  );
};

Grid.propTypes = {
  children: PropTypes.node,
  columns: PropTypes.shape({
    desktop: PropTypes.number,
    tablet: PropTypes.number,
    mobile: PropTypes.number,
  }),
  gap: PropTypes.shape({
    desktop: PropTypes.number,
    tablet: PropTypes.number,
    mobile: PropTypes.number,
  }),
  className: PropTypes.string,
};

/**
 * Grid Item Component
 * Individual grid items with responsive column span support
 */
export const GridItem = ({
  children,
  span = { desktop: 1, tablet: 1, mobile: 1 },
  offset = { desktop: 0, tablet: 0, mobile: 0 },
  className,
  ...props
}) => {
  // Generate responsive span classes
  const spanClasses = classNames(
    // Mobile first approach
    `col-span-${span.mobile}`,
    // Tablet breakpoint
    span.tablet && `md:col-span-${span.tablet}`,
    // Desktop breakpoint
    span.desktop && `lg:col-span-${span.desktop}`,
    // Offset classes
    offset.mobile > 0 && `col-start-${offset.mobile + 1}`,
    offset.tablet > 0 && `md:col-start-${offset.tablet + 1}`,
    offset.desktop > 0 && `lg:col-start-${offset.desktop + 1}`,
    className
  );

  return (
    <div className={spanClasses} {...props}>
      {children}
    </div>
  );
};

GridItem.propTypes = {
  children: PropTypes.node,
  span: PropTypes.shape({
    desktop: PropTypes.number,
    tablet: PropTypes.number,
    mobile: PropTypes.number,
  }),
  offset: PropTypes.shape({
    desktop: PropTypes.number,
    tablet: PropTypes.number,
    mobile: PropTypes.number,
  }),
  className: PropTypes.string,
};

/**
 * Container Component
 * Responsive container with consistent max-widths and centering
 */
export const Container = ({
  children,
  size = 'default',
  centered = true,
  className,
  ...props
}) => {
  // Container size configurations
  const sizeConfig = {
    small: 'max-w-4xl',      // 896px
    default: 'max-w-6xl',    // 1152px
    large: 'max-w-7xl',      // 1280px
    full: 'max-w-full',      // 100%
  };

  const containerClasses = classNames(
    'container-responsive', // Use responsive container utility
    sizeConfig[size],
    centered && 'mx-auto',
    className
  );

  return (
    <div className={containerClasses} {...props}>
      {children}
    </div>
  );
};

Container.propTypes = {
  children: PropTypes.node,
  size: PropTypes.oneOf(['small', 'default', 'large', 'full']),
  centered: PropTypes.bool,
  className: PropTypes.string,
};

/**
 * Panel Grid Component
 * Specialized grid for panel layouts with predefined responsive behavior
 */
export const PanelGrid = ({
  children,
  layout = 'auto',
  className,
  ...props
}) => {
  // Predefined layout configurations
  const layoutConfig = {
    auto: {
      columns: { desktop: 12, tablet: 8, mobile: 1 },
      gap: { desktop: 6, tablet: 4, mobile: 3 },
    },
    sidebar: {
      columns: { desktop: 4, tablet: 3, mobile: 1 },
      gap: { desktop: 6, tablet: 4, mobile: 3 },
    },
    cards: {
      columns: { desktop: 3, tablet: 2, mobile: 1 },
      gap: { desktop: 6, tablet: 4, mobile: 3 },
    },
    dashboard: {
      columns: { desktop: 6, tablet: 4, mobile: 2 },
      gap: { desktop: 6, tablet: 4, mobile: 3 },
    },
  };

  const config = layoutConfig[layout];

  return (
    <Grid
      columns={config.columns}
      gap={config.gap}
      className={className}
      {...props}
    >
      {children}
    </Grid>
  );
};

PanelGrid.propTypes = {
  children: PropTypes.node,
  layout: PropTypes.oneOf(['auto', 'sidebar', 'cards', 'dashboard']),
  className: PropTypes.string,
};

export default Grid;