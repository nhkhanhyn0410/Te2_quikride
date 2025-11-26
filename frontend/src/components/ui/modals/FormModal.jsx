/**
 * FormModal Component
 * Standardized modal component specifically designed for forms
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'antd';
import StandardModal from './StandardModal';

const FormModal = ({
  form,
  onFinish,
  onFinishFailed,
  initialValues,
  validateTrigger = 'onChange',
  layout = 'vertical',
  requiredMark = true,
  scrollToFirstError = true,
  submitOnOk = true,
  resetOnCancel = true,
  resetOnClose = true,
  okText = 'Submit',
  cancelText = 'Cancel',
  okAction = 'save',
  children,
  onCancel,
  onOk,
  loading = false,
  ...modalProps
}) => {
  const [formInstance] = Form.useForm(form);

  const handleOk = async () => {
    if (submitOnOk) {
      try {
        const values = await formInstance.validateFields();
        if (onFinish) {
          await onFinish(values);
        }
        if (onOk) {
          await onOk(values);
        }
      } catch (error) {
        console.error('Form validation failed:', error);
        if (onFinishFailed) {
          onFinishFailed(error);
        }
      }
    } else if (onOk) {
      onOk();
    }
  };

  const handleCancel = () => {
    if (resetOnCancel) {
      formInstance.resetFields();
    }
    if (onCancel) {
      onCancel();
    }
  };

  const handleAfterClose = () => {
    if (resetOnClose) {
      formInstance.resetFields();
    }
    if (modalProps.afterClose) {
      modalProps.afterClose();
    }
  };

  return (
    <StandardModal
      {...modalProps}
      onOk={handleOk}
      onCancel={handleCancel}
      afterClose={handleAfterClose}
      okText={okText}
      cancelText={cancelText}
      okAction={okAction}
      loading={loading}
    >
      <Form
        form={formInstance}
        layout={layout}
        initialValues={initialValues}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        validateTrigger={validateTrigger}
        requiredMark={requiredMark}
        scrollToFirstError={scrollToFirstError}
      >
        {children}
      </Form>
    </StandardModal>
  );
};

FormModal.propTypes = {
  form: PropTypes.object,
  onFinish: PropTypes.func,
  onFinishFailed: PropTypes.func,
  initialValues: PropTypes.object,
  validateTrigger: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  layout: PropTypes.oneOf(['horizontal', 'vertical', 'inline']),
  requiredMark: PropTypes.bool,
  scrollToFirstError: PropTypes.bool,
  submitOnOk: PropTypes.bool,
  resetOnCancel: PropTypes.bool,
  resetOnClose: PropTypes.bool,
  okText: PropTypes.string,
  cancelText: PropTypes.string,
  okAction: PropTypes.string,
  children: PropTypes.node,
  onCancel: PropTypes.func,
  onOk: PropTypes.func,
  loading: PropTypes.bool,
};

export default FormModal;