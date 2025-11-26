/**
 * Modal Components Demo
 * Comprehensive demonstration of all standardized modal components
 */

import React, { useState } from 'react';
import { Card, Space, Button, Typography, Row, Col, message, Form, Input, Select } from 'antd';
import { StandardModal, ConfirmModal, FormModal, InfoModal } from '../index';
import { ActionButton, ButtonGroup } from '../../buttons';

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;

const ModalDemo = () => {
  const [modals, setModals] = useState({
    standard: false,
    standardCustom: false,
    confirm: false,
    confirmDanger: false,
    confirmWarning: false,
    form: false,
    infoSuccess: false,
    infoWarning: false,
    infoError: false,
    infoCustom: false,
  });

  const [loading, setLoading] = useState({});
  const [form] = Form.useForm();

  const openModal = (modalName) => {
    setModals(prev => ({ ...prev, [modalName]: true }));
  };

  const closeModal = (modalName) => {
    setModals(prev => ({ ...prev, [modalName]: false }));
  };

  const handleLoading = (modalName, duration = 2000) => {
    setLoading(prev => ({ ...prev, [modalName]: true }));
    setTimeout(() => {
      setLoading(prev => ({ ...prev, [modalName]: false }));
      message.success('Action completed successfully!');
    }, duration);
  };

  const handleFormSubmit = async (values) => {
    console.log('Form values:', values);
    setLoading(prev => ({ ...prev, form: true }));
    
    // Simulate API call
    setTimeout(() => {
      setLoading(prev => ({ ...prev, form: false }));
      closeModal('form');
      message.success('Form submitted successfully!');
      form.resetFields();
    }, 1500);
  };

  const handleConfirm = (modalName, action) => {
    handleLoading(modalName, 1500);
    setTimeout(() => {
      closeModal(modalName);
    }, 1500);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Title level={1}>Modal Components Demo</Title>
      <Paragraph>
        Comprehensive demonstration of standardized modal components with consistent styling and behavior.
      </Paragraph>

      {/* StandardModal Demo */}
      <Card title="StandardModal Component" className="mb-6">
        <Title level={3}>Basic Standard Modals</Title>
        <Space wrap>
          <Button type="primary" onClick={() => openModal('standard')}>
            Basic Modal
          </Button>
          <Button onClick={() => openModal('standardCustom')}>
            Custom Modal
          </Button>
        </Space>

        {/* Basic Standard Modal */}
        <StandardModal
          title="Basic Standard Modal"
          titleIconContext="status"
          titleIconType="info"
          open={modals.standard}
          onCancel={() => closeModal('standard')}
          onOk={() => {
            message.success('OK clicked!');
            closeModal('standard');
          }}
          okText="Save"
          cancelText="Cancel"
        >
          <div className="py-4">
            <Paragraph>
              This is a basic StandardModal with consistent styling and standardized buttons.
              It includes an icon in the title and uses ActionButton components for the footer.
            </Paragraph>
            <ul>
              <li>Consistent button styling</li>
              <li>Standardized icon mapping</li>
              <li>Flexible footer configuration</li>
              <li>Responsive sizing</li>
            </ul>
          </div>
        </StandardModal>

        {/* Custom Standard Modal */}
        <StandardModal
          title="Custom Configuration Modal"
          titleIconContext="action"
          titleIconType="edit"
          open={modals.standardCustom}
          onCancel={() => closeModal('standardCustom')}
          size="large"
          footerAlign="space-between"
          customFooter={
            <ButtonGroup align="space-between">
              <ActionButton action="back" onClick={() => closeModal('standardCustom')}>
                Go Back
              </ActionButton>
              <div>
                <ActionButton action="cancel" onClick={() => closeModal('standardCustom')} />
                <ActionButton 
                  action="save" 
                  onClick={() => {
                    message.success('Changes saved!');
                    closeModal('standardCustom');
                  }}
                >
                  Save Changes
                </ActionButton>
              </div>
            </ButtonGroup>
          }
        >
          <div className="py-4">
            <Title level={4}>Custom Footer Configuration</Title>
            <Paragraph>
              This modal demonstrates custom footer configuration with space-between alignment
              and custom button grouping.
            </Paragraph>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Card size="small" title="Features">
                  <ul>
                    <li>Large size modal</li>
                    <li>Custom footer layout</li>
                    <li>Multiple button groups</li>
                    <li>Icon in title</li>
                  </ul>
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small" title="Configuration">
                  <Text code>size="large"</Text><br />
                  <Text code>footerAlign="space-between"</Text><br />
                  <Text code>customFooter={...}</Text>
                </Card>
              </Col>
            </Row>
          </div>
        </StandardModal>
      </Card>

      {/* ConfirmModal Demo */}
      <Card title="ConfirmModal Component" className="mb-6">
        <Title level={3}>Confirmation Modals</Title>
        <Space wrap>
          <Button onClick={() => openModal('confirm')}>
            Basic Confirm
          </Button>
          <Button onClick={() => openModal('confirmWarning')}>
            Warning Confirm
          </Button>
          <Button danger onClick={() => openModal('confirmDanger')}>
            Danger Confirm
          </Button>
        </Space>

        {/* Basic Confirm Modal */}
        <ConfirmModal
          open={modals.confirm}
          onConfirm={() => handleConfirm('confirm', 'basic')}
          onCancel={() => closeModal('confirm')}
          title="Confirm Action"
          content="Are you sure you want to proceed with this action? This will make changes to your data."
          loading={loading.confirm}
        />

        {/* Warning Confirm Modal */}
        <ConfirmModal
          open={modals.confirmWarning}
          onConfirm={() => handleConfirm('confirmWarning', 'warning')}
          onCancel={() => closeModal('confirmWarning')}
          type="warning"
          title="Warning: Proceed with Caution"
          content={
            <div>
              <Paragraph>
                This action requires your attention. Please review the following:
              </Paragraph>
              <ul>
                <li>This action cannot be easily undone</li>
                <li>It may affect other users</li>
                <li>Consider backing up your data first</li>
              </ul>
            </div>
          }
          confirmText="Yes, Proceed"
          cancelText="Cancel"
          loading={loading.confirmWarning}
        />

        {/* Danger Confirm Modal */}
        <ConfirmModal
          open={modals.confirmDanger}
          onConfirm={() => handleConfirm('confirmDanger', 'danger')}
          onCancel={() => closeModal('confirmDanger')}
          type="danger"
          title="Delete Item"
          content={
            <div>
              <Paragraph strong>
                This action will permanently delete the selected item.
              </Paragraph>
              <Paragraph type="danger">
                This action cannot be undone. All associated data will be lost.
              </Paragraph>
            </div>
          }
          confirmText="Yes, Delete"
          cancelText="Keep Item"
          loading={loading.confirmDanger}
        />
      </Card>

      {/* FormModal Demo */}
      <Card title="FormModal Component" className="mb-6">
        <Title level={3}>Form Modal</Title>
        <Space wrap>
          <Button type="primary" onClick={() => openModal('form')}>
            Open Form Modal
          </Button>
        </Space>

        <FormModal
          title="User Information Form"
          titleIconContext="action"
          titleIconType="edit"
          open={modals.form}
          onCancel={() => closeModal('form')}
          onFinish={handleFormSubmit}
          form={form}
          loading={loading.form}
          okText="Submit Form"
          size="default"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="firstName"
                label="First Name"
                rules={[{ required: true, message: 'Please enter first name' }]}
              >
                <Input placeholder="Enter first name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="lastName"
                label="Last Name"
                rules={[{ required: true, message: 'Please enter last name' }]}
              >
                <Input placeholder="Enter last name" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter email' },
              { type: 'email', message: 'Please enter valid email' }
            ]}
          >
            <Input placeholder="Enter email address" />
          </Form.Item>

          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: 'Please select a role' }]}
          >
            <Select placeholder="Select user role">
              <Option value="admin">Administrator</Option>
              <Option value="operator">Operator</Option>
              <Option value="customer">Customer</Option>
              <Option value="trip-manager">Trip Manager</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="bio"
            label="Biography"
          >
            <Input.TextArea 
              rows={3} 
              placeholder="Enter a brief biography (optional)"
              maxLength={500}
              showCount
            />
          </Form.Item>
        </FormModal>
      </Card>

      {/* InfoModal Demo */}
      <Card title="InfoModal Component" className="mb-6">
        <Title level={3}>Information Modals</Title>
        <Space wrap>
          <Button type="primary" onClick={() => openModal('infoSuccess')}>
            Success Info
          </Button>
          <Button onClick={() => openModal('infoWarning')}>
            Warning Info
          </Button>
          <Button danger onClick={() => openModal('infoError')}>
            Error Info
          </Button>
          <Button onClick={() => openModal('infoCustom')}>
            Custom Info
          </Button>
        </Space>

        {/* Success Info Modal */}
        <InfoModal
          title="Operation Successful"
          type="success"
          open={modals.infoSuccess}
          onCancel={() => closeModal('infoSuccess')}
          content="Your operation has been completed successfully. All changes have been saved."
          okText="Great!"
        />

        {/* Warning Info Modal */}
        <InfoModal
          title="Important Notice"
          type="warning"
          open={modals.infoWarning}
          onCancel={() => closeModal('infoWarning')}
          content={
            <div>
              <Paragraph>
                Please be aware of the following important information:
              </Paragraph>
              <ul>
                <li>System maintenance is scheduled for tonight</li>
                <li>Some features may be temporarily unavailable</li>
                <li>Please save your work frequently</li>
              </ul>
            </div>
          }
          okText="Understood"
        />

        {/* Error Info Modal */}
        <InfoModal
          title="Error Occurred"
          type="error"
          open={modals.infoError}
          onCancel={() => closeModal('infoError')}
          content={
            <div>
              <Paragraph>
                An error has occurred while processing your request:
              </Paragraph>
              <Card size="small" className="bg-red-50 border-red-200">
                <Text code>Error Code: 500</Text><br />
                <Text code>Message: Internal Server Error</Text><br />
                <Text code>Timestamp: {new Date().toLocaleString()}</Text>
              </Card>
              <Paragraph className="mt-3">
                Please try again later or contact support if the problem persists.
              </Paragraph>
            </div>
          }
          okText="Close"
        />

        {/* Custom Info Modal */}
        <InfoModal
          title="Custom Information Modal"
          type="info"
          open={modals.infoCustom}
          onCancel={() => closeModal('infoCustom')}
          size="large"
          showCancelButton={true}
          content="This modal demonstrates custom configuration with additional features."
        >
          <Row gutter={[16, 16]} className="mt-4">
            <Col span={8}>
              <Card size="small" title="Feature 1">
                <Text>Custom size (large)</Text>
              </Card>
            </Col>
            <Col span={8}>
              <Card size="small" title="Feature 2">
                <Text>Cancel button enabled</Text>
              </Card>
            </Col>
            <Col span={8}>
              <Card size="small" title="Feature 3">
                <Text>Additional children content</Text>
              </Card>
            </Col>
          </Row>
          
          <div className="mt-4 p-4 bg-blue-50 rounded">
            <Title level={5}>Additional Information</Title>
            <Paragraph>
              This content is passed as children to the InfoModal component,
              demonstrating how you can combine the content prop with additional
              child elements for more complex layouts.
            </Paragraph>
          </div>
        </InfoModal>
      </Card>

      {/* Modal Sizes Demo */}
      <Card title="Modal Sizes" className="mb-6">
        <Title level={3}>Different Modal Sizes</Title>
        <Space wrap>
          {['small', 'default', 'large', 'extra-large'].map(size => (
            <Button 
              key={size}
              onClick={() => {
                setModals(prev => ({ ...prev, [`size-${size}`]: true }));
              }}
            >
              {size.charAt(0).toUpperCase() + size.slice(1)} Modal
            </Button>
          ))}
        </Space>

        {['small', 'default', 'large', 'extra-large'].map(size => (
          <StandardModal
            key={size}
            title={`${size.charAt(0).toUpperCase() + size.slice(1)} Modal`}
            open={modals[`size-${size}`]}
            onCancel={() => closeModal(`size-${size}`)}
            onOk={() => closeModal(`size-${size}`)}
            size={size}
          >
            <div className="py-4">
              <Title level={4}>Modal Size: {size}</Title>
              <Paragraph>
                This modal demonstrates the {size} size configuration.
                Different sizes are appropriate for different types of content.
              </Paragraph>
              <ul>
                <li><strong>Small:</strong> Simple confirmations, alerts</li>
                <li><strong>Default:</strong> Standard forms, information</li>
                <li><strong>Large:</strong> Complex forms, detailed content</li>
                <li><strong>Extra Large:</strong> Data tables, comprehensive forms</li>
              </ul>
            </div>
          </StandardModal>
        ))}
      </Card>
    </div>
  );
};

export default ModalDemo;