/**
 * Form Validation Components
 * Consistent error message styling and validation state indicators
 */

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { 
  CheckCircleOutlined, 
  ExclamationCircleOutlined, 
  CloseCircleOutlined,
  InfoCircleOutlined 
} from '@ant-design/icons';

/**
 * FormFieldError - Individual field error message
 */
export const FormFieldError = ({ 
  message, 
  visible = true, 
  className,
  ...props 
}) => {
  if (!visible || !message) return null;

  const errorClassName = classNames(
    'flex items-center gap-2 mt-1 text-sm text-red-600',
    'transition-all duration-200 ease-in-out',
    className
  );

  return (
    <div className={errorClassName} {...props}>
      <CloseCircleOutlined className="text-red-500 flex-shrink-0" />
      <span>{message}</span>
    </div>
  );
};

FormFieldError.propTypes = {
  message: PropTypes.string,
  visible: PropTypes.bool,
  className: PropTypes.string,
};

/**
 * FormFieldSuccess - Individual field success message
 */
export const FormFieldSuccess = ({ 
  message, 
  visible = true, 
  className,
  ...props 
}) => {
  if (!visible || !message) return null;

  const successClassName = classNames(
    'flex items-center gap-2 mt-1 text-sm text-green-600',
    'transition-all duration-200 ease-in-out',
    className
  );

  return (
    <div className={successClassName} {...props}>
      <CheckCircleOutlined className="text-green-500 flex-shrink-0" />
      <span>{message}</span>
    </div>
  );
};

FormFieldSuccess.propTypes = {
  message: PropTypes.string,
  visible: PropTypes.bool,
  className: PropTypes.string,
};

/**
 * FormFieldWarning - Individual field warning message
 */
export const FormFieldWarning = ({ 
  message, 
  visible = true, 
  className,
  ...props 
}) => {
  if (!visible || !message) return null;

  const warningClassName = classNames(
    'flex items-center gap-2 mt-1 text-sm text-orange-600',
    'transition-all duration-200 ease-in-out',
    className
  );

  return (
    <div className={warningClassName} {...props}>
      <ExclamationCircleOutlined className="text-orange-500 flex-shrink-0" />
      <span>{message}</span>
    </div>
  );
};

FormFieldWarning.propTypes = {
  message: PropTypes.string,
  visible: PropTypes.bool,
  className: PropTypes.string,
};

/**
 * FormFieldHelp - Individual field help text
 */
export const FormFieldHelp = ({ 
  message, 
  visible = true, 
  className,
  ...props 
}) => {
  if (!visible || !message) return null;

  const helpClassName = classNames(
    'flex items-center gap-2 mt-1 text-sm text-gray-500',
    'transition-all duration-200 ease-in-out',
    className
  );

  return (
    <div className={helpClassName} {...props}>
      <InfoCircleOutlined className="text-gray-400 flex-shrink-0" />
      <span>{message}</span>
    </div>
  );
};

FormFieldHelp.propTypes = {
  message: PropTypes.string,
  visible: PropTypes.bool,
  className: PropTypes.string,
};

/**
 * ValidationStateIndicator - Visual indicator for validation states
 */
export const ValidationStateIndicator = ({ 
  state, 
  size = 'default',
  className,
  ...props 
}) => {
  const sizeClasses = {
    small: 'text-sm',
    default: 'text-base',
    large: 'text-lg',
  };

  const indicatorClassName = classNames(
    'flex items-center justify-center',
    sizeClasses[size],
    className
  );

  const getStateIcon = () => {
    switch (state) {
      case 'success':
        return <CheckCircleOutlined className="text-green-500" />;
      case 'error':
        return <CloseCircleOutlined className="text-red-500" />;
      case 'warning':
        return <ExclamationCircleOutlined className="text-orange-500" />;
      case 'info':
        return <InfoCircleOutlined className="text-blue-500" />;
      default:
        return null;
    }
  };

  if (!state || state === 'default') return null;

  return (
    <div className={indicatorClassName} {...props}>
      {getStateIcon()}
    </div>
  );
};

ValidationStateIndicator.propTypes = {
  state: PropTypes.oneOf(['success', 'error', 'warning', 'info', 'default']),
  size: PropTypes.oneOf(['small', 'default', 'large']),
  className: PropTypes.string,
};

/**
 * FormErrorSummary - Form-level error summary component
 */
export const FormErrorSummary = ({ 
  errors = [], 
  title = "Please fix the following errors:",
  visible = true,
  className,
  ...props 
}) => {
  if (!visible || !errors.length) return null;

  const summaryClassName = classNames(
    'bg-red-50 border border-red-200 rounded-lg p-4 mb-6',
    'transition-all duration-200 ease-in-out',
    className
  );

  return (
    <div className={summaryClassName} {...props}>
      <div className="flex items-start gap-3">
        <CloseCircleOutlined className="text-red-500 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h4 className="text-red-800 font-medium mb-2">{title}</h4>
          <ul className="text-red-700 text-sm space-y-1">
            {errors.map((error, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-red-400 mt-1">•</span>
                <span>{error.message || error}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

FormErrorSummary.propTypes = {
  errors: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        field: PropTypes.string,
        message: PropTypes.string.isRequired,
      }),
    ])
  ),
  title: PropTypes.string,
  visible: PropTypes.bool,
  className: PropTypes.string,
};

/**
 * FormSuccessSummary - Form-level success summary component
 */
export const FormSuccessSummary = ({ 
  message = "Form submitted successfully!",
  visible = true,
  className,
  ...props 
}) => {
  if (!visible || !message) return null;

  const summaryClassName = classNames(
    'bg-green-50 border border-green-200 rounded-lg p-4 mb-6',
    'transition-all duration-200 ease-in-out',
    className
  );

  return (
    <div className={summaryClassName} {...props}>
      <div className="flex items-center gap-3">
        <CheckCircleOutlined className="text-green-500 flex-shrink-0" />
        <span className="text-green-800 font-medium">{message}</span>
      </div>
    </div>
  );
};

FormSuccessSummary.propTypes = {
  message: PropTypes.string,
  visible: PropTypes.bool,
  className: PropTypes.string,
};