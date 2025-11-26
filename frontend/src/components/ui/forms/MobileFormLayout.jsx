/**
 * MobileFormLayout Component
 * Mobile-first form layout with touch-friendly interactions
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Form, Space } from 'antd';
import { ResponsiveContainer, ResponsiveText } from '../responsive';
import classNames from 'classnames';

const MobileFormLayout = ({
  children,
  title,
  subtitle,
  layout = 'vertical',
  size = 'large',
  spacing = 'large',
  className,
  ...props
}) => {
  const formClassName = classNames(
    'mobile-form-layout',
    'w-full',
    'touch-manipulation',
    className
  );

  return (
    <ResponsiveContainer size="md" className={formClassName}>
      {/* Form Header */}
      {(title || subtitle) && (
        <div className="mb-6 text-center sm:text-left">
          {title && (
            <ResponsiveText 
              heading={2} 
              className="mb-2"
              color="neutral-900"
            >
              {title}
            </ResponsiveText>
          )}
          {subtitle && (
            <ResponsiveText 
              size="base" 
              color="neutral-600"
            >
              {subtitle}
            </ResponsiveText>
          )}
        </div>
      )}

      {/* Form Content */}
      <Form
        layout={layout}
        size={size}
        className="mobile-form"
        {...props}
      >
        <Space 
          direction="vertical" 
          size={spacing} 
          className="w-full"
        >
          {children}
        </Space>
      </Form>
    </ResponsiveContainer>
  );
};

MobileFormLayout.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  layout: PropTypes.oneOf(['horizontal', 'vertical', 'inline']),
  size: PropTypes.oneOf(['small', 'middle', 'large']),
  spacing: PropTypes.oneOfType([
    PropTypes.oneOf(['small', 'middle', 'large']),
    PropTypes.number,
  ]),
  className: PropTypes.string,
};

export default MobileFormLayout;