/**
 * PanelContent Component
 * Standardized content component for panels with proper padding and overflow handling
 */

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { LoadingSpinner, PanelSkeleton } from './LoadingStates';
import { EmptyState } from './EmptyStates';

const PanelContent = ({
  children,
  loading = false,
  loadingType = 'spinner', // 'spinner' or 'skeleton'
  empty = false,
  emptyType = 'default', // 'default', 'noData', 'noResults', etc.
  emptyDescription = 'No data available',
  emptyImage,
  emptyAction,
  className,
  scrollable = false,
  maxHeight,
  padding = 'default', // 'none', 'compact', 'default', 'comfortable'
  ...props
}) => {
  // Padding configuration
  const paddingConfig = {
    none: '',
    compact: 'p-3',
    default: 'p-6',
    comfortable: 'p-8',
  };

  const contentClassName = classNames(
    'panel-content',
    'relative',
    {
      'overflow-auto': scrollable,
      'overflow-hidden': !scrollable,
    },
    paddingConfig[padding],
    className
  );

  const contentStyle = {
    ...(maxHeight && { maxHeight }),
    ...props.style,
  };

  // Loading state
  if (loading) {
    return (
      <div className={contentClassName} style={contentStyle} {...props}>
        {loadingType === 'skeleton' ? (
          <PanelSkeleton />
        ) : (
          <LoadingSpinner size="large" />
        )}
      </div>
    );
  }

  // Empty state
  if (empty) {
    return (
      <div className={contentClassName} style={contentStyle} {...props}>
        <EmptyState
          title={emptyDescription}
          image={emptyImage}
          action={emptyAction}
        />
      </div>
    );
  }

  // Normal content
  return (
    <div className={contentClassName} style={contentStyle} {...props}>
      {children}
    </div>
  );
};

PanelContent.propTypes = {
  /** Panel content */
  children: PropTypes.node,
  /** Loading state */
  loading: PropTypes.bool,
  /** Loading type */
  loadingType: PropTypes.oneOf(['spinner', 'skeleton']),
  /** Empty state */
  empty: PropTypes.bool,
  /** Empty state type */
  emptyType: PropTypes.oneOf(['default', 'noData', 'noResults']),
  /** Empty state description */
  emptyDescription: PropTypes.string,
  /** Empty state image */
  emptyImage: PropTypes.node,
  /** Empty state action */
  emptyAction: PropTypes.node,
  /** Additional CSS classes */
  className: PropTypes.string,
  /** Enable scrollable content */
  scrollable: PropTypes.bool,
  /** Maximum height for scrollable content */
  maxHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /** Content padding */
  padding: PropTypes.oneOf(['none', 'compact', 'default', 'comfortable']),
};

export { PanelContent };
export default PanelContent;