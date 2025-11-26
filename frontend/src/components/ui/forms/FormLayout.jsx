/**
 * Form Layout Components
 * Standardized form layout patterns and section components
 */

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Form, Row, Col, Divider } from 'antd';

/**
 * FormSection - Component for grouping related form fields
 */
export const FormSection = ({
  title,
  subtitle,
  children,
  divider = false,
  collapsible = false,
  defaultCollapsed = false,
  className,
  ...props
}) => {
  const [collapsed, setCollapsed] = React.useState(defaultCollapsed);

  const sectionClassName = classNames(
    'form-section',
    {
      'mb-8': !divider,
      'mb-6': divider,
    },
    className
  );

  const contentClassName = classNames(
    'form-section-content',
    {
      'hidden': collapsible && collapsed,
      'block': !collapsible || !collapsed,
    }
  );

  const handleToggle = () => {
    if (collapsible) {
      setCollapsed(!collapsed);
    }
  };

  return (
    <div className={sectionClassName} {...props}>
      {(title || subtitle) && (
        <div className="form-section-header mb-6">
          {title && (
            <h3 
              className={classNames(
                'text-lg font-semibold text-gray-900 mb-1',
                {
                  'cursor-pointer hover:text-blue-600': collapsible,
                }
              )}
              onClick={handleToggle}
            >
              {title}
              {collapsible && (
                <span className="ml-2 text-sm text-gray-500">
                  {collapsed ? '▶' : '▼'}
                </span>
              )}
            </h3>
          )}
          {subtitle && (
            <p className="text-sm text-gray-600">{subtitle}</p>
          )}
        </div>
      )}
      
      <div className={contentClassName}>
        {children}
      </div>
      
      {divider && <Divider className="my-8" />}
    </div>
  );
};

FormSection.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  children: PropTypes.node.isRequired,
  divider: PropTypes.bool,
  collapsible: PropTypes.bool,
  defaultCollapsed: PropTypes.bool,
  className: PropTypes.string,
};

/**
 * FormActions - Component for submit/cancel button placement
 */
export const FormActions = ({
  children,
  align = 'left',
  sticky = false,
  className,
  ...props
}) => {
  const actionsClassName = classNames(
    'form-actions',
    'flex gap-3 pt-6 mt-6 border-t border-gray-200',
    {
      'justify-start': align === 'left',
      'justify-center': align === 'center',
      'justify-end': align === 'right',
      'justify-between': align === 'between',
      'sticky bottom-0 bg-white z-10 shadow-lg px-6 py-4 -mx-6': sticky,
    },
    className
  );

  return (
    <div className={actionsClassName} {...props}>
      {children}
    </div>
  );
};

FormActions.propTypes = {
  children: PropTypes.node.isRequired,
  align: PropTypes.oneOf(['left', 'center', 'right', 'between']),
  sticky: PropTypes.bool,
  className: PropTypes.string,
};

/**
 * FormGrid - Responsive grid layout for form fields
 */
export const FormGrid = ({
  children,
  columns = { xs: 1, sm: 1, md: 2, lg: 2, xl: 3 },
  gutter = [16, 16],
  className,
  ...props
}) => {
  const gridClassName = classNames(
    'form-grid',
    className
  );

  return (
    <Row gutter={gutter} className={gridClassName} {...props}>
      {React.Children.map(children, (child, index) => (
        <Col
          key={index}
          xs={24 / columns.xs}
          sm={24 / columns.sm}
          md={24 / columns.md}
          lg={24 / columns.lg}
          xl={24 / columns.xl}
        >
          {child}
        </Col>
      ))}
    </Row>
  );
};

FormGrid.propTypes = {
  children: PropTypes.node.isRequired,
  columns: PropTypes.shape({
    xs: PropTypes.number,
    sm: PropTypes.number,
    md: PropTypes.number,
    lg: PropTypes.number,
    xl: PropTypes.number,
  }),
  gutter: PropTypes.array,
  className: PropTypes.string,
};

/**
 * FormField - Wrapper for individual form fields with consistent spacing
 */
export const FormField = ({
  label,
  required = false,
  error,
  success,
  warning,
  help,
  children,
  className,
  ...props
}) => {
  const fieldClassName = classNames(
    'form-field mb-6',
    className
  );

  const labelClassName = classNames(
    'block text-sm font-medium text-gray-700 mb-2',
    {
      'after:content-["*"] after:text-red-500 after:ml-1': required,
    }
  );

  return (
    <div className={fieldClassName} {...props}>
      {label && (
        <label className={labelClassName}>
          {label}
        </label>
      )}
      
      <div className="form-field-input">
        {children}
      </div>
      
      {(error || success || warning || help) && (
        <div className="form-field-feedback mt-1">
          {error && (
            <div className="text-sm text-red-600 flex items-center gap-1">
              <span className="text-red-500">●</span>
              {error}
            </div>
          )}
          {success && !error && (
            <div className="text-sm text-green-600 flex items-center gap-1">
              <span className="text-green-500">●</span>
              {success}
            </div>
          )}
          {warning && !error && !success && (
            <div className="text-sm text-orange-600 flex items-center gap-1">
              <span className="text-orange-500">●</span>
              {warning}
            </div>
          )}
          {help && !error && !success && !warning && (
            <div className="text-sm text-gray-500">
              {help}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

FormField.propTypes = {
  label: PropTypes.string,
  required: PropTypes.bool,
  error: PropTypes.string,
  success: PropTypes.string,
  warning: PropTypes.string,
  help: PropTypes.string,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

/**
 * FormContainer - Main container for forms with consistent padding and max-width
 */
export const FormContainer = ({
  children,
  maxWidth = 'lg',
  padding = 'default',
  className,
  ...props
}) => {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    '2xl': 'max-w-6xl',
    full: 'max-w-full',
  };

  const paddingClasses = {
    none: '',
    sm: 'p-4',
    default: 'p-6',
    lg: 'p-8',
  };

  const containerClassName = classNames(
    'form-container mx-auto',
    maxWidthClasses[maxWidth],
    paddingClasses[padding],
    className
  );

  return (
    <div className={containerClassName} {...props}>
      {children}
    </div>
  );
};

FormContainer.propTypes = {
  children: PropTypes.node.isRequired,
  maxWidth: PropTypes.oneOf(['sm', 'md', 'lg', 'xl', '2xl', 'full']),
  padding: PropTypes.oneOf(['none', 'sm', 'default', 'lg']),
  className: PropTypes.string,
};