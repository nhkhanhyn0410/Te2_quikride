/**
 * ActionButton Component
 * Specialized button for common actions with predefined icons and styling
 */

import React from 'react';
import PropTypes from 'prop-types';
import StandardButton from './StandardButton';

const ActionButton = ({
  action,
  variant,
  size = 'middle',
  loading = false,
  disabled = false,
  children,
  ...props
}) => {
  // Predefined action configurations
  const actionConfigs = {
    // CRUD Actions
    create: {
      iconContext: 'action',
      iconType: 'add',
      variant: 'primary',
      defaultText: 'Tạo mới',
    },
    edit: {
      iconContext: 'action',
      iconType: 'edit',
      variant: 'secondary',
      defaultText: 'Chỉnh sửa',
    },
    delete: {
      iconContext: 'action',
      iconType: 'delete',
      variant: 'secondary',
      danger: true,
      defaultText: 'Xóa',
    },
    save: {
      iconContext: 'action',
      iconType: 'save',
      variant: 'primary',
      defaultText: 'Lưu',
    },
    cancel: {
      iconContext: 'action',
      iconType: 'close',
      variant: 'secondary',
      defaultText: 'Hủy',
    },
    
    // Navigation Actions
    back: {
      iconContext: 'navigation',
      iconType: 'back',
      variant: 'secondary',
      defaultText: 'Quay lại',
    },
    forward: {
      iconContext: 'navigation',
      iconType: 'forward',
      variant: 'secondary',
      defaultText: 'Tiếp tục',
    },
    home: {
      iconContext: 'navigation',
      iconType: 'home',
      variant: 'secondary',
      defaultText: 'Trang chủ',
    },
    
    // Status Actions
    approve: {
      iconContext: 'status',
      iconType: 'success',
      variant: 'primary',
      defaultText: 'Phê duyệt',
    },
    reject: {
      iconContext: 'status',
      iconType: 'error',
      variant: 'secondary',
      danger: true,
      defaultText: 'Từ chối',
    },
    
    // Data Actions
    search: {
      iconContext: 'action',
      iconType: 'search',
      variant: 'primary',
      defaultText: 'Tìm kiếm',
    },
    filter: {
      iconContext: 'action',
      iconType: 'filter',
      variant: 'secondary',
      defaultText: 'Lọc',
    },
    export: {
      iconContext: 'action',
      iconType: 'export',
      variant: 'secondary',
      defaultText: 'Xuất dữ liệu',
    },
    import: {
      iconContext: 'action',
      iconType: 'import',
      variant: 'secondary',
      defaultText: 'Nhập dữ liệu',
    },
    
    // Communication Actions
    send: {
      iconContext: 'communication',
      iconType: 'send',
      variant: 'primary',
      defaultText: 'Gửi',
    },
    reply: {
      iconContext: 'communication',
      iconType: 'reply',
      variant: 'secondary',
      defaultText: 'Trả lời',
    },
    
    // Authentication Actions
    login: {
      iconContext: 'authentication',
      iconType: 'login',
      variant: 'primary',
      defaultText: 'Đăng nhập',
    },
    logout: {
      iconContext: 'authentication',
      iconType: 'logout',
      variant: 'secondary',
      defaultText: 'Đăng xuất',
    },
    register: {
      iconContext: 'authentication',
      iconType: 'register',
      variant: 'primary',
      defaultText: 'Đăng ký',
    },
  };

  const config = actionConfigs[action] || {};
  const buttonVariant = variant || config.variant || 'secondary';
  const buttonText = children || config.defaultText || action;

  return (
    <StandardButton
      variant={buttonVariant}
      size={size}
      iconContext={config.iconContext}
      iconType={config.iconType}
      loading={loading}
      disabled={disabled}
      danger={config.danger}
      {...props}
    >
      {buttonText}
    </StandardButton>
  );
};

ActionButton.propTypes = {
  action: PropTypes.oneOf([
    // CRUD Actions
    'create', 'edit', 'delete', 'save', 'cancel',
    // Navigation Actions
    'back', 'forward', 'home',
    // Status Actions
    'approve', 'reject',
    // Data Actions
    'search', 'filter', 'export', 'import',
    // Communication Actions
    'send', 'reply',
    // Authentication Actions
    'login', 'logout', 'register',
  ]).isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'text', 'link', 'dashed']),
  size: PropTypes.oneOf(['small', 'middle', 'large']),
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  children: PropTypes.node,
};

export default ActionButton;