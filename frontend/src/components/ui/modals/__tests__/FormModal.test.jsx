/**
 * FormModal Component Tests
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Form, Input } from 'antd';
import FormModal from '../FormModal';
import { IconProvider } from '../../../../icons/IconProvider';

// Mock icon provider
const mockGetIconByContext = vi.fn((context, type) => <span data-testid={`icon-${context}-${type}`} />);

const MockIconProvider = ({ children }) => (
  <IconProvider value={{ getIconByContext: mockGetIconByContext }}>
    {children}
  </IconProvider>
);

const renderWithIconProvider = (component) => {
  return render(
    <MockIconProvider>
      {component}
    </MockIconProvider>
  );
};

// Test form component
const TestForm = ({ onFinish, onFinishFailed }) => (
  <FormModal
    title="Test Form Modal"
    open={true}
    onCancel={() => {}}
    onFinish={onFinish}
    onFinishFailed={onFinishFailed}
  >
    <Form.Item
      name="username"
      label="Username"
      rules={[{ required: true, message: 'Please input username!' }]}
    >
      <Input placeholder="Enter username" />
    </Form.Item>
    <Form.Item
      name="email"
      label="Email"
      rules={[{ required: true, type: 'email', message: 'Please input valid email!' }]}
    >
      <Input placeholder="Enter email" />
    </Form.Item>
  </FormModal>
);

describe('FormModal', () => {
  beforeEach(() => {
    mockGetIconByContext.mockClear();
  });

  it('renders with form fields', () => {
    renderWithIconProvider(
      <TestForm onFinish={() => {}} />
    );

    expect(screen.getByText('Test Form Modal')).toBeInTheDocument();
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  it('handles form submission on OK button click', async () => {
    const handleFinish = vi.fn();
    
    renderWithIconProvider(
      <TestForm onFinish={handleFinish} />
    );

    // Fill in the form
    const usernameInput = screen.getByPlaceholderText('Enter username');
    const emailInput = screen.getByPlaceholderText('Enter email');
    
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    // Click submit button
    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(handleFinish).toHaveBeenCalledWith({
        username: 'testuser',
        email: 'test@example.com'
      });
    });
  });

  it('handles form validation errors', async () => {
    const handleFinish = vi.fn();
    const handleFinishFailed = vi.fn();
    
    renderWithIconProvider(
      <TestForm onFinish={handleFinish} onFinishFailed={handleFinishFailed} />
    );

    // Click submit without filling required fields
    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Please input username!')).toBeInTheDocument();
    });

    expect(handleFinish).not.toHaveBeenCalled();
  });

  it('resets form on cancel when resetOnCancel is true', () => {
    const handleCancel = vi.fn();
    
    renderWithIconProvider(
      <FormModal
        title="Test Form"
        open={true}
        onCancel={handleCancel}
        resetOnCancel={true}
      >
        <Form.Item name="test" label="Test">
          <Input />
        </Form.Item>
      </FormModal>
    );

    // Fill in form
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test value' } });

    // Click cancel
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);

    expect(handleCancel).toHaveBeenCalled();
  });

  it('handles custom form props', () => {
    const initialValues = { username: 'initial', email: 'initial@test.com' };
    
    renderWithIconProvider(
      <FormModal
        title="Test Form"
        open={true}
        onCancel={() => {}}
        initialValues={initialValues}
        layout="horizontal"
        requiredMark={false}
      >
        <Form.Item name="username" label="Username">
          <Input />
        </Form.Item>
        <Form.Item name="email" label="Email">
          <Input />
        </Form.Item>
      </FormModal>
    );

    // Check that initial values are set
    const usernameInput = screen.getByDisplayValue('initial');
    const emailInput = screen.getByDisplayValue('initial@test.com');
    
    expect(usernameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
  });

  it('handles submitOnOk false', async () => {
    const handleOk = vi.fn();
    const handleFinish = vi.fn();
    
    renderWithIconProvider(
      <FormModal
        title="Test Form"
        open={true}
        onCancel={() => {}}
        onOk={handleOk}
        onFinish={handleFinish}
        submitOnOk={false}
      >
        <Form.Item name="test" label="Test">
          <Input />
        </Form.Item>
      </FormModal>
    );

    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(handleOk).toHaveBeenCalled();
      expect(handleFinish).not.toHaveBeenCalled();
    });
  });

  it('handles loading state', () => {
    renderWithIconProvider(
      <FormModal
        title="Test Form"
        open={true}
        onCancel={() => {}}
        loading={true}
      >
        <Form.Item name="test" label="Test">
          <Input />
        </Form.Item>
      </FormModal>
    );

    const submitButton = screen.getByRole('button', { name: /submit/i });
    expect(submitButton).toHaveClass('ant-btn-loading');
  });

  it('handles custom button text and actions', () => {
    renderWithIconProvider(
      <FormModal
        title="Test Form"
        open={true}
        onCancel={() => {}}
        okText="Save Changes"
        cancelText="Discard"
        okAction="save"
      >
        <Form.Item name="test" label="Test">
          <Input />
        </Form.Item>
      </FormModal>
    );

    expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /discard/i })).toBeInTheDocument();
  });

  it('passes through modal props', () => {
    renderWithIconProvider(
      <FormModal
        title="Test Form"
        open={true}
        onCancel={() => {}}
        size="large"
        centered={false}
        maskClosable={true}
      >
        <Form.Item name="test" label="Test">
          <Input />
        </Form.Item>
      </FormModal>
    );

    // Modal should be rendered with the props
    expect(screen.getByText('Test Form')).toBeInTheDocument();
  });

  it('handles form instance prop', () => {
    const [form] = Form.useForm();
    
    renderWithIconProvider(
      <FormModal
        title="Test Form"
        open={true}
        onCancel={() => {}}
        form={form}
      >
        <Form.Item name="test" label="Test">
          <Input />
        </Form.Item>
      </FormModal>
    );

    expect(screen.getByText('Test Form')).toBeInTheDocument();
  });

  it('handles resetOnClose prop', () => {
    const handleAfterClose = vi.fn();
    
    renderWithIconProvider(
      <FormModal
        title="Test Form"
        open={true}
        onCancel={() => {}}
        resetOnClose={true}
        afterClose={handleAfterClose}
      >
        <Form.Item name="test" label="Test">
          <Input />
        </Form.Item>
      </FormModal>
    );

    // Modal should be rendered
    expect(screen.getByText('Test Form')).toBeInTheDocument();
  });

  it('handles async form submission', async () => {
    const handleFinish = vi.fn().mockResolvedValue();
    
    renderWithIconProvider(
      <FormModal
        title="Test Form"
        open={true}
        onCancel={() => {}}
        onFinish={handleFinish}
      >
        <Form.Item name="username" rules={[{ required: true }]}>
          <Input placeholder="Username" />
        </Form.Item>
      </FormModal>
    );

    // Fill form and submit
    const input = screen.getByPlaceholderText('Username');
    fireEvent.change(input, { target: { value: 'testuser' } });

    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(handleFinish).toHaveBeenCalledWith({ username: 'testuser' });
    });
  });

  it('handles form submission with both onFinish and onOk', async () => {
    const handleFinish = vi.fn();
    const handleOk = vi.fn();
    
    renderWithIconProvider(
      <FormModal
        title="Test Form"
        open={true}
        onCancel={() => {}}
        onFinish={handleFinish}
        onOk={handleOk}
      >
        <Form.Item name="test" rules={[{ required: true }]}>
          <Input placeholder="Test input" />
        </Form.Item>
      </FormModal>
    );

    // Fill form and submit
    const input = screen.getByPlaceholderText('Test input');
    fireEvent.change(input, { target: { value: 'test value' } });

    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(handleFinish).toHaveBeenCalledWith({ test: 'test value' });
      expect(handleOk).toHaveBeenCalledWith({ test: 'test value' });
    });
  });
});