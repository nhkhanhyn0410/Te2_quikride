/**
 * StandardPanel Component
 * A standardized panel component with multiple variants and consistent styling
 */

import React from 'react';
import { Card } from 'antd';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import PanelHeader from './PanelHeader';
import PanelFooter from './PanelFooter';
import PanelContent from './PanelContent';

const StandardPanel = ({
  variant = 'default',
  size = 'medium',
  padding = 'comfortable',
  header,
  footer,
  actions,
  children,
  className,
  loading = false,
  ...props
}) => {
  // Variant styles mapping
  const variantStyles = {
    default: {
      className: 'bg-white border border-neutral-200',
      bodyStyle: { padding: 0 },
    },
    elevated: {
      className: 'bg-white shadow-lg border-0',
      bodyStyle: { padding: 0 },
    },
    bordered: {
      className: 'bg-white border-2 border-neutral-300',
      bodyStyle: { padding: 0 },
    },
    ghost: {
      className: 'bg-transparent border-0 shadow-none',
      bodyStyle: { padding: 0 },
    },
  };

  // Size styles mapping - Mobile First Responsive
  const sizeStyles = {
    small: {
      className: 'text-responsive-sm',
      minHeight: '150px', // Mobile first - smaller on mobile
      responsiveMinHeight: 'min-h-[150px] sm:min-h-[200px] md:min-h-[250px]',
    },
    medium: {
      className: 'text-responsive-base',
      minHeight: '200px', // Mobile first
      responsiveMinHeight: 'min-h-[200px] sm:min-h-[300px] md:min-h-[350px]',
    },
    large: {
      className: 'text-responsive-lg',
      minHeight: '250px', // Mobile first
      responsiveMinHeight: 'min-h-[250px] sm:min-h-[400px] md:min-h-[450px]',
    },
  };

  // Padding styles mapping - Mobile First Responsive
  const paddingStyles = {
    compact: 'p-responsive-xs', // Uses responsive padding utilities
    comfortable: 'p-responsive-md',
    spacious: 'p-responsive-lg',
  };

  const currentVariant = variantStyles[variant];
  const currentSize = sizeStyles[size];
  const currentPadding = paddingStyles[padding];

  // Combine all class names - Mobile First
  const panelClassName = classNames(
    'standard-panel',
    'rounded-responsive-md', // Responsive border radius
    'transition-responsive', // Responsive transitions
    'w-full', // Full width on mobile
    'touch-manipulation', // Better touch handling
    currentVariant.className,
    currentSize.className,
    currentSize.responsiveMinHeight, // Responsive min height
    className
  );

  // Create header component if header prop is provided
  const headerComponent = header ? (
    <PanelHeader
      title={header.title}
      subtitle={header.subtitle}
      icon={header.icon}
      actions={header.actions || actions}
      size={size}
    />
  ) : null;

  // Create footer component if footer prop is provided
  const footerComponent = footer ? (
    <PanelFooter
      actions={footer.actions}
      align={footer.align}
      size={size}
    />
  ) : null;

  return (
    <Card
      className={panelClassName}
      style={{
        // Remove fixed minHeight, use responsive classes instead
        ...props.style,
      }}
      bodyStyle={currentVariant.bodyStyle}
      loading={loading}
      {...props}
    >
      {headerComponent}
      <PanelContent
        className={currentPadding}
        loading={loading}
        empty={!children}
      >
        {children}
      </PanelContent>
      {footerComponent}
    </Card>
  );
};

StandardPanel.propTypes = {
  /** Panel variant style */
  variant: PropTypes.oneOf(['default', 'elevated', 'bordered', 'ghost']),
  /** Panel size */
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  /** Panel padding style */
  padding: PropTypes.oneOf(['compact', 'comfortable', 'spacious']),
  /** Header configuration */
  header: PropTypes.shape({
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    icon: PropTypes.node,
    actions: PropTypes.arrayOf(PropTypes.node),
  }),
  /** Footer configuration */
  footer: PropTypes.shape({
    actions: PropTypes.arrayOf(PropTypes.node),
    align: PropTypes.oneOf(['left', 'center', 'right']),
  }),
  /** Action buttons for header (legacy support) */
  actions: PropTypes.arrayOf(PropTypes.node),
  /** Panel content */
  children: PropTypes.node,
  /** Additional CSS classes */
  className: PropTypes.string,
  /** Loading state */
  loading: PropTypes.bool,
};

export { StandardPanel };
export default StandardPanel;