/**
 * PanelHeader Component
 * Standardized header component for panels with title, subtitle, icon, and actions
 */

import React from 'react';
import { Typography, Space, Divider } from 'antd';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const { Title, Text } = Typography;

const PanelHeader = ({
  title,
  subtitle,
  icon,
  actions = [],
  size = 'medium',
  className,
  showDivider = true,
  ...props
}) => {
  // Size-based styling
  const sizeConfig = {
    small: {
      titleLevel: 5,
      titleClassName: 'text-base font-semibold mb-0',
      subtitleClassName: 'text-sm text-neutral-600 mb-0',
      padding: 'px-4 py-3',
      iconSize: '16px',
    },
    medium: {
      titleLevel: 4,
      titleClassName: 'text-lg font-semibold mb-0',
      subtitleClassName: 'text-sm text-neutral-600 mb-0',
      padding: 'px-6 py-4',
      iconSize: '20px',
    },
    large: {
      titleLevel: 3,
      titleClassName: 'text-xl font-semibold mb-0',
      subtitleClassName: 'text-base text-neutral-600 mb-0',
      padding: 'px-8 py-5',
      iconSize: '24px',
    },
  };

  const config = sizeConfig[size];

  const headerClassName = classNames(
    'panel-header',
    'flex',
    'items-center',
    'justify-between',
    config.padding,
    className
  );

  return (
    <>
      <div className={headerClassName} {...props}>
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          {icon && (
            <div 
              className="flex-shrink-0 text-primary-500"
              style={{ fontSize: config.iconSize }}
            >
              {icon}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <Title 
              level={config.titleLevel} 
              className={config.titleClassName}
              ellipsis={{ tooltip: title }}
            >
              {title}
            </Title>
            {subtitle && (
              <Text className={config.subtitleClassName} ellipsis={{ tooltip: subtitle }}>
                {subtitle}
              </Text>
            )}
          </div>
        </div>
        
        {actions.length > 0 && (
          <div className="flex-shrink-0 ml-4">
            <Space size="small">
              {actions.map((action, index) => (
                <div key={index} className="panel-header-action">
                  {action}
                </div>
              ))}
            </Space>
          </div>
        )}
      </div>
      
      {showDivider && (
        <Divider className="my-0 border-neutral-200" />
      )}
    </>
  );
};

PanelHeader.propTypes = {
  /** Header title */
  title: PropTypes.string.isRequired,
  /** Header subtitle */
  subtitle: PropTypes.string,
  /** Header icon */
  icon: PropTypes.node,
  /** Action buttons */
  actions: PropTypes.arrayOf(PropTypes.node),
  /** Header size */
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  /** Additional CSS classes */
  className: PropTypes.string,
  /** Show divider below header */
  showDivider: PropTypes.bool,
};

export { PanelHeader };
export default PanelHeader;