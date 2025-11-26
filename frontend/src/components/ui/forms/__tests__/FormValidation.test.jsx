/**
 * FormValidation Components Tests
 * Tests for form validation and error handling components
 */

import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ConfigProvider } from 'antd';
import {
  FormFieldError,
  FormFieldSuccess,
  FormFieldWarning,
  FormFieldHelp,
  ValidationStateIndicator,
  FormErrorSummary,
  FormSuccessSummary,
} from '../FormValidation';

// Test wrapper with Ant Design ConfigProvider
const TestWrapper = ({ children }) => (
  <ConfigProvider>
    {children}
  </ConfigProvider>
);

describe('FormFieldError', () => {
  it('renders error message with icon', () => {
    render(
      <TestWrapper>
        <FormFieldError message="This field is required" />
      </TestWrapper>
    );

    expect(screen.getByText('This field is required')).toBeInTheDocument();
    expect(document.querySelector('.anticon-close-circle')).toBeInTheDocument();
  });

  it('does not render when message is empty', () => {
    const { container } = render(
      <TestWrapper>
        <FormFieldError message="" />
      </TestWrapper>
    );

    expect(container.firstChild).toBeNull();
  });

  it('does not render when visible is false', () => {
    const { container } = render(
      <TestWrapper>
        <FormFieldError message="Error message" visible={false} />
      </TestWrapper>
    );

    expect(container.firstChild).toBeNull();
  });

  it('applies custom className', () => {
    const { container } = render(
      <TestWrapper>
        <FormFieldError message="Error message" className="custom-error" />
      </TestWrapper>
    );

    expect(container.firstChild).toHaveClass('custom-error');
  });
});

describe('FormFieldSuccess', () => {
  it('renders success message with icon', () => {
    render(
      <TestWrapper>
        <FormFieldSuccess message="Field is valid" />
      </TestWrapper>
    );

    expect(screen.getByText('Field is valid')).toBeInTheDocument();
    expect(document.querySelector('.anticon-check-circle')).toBeInTheDocument();
  });

  it('does not render when message is empty', () => {
    const { container } = render(
      <TestWrapper>
        <FormFieldSuccess message="" />
      </TestWrapper>
    );

    expect(container.firstChild).toBeNull();
  });

  it('applies success styling', () => {
    const { container } = render(
      <TestWrapper>
        <FormFieldSuccess message="Success message" />
      </TestWrapper>
    );

    expect(container.firstChild).toHaveClass('text-green-600');
  });
});

describe('FormFieldWarning', () => {
  it('renders warning message with icon', () => {
    render(
      <TestWrapper>
        <FormFieldWarning message="This field needs attention" />
      </TestWrapper>
    );

    expect(screen.getByText('This field needs attention')).toBeInTheDocument();
    expect(document.querySelector('.anticon-exclamation-circle')).toBeInTheDocument();
  });

  it('applies warning styling', () => {
    const { container } = render(
      <TestWrapper>
        <FormFieldWarning message="Warning message" />
      </TestWrapper>
    );

    expect(container.firstChild).toHaveClass('text-orange-600');
  });
});

describe('FormFieldHelp', () => {
  it('renders help message with icon', () => {
    render(
      <TestWrapper>
        <FormFieldHelp message="Enter your email address" />
      </TestWrapper>
    );

    expect(screen.getByText('Enter your email address')).toBeInTheDocument();
    expect(document.querySelector('.anticon-info-circle')).toBeInTheDocument();
  });

  it('applies help styling', () => {
    const { container } = render(
      <TestWrapper>
        <FormFieldHelp message="Help message" />
      </TestWrapper>
    );

    expect(container.firstChild).toHaveClass('text-gray-500');
  });
});

describe('ValidationStateIndicator', () => {
  it('renders success state icon', () => {
    render(
      <TestWrapper>
        <ValidationStateIndicator state="success" />
      </TestWrapper>
    );

    expect(document.querySelector('.anticon-check-circle')).toBeInTheDocument();
  });

  it('renders error state icon', () => {
    render(
      <TestWrapper>
        <ValidationStateIndicator state="error" />
      </TestWrapper>
    );

    expect(document.querySelector('.anticon-close-circle')).toBeInTheDocument();
  });

  it('renders warning state icon', () => {
    render(
      <TestWrapper>
        <ValidationStateIndicator state="warning" />
      </TestWrapper>
    );

    expect(document.querySelector('.anticon-exclamation-circle')).toBeInTheDocument();
  });

  it('renders info state icon', () => {
    render(
      <TestWrapper>
        <ValidationStateIndicator state="info" />
      </TestWrapper>
    );

    expect(document.querySelector('.anticon-info-circle')).toBeInTheDocument();
  });

  it('does not render for default state', () => {
    const { container } = render(
      <TestWrapper>
        <ValidationStateIndicator state="default" />
      </TestWrapper>
    );

    expect(container.firstChild).toBeNull();
  });

  it('applies size classes', () => {
    const { container } = render(
      <TestWrapper>
        <ValidationStateIndicator state="success" size="large" />
      </TestWrapper>
    );

    expect(container.firstChild).toHaveClass('text-lg');
  });
});

describe('FormErrorSummary', () => {
  const mockErrors = [
    'Email is required',
    'Password must be at least 8 characters',
    { field: 'phone', message: 'Invalid phone number format' },
  ];

  it('renders error summary with title and errors', () => {
    render(
      <TestWrapper>
        <FormErrorSummary errors={mockErrors} />
      </TestWrapper>
    );

    expect(screen.getByText('Please fix the following errors:')).toBeInTheDocument();
    expect(screen.getByText('Email is required')).toBeInTheDocument();
    expect(screen.getByText('Password must be at least 8 characters')).toBeInTheDocument();
    expect(screen.getByText('Invalid phone number format')).toBeInTheDocument();
  });

  it('renders custom title', () => {
    render(
      <TestWrapper>
        <FormErrorSummary 
          errors={mockErrors} 
          title="Form validation failed:" 
        />
      </TestWrapper>
    );

    expect(screen.getByText('Form validation failed:')).toBeInTheDocument();
  });

  it('does not render when errors array is empty', () => {
    const { container } = render(
      <TestWrapper>
        <FormErrorSummary errors={[]} />
      </TestWrapper>
    );

    expect(container.firstChild).toBeNull();
  });

  it('does not render when visible is false', () => {
    const { container } = render(
      <TestWrapper>
        <FormErrorSummary errors={mockErrors} visible={false} />
      </TestWrapper>
    );

    expect(container.firstChild).toBeNull();
  });

  it('applies error styling', () => {
    const { container } = render(
      <TestWrapper>
        <FormErrorSummary errors={mockErrors} />
      </TestWrapper>
    );

    expect(container.firstChild).toHaveClass('bg-red-50', 'border-red-200');
  });
});

describe('FormSuccessSummary', () => {
  it('renders success message with default text', () => {
    render(
      <TestWrapper>
        <FormSuccessSummary />
      </TestWrapper>
    );

    expect(screen.getByText('Form submitted successfully!')).toBeInTheDocument();
    expect(document.querySelector('.anticon-check-circle')).toBeInTheDocument();
  });

  it('renders custom success message', () => {
    render(
      <TestWrapper>
        <FormSuccessSummary message="Data saved successfully!" />
      </TestWrapper>
    );

    expect(screen.getByText('Data saved successfully!')).toBeInTheDocument();
  });

  it('does not render when visible is false', () => {
    const { container } = render(
      <TestWrapper>
        <FormSuccessSummary visible={false} />
      </TestWrapper>
    );

    expect(container.firstChild).toBeNull();
  });

  it('does not render when message is empty', () => {
    const { container } = render(
      <TestWrapper>
        <FormSuccessSummary message="" />
      </TestWrapper>
    );

    expect(container.firstChild).toBeNull();
  });

  it('applies success styling', () => {
    const { container } = render(
      <TestWrapper>
        <FormSuccessSummary />
      </TestWrapper>
    );

    expect(container.firstChild).toHaveClass('bg-green-50', 'border-green-200');
  });
});