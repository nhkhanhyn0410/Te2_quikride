/**
 * FormInput Component Tests
 * Tests for standardized input wrapper component
 */

import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ConfigProvider } from 'antd';
import FormInput from '../FormInput';

// Test wrapper with Ant Design ConfigProvider
const TestWrapper = ({ children }) => (
  <ConfigProvider>
    {children}
  </ConfigProvider>
);

describe('FormInput', () => {
  describe('Basic Rendering', () => {
    it('renders with default props', () => {
      render(
        <TestWrapper>
          <FormInput placeholder="Test input" />
        </TestWrapper>
      );

      const input = screen.getByPlaceholderText('Test input');
      expect(input).toBeInTheDocument();
      expect(input).toHaveClass('ant-input');
    });

    it('renders with custom className', () => {
      render(
        <TestWrapper>
          <FormInput 
            placeholder="Test input" 
            className="custom-input-class"
          />
        </TestWrapper>
      );

      const input = screen.getByPlaceholderText('Test input');
      expect(input).toHaveClass('custom-input-class');
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef();
      render(
        <TestWrapper>
          <FormInput ref={ref} placeholder="Test input" />
        </TestWrapper>
      );

      expect(ref.current).toBeTruthy();
      expect(ref.current.input).toBeInstanceOf(HTMLInputElement);
    });
  });

  describe('Size Variants', () => {
    it('renders with small size', () => {
      render(
        <TestWrapper>
          <FormInput size="small" placeholder="Small input" />
        </TestWrapper>
      );

      const input = screen.getByPlaceholderText('Small input');
      expect(input).toHaveClass('ant-input');
    });

    it('renders with middle size', () => {
      render(
        <TestWrapper>
          <FormInput size="middle" placeholder="Middle input" />
        </TestWrapper>
      );

      const input = screen.getByPlaceholderText('Middle input');
      expect(input).toHaveClass('ant-input');
    });

    it('renders with large size (default)', () => {
      render(
        <TestWrapper>
          <FormInput size="large" placeholder="Large input" />
        </TestWrapper>
      );

      const input = screen.getByPlaceholderText('Large input');
      expect(input).toHaveClass('ant-input');
    });
  });

  describe('Validation States', () => {
    it('applies error state styling', () => {
      render(
        <TestWrapper>
          <FormInput error placeholder="Error input" />
        </TestWrapper>
      );

      const input = screen.getByPlaceholderText('Error input');
      expect(input).toHaveClass('border-red-500');
    });

    it('applies success state styling', () => {
      render(
        <TestWrapper>
          <FormInput success placeholder="Success input" />
        </TestWrapper>
      );

      const input = screen.getByPlaceholderText('Success input');
      expect(input).toHaveClass('border-green-500');
    });

    it('applies warning state styling', () => {
      render(
        <TestWrapper>
          <FormInput warning placeholder="Warning input" />
        </TestWrapper>
      );

      const input = screen.getByPlaceholderText('Warning input');
      expect(input).toHaveClass('border-orange-500');
    });

    it('applies default hover styling when no validation state', () => {
      render(
        <TestWrapper>
          <FormInput placeholder="Default input" />
        </TestWrapper>
      );

      const input = screen.getByPlaceholderText('Default input');
      expect(input).toHaveClass('hover:border-blue-400');
    });

    it('prioritizes error state over other states', () => {
      render(
        <TestWrapper>
          <FormInput error success warning placeholder="Multi-state input" />
        </TestWrapper>
      );

      const input = screen.getByPlaceholderText('Multi-state input');
      expect(input).toHaveClass('border-red-500');
      expect(input).not.toHaveClass('border-green-500');
      expect(input).not.toHaveClass('border-orange-500');
    });
  });

  describe('Event Handling', () => {
    it('handles onChange events', () => {
      const handleChange = vi.fn();
      render(
        <TestWrapper>
          <FormInput onChange={handleChange} placeholder="Test input" />
        </TestWrapper>
      );

      const input = screen.getByPlaceholderText('Test input');
      fireEvent.change(input, { target: { value: 'test value' } });

      expect(handleChange).toHaveBeenCalled();
    });

    it('handles onFocus events', () => {
      const handleFocus = vi.fn();
      render(
        <TestWrapper>
          <FormInput onFocus={handleFocus} placeholder="Test input" />
        </TestWrapper>
      );

      const input = screen.getByPlaceholderText('Test input');
      fireEvent.focus(input);

      expect(handleFocus).toHaveBeenCalled();
    });

    it('handles onBlur events', () => {
      const handleBlur = vi.fn();
      render(
        <TestWrapper>
          <FormInput onBlur={handleBlur} placeholder="Test input" />
        </TestWrapper>
      );

      const input = screen.getByPlaceholderText('Test input');
      fireEvent.blur(input);

      expect(handleBlur).toHaveBeenCalled();
    });
  });

  describe('Props Forwarding', () => {
    it('forwards all standard input props', () => {
      render(
        <TestWrapper>
          <FormInput 
            placeholder="Test input"
            disabled
            readOnly
            maxLength={10}
            value="test"
          />
        </TestWrapper>
      );

      const input = screen.getByPlaceholderText('Test input');
      expect(input).toBeDisabled();
      expect(input).toHaveAttribute('readonly');
      expect(input).toHaveAttribute('maxlength', '10');
      expect(input).toHaveValue('test');
    });

    it('forwards Ant Design specific props', () => {
      render(
        <TestWrapper>
          <FormInput 
            placeholder="Test input"
            allowClear
            prefix="$"
            suffix=".00"
          />
        </TestWrapper>
      );

      const input = screen.getByPlaceholderText('Test input');
      expect(input).toBeInTheDocument();
      // Note: Ant Design specific props are handled internally
    });
  });

  describe('Accessibility', () => {
    it('supports aria-label', () => {
      render(
        <TestWrapper>
          <FormInput aria-label="Accessible input" />
        </TestWrapper>
      );

      const input = screen.getByLabelText('Accessible input');
      expect(input).toBeInTheDocument();
    });

    it('supports aria-describedby', () => {
      render(
        <TestWrapper>
          <FormInput 
            placeholder="Test input"
            aria-describedby="input-description"
          />
        </TestWrapper>
      );

      const input = screen.getByPlaceholderText('Test input');
      expect(input).toHaveAttribute('aria-describedby', 'input-description');
    });

    it('supports required attribute', () => {
      render(
        <TestWrapper>
          <FormInput 
            placeholder="Required input"
            required
          />
        </TestWrapper>
      );

      const input = screen.getByPlaceholderText('Required input');
      expect(input).toBeRequired();
    });
  });
});