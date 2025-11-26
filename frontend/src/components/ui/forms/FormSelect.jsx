/**
 * FormSelect Component
 * Standardized select wrapper with consistent dropdown styling and behavior
 */

import React, { forwardRef } from 'react';
import { Select } from 'antd';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const { Option } = Select;

const FormSelect = forwardRef(({
  size = 'large',
  variant = 'default',
  error = false,
  success = false,
  warning = false,
  options = [],
  className,
  ...props
}, ref) => {
  const selectClassName = classNames(
    'transition-all duration-200',
    {
      // Error state
      'border-red-500 hover:border-red-600 focus:border-red-500': error,
      // Success state
      'border-green-500 hover:border-green-600 focus:border-green-500': success,
      // Warning state
      'border-orange-500 hover:border-orange-600 focus:border-orange-500': warning,
      // Default state enhancements
      'hover:border-blue-400 focus:border-blue-500': !error && !success && !warning,
    },
    className
  );

  const dropdownClassName = classNames(
    'rounded-lg shadow-lg border-0',
    {
      'border-red-200': error,
      'border-green-200': success,
      'border-orange-200': warning,
    }
  );

  return (
    <Select
      ref={ref}
      size={size}
      className={selectClassName}
      dropdownClassName={dropdownClassName}
      {...props}
    >
      {options.map((option) => (
        <Option 
          key={option.value} 
          value={option.value}
          disabled={option.disabled}
        >
          {option.label}
        </Option>
      ))}
    </Select>
  );
});

FormSelect.displayName = 'FormSelect';

FormSelect.propTypes = {
  size: PropTypes.oneOf(['small', 'middle', 'large']),
  variant: PropTypes.oneOf(['default', 'filled', 'borderless']),
  error: PropTypes.bool,
  success: PropTypes.bool,
  warning: PropTypes.bool,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string.isRequired,
      disabled: PropTypes.bool,
    })
  ),
  className: PropTypes.string,
};

export { Option, FormSelect };
export default FormSelect;