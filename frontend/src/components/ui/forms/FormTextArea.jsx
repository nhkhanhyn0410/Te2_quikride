/**
 * FormTextArea Component
 * Standardized textarea wrapper with consistent resize behavior and validation
 */

import React, { forwardRef } from 'react';
import { Input } from 'antd';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const { TextArea } = Input;

const FormTextArea = forwardRef(({
  size = 'large',
  resize = 'vertical',
  error = false,
  success = false,
  warning = false,
  rows = 4,
  maxLength,
  showCount = false,
  className,
  ...props
}, ref) => {
  const textAreaClassName = classNames(
    'transition-all duration-200',
    {
      // Resize behavior
      'resize-none': resize === 'none',
      'resize-y': resize === 'vertical',
      'resize-x': resize === 'horizontal',
      'resize': resize === 'both',
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
    <TextArea
      ref={ref}
      size={size}
      rows={rows}
      maxLength={maxLength}
      showCount={showCount}
      className={textAreaClassName}
      style={{
        resize: resize === 'none' ? 'none' : resize,
      }}
      {...props}
    />
  );
});

FormTextArea.displayName = 'FormTextArea';

FormTextArea.propTypes = {
  size: PropTypes.oneOf(['small', 'middle', 'large']),
  resize: PropTypes.oneOf(['none', 'vertical', 'horizontal', 'both']),
  error: PropTypes.bool,
  success: PropTypes.bool,
  warning: PropTypes.bool,
  rows: PropTypes.number,
  maxLength: PropTypes.number,
  showCount: PropTypes.bool,
  className: PropTypes.string,
};

export { FormTextArea };
export default FormTextArea;