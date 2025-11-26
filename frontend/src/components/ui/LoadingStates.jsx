/**
 * Loading State Components
 * Standardized loading indicators for different content types
 */

import React from 'react';
import { Spin, Skeleton } from 'antd';
import PropTypes from 'prop-types';
import classNames from 'classnames';

/**
 * Standard Loading Spinner
 * Consistent loading spinner with different sizes
 */
export const LoadingSpinner = ({
  size = 'default',
  tip,
  className,
  ...props
}) => {
  const spinnerClassName = classNames(
    'flex',
    'items-center',
    'justify-center',
    'py-8',
    className
  );

  return (
    <div className={spinnerClassName} {...props}>
      <Spin size={size} tip={tip} />
    </div>
  );
};

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(['small', 'default', 'large']),
  tip: PropTypes.string,
  className: PropTypes.string,
};

/**
 * Panel Loading Skeleton
 * Skeleton loading state for panel content
 */
export const PanelSkeleton = ({
  rows = 3,
  avatar = false,
  title = true,
  paragraph = true,
  active = true,
  className,
  ...props
}) => {
  const skeletonClassName = classNames(
    'p-6',
    className
  );

  return (
    <div className={skeletonClassName} {...props}>
      <Skeleton
        avatar={avatar}
        title={title}
        paragraph={{ rows }}
        active={active}
      />
    </div>
  );
};

PanelSkeleton.propTypes = {
  rows: PropTypes.number,
  avatar: PropTypes.bool,
  title: PropTypes.bool,
  paragraph: PropTypes.bool,
  active: PropTypes.bool,
  className: PropTypes.string,
};

/**
 * Table Loading Skeleton
 * Skeleton loading state for table content
 */
export const TableSkeleton = ({
  columns = 4,
  rows = 5,
  className,
  ...props
}) => {
  const tableClassName = classNames(
    'space-y-4',
    'p-6',
    className
  );

  return (
    <div className={tableClassName} {...props}>
      {/* Table header skeleton */}
      <div className="flex space-x-4">
        {Array.from({ length: columns }, (_, i) => (
          <div key={i} className="flex-1">
            <Skeleton.Input active size="small" />
          </div>
        ))}
      </div>
      
      {/* Table rows skeleton */}
      {Array.from({ length: rows }, (_, rowIndex) => (
        <div key={rowIndex} className="flex space-x-4">
          {Array.from({ length: columns }, (_, colIndex) => (
            <div key={colIndex} className="flex-1">
              <Skeleton.Input active size="small" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

TableSkeleton.propTypes = {
  columns: PropTypes.number,
  rows: PropTypes.number,
  className: PropTypes.string,
};

/**
 * Card Loading Skeleton
 * Skeleton loading state for card content
 */
export const CardSkeleton = ({
  image = true,
  title = true,
  description = true,
  actions = true,
  className,
  ...props
}) => {
  const cardClassName = classNames(
    'p-6',
    'space-y-4',
    className
  );

  return (
    <div className={cardClassName} {...props}>
      {image && (
        <Skeleton.Image active className="w-full h-32" />
      )}
      {title && (
        <Skeleton.Input active size="default" className="w-3/4" />
      )}
      {description && (
        <Skeleton active paragraph={{ rows: 2 }} title={false} />
      )}
      {actions && (
        <div className="flex space-x-2">
          <Skeleton.Button active size="default" />
          <Skeleton.Button active size="default" />
        </div>
      )}
    </div>
  );
};

CardSkeleton.propTypes = {
  image: PropTypes.bool,
  title: PropTypes.bool,
  description: PropTypes.bool,
  actions: PropTypes.bool,
  className: PropTypes.string,
};

/**
 * Form Loading Skeleton
 * Skeleton loading state for form content
 */
export const FormSkeleton = ({
  fields = 4,
  buttons = 2,
  className,
  ...props
}) => {
  const formClassName = classNames(
    'space-y-6',
    'p-6',
    className
  );

  return (
    <div className={formClassName} {...props}>
      {Array.from({ length: fields }, (_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton.Input active size="small" className="w-1/4" />
          <Skeleton.Input active size="default" className="w-full" />
        </div>
      ))}
      
      <div className="flex space-x-4 pt-4">
        {Array.from({ length: buttons }, (_, i) => (
          <Skeleton.Button key={i} active size="default" />
        ))}
      </div>
    </div>
  );
};

FormSkeleton.propTypes = {
  fields: PropTypes.number,
  buttons: PropTypes.number,
  className: PropTypes.string,
};

/**
 * Chart Loading Skeleton
 * Skeleton loading state for chart content
 */
export const ChartSkeleton = ({
  type = 'bar',
  className,
  ...props
}) => {
  const chartClassName = classNames(
    'p-6',
    'space-y-4',
    className
  );

  return (
    <div className={chartClassName} {...props}>
      {/* Chart title */}
      <Skeleton.Input active size="default" className="w-1/3" />
      
      {/* Chart area */}
      <div className="h-64 bg-neutral-100 rounded-lg flex items-center justify-center">
        <div className="text-neutral-400">
          <LoadingSpinner size="large" tip="Loading chart..." />
        </div>
      </div>
      
      {/* Chart legend */}
      <div className="flex space-x-4 justify-center">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-neutral-200 rounded"></div>
            <Skeleton.Input active size="small" className="w-16" />
          </div>
        ))}
      </div>
    </div>
  );
};

ChartSkeleton.propTypes = {
  type: PropTypes.oneOf(['bar', 'line', 'pie', 'area']),
  className: PropTypes.string,
};

export default {
  LoadingSpinner,
  PanelSkeleton,
  TableSkeleton,
  CardSkeleton,
  FormSkeleton,
  ChartSkeleton,
};