/**
 * InfoModal Component
 * Standardized modal for displaying information with consistent styling
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Typography, Space } from 'antd';
import StandardModal from './StandardModal';

const { Title, Paragraph, Text } = Typography;

const InfoModal = ({
  title,
  content,
  type = 'info', // 'info', 'success', 'warning', 'error'
  showIcon = true,
  okText = 'OK',
  showCancelButton = false,
  size = 'default',
  children,
  ...modalProps
}) => {
  // Get icon context and type based on modal type
  const getIconProps = () => {
    if (!showIcon) return {};
    
    switch (type) {
      case 'success':
        return { titleIconContext: 'status', titleIconType: 'success' };
      case 'warning':
        return { titleIconContext: 'status', titleIconType: 'warning' };
      case 'error':
        return { titleIconContext: 'status', titleIconType: 'error' };
      default:
        return { titleIconContext: 'status', titleIconType: 'info' };
    }
  };

  // Get OK button action based on type
  const getOkAction = () => {
    switch (type) {
      case 'error':
        return 'cancel';
      default:
        return 'save';
    }
  };

  return (
    <StandardModal
      {...modalProps}
      title={title}
      {...getIconProps()}
      okText={okText}
      okAction={getOkAction()}
      showCancelButton={showCancelButton}
      size={size}
    >
      <Space direction="vertical" size="middle" className="w-full">
        {content && (
          <div>
            {typeof content === 'string' ? (
              <Paragraph>{content}</Paragraph>
            ) : (
              content
            )}
          </div>
        )}
        {children}
      </Space>
    </StandardModal>
  );
};

InfoModal.propTypes = {
  title: PropTypes.string,
  content: PropTypes.node,
  type: PropTypes.oneOf(['info', 'success', 'warning', 'error']),
  showIcon: PropTypes.bool,
  okText: PropTypes.string,
  showCancelButton: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'default', 'large', 'extra-large']),
  children: PropTypes.node,
};

export default InfoModal;