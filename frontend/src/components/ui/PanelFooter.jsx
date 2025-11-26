/**
 * PanelFooter Component
 * Standardized footer component for panels with consistent button placement and spacing
 */

import React from 'react';
import { Space, Divider } from 'antd';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const PanelFooter = ({
  actions = [],
  align = 'right',
  size = 'medium',
  className,
  showDivider = true,
  ...props
}) => {
  // Size-based styling
  const sizeConfig = {
    small: {
      padding: 'px-4 py-3',
      spacing: 'small',
    },
    medium: {
      padding: 'px-6 py-4',
      spacing: 'middle',
    },
    large: {
      padding: 'px-8 py-5',
      spacing: 'large',
    },
  };

  const config = sizeConfig[size];

  // Alignment classes
  const alignmentClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  };

  const footerClassName = classNames(
    'panel-footer',
    'flex',
    'items-center',
    alignmentClasses[align],
    config.padding,
    className
  );

  // Don't render if no actions
  if (!actions || actions.length === 0) {
    return null;
  }

  return (
    <>
      {showDivider && (
        <Divider className="my-0 border-neutral-200" />
      )}
      <div className={footerClassName} {...props}>
        <Space size={config.spacing}>
          {actions.map((action, index) => (
            <div key={index} className="panel-footer-action">
              {action}
            </div>
          ))}
        </Space>
      </div>
    </>
  );
};

PanelFooter.propTypes = {
  /** Footer action buttons */
  actions: PropTypes.arrayOf(PropTypes.node),
  /** Footer alignment */
  align: PropTypes.oneOf(['left', 'center', 'right']),
  /** Footer size */
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  /** Additional CSS classes */
  className: PropTypes.string,
  /** Show divider above footer */
  showDivider: PropTypes.bool,
};

export { PanelFooter };
export default PanelFooter;