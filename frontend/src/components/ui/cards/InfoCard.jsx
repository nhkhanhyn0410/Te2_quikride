/**
 * InfoCard Component
 * Card for displaying information with consistent styling and optional status indicators
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Typography, Tag, Space } from 'antd';
import StandardCard from './StandardCard';
import { useIcon } from '../../../icons/IconProvider';

const { Title, Text, Paragraph } = Typography;

const InfoCard = ({
  title,
  subtitle,
  description,
  status,
  statusType = 'default', // 'success', 'warning', 'error', 'info', 'default'
  statusText,
  icon,
  iconContext,
  iconType,
  metadata = [],
  tags = [],
  variant = 'default',
  size = 'default',
  ...props
}) => {
  const { getIconByContext } = useIcon();

  // Get standardized icon
  const getInfoIcon = () => {
    if (icon) return icon;
    if (iconContext && iconType) {
      return getIconByContext(iconContext, iconType);
    }
    return undefined;
  };

  // Get status color
  const getStatusColor = () => {
    switch (statusType) {
      case 'success':
        return 'green';
      case 'warning':
        return 'orange';
      case 'error':
        return 'red';
      case 'info':
        return 'blue';
      default:
        return 'default';
    }
  };

  // Create status display
  const createStatus = () => {
    if (!status && !statusText) return null;

    return (
      <Tag color={getStatusColor()}>
        {statusText || status}
      </Tag>
    );
  };

  // Create metadata display
  const createMetadata = () => {
    if (metadata.length === 0) return null;

    return (
      <div className="mt-3 space-y-1">
        {metadata.map((item, index) => (
          <div key={index} className="flex justify-between items-center text-sm">
            <Text type="secondary">{item.label}:</Text>
            <Text>{item.value}</Text>
          </div>
        ))}
      </div>
    );
  };

  // Create tags display
  const createTags = () => {
    if (tags.length === 0) return null;

    return (
      <div className="mt-3">
        <Space wrap>
          {tags.map((tag, index) => (
            <Tag key={index} color={tag.color || 'default'}>
              {tag.text || tag}
            </Tag>
          ))}
        </Space>
      </div>
    );
  };

  // Create card title with status
  const createCardTitle = () => {
    if (!title) return undefined;

    return (
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {getInfoIcon()}
          <div>
            <div className="font-medium">{title}</div>
            {subtitle && (
              <div className="text-sm text-gray-500 font-normal mt-1">
                {subtitle}
              </div>
            )}
          </div>
        </div>
        {createStatus()}
      </div>
    );
  };

  return (
    <StandardCard
      title={createCardTitle()}
      variant={variant}
      size={size}
      className="info-card"
      {...props}
    >
      <div className="space-y-3">
        {description && (
          <div>
            {typeof description === 'string' ? (
              <Paragraph className="mb-0">{description}</Paragraph>
            ) : (
              description
            )}
          </div>
        )}
        
        {createMetadata()}
        {createTags()}
      </div>
    </StandardCard>
  );
};

InfoCard.propTypes = {
  title: PropTypes.node,
  subtitle: PropTypes.node,
  description: PropTypes.node,
  status: PropTypes.string,
  statusType: PropTypes.oneOf(['success', 'warning', 'error', 'info', 'default']),
  statusText: PropTypes.string,
  icon: PropTypes.node,
  iconContext: PropTypes.string,
  iconType: PropTypes.string,
  metadata: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.node.isRequired,
  })),
  tags: PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      color: PropTypes.string,
    }),
  ])),
  variant: PropTypes.oneOf(['default', 'elevated', 'outlined', 'ghost', 'filled']),
  size: PropTypes.oneOf(['small', 'default', 'large']),
};

export default InfoCard;