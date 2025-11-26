/**
 * FormInput Component
 * Standardized input wrapper that extends Ant Design Input with consistent styling
 */

import React, { forwardRef } from 'react';
import { Input } from 'antd';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const FormInput = forwardRef(({
  size = 'large',
  variant = 'default',
  error = false,
  success = false,
  warning = false,
  className,
  ...props
}, ref) => {
  const inputClassName = classNames(
    'transition-responsive',
    'touch-manipulation', // Better touch handling on mobile
    'w-full', // Full width on mobile
    {
      // Error state
      'border-red-500 hover:border-red-600 focus:border-red-500 focus:shadow-red-100': error,
      // Success state
      'border-green-500 hover:border-green-600 focus:border-green-500 focus:shadow-green-100': success,
      // Warning state
      'border-orange-500 hover:border-orange-600 focus:border-orange-500 focus:shadow-orange-100': warning,
      // Default state enhancements
      'hover:border-blue-400 focus:border-blue-500 focus:shadow-blue-100': !error && !success && !warning,
    },
    className
  );

  return (
    <Input
      ref={ref}
      size={size}
      className={inputClassName}
      style={{
        // Ensure minimum touch target size on mobile
        minHeight: '44px',
        fontSize: '16px', // Prevents zoom on iOS
        ...props.style,
      }}
      {...props}
    />
  );
});

FormInput.displayName = 'FormInput';

FormInput.propTypes = {
  size: PropTypes.oneOf(['small', 'middle', 'large']),
  variant: PropTypes.oneOf(['default', 'filled', 'borderless']),
  error: PropTypes.bool,
  success: PropTypes.bool,
  warning: PropTypes.bool,
  className: PropTypes.string,
};

export { FormInput };
export default FormInput;