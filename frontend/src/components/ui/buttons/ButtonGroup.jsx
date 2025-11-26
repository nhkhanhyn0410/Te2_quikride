/**
 * ButtonGroup Component
 * Consistent button grouping and spacing component
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Space } from 'antd';
import classNames from 'classnames';

const ButtonGroup = ({
  children,
  align = 'left',
  spacing = 'middle',
  direction = 'horizontal',
  wrap = false,
  className,
  ...props
}) => {
  const groupClassName = classNames(
    'button-group',
    {
      'justify-start': align === 'left',
      'justify-center': align === 'center',
      'justify-end': align === 'right',
      'justify-between': align === 'space-between',
      'w-full': align === 'space-between' || align === 'center',
    },
    className
  );

  // Map spacing to Ant Design Space sizes
  const getSpaceSize = () => {
    switch (spacing) {
      case 'small':
        return 8;
      case 'middle':
        return 16;
      case 'large':
        return 24;
      default:
        return spacing;
    }
  };

  return (
    <Space
      size={getSpaceSize()}
      direction={direction}
      wrap={wrap}
      className={groupClassName}
      {...props}
    >
      {children}
    </Space>
  );
};

ButtonGroup.propTypes = {
  children: PropTypes.node.isRequired,
  align: PropTypes.oneOf(['left', 'center', 'right', 'space-between']),
  spacing: PropTypes.oneOfType([
    PropTypes.oneOf(['small', 'middle', 'large']),
    PropTypes.number,
  ]),
  direction: PropTypes.oneOf(['horizontal', 'vertical']),
  wrap: PropTypes.bool,
  className: PropTypes.string,
};

export default ButtonGroup;