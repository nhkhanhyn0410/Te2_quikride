/**
 * ActionCard Component
 * Card with built-in action buttons and consistent styling
 */

import React from 'react';
import PropTypes from 'prop-types';
import StandardCard from './StandardCard';
import { ButtonGroup, ActionButton } from '../buttons';

const ActionCard = ({
  title,
  titleIcon,
  titleIconContext,
  titleIconType,
  subtitle,
  children,
  primaryAction,
  secondaryActions = [],
  footerActions = [],
  actionsAlign = 'right',
  actionsSpacing = 'middle',
  loading = false,
  disabled = false,
  variant = 'default',
  ...props
}) => {
  // Create header actions (extra prop)
  const createHeaderActions = () => {
    if (!primaryAction && secondaryActions.length === 0) return undefined;

    const actions = [];
    
    // Add secondary actions first
    secondaryActions.forEach((action, index) => {
      actions.push(
        <ActionButton
          key={`secondary-${index}`}
          {...action}
          disabled={disabled || action.disabled}
          loading={loading && action.loading}
        />
      );
    });

    // Add primary action last
    if (primaryAction) {
      actions.push(
        <ActionButton
          key="primary"
          {...primaryAction}
          disabled={disabled || primaryAction.disabled}
          loading={loading && primaryAction.loading}
        />
      );
    }

    return (
      <ButtonGroup align={actionsAlign} spacing={actionsSpacing}>
        {actions}
      </ButtonGroup>
    );
  };

  // Create footer actions
  const createFooterActions = () => {
    if (footerActions.length === 0) return undefined;

    return footerActions.map((action, index) => (
      <ActionButton
        key={index}
        {...action}
        disabled={disabled || action.disabled}
        loading={loading && action.loading}
      />
    ));
  };

  return (
    <StandardCard
      title={title}
      titleIcon={titleIcon}
      titleIconContext={titleIconContext}
      titleIconType={titleIconType}
      subtitle={subtitle}
      extra={createHeaderActions()}
      actions={createFooterActions()}
      loading={loading}
      variant={variant}
      className="action-card"
      {...props}
    >
      {children}
    </StandardCard>
  );
};

ActionCard.propTypes = {
  title: PropTypes.node,
  titleIcon: PropTypes.node,
  titleIconContext: PropTypes.string,
  titleIconType: PropTypes.string,
  subtitle: PropTypes.node,
  children: PropTypes.node,
  primaryAction: PropTypes.shape({
    action: PropTypes.string,
    onClick: PropTypes.func,
    loading: PropTypes.bool,
    disabled: PropTypes.bool,
    children: PropTypes.node,
  }),
  secondaryActions: PropTypes.arrayOf(PropTypes.shape({
    action: PropTypes.string,
    onClick: PropTypes.func,
    loading: PropTypes.bool,
    disabled: PropTypes.bool,
    children: PropTypes.node,
  })),
  footerActions: PropTypes.arrayOf(PropTypes.shape({
    action: PropTypes.string,
    onClick: PropTypes.func,
    loading: PropTypes.bool,
    disabled: PropTypes.bool,
    children: PropTypes.node,
  })),
  actionsAlign: PropTypes.oneOf(['left', 'center', 'right', 'space-between']),
  actionsSpacing: PropTypes.oneOfType([
    PropTypes.oneOf(['small', 'middle', 'large']),
    PropTypes.number,
  ]),
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  variant: PropTypes.oneOf(['default', 'elevated', 'outlined', 'ghost', 'filled']),
};

export default ActionCard;