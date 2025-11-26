/**
 * ConfirmModal Component
 * Standardized confirmation modal for common confirmation patterns
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Typography } from 'antd';
import { useIcon } from '../../../icons/IconProvider';
import { ButtonGroup, ActionButton } from '../buttons';

const { Text } = Typography;

const ConfirmModal = ({
  open = false,
  onConfirm,
  onCancel,
  title = 'Confirm Action',
  content,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'default', // 'default', 'warning', 'danger', 'info'
  loading = false,
  icon,
  iconContext,
  iconType,
  centered = true,
  ...props
}) => {
  const { getIconByContext } = useIcon();

  // Get icon based on type or custom icon
  const getModalIcon = () => {
    if (icon) return icon;
    if (iconContext && iconType) {
      return getIconByContext(iconContext, iconType);
    }

    // Default icons based on type
    switch (type) {
      case 'warning':
        return getIconByContext('status', 'warning');
      case 'danger':
        return getIconByContext('status', 'error');
      case 'info':
        return getIconByContext('status', 'info');
      default:
        return getIconByContext('status', 'question');
    }
  };

  // Get button variant based on type
  const getConfirmButtonProps = () => {
    switch (type) {
      case 'danger':
        return { action: 'delete', danger: true };
      case 'warning':
        return { action: 'approve', variant: 'primary' };
      default:
        return { action: 'save', variant: 'primary' };
    }
  };

  const modalTitle = (
    <div className="flex items-center gap-2">
      {getModalIcon()}
      <span>{title}</span>
    </div>
  );

  const footer = (
    <ButtonGroup align="right" spacing="middle">
      <ActionButton
        action="cancel"
        onClick={onCancel}
      >
        {cancelText}
      </ActionButton>
      <ActionButton
        {...getConfirmButtonProps()}
        onClick={onConfirm}
        loading={loading}
      >
        {confirmText}
      </ActionButton>
    </ButtonGroup>
  );

  return (
    <Modal
      title={modalTitle}
      open={open}
      onCancel={onCancel}
      centered={centered}
      footer={footer}
      width={400}
      {...props}
    >
      <div className="py-4">
        {typeof content === 'string' ? (
          <Text>{content}</Text>
        ) : (
          content
        )}
      </div>
    </Modal>
  );
};

ConfirmModal.propTypes = {
  open: PropTypes.bool,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  title: PropTypes.string,
  content: PropTypes.node,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  type: PropTypes.oneOf(['default', 'warning', 'danger', 'info']),
  loading: PropTypes.bool,
  icon: PropTypes.node,
  iconContext: PropTypes.string,
  iconType: PropTypes.string,
  centered: PropTypes.bool,
};

export default ConfirmModal;