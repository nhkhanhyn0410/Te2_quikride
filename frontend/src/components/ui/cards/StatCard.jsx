/**
 * StatCard Component
 * Specialized card for displaying statistics with consistent styling
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Statistic, Typography } from 'antd';
import StandardCard from './StandardCard';
import { useIcon } from '../../../icons/IconProvider';

const { Text } = Typography;

const StatCard = ({
  title,
  value,
  prefix,
  suffix,
  precision,
  formatter,
  valueStyle,
  icon,
  iconContext,
  iconType,
  trend,
  trendValue,
  trendType = 'up', // 'up', 'down', 'neutral'
  loading = false,
  variant = 'default',
  size = 'default',
  color,
  ...props
}) => {
  const { getIconByContext } = useIcon();

  // Get standardized icon
  const getStatIcon = () => {
    if (icon) return icon;
    if (iconContext && iconType) {
      return getIconByContext(iconContext, iconType);
    }
    return undefined;
  };

  // Get trend icon
  const getTrendIcon = () => {
    switch (trendType) {
      case 'up':
        return getIconByContext('status', 'up');
      case 'down':
        return getIconByContext('status', 'down');
      default:
        return null;
    }
  };

  // Get trend color
  const getTrendColor = () => {
    switch (trendType) {
      case 'up':
        return '#52c41a'; // green
      case 'down':
        return '#f5222d'; // red
      default:
        return '#8c8c8c'; // gray
    }
  };

  // Create value style with color
  const createValueStyle = () => {
    const baseStyle = valueStyle || {};
    if (color) {
      return { ...baseStyle, color };
    }
    return baseStyle;
  };

  // Create trend display
  const createTrend = () => {
    if (!trend && !trendValue) return null;

    return (
      <div className="flex items-center gap-1 mt-2">
        {getTrendIcon()}
        <Text style={{ color: getTrendColor(), fontSize: '12px' }}>
          {trendValue && `${trendValue} `}
          {trend}
        </Text>
      </div>
    );
  };

  return (
    <StandardCard
      variant={variant}
      size={size}
      loading={loading}
      className="stat-card"
      {...props}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <Statistic
            title={title}
            value={value}
            prefix={prefix}
            suffix={suffix}
            precision={precision}
            formatter={formatter}
            valueStyle={createValueStyle()}
          />
          {createTrend()}
        </div>
        {getStatIcon() && (
          <div className="flex-shrink-0 ml-4">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ 
                backgroundColor: color ? `${color}15` : '#f0f0f0',
                color: color || '#8c8c8c'
              }}
            >
              {getStatIcon()}
            </div>
          </div>
        )}
      </div>
    </StandardCard>
  );
};

StatCard.propTypes = {
  title: PropTypes.node.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  prefix: PropTypes.node,
  suffix: PropTypes.node,
  precision: PropTypes.number,
  formatter: PropTypes.func,
  valueStyle: PropTypes.object,
  icon: PropTypes.node,
  iconContext: PropTypes.string,
  iconType: PropTypes.string,
  trend: PropTypes.string,
  trendValue: PropTypes.string,
  trendType: PropTypes.oneOf(['up', 'down', 'neutral']),
  loading: PropTypes.bool,
  variant: PropTypes.oneOf(['default', 'elevated', 'outlined', 'ghost', 'filled']),
  size: PropTypes.oneOf(['small', 'default', 'large']),
  color: PropTypes.string,
};

export default StatCard;