/**
 * Form Loading States Components
 * Consistent loading state indicators for form submission
 */

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Spin, Button } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

/**
 * FormSubmitButton - Button with integrated loading state
 */
export const FormSubmitButton = ({
  loading = false,
  disabled = false,
  children = "Submit",
  loadingText = "Submitting...",
  type = "primary",
  size = "large",
  className,
  ...props
}) => {
  const buttonClassName = classNames(
    'transition-all duration-200',
    {
      'opacity-75 cursor-not-allowed': loading,
    },
    className
  );

  return (
    <Button
      type={type}
      size={size}
      loading={loading}
      disabled={disabled || loading}
      className={buttonClassName}
      {...props}
    >
      {loading ? loadingText : children}
    </Button>
  );
};

FormSubmitButton.propTypes = {
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  children: PropTypes.node,
  loadingText: PropTypes.string,
  type: PropTypes.oneOf(['primary', 'default', 'dashed', 'text', 'link']),
  size: PropTypes.oneOf(['small', 'middle', 'large']),
  className: PropTypes.string,
};

/**
 * FormLoadingOverlay - Overlay for entire form during submission
 */
export const FormLoadingOverlay = ({
  loading = false,
  message = "Processing...",
  children,
  className,
  ...props
}) => {
  const overlayClassName = classNames(
    'relative',
    className
  );

  const spinnerClassName = classNames(
    'absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10',
    'transition-all duration-200',
    {
      'opacity-100 visible': loading,
      'opacity-0 invisible': !loading,
    }
  );

  return (
    <div className={overlayClassName} {...props}>
      {children}
      {loading && (
        <div className={spinnerClassName}>
          <div className="text-center">
            <Spin 
              size="large" 
              indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
            />
            {message && (
              <div className="mt-3 text-gray-600 font-medium">
                {message}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

FormLoadingOverlay.propTypes = {
  loading: PropTypes.bool,
  message: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
};

/**
 * FormFieldSpinner - Small spinner for individual field loading
 */
export const FormFieldSpinner = ({
  loading = false,
  size = 'small',
  className,
  ...props
}) => {
  if (!loading) return null;

  const spinnerClassName = classNames(
    'inline-flex items-center justify-center',
    className
  );

  const spinnerSize = {
    small: 14,
    default: 16,
    large: 20,
  };

  return (
    <div className={spinnerClassName} {...props}>
      <Spin 
        size={size}
        indicator={
          <LoadingOutlined 
            style={{ fontSize: spinnerSize[size] }} 
            spin 
          />
        }
      />
    </div>
  );
};

FormFieldSpinner.propTypes = {
  loading: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'default', 'large']),
  className: PropTypes.string,
};

/**
 * FormProgressIndicator - Progress indicator for multi-step forms
 */
export const FormProgressIndicator = ({
  current = 0,
  total = 1,
  showPercentage = true,
  showSteps = true,
  className,
  ...props
}) => {
  const progressClassName = classNames(
    'w-full',
    className
  );

  const percentage = Math.round((current / total) * 100);

  return (
    <div className={progressClassName} {...props}>
      {showSteps && (
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Step {current} of {total}</span>
          {showPercentage && <span>{percentage}%</span>}
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-blue-500 h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

FormProgressIndicator.propTypes = {
  current: PropTypes.number,
  total: PropTypes.number,
  showPercentage: PropTypes.bool,
  showSteps: PropTypes.bool,
  className: PropTypes.string,
};

/**
 * FormSavingIndicator - Indicator for auto-save functionality
 */
export const FormSavingIndicator = ({
  status = 'idle', // 'idle', 'saving', 'saved', 'error'
  savedText = "Saved",
  savingText = "Saving...",
  errorText = "Save failed",
  className,
  ...props
}) => {
  if (status === 'idle') return null;

  const indicatorClassName = classNames(
    'inline-flex items-center gap-2 text-sm',
    {
      'text-gray-500': status === 'saving',
      'text-green-600': status === 'saved',
      'text-red-600': status === 'error',
    },
    className
  );

  const getText = () => {
    switch (status) {
      case 'saving':
        return savingText;
      case 'saved':
        return savedText;
      case 'error':
        return errorText;
      default:
        return '';
    }
  };

  return (
    <div className={indicatorClassName} {...props}>
      {status === 'saving' && (
        <FormFieldSpinner loading size="small" />
      )}
      {status === 'saved' && (
        <span className="w-3 h-3 bg-green-500 rounded-full" />
      )}
      {status === 'error' && (
        <span className="w-3 h-3 bg-red-500 rounded-full" />
      )}
      <span>{getText()}</span>
    </div>
  );
};

FormSavingIndicator.propTypes = {
  status: PropTypes.oneOf(['idle', 'saving', 'saved', 'error']),
  savedText: PropTypes.string,
  savingText: PropTypes.string,
  errorText: PropTypes.string,
  className: PropTypes.string,
};