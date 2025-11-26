/**
 * MobileButton Component
 * Mobile-optimized button with touch-friendly interactions
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import classNames from 'classnames';

const MobileButton = ({
  children,
  size = 'large',
  block = false,
  touchTarget = 'default',
  className,
  ...props
}) => {
  // Touch target size mapping
  const touchTargetClasses = {
    small: 'touch-target-sm',
    default: 'touch-target',
    large: 'touch-target-lg',
  };

  const buttonClassName = classNames(
    'mobile-button',
    'transition-responsive',
    'touch-manipulation',
    touchTargetClasses[touchTarget],
    {
      'w-full': block, // Full width on mobile when block is true
    },
    className
  );

  return (
    <Button
      size={size}
      block={block}
      className={buttonClassName}
      style={{
        // Ensure minimum touch target size
        minHeight: touchTarget === 'large' ? '52px' : touchTarget === 'small' ? '36px' : '44px',
        fontSize: '16px', // Prevents zoom on iOS
        ...props.style,
      }}
      {...props}
    >
      {children}
    </Button>
  );
};

MobileButton.propTypes = {
  children: PropTypes.node.isRequired,
  size: PropTypes.oneOf(['small', 'middle', 'large']),
  block: PropTypes.bool,
  touchTarget: PropTypes.oneOf(['small', 'default', 'large']),
  className: PropTypes.string,
};

export default MobileButton;