/**
 * StandardModal Component
 * Standardized modal component that extends Ant Design Modal with consistent styling
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import classNames from 'classnames';
import { useIcon } from '../../../icons/IconProvider';
import { ButtonGroup, ActionButton, StandardButton } from '../buttons';

const StandardModal = ({
  title,
  titleIcon,
  titleIconContext,
  titleIconType,
  children,
  open = false,
  onCancel,
  onOk,
  okText = 'OK',
  cancelText = 'Cancel',
  okButtonProps = {},
  cancelButtonProps = {},
  showOkButton = true,
  showCancelButton = true,
  okAction = 'save',
  cancelAction = 'cancel',
  customFooter,
  footerAlign = 'right',
  footerSpacing = 'middle',
  size = 'default',
  centered = true,
  closable = true,
  maskClosable = false,
  destroyOnClose = true,
  className,
  bodyClassName,
  headerClassName,
  footerClassName,
  loading = false,
  danger = false,
  ...props
}) => {
  const { getIconByContext } = useIcon();

  // Get standardized icon for title
  const getTitleIcon = () => {
    if (titleIcon) return titleIcon;
    if (titleIconContext && titleIconType) {
      return getIconByContext(titleIconContext, titleIconType);
    }
    return undefined;
  };

  // Get modal width based on size
  const getModalWidth = () => {
    switch (size) {
      case 'small':
        return 400;
      case 'large':
        return 800;
      case 'extra-large':
        return 1000;
      default:
        return 520;
    }
  };

  // Create title with icon
  const modalTitle = title && (
    <div className="flex items-center gap-2">
      {getTitleIcon()}
      <span>{title}</span>
    </div>
  );

  // Create footer with standardized buttons
  const createFooter = () => {
    if (customFooter !== undefined) {
      return customFooter;
    }

    if (!showOkButton && !showCancelButton) {
      return null;
    }

    const buttons = [];

    if (showCancelButton) {
      buttons.push(
        <ActionButton
          key="cancel"
          action={cancelAction}
          onClick={onCancel}
          {...cancelButtonProps}
        >
          {cancelText}
        </ActionButton>
      );
    }

    if (showOkButton) {
      buttons.push(
        <ActionButton
          key="ok"
          action={okAction}
          onClick={onOk}
          loading={loading}
          danger={danger}
          {...okButtonProps}
        >
          {okText}
        </ActionButton>
      );
    }

    return (
      <ButtonGroup align={footerAlign} spacing={footerSpacing}>
        {buttons}
      </ButtonGroup>
    );
  };

  const modalClassName = classNames(
    'standard-modal',
    {
      'standard-modal--small': size === 'small',
      'standard-modal--large': size === 'large',
      'standard-modal--extra-large': size === 'extra-large',
    },
    className
  );

  const modalBodyClassName = classNames(
    'standard-modal__body',
    bodyClassName
  );

  return (
    <Modal
      title={modalTitle}
      open={open}
      onCancel={onCancel}
      onOk={onOk}
      width={getModalWidth()}
      centered={centered}
      closable={closable}
      maskClosable={maskClosable}
      destroyOnClose={destroyOnClose}
      className={modalClassName}
      footer={createFooter()}
      {...props}
    >
      <div className={modalBodyClassName}>
        {children}
      </div>
    </Modal>
  );
};

StandardModal.propTypes = {
  title: PropTypes.node,
  titleIcon: PropTypes.node,
  titleIconContext: PropTypes.string,
  titleIconType: PropTypes.string,
  children: PropTypes.node,
  open: PropTypes.bool,
  onCancel: PropTypes.func,
  onOk: PropTypes.func,
  okText: PropTypes.string,
  cancelText: PropTypes.string,
  okButtonProps: PropTypes.object,
  cancelButtonProps: PropTypes.object,
  showOkButton: PropTypes.bool,
  showCancelButton: PropTypes.bool,
  okAction: PropTypes.string,
  cancelAction: PropTypes.string,
  customFooter: PropTypes.node,
  footerAlign: PropTypes.oneOf(['left', 'center', 'right', 'space-between']),
  footerSpacing: PropTypes.oneOfType([
    PropTypes.oneOf(['small', 'middle', 'large']),
    PropTypes.number,
  ]),
  size: PropTypes.oneOf(['small', 'default', 'large', 'extra-large']),
  centered: PropTypes.bool,
  closable: PropTypes.bool,
  maskClosable: PropTypes.bool,
  destroyOnClose: PropTypes.bool,
  className: PropTypes.string,
  bodyClassName: PropTypes.string,
  headerClassName: PropTypes.string,
  footerClassName: PropTypes.string,
  loading: PropTypes.bool,
  danger: PropTypes.bool,
};

export default StandardModal;