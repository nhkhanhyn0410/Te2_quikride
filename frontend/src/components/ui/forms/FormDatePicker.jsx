/**
 * FormDatePicker Component
 * Standardized date picker with unified date selection styling
 */

import React, { forwardRef } from 'react';
import { DatePicker } from 'antd';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import dayjs from 'dayjs';

const FormDatePicker = forwardRef(({
  size = 'large',
  variant = 'default',
  error = false,
  success = false,
  warning = false,
  format = 'DD/MM/YYYY',
  showTime = false,
  picker = 'date',
  className,
  ...props
}, ref) => {
  const datePickerClassName = classNames(
    'transition-all duration-200 w-full',
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

  const popupClassName = classNames(
    'rounded-lg shadow-lg',
    {
      'border-red-200': error,
      'border-green-200': success,
      'border-orange-200': warning,
    }
  );

  return (
    <DatePicker
      ref={ref}
      size={size}
      format={format}
      showTime={showTime}
      picker={picker}
      className={datePickerClassName}
      popupClassName={popupClassName}
      {...props}
    />
  );
});

FormDatePicker.displayName = 'FormDatePicker';

FormDatePicker.propTypes = {
  size: PropTypes.oneOf(['small', 'middle', 'large']),
  variant: PropTypes.oneOf(['default', 'filled', 'borderless']),
  error: PropTypes.bool,
  success: PropTypes.bool,
  warning: PropTypes.bool,
  format: PropTypes.string,
  showTime: PropTypes.bool,
  picker: PropTypes.oneOf(['date', 'week', 'month', 'quarter', 'year']),
  className: PropTypes.string,
};

// Export additional DatePicker components
export const FormRangePicker = forwardRef(({
  size = 'large',
  error = false,
  success = false,
  warning = false,
  format = 'DD/MM/YYYY',
  className,
  ...props
}, ref) => {
  const rangePickerClassName = classNames(
    'transition-all duration-200 w-full',
    {
      'border-red-500 hover:border-red-600 focus:border-red-500': error,
      'border-green-500 hover:border-green-600 focus:border-green-500': success,
      'border-orange-500 hover:border-orange-600 focus:border-orange-500': warning,
      'hover:border-blue-400 focus:border-blue-500': !error && !success && !warning,
    },
    className
  );

  return (
    <DatePicker.RangePicker
      ref={ref}
      size={size}
      format={format}
      className={rangePickerClassName}
      {...props}
    />
  );
});

FormRangePicker.displayName = 'FormRangePicker';

FormRangePicker.propTypes = {
  size: PropTypes.oneOf(['small', 'middle', 'large']),
  error: PropTypes.bool,
  success: PropTypes.bool,
  warning: PropTypes.bool,
  format: PropTypes.string,
  className: PropTypes.string,
};

export { FormDatePicker };
export default FormDatePicker;