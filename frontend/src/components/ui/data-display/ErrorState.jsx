import React from 'react';
import { Result, Button } from 'antd';
import { 
  ExclamationCircleOutlined,
  ReloadOutlined,
  HomeOutlined,
  WarningOutlined,
  CloseCircleOutlined,
  DisconnectOutlined
} from '@ant-design/icons';
import PropTypes from 'prop-types';
import './ErrorState.css';

/**
 * ErrorState Component
 * 
 * Standardized error state component for handling different types of errors
 * with consistent styling and user actions.
 */
const ErrorState = ({
  type = 'error',
  title,
  subtitle,
  description,
  showRetry = true,
  showHome = false,
  onRetry,
  onHome,
  customActions = [],
  className = '',
  ...props
}) => {
  // Error type configurations
  const errorConfigs = {
    error: {
      status: 'error',
      icon: <CloseCircleOutlined />,
      defaultTitle: 'Something went wrong',
      defaultSubtitle: 'An unexpected error occurred',
      defaultDescription: 'Please try again or contact support if the problem persists.',
    },
    warning: {
      status: 'warning',
      icon: <WarningOutlined />,
      defaultTitle: 'Warning',
      defaultSubtitle: 'Please check your input',
      defaultDescription: 'There might be an issue with the data you provided.',
    },
    network: {
      status: 'error',
      icon: <DisconnectOutlined />,
      defaultTitle: 'Connection Error',
      defaultSubtitle: 'Unable to connect to server',
      defaultDescription: 'Please check your internet connection and try again.',
    },
    notFound: {
      status: '404',
      icon: <ExclamationCircleOutlined />,
      defaultTitle: 'Page Not Found',
      defaultSubtitle: 'The page you are looking for does not exist',
      defaultDescription: 'It might have been moved, deleted, or you entered the wrong URL.',
    },
    forbidden: {
      status: '403',
      icon: <ExclamationCircleOutlined />,
      defaultTitle: 'Access Denied',
      defaultSubtitle: 'You do not have permission to access this resource',
      defaultDescription: 'Please contact your administrator if you believe this is an error.',
    },
    serverError: {
      status: '500',
      icon: <ExclamationCircleOutlined />,
      defaultTitle: 'Server Error',
      defaultSubtitle: 'Internal server error occurred',
      defaultDescription: 'Our servers are experiencing issues. Please try again later.',
    },
  };

  const config = errorConfigs[type] || errorConfigs.error;

  // Build actions array
  const actions = [];

  if (showRetry && onRetry) {
    actions.push(
      <Button
        key="retry"
        type="primary"
        icon={<ReloadOutlined />}
        onClick={onRetry}
        className="error-state-retry-btn"
      >
        Try Again
      </Button>
    );
  }

  if (showHome && onHome) {
    actions.push(
      <Button
        key="home"
        icon={<HomeOutlined />}
        onClick={onHome}
        className="error-state-home-btn"
      >
        Go Home
      </Button>
    );
  }

  // Add custom actions
  customActions.forEach((action, index) => {
    actions.push(
      <div key={`custom-${index}`}>
        {action}
      </div>
    );
  });

  return (
    <div className={`error-state ${className}`} {...props}>
      <Result
        status={config.status}
        icon={config.icon}
        title={title || config.defaultTitle}
        subTitle={subtitle || config.defaultSubtitle}
        extra={actions.length > 0 ? actions : undefined}
      >
        {(description || config.defaultDescription) && (
          <div className="error-state-description">
            {description || config.defaultDescription}
          </div>
        )}
      </Result>
    </div>
  );
};

ErrorState.propTypes = {
  /** Error type */
  type: PropTypes.oneOf([
    'error',
    'warning', 
    'network',
    'notFound',
    'forbidden',
    'serverError'
  ]),
  /** Error title */
  title: PropTypes.string,
  /** Error subtitle */
  subtitle: PropTypes.string,
  /** Error description */
  description: PropTypes.string,
  /** Show retry button */
  showRetry: PropTypes.bool,
  /** Show home button */
  showHome: PropTypes.bool,
  /** Retry action handler */
  onRetry: PropTypes.func,
  /** Home action handler */
  onHome: PropTypes.func,
  /** Custom action buttons */
  customActions: PropTypes.array,
  /** Additional CSS class */
  className: PropTypes.string,
};

export default ErrorState;