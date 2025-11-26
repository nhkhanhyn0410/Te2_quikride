/**
 * ResponsiveIcon Component
 * Icon component that scales appropriately across different devices
 */

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const ResponsiveIcon = ({
  icon: IconComponent,
  size = 'base',
  responsive = true,
  color = 'currentColor',
  className,
  ...props
}) => {
  // Size mapping for responsive icons
  const responsiveSizeClasses = {
    xs: 'text-xs sm:text-sm',
    sm: 'text-sm sm:text-base',
    base: 'text-base sm:text-lg',
    lg: 'text-lg sm:text-xl',
    xl: 'text-xl sm:text-2xl',
    '2xl': 'text-2xl sm:text-3xl',
    '3xl': 'text-3xl sm:text-4xl',
    '4xl': 'text-4xl sm:text-5xl',
  };

  // Fixed size classes for non-responsive icons
  const fixedSizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
    '4xl': 'text-4xl',
  };

  // Color mapping
  const colorClasses = {
    primary: 'text-primary-500',
    secondary: 'text-neutral-500',
    success: 'text-success-500',
    warning: 'text-warning-500',
    error: 'text-error-500',
    white: 'text-white',
    black: 'text-black',
    currentColor: '',
  };

  const iconClassName = classNames(
    'responsive-icon',
    'inline-block',
    'transition-responsive',
    responsive ? responsiveSizeClasses[size] : fixedSizeClasses[size],
    colorClasses[color] || color,
    {
      'touch-manipulation': responsive, // Better touch handling on mobile
    },
    className
  );

  // Handle different icon types
  if (typeof IconComponent === 'string') {
    // Handle emoji or text icons
    return (
      <span className={iconClassName} {...props}>
        {IconComponent}
      </span>
    );
  }

  if (React.isValidElement(IconComponent)) {
    // Handle React elements
    return React.cloneElement(IconComponent, {
      className: classNames(IconComponent.props.className, iconClassName),
      ...props,
    });
  }

  if (typeof IconComponent === 'function') {
    // Handle component functions
    return (
      <IconComponent className={iconClassName} {...props} />
    );
  }

  // Fallback for other types
  return (
    <span className={iconClassName} {...props}>
      {IconComponent}
    </span>
  );
};

ResponsiveIcon.propTypes = {
  icon: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
    PropTypes.element,
    PropTypes.node,
  ]).isRequired,
  size: PropTypes.oneOf(['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl']),
  responsive: PropTypes.bool,
  color: PropTypes.oneOfType([
    PropTypes.oneOf(['primary', 'secondary', 'success', 'warning', 'error', 'white', 'black', 'currentColor']),
    PropTypes.string, // Custom color class
  ]),
  className: PropTypes.string,
};

export default ResponsiveIcon;