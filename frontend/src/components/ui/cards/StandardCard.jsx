/**
 * StandardCard Component
 * Standardized card component that extends Ant Design Card with consistent styling
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'antd';
import classNames from 'classnames';
import { useIcon } from '../../../icons/IconProvider';
import { ButtonGroup } from '../buttons';

const StandardCard = ({
  title,
  titleIcon,
  titleIconContext,
  titleIconType,
  subtitle,
  variant = 'default',
  size = 'default',
  bordered = true,
  hoverable = false,
  loading = false,
  actions,
  extra,
  cover,
  children,
  className,
  bodyClassName,
  headClassName,
  padding = 'default',
  shadow = 'default',
  ...props
}) => {
  const { getIconByContext } = useIcon();

  // Get standardized icon for title
  const getTitleIcon = () => {
    if (titleIcon) return titleIcon;
    if (titleIconContext && titleIconType) {
      return getIconByContext(titleIconContext, titleIconType);
    }
    return undefined;
  };

  // Create title with icon and subtitle
  const createTitle = () => {
    if (!title) return undefined;

    const icon = getTitleIcon();
    
    return (
      <div className="flex items-center gap-2">
        {icon}
        <div>
          <div className="font-medium">{title}</div>
          {subtitle && (
            <div className="text-sm text-gray-500 font-normal mt-1">
              {subtitle}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Create actions with ButtonGroup
  const createActions = () => {
    if (!actions || actions.length === 0) return undefined;

    return actions.map((action, index) => (
      <div key={index} className="flex justify-center">
        {action}
      </div>
    ));
  };

  const cardClassName = classNames(
    'standard-card',
    {
      // Variant styles
      'standard-card--elevated': variant === 'elevated',
      'standard-card--outlined': variant === 'outlined',
      'standard-card--ghost': variant === 'ghost',
      'standard-card--filled': variant === 'filled',
      
      // Size styles
      'standard-card--small': size === 'small',
      'standard-card--large': size === 'large',
      
      // Padding styles
      'standard-card--compact': padding === 'compact',
      'standard-card--comfortable': padding === 'comfortable',
      'standard-card--spacious': padding === 'spacious',
      
      // Shadow styles
      'standard-card--shadow-none': shadow === 'none',
      'standard-card--shadow-small': shadow === 'small',
      'standard-card--shadow-medium': shadow === 'medium',
      'standard-card--shadow-large': shadow === 'large',
      
      // Interactive styles
      'standard-card--hoverable': hoverable,
    },
    className
  );

  const cardBodyClassName = classNames(
    'standard-card__body',
    bodyClassName
  );

  const cardHeadClassName = classNames(
    'standard-card__head',
    headClassName
  );

  return (
    <Card
      title={createTitle()}
      extra={extra}
      cover={cover}
      actions={createActions()}
      bordered={bordered}
      hoverable={hoverable}
      loading={loading}
      size={size}
      className={cardClassName}
      classNames={{
        body: cardBodyClassName,
        header: cardHeadClassName,
      }}
      {...props}
    >
      {children}
    </Card>
  );
};

StandardCard.propTypes = {
  title: PropTypes.node,
  titleIcon: PropTypes.node,
  titleIconContext: PropTypes.string,
  titleIconType: PropTypes.string,
  subtitle: PropTypes.node,
  variant: PropTypes.oneOf(['default', 'elevated', 'outlined', 'ghost', 'filled']),
  size: PropTypes.oneOf(['small', 'default', 'large']),
  bordered: PropTypes.bool,
  hoverable: PropTypes.bool,
  loading: PropTypes.bool,
  actions: PropTypes.arrayOf(PropTypes.node),
  extra: PropTypes.node,
  cover: PropTypes.node,
  children: PropTypes.node,
  className: PropTypes.string,
  bodyClassName: PropTypes.string,
  headClassName: PropTypes.string,
  padding: PropTypes.oneOf(['compact', 'default', 'comfortable', 'spacious']),
  shadow: PropTypes.oneOf(['none', 'small', 'default', 'medium', 'large']),
};

export default StandardCard;