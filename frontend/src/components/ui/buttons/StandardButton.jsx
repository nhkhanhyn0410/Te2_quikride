/**
 * StandardButton Component
 * Standardized button component that extends Ant Design Button with consistent styling and icon mapping
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import classNames from 'classnames';
import { useIcon } from '../../../icons/IconProvider';

const StandardButton = ({
  variant = 'default',
  size = 'middle',
  icon,
  iconContext,
  iconType,
  loading = false,
  disabled = false,
  block = false,
  danger = false,
  ghost = false,
  className,
  children,
  ...props
}) => {
  const { getIconByContext } = useIcon();

  // Map variants to Ant Design button types
  const getButtonType = () => {
    switch (variant) {
      case 'primary':
        return 'primary';
      case 'secondary':
        return 'default';
      case 'text':
        return 'text';
      case 'link':
        return 'link';
      case 'dashed':
        return 'dashed';
      default:
        return 'default';
    }
  };

  // Get standardized icon if iconContext and iconType are provided
  const getStandardizedIcon = () => {
    if (icon) return icon;
    if (iconContext && iconType) {
      return getIconByContext(iconContext, iconType);
    }
    return undefined;
  };

  const buttonClassName = classNames(
    'transition-all duration-200',
    {
      // Custom styling for different variants
      'hover:shadow-md': variant === 'primary' && !disabled,
      'border-gray-300 hover:border-blue-500': variant === 'secondary' && !disabled,
      'text-blue-600 hover:text-blue-700': variant === 'text' && !disabled,
      'text-blue-600 hover:text-blue-700 hover:underline': variant === 'link' && !disabled,
    },
    className
  );

  return (
    <Button
      type={getButtonType()}
      size={size}
      icon={getStandardizedIcon()}
      loading={loading}
      disabled={disabled}
      block={block}
      danger={danger}
      ghost={ghost}
      className={buttonClassName}
      {...props}
    >
      {children}
    </Button>
  );
};

StandardButton.propTypes = {
  variant: PropTypes.oneOf(['primary', 'secondary', 'text', 'link', 'dashed']),
  size: PropTypes.oneOf(['small', 'middle', 'large']),
  icon: PropTypes.node,
  iconContext: PropTypes.string,
  iconType: PropTypes.string,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  block: PropTypes.bool,
  danger: PropTypes.bool,
  ghost: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node,
};

export { StandardButton };
export default StandardButton;