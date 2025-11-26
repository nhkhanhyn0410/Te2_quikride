import React from 'react';
import { Skeleton } from 'antd';
import PropTypes from 'prop-types';
import { colorPalette } from '../../../theme/themeConfig';
import './StandardSkeleton.css';

/**
 * StandardSkeleton Component
 * 
 * A unified skeleton component that provides consistent loading states
 * for different content types with theme integration.
 */
const StandardSkeleton = ({
  type = 'default',
  size = 'default',
  animated = true,
  className = '',
  ...props
}) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'avatar':
        return (
          <div className={`standard-skeleton standard-skeleton--${size} ${className}`}>
            <Skeleton.Avatar 
              active={animated} 
              size={getSizeValue(size, 'avatar')}
              {...props} 
            />
          </div>
        );

      case 'button':
        return (
          <div className={`standard-skeleton standard-skeleton--${size} ${className}`}>
            <Skeleton.Button 
              active={animated} 
              size={getSizeValue(size, 'button')}
              {...props} 
            />
          </div>
        );

      case 'input':
        return (
          <div className={`standard-skeleton standard-skeleton--${size} ${className}`}>
            <Skeleton.Input 
              active={animated} 
              size={getSizeValue(size, 'input')}
              {...props} 
            />
          </div>
        );

      case 'image':
        return (
          <div className={`standard-skeleton standard-skeleton--${size} ${className}`}>
            <Skeleton.Image 
              active={animated}
              {...props} 
            />
          </div>
        );

      case 'paragraph':
        return (
          <div className={`standard-skeleton standard-skeleton--${size} ${className}`}>
            <Skeleton 
              active={animated}
              title={false}
              paragraph={{ 
                rows: getSizeValue(size, 'paragraph'),
                width: ['100%', '90%', '80%', '70%']
              }}
              {...props} 
            />
          </div>
        );

      case 'title':
        return (
          <div className={`standard-skeleton standard-skeleton--${size} ${className}`}>
            <Skeleton 
              active={animated}
              title={{ width: getSizeValue(size, 'title') }}
              paragraph={false}
              {...props} 
            />
          </div>
        );

      case 'card':
        return (
          <div className={`standard-skeleton standard-skeleton--card standard-skeleton--${size} ${className}`}>
            <div className="standard-skeleton-card-image">
              <Skeleton.Image active={animated} />
            </div>
            <div className="standard-skeleton-card-content">
              <Skeleton 
                active={animated}
                title={{ width: '70%' }}
                paragraph={{ 
                  rows: getSizeValue(size, 'card'),
                  width: ['100%', '80%']
                }}
              />
            </div>
            <div className="standard-skeleton-card-actions">
              <Skeleton.Button active={animated} size="small" />
              <Skeleton.Button active={animated} size="small" />
            </div>
          </div>
        );

      case 'table':
        const { columns = 4, rows = 5 } = props;
        return (
          <div className={`standard-skeleton standard-skeleton--table standard-skeleton--${size} ${className}`}>
            {/* Table header */}
            <div className="standard-skeleton-table-header">
              {Array.from({ length: columns }, (_, i) => (
                <Skeleton.Input key={i} active={animated} size="small" />
              ))}
            </div>
            
            {/* Table rows */}
            <div className="standard-skeleton-table-body">
              {Array.from({ length: rows }, (_, rowIndex) => (
                <div key={rowIndex} className="standard-skeleton-table-row">
                  {Array.from({ length: columns }, (_, colIndex) => (
                    <Skeleton.Input key={colIndex} active={animated} size="small" />
                  ))}
                </div>
              ))}
            </div>
          </div>
        );

      case 'form':
        const { fields = 4 } = props;
        return (
          <div className={`standard-skeleton standard-skeleton--form standard-skeleton--${size} ${className}`}>
            {Array.from({ length: fields }, (_, i) => (
              <div key={i} className="standard-skeleton-form-field">
                <Skeleton.Input active={animated} size="small" className="standard-skeleton-form-label" />
                <Skeleton.Input active={animated} size="default" className="standard-skeleton-form-input" />
              </div>
            ))}
            <div className="standard-skeleton-form-actions">
              <Skeleton.Button active={animated} size="default" />
              <Skeleton.Button active={animated} size="default" />
            </div>
          </div>
        );

      case 'chart':
        return (
          <div className={`standard-skeleton standard-skeleton--chart standard-skeleton--${size} ${className}`}>
            <div className="standard-skeleton-chart-title">
              <Skeleton.Input active={animated} size="default" />
            </div>
            <div className="standard-skeleton-chart-area">
              <div className="standard-skeleton-chart-placeholder">
                <div className="standard-skeleton-chart-bars">
                  {Array.from({ length: 6 }, (_, i) => (
                    <div 
                      key={i} 
                      className="standard-skeleton-chart-bar"
                      style={{ height: `${Math.random() * 60 + 20}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="standard-skeleton-chart-legend">
              {Array.from({ length: 3 }, (_, i) => (
                <div key={i} className="standard-skeleton-chart-legend-item">
                  <div className="standard-skeleton-chart-legend-color" />
                  <Skeleton.Input active={animated} size="small" />
                </div>
              ))}
            </div>
          </div>
        );

      case 'list':
        const { items = 5 } = props;
        return (
          <div className={`standard-skeleton standard-skeleton--list standard-skeleton--${size} ${className}`}>
            {Array.from({ length: items }, (_, i) => (
              <div key={i} className="standard-skeleton-list-item">
                <Skeleton.Avatar active={animated} size="small" />
                <div className="standard-skeleton-list-content">
                  <Skeleton 
                    active={animated}
                    title={{ width: '60%' }}
                    paragraph={{ rows: 1, width: '80%' }}
                  />
                </div>
              </div>
            ))}
          </div>
        );

      default:
        return (
          <div className={`standard-skeleton standard-skeleton--${size} ${className}`}>
            <Skeleton 
              active={animated}
              avatar
              paragraph={{ rows: 3 }}
              {...props} 
            />
          </div>
        );
    }
  };

  return renderSkeleton();
};

// Helper function to get size values for different skeleton types
const getSizeValue = (size, type) => {
  const sizeMap = {
    avatar: {
      small: 'small',
      default: 'default',
      large: 'large',
    },
    button: {
      small: 'small',
      default: 'default',
      large: 'large',
    },
    input: {
      small: 'small',
      default: 'default',
      large: 'large',
    },
    paragraph: {
      small: 2,
      default: 3,
      large: 4,
    },
    title: {
      small: '40%',
      default: '60%',
      large: '80%',
    },
    card: {
      small: 1,
      default: 2,
      large: 3,
    },
  };

  return sizeMap[type]?.[size] || sizeMap[type]?.default;
};

StandardSkeleton.propTypes = {
  /** Skeleton type */
  type: PropTypes.oneOf([
    'default',
    'avatar',
    'button',
    'input',
    'image',
    'paragraph',
    'title',
    'card',
    'table',
    'form',
    'chart',
    'list'
  ]),
  /** Skeleton size */
  size: PropTypes.oneOf(['small', 'default', 'large']),
  /** Enable animation */
  animated: PropTypes.bool,
  /** Additional CSS class */
  className: PropTypes.string,
  /** Number of table columns (for table type) */
  columns: PropTypes.number,
  /** Number of table rows (for table type) */
  rows: PropTypes.number,
  /** Number of form fields (for form type) */
  fields: PropTypes.number,
  /** Number of list items (for list type) */
  items: PropTypes.number,
};

export default StandardSkeleton;